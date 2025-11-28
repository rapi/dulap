// front/src/presets/index.ts
import type { Preset } from "./preset.schema";

export type PresetIndexItem = Pick<
  Preset,
  "id" | "slug" | "type" | "meta" | "details"
>;

export const presetIndex: PresetIndexItem[] = [
  // Dulap pentru haine 180cm
  {
    id: "WR-101",
    slug: "dulap-pentru-haine-180",
    type: "wardrobe",
    meta: {
      title: "products.presets.WR-101.title",
      shortDescription: "products.presets.WR-101.shortDescription",
      tags: [
        "products.presets.WR-101.tag.1",
        "products.presets.WR-101.tag.2",
        "products.presets.WR-101.tag.3",
      ],
      sortWeight: 100,
      previewImage: "/ready-products/wardrobe/1600-3_2.png",
    },
    details: {
      width: 180,
      height: 240,
      depth: 60,
      color: "#d9c9be",
      columns: 3,
      wardrobeCfg: "WARDROBE_180CM",
      openingType: "round", // mapped from "maner"
    },
  },

  // Dulap pentru haine 50cm
  {
    id: "WR-102",
    slug: "dulap-pentru-haine-50",
    type: "wardrobe",
    meta: {
      title: "products.presets.WR-102.title",
      shortDescription: "products.presets.WR-102.shortDescription",
      tags: [
        "products.presets.WR-102.tag.1",
        "products.presets.WR-102.tag.2",
        "products.presets.WR-102.tag.3",
      ],
      sortWeight: 90,
      previewImage: "/ready-products/wardrobe/500-1_2.png",
    },
    details: {
      width: 50,
      height: 240,
      depth: 60,
      color: "#fcfbf5",
      columns: 1,
      wardrobeCfg: "WARDROBE_50CM",
      openingType: "round",
    },
  },

  // Dulap pentru haine 200cm
  {
    id: "WR-103",
    slug: "dulap-pentru-haine-200",
    type: "wardrobe",
    meta: {
      title: "products.presets.WR-103.title",
      shortDescription: "products.presets.WR-103.shortDescription",
      tags: [
        "products.presets.WR-103.tag.1",
        "products.presets.WR-103.tag.2",
        "products.presets.WR-103.tag.3",
      ],
      sortWeight: 110,
      previewImage: "/ready-products/wardrobe/2000-4_2.png",
    },
    details: {
      width: 200,
      height: 240,
      depth: 60,
      color: "#d9c9be",
      columns: 3,
      wardrobeCfg: "WARDROBE_200CM",
      openingType: "round",
    },
  },

  // Dulap pentru haine 240cm
  {
    id: "WR-104",
    slug: "dulap-pentru-haine-240",
    type: "wardrobe",
    meta: {
      title: "products.presets.WR-104.title",
      shortDescription: "products.presets.WR-104.shortDescription",
      tags: [
        "products.presets.WR-104.tag.1",
        "products.presets.WR-104.tag.2",
        "products.presets.WR-104.tag.3",
      ],
      sortWeight: 120,
      previewImage: "/ready-products/wardrobe/2500-5_2.png",
    },
    details: {
      width: 240,
      height: 240,
      depth: 60,
      color: "#d6d6d6",
      columns: 4,
      wardrobeCfg: "WARDROBE_240CM",
      openingType: "push",
    },
  },

  // Comodă 90cm
  {
    id: "ST-201",
    slug: "comoda-90",
    type: "stand",
    meta: {
      title: "products.presets.ST-201.title",
      shortDescription: "products.presets.ST-201.shortDescription",
      tags: [
        "products.presets.ST-201.tag.1",
        "products.presets.ST-201.tag.2",
      ],
      sortWeight: 80,
      previewImage: "/ready-products/stand/800 stand_2.png",
    },
    details: {
      width: 90,
      height: 90,
      depth: 40,
      color: "#d6d6d6",
      columns: 3,
      openingType: "push",
    },
  },

  // Comodă 50cm
  {
    id: "ST-202",
    slug: "comoda-50",
    type: "stand",
    meta: {
      title: "products.presets.ST-202.title",
      shortDescription: "products.presets.ST-202.shortDescription",
      tags: [
        "products.presets.ST-202.tag.1",
        "products.presets.ST-202.tag.2",
      ],
      sortWeight: 70,
      previewImage: "/ready-products/stand/600 stand_2.png",
    },
    details: {
      width: 50,
      height: 90,
      depth: 40,
      color: "#fcfbf5",
      columns: 2,
      openingType: "round",
    },
  },

  // Comodă TV 200cm
  {
    id: "TV-301",
    slug: "comoda-tv-200",
    type: "tv-stand",
    meta: {
      title: "products.presets.TV-301.title",
      shortDescription: "products.presets.TV-301.shortDescription",
      tags: [
        "products.presets.TV-301.tag.1",
        "products.presets.TV-301.tag.2",
      ],
      sortWeight: 95,
      previewImage: "/ready-products/tv-stand/2000-4 tv-stand_2.png",
    },
    details: {
      width: 200,
      height: 35,
      depth: 40,
      color: "#9c9c9c",
      columns: 4,
      openingType: "push",
    },
  },

  // Comodă TV 150cm
  {
    id: "TV-302",
    slug: "comoda-tv-150",
    type: "tv-stand",
    meta: {
      title: "products.presets.TV-302.title",
      shortDescription: "products.presets.TV-302.shortDescription",
      tags: [
        "products.presets.TV-302.tag.1",
        "products.presets.TV-302.tag.2",
      ],
      sortWeight: 90,
      previewImage: "/ready-products/tv-stand/1600-2_2.png",
    },
    details: {
      width: 150,
      height: 45,
      depth: 40,
      color: "#fcfbf5",
      columns: 2,
      openingType: "round",
    },
  },

  // Noptieră 80cm
  {
    id: "BS-401",
    slug: "noptiera-80",
    type: "bedside",
    meta: {
      title: "products.presets.BS-401.title",
      shortDescription: "products.presets.BS-401.shortDescription",
      tags: [
        "products.presets.BS-401.tag.1",
        "products.presets.BS-401.tag.2",
      ],
      sortWeight: 85,
      previewImage: "/ready-products/bedside/800 bedside_2.png",
    },
    details: {
      width: 80,
      height: 30,
      depth: 40,
      color: "#d6d6d6",
      openingType: "push",
    },
  },

  // Noptieră 60cm
  {
    id: "BS-402",
    slug: "noptiera-60",
    type: "bedside",
    meta: {
      title: "products.presets.BS-402.title",
      shortDescription: "products.presets.BS-402.shortDescription",
      tags: [
        "products.presets.BS-402.tag.1",
        "products.presets.BS-402.tag.2",
      ],
      sortWeight: 75,
      previewImage: "/ready-products/bedside/600 bedside_2.png",
    },
    details: {
      width: 60,
      height: 50,
      depth: 40,
      color: "#d6d6d6",
      openingType: "round",
    },
  },
];
