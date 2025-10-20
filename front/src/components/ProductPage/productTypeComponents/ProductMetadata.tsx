/**
 * Metadata component for passing derived values to 3D system
 * This component doesn't render anything in the UI
 * It's used to pass derivedSections and other computed values to the 3D viewer
 */
export type ProductMetadataComponent = {
  type: 'metadata'
  derivedSections: number
}

