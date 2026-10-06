import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { PRODUCTS, HERO_IMAGE, Product } from "@/data/products";
import { shopRequest } from "@/lib/api";

export const DEFAULT_TEXTS: Record<string, string> = {
  "brand.logo": "норд",
  "hero.title": "Осень–зима 2026.\nШерсть, кашемир, лён",
  "hero.button": "Смотреть коллекцию",
  "hero.image": HERO_IMAGE,
  "hero.badge": "БЕСТСЕЛЛЕР",
  "hero.cta": "В корзину",
  "catalog.label": "Каталог",
  "catalog.title": "Вся коллекция",
  "footer.fact1_n": "30 дней",
  "footer.fact1_t": "на возврат без вопросов",
  "footer.fact2_n": "1–3 дня",
  "footer.fact2_t": "доставка по России",
  "footer.fact3_n": "от 15 000 ₽",
  "footer.fact3_t": "бесплатная доставка",
  "footer.fact4_n": "100%",
  "footer.fact4_t": "натуральные ткани",
  "footer.subscribe_title": "Новая коллекция — раньше всех",
  "footer.subscribe_button": "Подписаться",
  "footer.phone": "8 800 000-00-00",
  "footer.copyright": "© 2026 норд. Одежда без сезона.",
};

export interface DbProduct {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  category: string;
  gender: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  image: string;
  badge: string | null;
  material: string;
  description: string;
  position: string | null;
  sort_order: number;
  is_active: boolean;
  is_hero: boolean;
}

export const fromDb = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  price: p.price,
  oldPrice: p.old_price ?? undefined,
  category: p.category as Product["category"],
  gender: p.gender as Product["gender"],
  colors: p.colors || [],
  sizes: p.sizes || [],
  image: p.image,
  badge: (p.badge as Product["badge"]) ?? undefined,
  material: p.material,
  description: p.description,
  position: p.position ?? undefined,
});

interface Ctx {
  products: Product[];
  hero: Product | undefined;
  t: (key: string) => string;
}

const ShopDataContext = createContext<Ctx>({
  products: PRODUCTS,
  hero: PRODUCTS[0],
  t: (k) => DEFAULT_TEXTS[k] ?? "",
});

export const ShopDataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [heroId, setHeroId] = useState<string | undefined>(PRODUCTS[0]?.id);
  const [texts, setTexts] = useState<Record<string, string>>(DEFAULT_TEXTS);

  useEffect(() => {
    shopRequest("public")
      .then((d: { products: DbProduct[]; texts: Record<string, string> }) => {
        setProducts(d.products.map(fromDb));
        setHeroId((d.products.find((p) => p.is_hero) ?? d.products[0])?.id);
        setTexts({ ...DEFAULT_TEXTS, ...d.texts });
      })
      .catch(() => undefined);
  }, []);

  const hero = products.find((p) => p.id === heroId) ?? products[0];
  const t = (key: string) => texts[key] ?? "";

  return <ShopDataContext.Provider value={{ products, hero, t }}>{children}</ShopDataContext.Provider>;
};

export const useShopData = () => useContext(ShopDataContext);
