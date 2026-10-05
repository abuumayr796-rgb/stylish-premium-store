import { useState } from "react";
import { toast } from "sonner";

const facts = [
  { n: "30 дней", t: "на возврат без вопросов" },
  { n: "1–3 дня", t: "доставка по России" },
  { n: "от 15 000 ₽", t: "бесплатная доставка" },
  { n: "100%", t: "натуральные ткани" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr("Проверьте адрес почты");
      return;
    }
    setErr("");
    setEmail("");
    toast("Готово", { description: "Пришлём письмо о новой коллекции первыми." });
  };

  return (
    <footer className="px-3 pb-3 pt-4 md:px-4 md:pb-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f.n} className="rounded-[10px] bg-card p-5 md:p-7">
            <div className="font-display text-2xl font-medium tracking-[-0.02em] md:text-4xl">{f.n}</div>
            <div className="mt-1.5 text-sm text-muted-foreground">{f.t}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2.6fr_1fr]">
        <div className="relative overflow-hidden rounded-[10px] bg-primary px-6 pb-4 pt-8 text-primary-foreground md:px-12 md:pt-12">
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight md:text-4xl">
            Новая коллекция — раньше всех
          </h2>
          <form onSubmit={submit} className="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваша почта"
              className="h-12 flex-1 rounded-full bg-primary-foreground px-5 text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button className="h-12 rounded-full border-[1.5px] border-primary-foreground px-7 font-display font-medium transition-colors hover:bg-primary-foreground hover:text-primary">
              Подписаться
            </button>
          </form>
          {err && <p className="mt-2 text-sm text-primary-foreground/80">{err}</p>}
          <div className="mt-8 select-none font-display text-[22vw] font-medium leading-[0.8] tracking-[-0.05em] opacity-95 lg:text-[15vw]">
            норд
          </div>
        </div>
        <div className="flex flex-col justify-between gap-8 rounded-[10px] bg-card p-6 font-display md:p-8">
          <div className="grid grid-cols-2 gap-6 text-[15px]">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Магазин</span>
              <a href="#catalog" className="story-link self-start">Каталог</a>
              <a href="#catalog" className="story-link self-start">Новинки</a>
              <a href="#catalog" className="story-link self-start">Бестселлеры</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Помощь</span>
              <a href="#top" className="story-link self-start">Доставка</a>
              <a href="#top" className="story-link self-start">Возврат</a>
              <a href="#top" className="story-link self-start">Размеры</a>
            </div>
          </div>
          <div>
            <a href="tel:+78000000000" className="block text-xl">8 800 000-00-00</a>
            <p className="mt-1 text-sm text-muted-foreground">© 2026 норд. Одежда без сезона.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
