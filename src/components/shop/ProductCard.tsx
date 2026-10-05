import { Product, formatPrice } from "@/data/products";
import Icon from "@/components/ui/icon";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Props {
  product: Product;
  onOpen: (p: Product) => void;
  index?: number;
}

const ProductCard = ({ product, onOpen, index = 0 }: Props) => {
  const { add, setOpen } = useCart();

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const size = product.sizes.includes("M") ? "M" : product.sizes[0];
    add(product, size, product.colors[0].name);
    toast(`${product.name} — в корзине`, {
      description: `Размер ${size} · ${product.colors[0].name}`,
      action: { label: "Открыть", onClick: () => setOpen(true) },
    });
  };

  return (
    <article
      onClick={() => onOpen(product)}
      className="group flex cursor-pointer flex-col rounded-[10px] bg-card p-3 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-photo">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: product.position ?? "50% 30%" }}
        />
        {product.badge && (
          <span
            className={
              product.badge === "Бестселлер"
                ? "absolute left-3 top-3 rounded-full border-[1.5px] border-foreground bg-card px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wide"
                : "absolute left-3 top-3 rounded-full bg-primary px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wide text-primary-foreground"
            }
          >
            {product.badge}
          </span>
        )}
        {product.oldPrice && (
          <span className="absolute right-3 top-3 rounded-full bg-card px-3 py-1 font-display text-[11px] font-semibold">
            −{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        <button
          onClick={quickAdd}
          aria-label="Быстро добавить в корзину"
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <Icon name="Plus" size={20} />
        </button>
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-3.5">
        <div>
          <h3 className="font-display text-[17px] leading-tight">{product.name}</h3>
          <p className="mt-1 text-[13px] text-muted-foreground">{product.category}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-[17px] font-medium">{formatPrice(product.price)}</div>
          {product.oldPrice && <div className="text-[13px] text-muted-foreground line-through">{formatPrice(product.oldPrice)}</div>}
        </div>
      </div>
      <div className="flex gap-1.5 px-1 pb-1 pt-2">
        {product.colors.map((c) => (
          <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
        ))}
      </div>
    </article>
  );
};

export default ProductCard;
