import React, { memo } from 'react'
import * as THREE from 'three'
import { RackZone, RackZoneType } from '~/types/rackConfigurationTypes'
import { Shelf } from '../wardrobe-zones/Shelf'
import { Drawer } from '../Drawer'
import { OpeningType } from '../../furnitureConfig'

interface RackZoneRendererProps {
  zone: RackZone
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
  masterShelfPositions?: number[] // Master grid positions for symmetric shelves (relative to plint top)
  useMasterGrid?: boolean // Whether this zone should use master grid for shelf positions
  isColumnOpen?: boolean // Whether column is hovered or selected (for drawer animation)
}

/**
 * RackZoneRenderer - Renders a single rack zone based on its type
 * 
 * This component determines which interior elements to render based on the zone type:
 * - SHELVES zones: render multiple shelves with calculated spacing
 * - DRAWERS zones: render drawer fronts with calculated heights
 * - EMPTY zones: render nothing (open space)
 */
const RackZoneRendererComponent: React.FC<RackZoneRendererProps> = ({
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
  masterShelfPositions,
  useMasterGrid = false,
  isColumnOpen = false,
}) => {
  // Calculate shelf position based on purpose:
  // - At TOP of zone: for doors (ceiling of closed compartment)
  // - At BOTTOM of zone: for separators (between different zone types)
  const shelfY = renderShelfAtTop 
    ? plintHeight + zoneBottomY + zone.height  // Top of zone
    : plintHeight + zoneBottomY                // Bottom of zone
  
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
    case RackZoneType.SHELVES:
    case RackZoneType.SHELVES_FIXED:
      // Render shelves - either using master grid (for symmetric alignment) or zone-local calculation
      if (useMasterGrid && masterShelfPositions && masterShelfPositions.length > 0) {
        // USE MASTER GRID: Filter master positions that fall within this zone's bounds
        const zoneTop = zoneBottomY + zone.height
        const SHELF_MARGIN = 5 // Minimum margin from zone edges to place a shelf
        
        // Filter master positions to those within this zone (with margin)
        const shelvesInZone = masterShelfPositions.filter(pos => 
          pos > (zoneBottomY + SHELF_MARGIN) && pos < (zoneTop - SHELF_MARGIN)
        )
        
        const shelves = shelvesInZone.map((shelfPos, i) => {
          const absoluteShelfY = plintHeight + shelfPos
          
          return (
            <Shelf
              key={`shelf-master-${i}`}
              columnWidth={columnWidth - 1}
              columnDepth={columnDepth}
              positionY={absoluteShelfY}
              selectedColor={selectedColor}
              thickness={2}
            />
          )
        })
        
        zoneContent = <>{shelves}</>
      } else if (zone.shelfCount && zone.shelfCount > 0) {
        // ZONE-LOCAL CALCULATION: Distribute shelves evenly within zone
        const shelves = []
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

    case RackZoneType.DRAWERS:
      // Render drawers with calculated heights and staggered opening animation
      // Animation pattern:
      // - Bottom drawer opens most (20cm)
      // - Each drawer above opens 2cm less than the one below
      // - Creates cascading "one by one" visual effect
      if (zone.drawerCount && zone.drawerCount > 0 && zone.drawerHeights) {
        const DRAWER_MARGIN = 0.2 // 0.2cm margin between drawers
        const BASE_DRAWER_OFFSET_Z = 20 // Base offset for drawer animation (5cm more than stand)
        const DRAWER_STAGGER = 3 // Stagger each drawer by 3cm
        const LERP_SPEED = 0.15 // Smooth animation speed
        
        const elements = []

        // Render each drawer from bottom to top
        let currentDrawerBottomY = 0
        
        for (let i = 0; i < zone.drawerCount; i++) {
          const drawerHeight = zone.drawerHeights[i] + 1.25
          console.log('drawerHeight', zone.drawerHeights);
          const absoluteDrawerBottomY = plintHeight + zoneBottomY + currentDrawerBottomY
          
          elements.push(
            <Drawer
              key={`drawer-${i}`}
              horizontalPanelObject={horizontalPanelObject}
              roundHandleObject={roundHandleObject}
              profileHandleObject={profileHandleObject}
              openingType={OpeningType.Push} // Racks use push-to-open
              drawerWidth={columnWidth}
              drawerHeight={drawerHeight}
              drawerDepth={columnDepth}
              selectedColor={selectedColor}
              drawerIndex={i}
              positionY={absoluteDrawerBottomY}
              positionX={0}
              drawerOffsetZ={BASE_DRAWER_OFFSET_Z - i * DRAWER_STAGGER} // Staggered opening animation
              lerpSpeed={LERP_SPEED} // Smooth animation interpolation
              isHovered={isColumnOpen} // Open when column is hovered or selected
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

    case RackZoneType.EMPTY:
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

export const RackZoneRenderer = memo(RackZoneRendererComponent)

