import Image from "next/image";
import Link from "next/link";
import { presetIndex, type PresetIndexItem } from "./index";
import { buildPresetHref } from "./presetLink";

export default function PresetListPage() {
  const items: PresetIndexItem[] = [...presetIndex].sort(
    (a, b) => (b.meta.sortWeight ?? 0) - (a.meta.sortWeight ?? 0)
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Presets
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((p) => {
          const href = buildPresetHref(p);

          return (
            <Link
              key={p.id}
              href={href}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {p.meta.previewImage && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                  }}
                >
                  <Image
                    src={p.meta.previewImage}
                    alt={p.meta.title.ro ?? p.meta.title.ru ?? p.id}
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    sizes="300px"
                  />
                </div>
              )}

              <div style={{ marginTop: 10, fontWeight: 600 }}>
                {p.meta.title.ro ?? p.meta.title.ru}
              </div>

              <div style={{ fontSize: 12, marginTop: 6 }}>{p.type}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
