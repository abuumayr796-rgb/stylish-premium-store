import { Slider } from "@/components/ui/slider";
import { CATEGORIES, COLORS, SIZES, Category, Gender, formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

export const PRICE_MIN = 5000;
export const PRICE_MAX = 35000;

export interface FilterState {
  gender: Gender | "all";
  categories: Category[];
  sizes: string[];
  colors: string[];
  price: [number, number];
  onlyNew: boolean;
}

export const defaultFilters: FilterState = {
  gender: "all",
  categories: [],
  sizes: [],
  colors: [],
  price: [PRICE_MIN, PRICE_MAX],
  onlyNew: false,
};

interface Props {
  value: FilterState;
  onChange: (v: FilterState) => void;
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-full border-[1.5px] px-3.5 py-1.5 font-display text-sm font-medium transition-colors",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-foreground"
    )}
  >
    {children}
  </button>
);

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-[10px] bg-card p-5">
    <div className="mb-3.5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</div>
    {children}
  </div>
);

const Filters = ({ value, onChange }: Props) => {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-3">
      <Block title="Для кого">
        <div className="flex flex-wrap gap-2">
          {(["all", "Женщинам", "Мужчинам"] as const).map((g) => (
            <Chip key={g} active={value.gender === g} onClick={() => set({ gender: g })}>
              {g === "all" ? "Все" : g}
            </Chip>
          ))}
        </div>
      </Block>

      <Block title="Категория">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} active={value.categories.includes(c)} onClick={() => set({ categories: toggle(value.categories, c) })}>
              {c}
            </Chip>
          ))}
        </div>
      </Block>

      <Block title="Размер">
        <div className="grid grid-cols-5 gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => set({ sizes: toggle(value.sizes, s) })}
              className={cn(
                "h-10 rounded-[8px] border-[1.5px] font-display text-sm font-medium transition-colors",
                value.sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Block>

      <Block title="Цвет">
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map((c) => {
            const active = value.colors.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => set({ colors: toggle(value.colors, c.name) })}
                title={c.name}
                aria-label={c.name}
                className={cn(
                  "h-8 w-8 rounded-full border border-border ring-offset-2 ring-offset-card transition-all",
                  active ? "ring-2 ring-primary" : "hover:scale-110"
                )}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </Block>

      <Block title="Цена">
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={value.price}
          onValueChange={(v) => set({ price: [v[0], v[1]] as [number, number] })}
          className="my-3"
        />
        <div className="flex justify-between font-display text-sm">
          <span>{formatPrice(value.price[0])}</span>
          <span>{formatPrice(value.price[1])}</span>
        </div>
      </Block>

      <Block title="Подборка">
        <Chip active={value.onlyNew} onClick={() => set({ onlyNew: !value.onlyNew })}>
          Только новинки
        </Chip>
      </Block>
    </div>
  );
};

export default Filters;
