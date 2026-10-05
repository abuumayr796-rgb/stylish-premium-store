import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Product, SIZES, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  product: Product | null;
  onClose: () => void;
}

const ProductDialog = ({ product, onClose }: Props) => {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (product) {
      setSize(null);
      setColor(product.colors[0].name);
      setError(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product, size, color);
    onClose();
    toast(`${product.name} — в корзине`, {
      description: `Размер ${size} · ${color}`,
      action: { label: "Открыть", onClick: () => setOpen(true) },
    });
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-5xl gap-0 overflow-y-auto border-0 bg-background p-3 sm:rounded-[14px]">
        <div className="grid gap-3 md:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-photo md:aspect-auto md:min-h-[600px]">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: product.position ?? "50% 30%" }}
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-card px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wide">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col rounded-[10px] bg-card p-6 md:p-8">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {product.gender} · {product.category}
            </p>
            <DialogTitle className="mt-3 font-display text-3xl font-medium leading-tight tracking-[-0.02em] md:text-4xl">
              {product.name}
            </DialogTitle>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-2xl">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
            </div>
            <DialogDescription className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {product.description}
            </DialogDescription>

            <div className="mt-6">
              <div className="mb-2.5 font-display text-sm font-medium">Цвет: <span className="text-muted-foreground">{color}</span></div>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={cn(
                      "h-9 w-9 rounded-full border border-border ring-offset-2 ring-offset-card transition-all",
                      color === c.name && "ring-2 ring-primary"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2.5 flex justify-between font-display text-sm font-medium">
                <span>Размер</span>
                {error && <span className="text-destructive animate-fade-in">Выберите размер</span>}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((s) => {
                  const available = product.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      disabled={!available}
                      onClick={() => {
                        setSize(s);
                        setError(false);
                      }}
                      className={cn(
                        "h-12 rounded-[8px] border-[1.5px] font-display font-medium transition-colors",
                        !available && "cursor-not-allowed border-border text-muted-foreground/50 line-through",
                        available && size === s && "border-primary bg-primary text-primary-foreground",
                        available && size !== s && (error ? "border-destructive/60" : "border-border hover:border-foreground")
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="mt-6 rounded-full bg-primary py-4 font-display text-lg font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]"
            >
              В корзину · {formatPrice(product.price)}
            </button>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="m">
                <AccordionTrigger className="font-display">Состав и уход</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {product.material}. Деликатная стирка при 30 °C или химчистка. Сушить в расправленном виде.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="d" className="border-b-0">
                <AccordionTrigger className="font-display">Доставка и возврат</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Бесплатная доставка от 15 000 ₽ за 1–3 дня. Примерка перед оплатой, возврат в течение 30 дней.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
