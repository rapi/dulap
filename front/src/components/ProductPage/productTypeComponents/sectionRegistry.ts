// sectionRegistry.ts
export type NavSection =
  | 'select'
  | 'colors'
  | 'dimensions'
  | 'sections'
  | 'columns'
  | 'individualColumns'
  | 'wardrobeColumns'
  | 'rackColumns'
  | 'furniture'

export const NAV_ORDER = [
  'select',
  'dimensions',
  'colors',
  'sections',
  'columns',
  'individualColumns',
  'wardrobeColumns',
  'rackColumns',
  'furniture',
] as const // readonly tuple

export const SECTION_LABELS: Record<
  NavSection,
  { id: string; defaultMessage: string }
> = {
  select: {
    id: 'homepage.configurator.select.title',
    defaultMessage: 'opțiuni',
  },
  colors: {
    id: 'homepage.configurator.colors.title',
    defaultMessage: 'culoarea',
  },
  dimensions: {
    id: 'homepage.configurator.dimensions.title',
    defaultMessage: 'dimensiuni',
  },
  sections: {
    id: 'homepage.configurator.sections.title',
    defaultMessage: 'secțiuni',
  },
  columns: {
    id: 'homepage.configurator.columns.title',
    defaultMessage: 'coloane',
  },
  individualColumns: {
    id: 'homepage.configurator.individualColumns.title',
    defaultMessage: 'coloane (individual)',
  },
  wardrobeColumns: {
    id: 'homepage.configurator.wardrobe.columnConfiguration',
    defaultMessage: 'configurație interioară',
  },
  rackColumns: {
    id: 'homepage.configurator.rack.columnConfiguration',
    defaultMessage: 'configurație interioară',
  },
  furniture: {
    id: 'homepage.configurator.fittings.handleType',
    defaultMessage: 'vizualizare',
  },
}

// ✅ use a readonly cast here
export const isNavSection = (t: string): t is NavSection =>
  (NAV_ORDER as readonly string[]).includes(t)
