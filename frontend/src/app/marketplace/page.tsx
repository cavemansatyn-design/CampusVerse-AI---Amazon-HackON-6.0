"use client";

import { useEffect, useState } from "react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ComicBadge, ComicButton, ComicPanel } from "@/components/ui/comic-panel";
import { ProductImage } from "@/components/ui/product-image";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useRecommendations } from "@/lib/hooks/use-recommendations";
import { ACQUISITION_LADDER } from "@/lib/recommendation-data";
import { API_BASE } from "@/lib/utils";
import { Leaf, Plus, ShoppingBag } from "lucide-react";

interface CatalogItem {
  id: string;
  name: string;
  category: string;
  new_cost: number;
  borrowable: boolean;
  sustainability_score: number;
  image_url?: string;
}

function CatalogImage({ name, category }: { name: string; category?: string }) {
  return <ProductImage name={name} category={category} size={400} />;
}

export default function MarketplacePage() {
  const { dashboard } = useDashboard();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [wishlist, setWishlist] = useState("");
  const [myRentals, setMyRentals] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/intelligence/catalog?limit=300`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setCatalog)
      .catch(() => setCatalog([]));
  }, []);

  const recs = useRecommendations("marketplace", dashboard?.goals.map((g) => g.title) ?? []);

  return (
    <ToolPageLayout
      module="marketplace"
      title="Marketplace Engine"
      subtitle="Buy new · bundle deals · rent · share · borrow free · lend your items"
      recommendations={recs}
      recTitle="Top Picks (Buy First)"
    >
      <ComicPanel title="How Recommendations Are Ranked">
        <div className="flex flex-wrap items-center gap-2">
          {ACQUISITION_LADDER.split(" → ").map((type, i, arr) => (
            <div key={type} className="flex items-center gap-2">
              <ComicBadge variant={i <= 1 ? "alert" : i >= arr.length - 2 ? "success" : "default"}>{type}</ComicBadge>
              {i < arr.length - 1 && <span className="font-display">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 font-body text-sm">
          <Leaf size={14} /> Premium options first — free borrow & share at the bottom
        </p>
      </ComicPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <ComicPanel title="Borrow — What I Need (Wishlist)">
          <p className="mb-2 font-body text-xs text-outline">Post items you want to borrow or rent from campus mates</p>
          <textarea
            value={wishlist}
            onChange={(e) => setWishlist(e.target.value)}
            placeholder="Need: gym shoes size 9, scientific calculator for midterms..."
            className="mb-3 w-full border-4 border-on-surface p-3 font-body text-sm"
            rows={3}
          />
          <ComicButton><Plus size={14} className="mr-2 inline" /> Post Wish</ComicButton>
        </ComicPanel>

        <ComicPanel title="Lend — What I Offer (Rent List)">
          <p className="mb-2 font-body text-xs text-outline">List items you can rent out or lend to others</p>
          <textarea
            value={myRentals}
            onChange={(e) => setMyRentals(e.target.value)}
            placeholder="Offering: USB hub ₹30/day, extension board free borrow..."
            className="mb-3 w-full border-4 border-on-surface p-3 font-body text-sm"
            rows={3}
          />
          <ComicButton variant="secondary"><Plus size={14} className="mr-2 inline" /> List For Rent / Lend</ComicButton>
        </ComicPanel>
      </div>

      <ComicPanel title={`Campus Catalog — Buy, Rent & Borrow (${catalog.length || 300} items)`}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(catalog.length ? catalog : dashboard?.recommendations || []).slice(0, 12).map((item, i) => {
            const name = "name" in item ? item.name : (item as { item_name?: string }).item_name;
            const category = "category" in item ? item.category : (item as { item_category?: string }).item_category;
            const cost = "new_cost" in item ? item.new_cost : (item as { cost?: number }).cost;
            const borrowable = "borrowable" in item ? item.borrowable : cost === 0;
            return (
              <div key={("id" in item ? item.id : i) as string} className="border-4 border-on-surface bg-white p-3 shadow-[4px_4px_0_0_#1a1c1b]">
                <div className="relative mb-2 h-32 w-full border-2 border-on-surface bg-[#fff9e6]">
                  <CatalogImage name={name || "Product"} category={category} />
                </div>
                <ComicBadge variant={cost === 0 || borrowable ? "success" : "default"}>
                  {cost === 0 ? "borrow free" : cost && cost < 100 ? "rent" : "buy new"}
                </ComicBadge>
                <h3 className="font-display text-base uppercase">{name}</h3>
                <p className="font-mono text-xs">{cost === 0 ? "FREE borrow" : `₹${cost}`}</p>
              </div>
            );
          })}
        </div>
      </ComicPanel>
    </ToolPageLayout>
  );
}
