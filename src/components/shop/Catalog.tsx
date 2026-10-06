import { useMemo, useState } from "react";
import { Product } from "@/data/products";
import { useShopData } from "@/context/ShopDataContext";
import Filters, { FilterState, defaultFilters, PRICE_MIN, PRICE_MAX } from "./Filters";
import ProductCard from "./ProductCard";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  search: string;
  onOpenProduct: (p: Product) => void;
}

type Sort = "popular" | "cheap" | "expensive" | "new";

const Catalog = ({ filters, setFilters, search, onOpenProduct }: Props) => {
  const { products: PRODUCTS, t } = useShopData();
  const [sort, setSort] = useState<Sort>("popular");
  const [mobileOpen, setMobileOpen] = useState(false);

  const list = useMemo(() => {
    const q = search.toLowerCase();
    const res = PRODUCTS.filter((p) => {
      if (filters.gender !== "all" && p.gender !== filters.gender) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
      if (filters.colors.length && !filters.colors.some((c) => p.colors.some((pc) => pc.name === c))) return false;
      if (filters.price[0] > PRICE_MIN && p.price < filters.price[0]) return false;
      if (filters.price[1] < PRICE_MAX && p.price > filters.price[1]) return false;
      if (filters.onlyNew && p.badge !== "Новинка") return false;
      if (q && !(`${p.name} ${p.category} ${p.material}`.toLowerCase().includes(q))) return false;
      return true;
    });
    const sorted = [...res];
    if (sort === "cheap") sorted.sort((a, b) => a.price - b.price);
    if (sort === "expensive") sorted.sort((a, b) => b.price - a.price);
    if (sort === "new") sorted.sort((a, b) => Number(b.badge === "Новинка") - Number(a.badge === "Новинка"));
    if (sort === "popular") sorted.sort((a, b) => Number(b.badge === "Бестселлер") - Number(a.badge === "Бестселлер"));
    return sorted;
  }, [filters, sort, search, PRODUCTS]);

  const activeCount =
    (filters.gender !== "all" ? 1 : 0) +
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.onlyNew ? 1 : 0) +
    (filters.price[0] !== PRICE_MIN || filters.price[1] !== PRICE_MAX ? 1 : 0);

  return (
    <section id="catalog" className="scroll-mt-20 px-3 pt-4 md:px-4">
      <div className="mb-4 flex flex-col gap-4 rounded-[10px] bg-card px-5 py-6 md:flex-row md:items-end md:justify-between md:px-12 md:py-10">
        <div>
          <p className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">{t("catalog.label")}</p>
          <h2 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] md:text-6xl">
            {filters.gender === "all" ? t("catalog.title") : filters.gender}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display text-sm text-muted-foreground">{list.length} позиций</span>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-10 w-[190px] rounded-full border-[1.5px] font-display">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Сначала популярные</SelectItem>
              <SelectItem value="new">Сначала новинки</SelectItem>
              <SelectItem value="cheap">Сначала дешевле</SelectItem>
              <SelectItem value="expensive">Сначала дороже</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 flex gap-2 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 font-display font-medium text-primary-foreground"
        >
          <Icon name="SlidersHorizontal" size={18} />
          Фильтры{activeCount ? ` · ${activeCount}` : ""}
        </button>
        {activeCount > 0 && (
          <button onClick={() => setFilters(defaultFilters)} className="rounded-full bg-card px-5 font-display font-medium">
            Сбросить
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[86px]">
            <Filters value={filters} onChange={setFilters} />
            {activeCount > 0 && (
              <button
                onClick={() => setFilters(defaultFilters)}
                className="mt-3 w-full rounded-full border-[1.5px] border-foreground py-2.5 font-display font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                Сбросить фильтры · {activeCount}
              </button>
            )}
          </div>
        </aside>

        {list.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} onOpen={onOpenProduct} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[10px] bg-card p-10 text-center">
            <Icon name="SearchX" size={40} className="text-muted-foreground" />
            <p className="mt-4 font-display text-2xl">Ничего не нашлось</p>
            <p className="mt-2 text-muted-foreground">Попробуйте ослабить фильтры или изменить запрос</p>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="mt-6 rounded-full bg-primary px-8 py-3 font-display font-medium text-primary-foreground"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-full overflow-y-auto border-0 bg-background p-3 sm:max-w-sm">
          <SheetTitle className="px-2 pb-3 pt-2 font-display text-2xl font-medium">Фильтры</SheetTitle>
          <Filters value={filters} onChange={setFilters} />
          <div className="sticky bottom-0 mt-3 flex gap-2 bg-background pb-1 pt-2">
            <button onClick={() => setFilters(defaultFilters)} className="rounded-full bg-card px-5 py-3 font-display font-medium">
              Сбросить
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full bg-primary py-3 font-display font-medium text-primary-foreground"
            >
              Показать {list.length}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default Catalog;
