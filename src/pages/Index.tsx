import { useState } from "react";
import { CartProvider } from "@/context/CartContext";
import { ShopDataProvider } from "@/context/ShopDataContext";
import Header from "@/components/shop/Header";
import Hero from "@/components/shop/Hero";
import Catalog from "@/components/shop/Catalog";
import ProductDialog from "@/components/shop/ProductDialog";
import CartDrawer from "@/components/shop/CartDrawer";
import Footer from "@/components/shop/Footer";
import { FilterState, defaultFilters } from "@/components/shop/Filters";
import { Gender, Product } from "@/data/products";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState<Product | null>(null);

  const goCatalog = (gender: Gender | "all", onlyNew = false) => {
    setFilters({ ...defaultFilters, gender, onlyNew });
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const onSearch = (q: string) => {
    setSearch(q);
    if (q) document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ShopDataProvider>
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header onNavigate={goCatalog} onSearch={onSearch} />
        <main>
          <Hero onOpenProduct={setProduct} />
          <Catalog filters={filters} setFilters={setFilters} search={search} onOpenProduct={setProduct} />
        </main>
        <Footer />
        <ProductDialog product={product} onClose={() => setProduct(null)} />
        <CartDrawer />
      </div>
    </CartProvider>
    </ShopDataProvider>
  );
};

export default Index;
