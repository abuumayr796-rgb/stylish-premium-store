import { formatPrice, Product } from "@/data/products";
import { useShopData } from "@/context/ShopDataContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Props {
  onOpenProduct: (p: Product) => void;
}

const Hero = ({ onOpenProduct }: Props) => {
  const { add, setOpen } = useCart();
  const { hero: best, t } = useShopData();

  const addBest = () => {
    if (!best) return;
    const size = best.sizes.includes("M") ? "M" : best.sizes[0];
    add(best, size, best.colors[0]?.name ?? "");
    toast(`${best.name} — добавлено в корзину`, {
      description: `Размер ${size} · ${best.colors[0]?.name ?? ""}`,
      action: { label: "Открыть", onClick: () => setOpen(true) },
    });
  };

  if (!best) return null;

  return (
    <section id="top" className="px-3 pt-4 md:px-4">
      <div className="grid gap-4 lg:h-[calc(100vh-102px)] lg:min-h-[560px] lg:max-h-[900px] lg:grid-cols-[2.6fr_1fr] lg:grid-rows-1">
        <div className="relative h-[72vh] min-h-[440px] overflow-hidden rounded-[10px] bg-photo animate-scale-in lg:h-auto">
          <img
            src={t("hero.image")}
            alt="Пальто из новой коллекции"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] ease-out hover:scale-[1.03]"
          />
          <h1
            className="absolute left-6 top-8 font-display text-[26px] font-semibold leading-[1.1] text-foreground animate-fade-in md:left-12 md:top-14 md:text-[35px]"
            style={{ animationDelay: "200ms" }}
          >
            {t("hero.title").split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <a
            href="#catalog"
            className="absolute left-6 top-[120px] rounded-full bg-card px-5 py-2 font-display text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground animate-fade-in md:left-12 md:top-[170px]"
            style={{ animationDelay: "350ms" }}
          >
            {t("hero.button")}
          </a>
          <div className="pointer-events-none absolute bottom-3 left-4 overflow-hidden md:bottom-5 md:left-11">
            <div
              className="font-display font-medium leading-[0.9] tracking-[-0.04em] text-foreground animate-rise text-[96px] sm:text-[130px] md:text-[166px]"
              style={{ animationDelay: "250ms" }}
            >
              {t("brand.logo")}
            </div>
          </div>
        </div>

        <aside
          className="flex flex-col rounded-[10px] bg-card p-6 animate-fade-in"
          style={{ animationDelay: "150ms" }}
        >
          <span className="self-start rounded-full border-[1.5px] border-foreground px-[18px] py-[5px] font-display text-[0.9em] font-semibold">
            {t("hero.badge")}
          </span>
          <button onClick={() => onOpenProduct(best)} className="mt-3.5 text-left font-display text-[1.2em] story-link self-start">
            {best.name}
          </button>
          <span className="mt-1 text-muted-foreground">{formatPrice(best.price)}</span>
          <button
            onClick={() => onOpenProduct(best)}
            className="relative my-[18px] min-h-[320px] flex-1 overflow-hidden rounded-[6px] bg-photo"
            aria-label="Открыть карточку товара"
          >
            <img
              src={best.image}
              alt="Пальто"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              style={{ objectPosition: best.position ?? "50% 30%" }}
            />
          </button>
          <button
            onClick={addBest}
            className="rounded-full bg-primary py-[11px] text-center font-display font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            {t("hero.cta")}
          </button>
        </aside>
      </div>
    </section>
  );
};

export default Hero;
