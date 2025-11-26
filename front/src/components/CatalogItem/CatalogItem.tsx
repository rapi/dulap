import React from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./CatalogItem.module.css";

import type { PresetIndexItem } from "~/presets/index";
import { buildPresetHref } from "~/presets/presetLink";
import { FormattedMessage } from "react-intl";

interface Props {
  item: PresetIndexItem;
}

export const CatalogItem: React.FC<Props> = ({ item }) => {
  const href = buildPresetHref(item);
  const title = item.meta.title ?? item.id;
  const img = item.meta.previewImage;

  return (
    <Link key={item.id} href={href} className={styles.card}>
      <div className={styles.imageWrap}>
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            sizes="320px"
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.title}><FormattedMessage id={item.meta.title} /></div>

        <div className={styles.dimensions}>
          {item.details.width}×{item.details.height}×{item.details.depth} <FormattedMessage id="homepage.configurator.dimensions.cm"></FormattedMessage>
        </div>

        <div className={styles.type}>{item.type}</div>

        {item.meta.tags?.length ? (
          <div className={styles.tags}>
            {item.meta.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                <FormattedMessage id={tag} />
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
};
