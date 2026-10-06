import json
import os
import re
import uuid
import base64
import hmac
import psycopg2
import psycopg2.extras
import boto3

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p76524370_stylish_premium_stor')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
}
FIELDS = ['name', 'price', 'old_price', 'category', 'gender', 'colors', 'sizes', 'image',
          'badge', 'material', 'description', 'position', 'sort_order', 'is_active', 'is_hero']


def resp(status, data):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps(data, ensure_ascii=False, default=str)}


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def is_admin(event):
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    given = headers.get('x-admin-password', '')
    real = os.environ.get('ADMIN_PASSWORD', '')
    return bool(real) and hmac.compare_digest(given, real)


def fetch(cur, sql, params=None):
    cur.execute(sql, params)
    return [dict(r) for r in cur.fetchall()]


def load(cur, only_active):
    where = 'WHERE is_active' if only_active else ''
    products = fetch(cur, f'SELECT * FROM {SCHEMA}.products {where} ORDER BY sort_order, created_at')
    texts = fetch(cur, f'SELECT key, value, label, section FROM {SCHEMA}.site_texts ORDER BY sort_order')
    return products, texts


def clean_product(d):
    out = {}
    for f in FIELDS:
        if f not in d:
            continue
        v = d[f]
        if f in ('price', 'sort_order'):
            v = int(v or 0)
        elif f == 'old_price':
            v = int(v) if v not in (None, '', 0) else None
        elif f in ('colors', 'sizes'):
            v = json.dumps(v or [], ensure_ascii=False)
        elif f in ('is_active', 'is_hero'):
            v = bool(v)
        elif f in ('badge', 'position'):
            v = (v or '').strip() or None
        else:
            v = (v or '').strip() if isinstance(v, str) else v
        out[f] = v
    return out


def upload(data_url):
    m = re.match(r'data:(image/[\w+.-]+);base64,(.+)', data_url, re.S)
    if not m:
        return None
    ctype, raw = m.group(1), base64.b64decode(m.group(2))
    ext = ctype.split('/')[1].replace('jpeg', 'jpg').split('+')[0]
    key = f'products/{uuid.uuid4().hex}.{ext}'
    s3 = boto3.client('s3', endpoint_url='https://bucket.poehali.dev',
                      aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                      aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'])
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=ctype)
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def handler(event: dict, context) -> dict:
    """Магазин: публичные товары и надписи сайта, а также админка (товары, надписи, загрузка фото) по паролю."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', 'public')
    body = json.loads(event.get('body') or '{}') if method in ('POST', 'PUT', 'DELETE') else {}

    if action == 'public':
        conn = db()
        with conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            products, texts = load(cur, True)
        conn.close()
        return resp(200, {'products': products, 'texts': {t['key']: t['value'] for t in texts}})

    if not is_admin(event):
        return resp(401, {'error': 'Неверный пароль'})

    if action == 'login':
        return resp(200, {'ok': True})

    if action == 'upload':
        url = upload(body.get('file', ''))
        if not url:
            return resp(400, {'error': 'Нужна картинка'})
        return resp(200, {'url': url})

    conn = db()
    with conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        if action == 'admin':
            products, texts = load(cur, False)
            result = resp(200, {'products': products, 'texts': texts})

        elif action == 'save_product':
            p = body.get('product') or {}
            data = clean_product(p)
            if not data.get('name') or not data.get('price'):
                result = resp(400, {'error': 'Укажите название и цену'})
            else:
                pid = p.get('id') or ''
                if data.get('is_hero'):
                    cur.execute(f'UPDATE {SCHEMA}.products SET is_hero = FALSE')
                if pid:
                    sets = ', '.join(f'{k} = %s' for k in data)
                    cur.execute(f'UPDATE {SCHEMA}.products SET {sets} WHERE id = %s', [*data.values(), pid])
                else:
                    pid = uuid.uuid4().hex[:12]
                    cols = ', '.join(['id', *data.keys()])
                    vals = ', '.join(['%s'] * (len(data) + 1))
                    cur.execute(f'INSERT INTO {SCHEMA}.products ({cols}) VALUES ({vals})', [pid, *data.values()])
                result = resp(200, {'id': pid})

        elif action == 'delete_product':
            cur.execute(f'DELETE FROM {SCHEMA}.products WHERE id = %s', [body.get('id', '')])
            result = resp(200, {'ok': True})

        elif action == 'save_texts':
            for key, value in (body.get('texts') or {}).items():
                cur.execute(f'UPDATE {SCHEMA}.site_texts SET value = %s WHERE key = %s', [str(value), key])
            result = resp(200, {'ok': True})

        else:
            result = resp(404, {'error': 'Неизвестное действие'})
    conn.close()
    return result
