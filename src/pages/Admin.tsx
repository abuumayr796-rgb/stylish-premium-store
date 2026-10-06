import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProductEditor, { Draft, emptyDraft } from "@/components/admin/ProductEditor";
import TextsEditor, { SiteText } from "@/components/admin/TextsEditor";
import { DbProduct } from "@/context/ShopDataContext";
import { formatPrice } from "@/data/products";
import { shopRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STORAGE_KEY = "nord_admin_pwd";

const Login = ({ onLogin }: { onLogin: (p: string) => void }) => {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await shopRequest("login", { password: pwd });
      sessionStorage.setItem(STORAGE_KEY, pwd);
      onLogin(pwd);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[10px] bg-card p-8 animate-fade-in">
        <div className="font-display text-5xl font-medium tracking-[-0.04em]">норд</div>
        <p className="mt-2 text-muted-foreground">Вход в админку магазина</p>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Пароль"
          className="mt-6 h-12 w-full rounded-full bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
        />
        {err && <p className="mt-2 px-2 text-sm text-destructive">{err}</p>}
        <button
          disabled={!pwd || loading}
          className="mt-4 h-12 w-full rounded-full bg-primary font-display font-medium text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Проверяю…" : "Войти"}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-muted-foreground story-link">
          На сайт
        </Link>
      </form>
    </div>
  );
};

const Admin = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [tab, setTab] = useState<"products" | "texts">("products");
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [texts, setTexts] = useState<SiteText[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toDelete, setToDelete] = useState<DbProduct | null>(null);
  const [query, setQuery] = useState("");

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword("");
  };

  const load = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    try {
      const d = await shopRequest("admin", { password });
      setProducts(d.products);
      setTexts(d.texts);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async () => {
    if (!toDelete) return;
    try {
      await shopRequest("delete_product", { body: { id: toDelete.id }, password });
      toast.success("Товар удалён");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
    setToDelete(null);
  };

  const toggleActive = async (p: DbProduct) => {
    await shopRequest("save_product", { body: { product: { ...p, is_active: !p.is_active } }, password });
    load();
  };

  if (!password) return <Login onLogin={setPassword} />;

  const list = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-background px-3 pb-4 md:px-4">
      <header className="sticky top-0 z-20 bg-background pt-3 md:pt-4">
        <div className="flex h-[54px] items-center gap-4 rounded-[10px] bg-card px-5 font-display font-medium md:px-8">
          <span className="text-[1.6em] font-semibold leading-none tracking-[-0.02em]">норд</span>
          <span className="hidden text-muted-foreground sm:inline">админка</span>
          <div className="ml-auto flex items-center gap-5">
            <Link to="/" target="_blank" className="flex items-center gap-1.5 story-link">
              <Icon name="ExternalLink" size={16} />
              <span className="hidden sm:inline">Сайт</span>
            </Link>
            <button onClick={logout} className="flex items-center gap-1.5 story-link">
              <Icon name="LogOut" size={16} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-4 max-w-6xl">
        <div className="mb-4 flex flex-col gap-4 rounded-[10px] bg-card px-5 py-6 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Управление</p>
            <h1 className="mt-1 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">
              {tab === "products" ? "Товары" : "Надписи"}
            </h1>
          </div>
          <div className="flex gap-2 rounded-full bg-background p-1">
            {(
              [
                ["products", "Товары"],
                ["texts", "Надписи"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={cn(
                  "h-10 rounded-full px-6 font-display font-medium transition-colors",
                  tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {loading && !products.length ? (
          <div className="flex justify-center py-20">
            <Icon name="Loader2" size={28} className="animate-spin text-muted-foreground" />
          </div>
        ) : tab === "texts" ? (
          <TextsEditor texts={texts} password={password} onSaved={load} />
        ) : (
          <>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <div className="flex h-12 flex-1 items-center gap-2 rounded-full bg-card px-5">
                <Icon name="Search" size={18} className="text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти товар"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setDraft({ ...emptyDraft(), sort_order: products.length })}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-display font-medium text-primary-foreground"
              >
                <Icon name="Plus" size={18} />
                Добавить товар
              </button>
            </div>

            <div className="grid gap-3">
              {list.map((p) => (
                <div
                  key={p.id}
                  className={cn("flex items-center gap-4 rounded-[10px] bg-card p-3 pr-4 md:pr-6", !p.is_active && "opacity-60")}
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[6px] bg-photo md:h-24 md:w-20">
                    {p.image && (
                      <img src={p.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: p.position ?? "50% 30%" }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-display text-lg font-medium">{p.name}</span>
                      {p.badge && (
                        <span className="rounded-full border-[1.5px] border-foreground px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase">
                          {p.badge}
                        </span>
                      )}
                      {p.is_hero && (
                        <span className="rounded-full bg-primary px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase text-primary-foreground">
                          Первый экран
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {p.gender} · {p.category} · {p.sizes.join(", ")}
                    </div>
                    <div className="mt-1 flex gap-2 font-display">
                      {formatPrice(p.price)}
                      {p.old_price && <span className="text-muted-foreground line-through">{formatPrice(p.old_price)}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => toggleActive(p)}
                      title={p.is_active ? "Скрыть с сайта" : "Показать на сайте"}
                      className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-background"
                    >
                      <Icon name={p.is_active ? "Eye" : "EyeOff"} size={18} />
                    </button>
                    <button
                      onClick={() => setDraft(p)}
                      title="Редактировать"
                      className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-background"
                    >
                      <Icon name="Pencil" size={18} />
                    </button>
                    <button
                      onClick={() => setToDelete(p)}
                      title="Удалить"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-destructive hover:bg-background"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {!list.length && <div className="rounded-[10px] bg-card p-10 text-center text-muted-foreground">Товаров не найдено</div>}
            </div>
          </>
        )}
      </div>

      <ProductEditor draft={draft} password={password} onClose={() => setDraft(null)} onSaved={load} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="rounded-[10px] border-0 bg-card">
          <AlertDialogTitle className="font-display">Удалить «{toDelete?.name}»?</AlertDialogTitle>
          <AlertDialogDescription>Товар пропадёт из каталога. Если нужно временно убрать — лучше скройте его.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
