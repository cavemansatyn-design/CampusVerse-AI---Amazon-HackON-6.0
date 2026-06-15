"use client";

import Image from "next/image";
import { useState } from "react";
import { imgForProduct, placeholderForProduct } from "@/lib/product-images";

interface ProductImageProps {
  name: string;
  category?: string;
  size?: number;
  className?: string;
  fill?: boolean;
}

/** Loads product photo with automatic fallback — never shows broken image icon */
export function ProductImage({ name, category = "", size = 400, className, fill = true }: ProductImageProps) {
  const [attempt, setAttempt] = useState(0);
  const urls = [imgForProduct(name, category, size), placeholderForProduct(name, size)];
  const src = urls[Math.min(attempt, urls.length - 1)];

  return (
    <Image
      src={src}
      alt={name}
      fill={fill}
      width={fill ? undefined : size}
      height={fill ? undefined : Math.round(size * 0.75)}
      className={className ?? "object-cover"}
      unoptimized
      onError={() => setAttempt((a) => Math.min(a + 1, urls.length - 1))}
    />
  );
}
