import React, { memo } from 'react'
import * as THREE from 'three'
import { BookcaseZone, BookcaseZoneType } from '~/types/bookcaseConfigurationTypes'
import { Shelf } from '../wardrobe-zones/Shelf'
import { Drawer } from '../Drawer'
import { OpeningType } from '../../furnitureConfig'

interface BookcaseZoneRendererProps {
  zone: BookcaseZone
  columnWidth: number
  columnDepth: number
  zoneBottomY: number // Y position of the bottom of this zone (from bottom of column, after plint)
  plintHeight: number
  selectedColor: string
  horizontalPanelObject: THREE.Object3D
  roundHandleObject: THREE.Object3D
  profileHandleObject: THREE.Object3D
  renderTopShelf?: boolean // Whether to render a shelf
  renderShelfAtTop?: boolean // If true, render at top of zone; if false, render at bottom
  isLastZone?: boolean // Whether this is the last (bottom) zone
}

/**
 * BookcaseZoneRenderer - Renders a single bookcase zone based on its type
 * 
 * This component determines which interior elements to render based on the zone type:
 * - SHELVES zones: render multiple shelves with calculated spacing
 * - DRAWERS zones: render drawer fronts with calculated heights
 * - EMPTY zones: render nothing (open space)
 */
const BookcaseZoneRendererComponent: React.FC<BookcaseZoneRendererProps> = ({
  zone,
  columnWidth,
  columnDepth,
  zoneBottomY,
  plintHeight,
  selectedColor,
  horizontalPanelObject,
  roundHandleObject,
  profileHandleObject,
  renderTopShelf = false,
  renderShelfAtTop = false,
  isLastZone = false,
}) => {
  // Calculate shelf position based on purpose:
  // - At TOP of zone: for doors (ceiling of closed compartment)
  // - At BOTTOM of zone: for separators (between different zone types)
  const shelfY = renderShelfAtTop 
    ? plintHeight + zoneBottomY + zone.height  // Top of zone
    : plintHeight + zoneBottomY                 // Bottom of zone
  
  console.log('BookcaseZoneRenderer:', {
    zoneType: zone.type,
    renderTopShelf,
    renderShelfAtTop,
    shelfY,
    zoneBottomY,
    zoneHeight: zone.height,
    plintHeight
  })
  
  const topShelf = renderTopShelf ? (
    <Shelf
      key="zone-shelf"
      columnWidth={columnWidth - 1}
      columnDepth={columnDepth}
      positionY={shelfY}
      selectedColor={selectedColor}
      thickness={2}
    />
  ) : null
  // Render zone contents based on type
  let zoneContent: React.ReactElement | null = null

  switch (zone.type) {
    case BookcaseZoneType.SHELVES:
    case BookcaseZoneType.SHELVES_FIXED:
      // Render shelves with calculated spacing
      if (zone.shelfCount && zone.shelfCount > 0) {
        const shelves = []
        // Always calculate spacing to evenly distribute shelves within the zone
        // shelfCount + 1 creates equal spaces: bottom | shelf | shelf | ... | top
        const shelfSpacing = zone.height / (zone.shelfCount + 1)
        
        // Render shelves evenly distributed within the zone
        for (let i = 0; i < zone.shelfCount; i++) {
          // Position shelf from bottom of zone (i+1 to skip the first space at bottom)
          const shelfYInZone = shelfSpacing * (i + 1)
          const absoluteShelfY = plintHeight + zoneBottomY + shelfYInZone
          
          shelves.push(
            <Shelf
              key={`shelf-${i}`}
              columnWidth={columnWidth - 1}
              columnDepth={columnDepth}
              positionY={absoluteShelfY}
              selectedColor={selectedColor}
              thickness={2}
            />
          )
        }
        
        zoneContent = <>{shelves}</>
      } else {
        zoneContent = null
      }
      break

    case BookcaseZoneType.DRAWERS:
      // Render drawers with calculated heights
      if (zone.drawerCount && zone.drawerCount > 0 && zone.drawerHeights) {
        const DRAWER_MARGIN = 1 // 1cm margin between drawers
        const BOTTOM_DRAWER_MARGIN = 2 // 2cm margin at bottom
        
        const elements = []
        
        // Render each drawer from bottom to top
        let currentDrawerBottomY = BOTTOM_DRAWER_MARGIN
        
        for (let i = 0; i < zone.drawerCount; i++) {
          const drawerHeight = zone.drawerHeights[i]
          const absoluteDrawerBottomY = plintHeight + zoneBottomY + currentDrawerBottomY
          
          elements.push(
            <Drawer
              key={`drawer-${i}`}
              horizontalPanelObject={horizontalPanelObject}
              roundHandleObject={roundHandleObject}
              profileHandleObject={profileHandleObject}
              openingType={OpeningType.Push} // Bookcases use push-to-open
              drawerWidth={columnWidth - 8}
              drawerHeight={drawerHeight}
              drawerDepth={columnDepth - 5}
              selectedColor={selectedColor}
              drawerIndex={i}
              positionY={absoluteDrawerBottomY}
              positionX={0}
              drawerOffsetZ={0} // No opening animation for closed bookcase drawers
              isHovered={false} // Never hover (controlled by bookcase door)
            />
          )
          
          // Move up by drawer height + margin for next drawer
          currentDrawerBottomY += drawerHeight + DRAWER_MARGIN
        }
        
        zoneContent = <>{elements}</>
      } else {
        zoneContent = null
      }
      break

    case BookcaseZoneType.EMPTY:
      // Empty space - render nothing
      zoneContent = null
      break

    default:
      zoneContent = null
  }

  return (
    <>
      {topShelf}
      {zoneContent}
    </>
  )
}

export const BookcaseZoneRenderer = memo(BookcaseZoneRendererComponent)

