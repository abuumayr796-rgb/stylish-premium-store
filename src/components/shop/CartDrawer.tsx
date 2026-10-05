import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

const FREE_SHIPPING = 15000;

const CartDrawer = () => {
  const { items, open, setOpen, setQty, remove, total, count, clear } = useCart();
  const shipping = total === 0 || total >= FREE_SHIPPING ? 0 : 590;
  const left = Math.max(0, FREE_SHIPPING - total);

  const checkout = () => {
    toast("Заказ оформлен", { description: "Мы свяжемся с вами для подтверждения доставки." });
    clear();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-3 border-0 bg-background p-3 sm:max-w-md">
        <div className="flex items-center justify-between rounded-[10px] bg-card px-5 py-4">
          <SheetTitle className="font-display text-2xl font-medium">Корзина · {count}</SheetTitle>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-[10px] bg-card p-8 text-center">
            <Icon name="ShoppingBag" size={44} className="text-muted-foreground" />
            <p className="mt-4 font-display text-2xl">Пока пусто</p>
            <p className="mt-2 text-muted-foreground">Загляните в каталог — там новая коллекция</p>
            <button
              onClick={() => {
                setOpen(false);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-6 rounded-full bg-primary px-8 py-3 font-display font-medium text-primary-foreground"
            >
              В каталог
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-[10px] bg-card px-5 py-3.5 text-sm">
              {left > 0 ? (
                <>До бесплатной доставки — <b className="font-display font-medium">{formatPrice(left)}</b></>
              ) : (
                <>Доставка бесплатная</>
              )}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%` }} />
              </div>
            </div>

            <div className="no-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto">
              {items.map((i) => (
                <div key={i.key} className="flex gap-3 rounded-[10px] bg-card p-3 animate-fade-in">
                  <div className="h-32 w-24 shrink-0 overflow-hidden rounded-[6px] bg-photo">
                    <img src={i.product.image} alt={i.product.name} className="h-full w-full object-cover" style={{ objectPosition: i.product.position ?? "50% 30%" }} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-display leading-tight">{i.product.name}</p>
                      <button onClick={() => remove(i.key)} aria-label="Удалить" className="text-muted-foreground hover:text-foreground">
                        <Icon name="X" size={18} />
                      </button>
                    </div>
                    <p className="mt-1 text-[13px] text-muted-foreground">{i.size} · {i.color}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border-[1.5px] border-border">
                        <button onClick={() => setQty(i.key, i.qty - 1)} className="flex h-9 w-9 items-center justify-center" aria-label="Меньше">
                          <Icon name="Minus" size={15} />
                        </button>
                        <span className="w-6 text-center font-display font-medium">{i.qty}</span>
                        <button onClick={() => setQty(i.key, i.qty + 1)} className="flex h-9 w-9 items-center justify-center" aria-label="Больше">
                          <Icon name="Plus" size={15} />
                        </button>
                      </div>
                      <span className="font-display font-medium">{formatPrice(i.product.price * i.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[10px] bg-card p-5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Товары</span><span>{formatPrice(total)}</span>
              </div>
              <div className="mt-1.5 flex justify-between text-sm text-muted-foreground">
                <span>Доставка</span><span>{shipping ? formatPrice(shipping) : "Бесплатно"}</span>
              </div>
              <div className="mt-3 flex justify-between font-display text-2xl">
                <span>Итого</span><span>{formatPrice(total + shipping)}</span>
              </div>
              <button
                onClick={checkout}
                className="mt-4 w-full rounded-full bg-primary py-4 font-display text-lg font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
