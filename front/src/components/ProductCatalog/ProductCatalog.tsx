import React from "react";
import { useRouter } from "next/router";

import styles from "./ProductCatalog.module.css";

import { presetIndex, type PresetIndexItem } from "~/presets/index";
import { CatalogItem } from "~/components/CatalogItem/CatalogItem";

/**
 * Optional helper to read selected product type from query.
 * Adjust keys if your ProductTypesList sets a different param name.
 */
function getSelectedType(q: Record<string, unknown>): PresetIndexItem["type"] | undefined {
  const t1 = typeof q["type"] === "string" ? q["type"] : undefined;
  const t2 = typeof q["productType"] === "string" ? q["productType"] : undefined;
  const t = t1 ?? t2;

  if (t === "wardrobe" || t === "bedside" || t === "stand" || t === "tv-stand") {
    return t;
  }
  return undefined;
}

export const ProductCatalog: React.FC = () => {
  const router = useRouter();

  const selectedType = getSelectedType(router.query as Record<string, unknown>);

  const items = [...presetIndex]
    .filter((p) => (selectedType ? p.type === selectedType : true))
    .sort((a, b) => (b.meta.sortWeight ?? 0) - (a.meta.sortWeight ?? 0));

  return (
    <div className={styles.grid}>
      {items.map((p) => (
        <CatalogItem key={p.id} item={p} />
      ))}
    </div>
  );
};
