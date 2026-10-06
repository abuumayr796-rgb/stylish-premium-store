import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { CATEGORIES, COLORS, SIZES } from "@/data/products";
import { DbProduct } from "@/context/ShopDataContext";
import { shopRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type Draft = Partial<DbProduct>;

export const emptyDraft = (): Draft => ({
  name: "",
  price: 0,
  old_price: null,
  category: CATEGORIES[0],
  gender: "Женщинам",
  colors: [],
  sizes: [],
  image: "",
  badge: null,
  material: "",
  description: "",
  position: null,
  sort_order: 0,
  is_active: true,
  is_hero: false,
});

interface Props {
  draft: Draft | null;
  password: string;
  onClose: () => void;
  onSaved: () => void;
}

const field = "h-11 w-full rounded-[10px] bg-background px-4 outline-none focus:ring-2 focus:ring-primary/30";
const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{children}</span>
);

const ProductEditor = ({ draft, password, onClose, onSaved }: Props) => {
  const [p, setP] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (draft) setP({ ...emptyDraft(), ...draft });
  }, [draft]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setP((s) => ({ ...s, [k]: v }));

  const toggleSize = (s: string) =>
    set("sizes", p.sizes?.includes(s) ? p.sizes.filter((x) => x !== s) : SIZES.filter((x) => [...(p.sizes || []), s].includes(x)));

  const toggleColor = (c: { name: string; hex: string }) =>
    set("colors", p.colors?.some((x) => x.name === c.name) ? p.colors.filter((x) => x.name !== c.name) : [...(p.colors || []), c]);

  const onFile = (f?: File) => {
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) {
      toast.error("Фото больше 4 МБ — уменьшите его");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      try {
        const d = await shopRequest("upload", { body: { file: reader.result }, password });
        set("image", d.url);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(f);
  };

  const save = async () => {
    if (!p.name?.trim() || !p.price) {
      toast.error("Укажите название и цену");
      return;
    }
    if (!p.sizes?.length || !p.colors?.length) {
      toast.error("Выберите хотя бы один размер и цвет");
      return;
    }
    setSaving(true);
    try {
      await shopRequest("save_product", { body: { product: p }, password });
      toast.success("Товар сохранён");
      onSaved();
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!draft} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-[10px] border-0 bg-card p-5 md:p-8">
        <DialogTitle className="font-display text-2xl font-medium">{p.id ? "Редактировать товар" : "Новый товар"}</DialogTitle>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div>
            <Label>Фото</Label>
            <button
              onClick={() => fileRef.current?.click()}
              className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-[10px] bg-photo"
            >
              {p.image ? (
                <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: p.position ?? "50% 30%" }} />
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="ImagePlus" size={28} />
                  Загрузить фото
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-card/70">
                  <Icon name="Loader2" size={26} className="animate-spin" />
                </span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            {p.image && (
              <button onClick={() => fileRef.current?.click()} className="mt-2 text-sm text-muted-foreground story-link">
                Заменить фото
              </button>
            )}
            <div className="mt-4">
              <Label>Кадрирование</Label>
              <select value={p.position ?? ""} onChange={(e) => set("position", e.target.value || null)} className={field}>
                <option value="">По центру</option>
                <option value="50% 0%">Верх</option>
                <option value="50% 20%">Чуть выше центра</option>
                <option value="50% 80%">Чуть ниже центра</option>
                <option value="50% 100%">Низ</option>
                <option value="20% 50%">Левее</option>
                <option value="80% 50%">Правее</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            <label>
              <Label>Название</Label>
              <input value={p.name} onChange={(e) => set("name", e.target.value)} className={field} placeholder="Пальто из шерсти" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <Label>Цена, ₽</Label>
                <input type="number" value={p.price || ""} onChange={(e) => set("price", Number(e.target.value))} className={field} />
              </label>
              <label>
                <Label>Старая цена, ₽</Label>
                <input
                  type="number"
                  value={p.old_price || ""}
                  onChange={(e) => set("old_price", e.target.value ? Number(e.target.value) : null)}
                  className={field}
                  placeholder="Для скидки"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <Label>Раздел</Label>
                <select value={p.gender} onChange={(e) => set("gender", e.target.value)} className={field}>
                  <option>Женщинам</option>
                  <option>Мужчинам</option>
                </select>
              </label>
              <label>
                <Label>Категория</Label>
                <select value={p.category} onChange={(e) => set("category", e.target.value)} className={field}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <Label>Размеры</Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={cn(
                      "h-10 min-w-12 rounded-full border-[1.5px] px-4 font-display text-sm font-medium transition-colors",
                      p.sizes?.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Цвета</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => {
                  const on = p.colors?.some((x) => x.name === c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleColor(c)}
                      className={cn(
                        "flex h-10 items-center gap-2 rounded-full border-[1.5px] px-3 text-sm transition-colors",
                        on ? "border-primary bg-background" : "border-transparent bg-background text-muted-foreground"
                      )}
                    >
                      <span className="h-4 w-4 rounded-full border border-border" style={{ background: c.hex }} />
                      {c.name}
                      {on && <Icon name="Check" size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Бейдж</Label>
              <div className="flex flex-wrap gap-2">
                {[null, "Новинка", "Бестселлер"].map((b) => (
                  <button
                    key={b ?? "none"}
                    onClick={() => set("badge", b)}
                    className={cn(
                      "h-10 rounded-full border-[1.5px] px-4 font-display text-sm font-medium",
                      (p.badge ?? null) === b ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                    )}
                  >
                    {b ?? "Без бейджа"}
                  </button>
                ))}
              </div>
            </div>

            <label>
              <Label>Состав</Label>
              <input value={p.material} onChange={(e) => set("material", e.target.value)} className={field} placeholder="100% шерсть" />
            </label>
            <label>
              <Label>Описание</Label>
              <textarea
                value={p.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full rounded-[10px] bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label>
              <Label>Порядок в каталоге</Label>
              <input type="number" value={p.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} className={field} />
            </label>

            <div className="grid gap-3 rounded-[10px] bg-background p-4">
              <label className="flex items-center justify-between gap-4">
                <span>
                  <span className="block font-medium">Показывать на сайте</span>
                  <span className="text-sm text-muted-foreground">Выключите, чтобы скрыть товар</span>
                </span>
                <Switch checked={!!p.is_active} onCheckedChange={(v) => set("is_active", v)} />
              </label>
              <label className="flex items-center justify-between gap-4">
                <span>
                  <span className="block font-medium">Бестселлер на первом экране</span>
                  <span className="text-sm text-muted-foreground">Только один товар</span>
                </span>
                <Switch checked={!!p.is_hero} onCheckedChange={(v) => set("is_hero", v)} />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="h-12 rounded-full border-[1.5px] border-border px-7 font-display font-medium">
            Отмена
          </button>
          <button
            onClick={save}
            disabled={saving || uploading}
            className="h-12 rounded-full bg-primary px-8 font-display font-medium text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Сохраняю…" : "Сохранить"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditor;
