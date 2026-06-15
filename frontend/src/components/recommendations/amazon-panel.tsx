"use client";

import { ComicBadge } from "@/components/ui/comic-panel";
import { ProductImage } from "@/components/ui/product-image";
import { ACQUISITION_LADDER, type RecProduct } from "@/lib/recommendation-data";
import { Leaf, ShoppingBag } from "lucide-react";

interface AmazonPanelProps {
  title?: string;
  items: RecProduct[];
  className?: string;
}

export function AmazonPanel({ title = "Smart Picks For You", items, className }: AmazonPanelProps) {
  const uniqueItems = items.filter(
    (item, index, list) =>
      list.findIndex((other) => other.name.toLowerCase() === item.name.toLowerCase()) === index
  );

  return (
    <aside className={`sticky top-8 h-fit ${className ?? ""}`}>
      <div className="comic-panel border-4 border-on-surface bg-white/95 p-4 shadow-[6px_6px_0_0_#1a1c1b]">
        <div className="mb-3 flex items-center gap-2 border-b-4 border-on-surface pb-2">
          <ShoppingBag size={18} />
          <h2 className="font-display text-lg uppercase leading-tight">{title}</h2>
        </div>
        <p className="mb-3 flex items-start gap-1 font-mono text-[9px] uppercase leading-snug text-outline">
          <Leaf size={11} className="mt-0.5 shrink-0" />
          {ACQUISITION_LADDER}
        </p>
        <div className="space-y-3">
          {uniqueItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 border-4 border-on-surface bg-white p-2 shadow-[3px_3px_0_0_#1a1c1b]"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden border-2 border-on-surface bg-[#fff9e6]">
                <ProductImage name={item.name} size={128} />
              </div>
              <div className="min-w-0 flex-1">
                <ComicBadge
                  variant={
                    item.acquisition === "new" || item.acquisition === "bundle"
                      ? "alert"
                      : item.acquisition === "borrow" || item.acquisition === "share"
                        ? "success"
                        : "default"
                  }
                >
                  {item.acquisition}
                </ComicBadge>
                <p className="truncate font-display text-sm uppercase">{item.name}</p>
                <p className="line-clamp-2 font-body text-[11px] leading-tight text-outline">{item.reason}</p>
                <div className="mt-1 flex justify-between font-mono text-[10px]">
                  <span>{Math.round(item.score * 100)}% match</span>
                  <span className="font-bold">{item.price === 0 ? "FREE" : `₹${item.price.toLocaleString()}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
