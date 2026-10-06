import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useShopData } from "@/context/ShopDataContext";
import { Gender } from "@/data/products";

interface Props {
  onNavigate: (gender: Gender | "all", onlyNew?: boolean) => void;
  onSearch: (q: string) => void;
}

const Header = ({ onNavigate, onSearch }: Props) => {
  const { count, setOpen } = useCart();
  const { t } = useShopData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const links: { label: string; action: () => void }[] = [
    { label: "Каталог", action: () => onNavigate("all") },
    { label: "Женщинам", action: () => onNavigate("Женщинам") },
    { label: "Мужчинам", action: () => onNavigate("Мужчинам") },
    { label: "Новинки", action: () => onNavigate("all", true) },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(q.trim());
  };

  return (
    <header className="sticky top-0 z-40 bg-background px-3 pt-3 md:px-4 md:pt-4">
      <div className="flex h-[54px] items-center rounded-[10px] bg-card px-5 font-display font-medium md:px-12">
        <a href="#top" className="text-[1.6em] font-semibold tracking-[-0.02em] leading-none">
          {t("brand.logo")}
        </a>

        {searchOpen ? (
          <form onSubmit={submit} className="mx-4 flex flex-1 items-center gap-2 animate-fade-in md:mx-10">
            <Icon name="Search" size={18} className="text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                onSearch(e.target.value.trim());
              }}
              placeholder="Пальто, кашемир, лён…"
              className="w-full bg-transparent font-body text-[15px] font-normal outline-none placeholder:text-muted-foreground"
            />
          </form>
        ) : (
          <nav className="mx-auto hidden gap-10 lg:flex">
            {links.map((l) => (
              <button key={l.label} onClick={l.action} className="story-link">
                {l.label}
              </button>
            ))}
            <button onClick={() => setOpen(true)} className="story-link">
              Корзина · {count}
            </button>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          <button
            onClick={() => {
              setSearchOpen((v) => !v);
              if (searchOpen) {
                setQ("");
                onSearch("");
              }
            }}
            className="flex items-center gap-2"
            aria-label="Поиск"
          >
            <span className="hidden sm:inline">{searchOpen ? "Закрыть" : "Поиск"}</span>
            <Icon name={searchOpen ? "X" : "Search"} size={18} className="sm:hidden" />
          </button>
          <button onClick={() => setOpen(true)} className="relative lg:hidden" aria-label="Корзина">
            <Icon name="ShoppingBag" size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden" aria-label="Меню">
                <Icon name="Menu" size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-0 bg-background p-4 sm:max-w-sm">
              <SheetTitle className="sr-only">Меню</SheetTitle>
              <div className="flex h-full flex-col gap-3 pt-10">
                {links.map((l, i) => (
                  <button
                    key={l.label}
                    onClick={() => {
                      l.action();
                      setMenuOpen(false);
                    }}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="flex items-center justify-between rounded-[10px] bg-card px-5 py-5 text-left font-display text-2xl font-medium animate-fade-in"
                  >
                    {l.label}
                    <Icon name="ArrowUpRight" size={22} />
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setOpen(true);
                  }}
                  className="mt-auto rounded-full bg-primary py-4 font-display font-medium text-primary-foreground"
                >
                  Корзина · {count}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
