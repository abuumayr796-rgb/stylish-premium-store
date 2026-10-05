export type Category = "Верхняя одежда" | "Трикотаж" | "Платья" | "Рубашки" | "Брюки" | "Пиджаки";
export type Gender = "Женщинам" | "Мужчинам";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: Category;
  gender: Gender;
  colors: { name: string; hex: string }[];
  sizes: string[];
  image: string;
  badge?: "Новинка" | "Бестселлер";
  material: string;
  description: string;
  position?: string;
}

const IMG = {
  coat: "https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/a10dd1d2-63f2-463a-a480-e5b4961fe8c7.jpg",
  knit: "https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/84f2fe58-5e11-48c7-b2a8-f39657916b2d.jpg",
  blazer: "https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/93cb6911-5b71-49e8-acf6-10d5b6fcdb45.jpg",
  dress: "https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/f7a23ce2-e6b9-4a0b-bcd4-073a31c3dc99.jpg",
  shirt: "https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/8338b75d-4e73-43d1-885b-7686f38a3495.jpg",
};

export const HERO_IMAGE = IMG.coat;

const C = {
  black: { name: "Чёрный", hex: "#121826" },
  navy: { name: "Тёмно-синий", hex: "#1D2A4A" },
  grey: { name: "Серый", hex: "#9AA0AB" },
  white: { name: "Белый", hex: "#F4F4F2" },
  cream: { name: "Молочный", hex: "#E8E1D3" },
  camel: { name: "Кэмел", hex: "#B08A63" },
};

export const COLORS = Object.values(C);
export const SIZES = ["XS", "S", "M", "L", "XL"];
export const CATEGORIES: Category[] = ["Верхняя одежда", "Трикотаж", "Платья", "Рубашки", "Брюки", "Пиджаки"];

export const PRODUCTS: Product[] = [
  {
    id: "coat-oversize",
    name: "Пальто оверсайз, шерсть",
    price: 24900,
    category: "Верхняя одежда",
    gender: "Женщинам",
    colors: [C.camel, C.black, C.grey],
    sizes: ["XS", "S", "M", "L"],
    image: IMG.coat,
    badge: "Бестселлер",
    material: "80% шерсть, 20% кашемир",
    description: "Свободный силуэт, спущенное плечо и глубокие карманы. Держит форму и тепло до −10 °C.",
    position: "70% 50%",
  },
  {
    id: "knit-cashmere",
    name: "Свитер из кашемира",
    price: 14500,
    category: "Трикотаж",
    gender: "Женщинам",
    colors: [C.cream, C.grey, C.black],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: IMG.knit,
    badge: "Новинка",
    material: "100% кашемир, Монголия",
    description: "Объёмная вязка, мягкий рукав и высокий ворот. Не колется, не скатывается.",
  },
  {
    id: "blazer-navy",
    name: "Двубортный пиджак",
    price: 21900,
    category: "Пиджаки",
    gender: "Мужчинам",
    colors: [C.navy, C.black],
    sizes: ["S", "M", "L", "XL"],
    image: IMG.blazer,
    badge: "Новинка",
    material: "100% тонкая шерсть",
    description: "Шесть пуговиц, мягкое плечо без подплечников, полуподкладка из купро.",
  },
  {
    id: "dress-linen",
    name: "Платье-комбинация, лён",
    price: 11900,
    oldPrice: 14900,
    category: "Платья",
    gender: "Женщинам",
    colors: [C.black, C.cream],
    sizes: ["XS", "S", "M"],
    image: IMG.dress,
    material: "100% европейский лён",
    description: "Длина миди, тонкие бретели, косой крой — садится по фигуре без лишних деталей.",
  },
  {
    id: "shirt-poplin",
    name: "Рубашка оверсайз, поплин",
    price: 7900,
    category: "Рубашки",
    gender: "Мужчинам",
    colors: [C.white, C.navy],
    sizes: ["S", "M", "L", "XL"],
    image: IMG.shirt,
    badge: "Бестселлер",
    material: "100% хлопок поплин",
    description: "Плотный хлопок, удлинённая спинка, перламутровые пуговицы.",
  },
  {
    id: "trousers-wool",
    name: "Брюки широкие, шерсть",
    price: 12400,
    category: "Брюки",
    gender: "Женщинам",
    colors: [C.grey, C.black],
    sizes: ["XS", "S", "M", "L"],
    image: IMG.knit,
    material: "70% шерсть, 30% вискоза",
    description: "Высокая посадка, заутюженные стрелки, длина в пол.",
    position: "50% 85%",
  },
  {
    id: "coat-men",
    name: "Пальто прямое, кашемир",
    price: 32900,
    category: "Верхняя одежда",
    gender: "Мужчинам",
    colors: [C.navy, C.camel],
    sizes: ["M", "L", "XL"],
    image: IMG.blazer,
    badge: "Новинка",
    material: "90% шерсть, 10% кашемир",
    description: "Классика с потайной застёжкой и шлицей. На каждый день и на десять лет вперёд.",
    position: "50% 20%",
  },
  {
    id: "trousers-men",
    name: "Брюки со стрелками",
    price: 9900,
    oldPrice: 11900,
    category: "Брюки",
    gender: "Мужчинам",
    colors: [C.grey, C.black],
    sizes: ["S", "M", "L", "XL"],
    image: IMG.shirt,
    material: "Шерсть с эластаном",
    description: "Прямой крой, средняя посадка, ткань не мнётся в поездках.",
    position: "50% 80%",
  },
];

export const formatPrice = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";
