import React, { memo } from 'react'
import * as THREE from 'three'
import { WardrobeZone, WardrobeZoneType } from '~/types/wardrobeConfigurationTypes'
import { HangingRod } from './HangingRod'
import { Shelf } from './Shelf'
import { Drawer } from '../Drawer'
import { OpeningType } from '../../furnitureConfig'

interface WardrobeZoneRendererProps {
  zone: WardrobeZone
  columnWidth: number
  columnDepth: number
  zoneBottomY: number // Y position of the bottom of this zone (from bottom of column, after plint)
  plintHeight: number
  selectedColor: string
  horizontalPanelObject: THREE.Object3D
  roundHandleObject: THREE.Object3D
  profileHandleObject: THREE.Object3D
}

/**
 * WardrobeZoneRenderer - Renders a single wardrobe zone based on its type
 * 
 * This component determines which interior elements to render based on the zone type:
 * - HANGING zones: render hanging rods
 * - SHELVES zones: render shelves
 * - DRAWERS zones: render drawer fronts
 * - etc.
 */
const WardrobeZoneRendererComponent: React.FC<WardrobeZoneRendererProps> = ({
  zone,
  columnWidth,
  columnDepth,
  zoneBottomY,
  plintHeight,
  selectedColor,
  horizontalPanelObject,
  roundHandleObject,
  profileHandleObject,
}) => {
  // Helper function to render a top shelf if requested
  const renderTopShelf = () => {
    if (!zone.addShelfAtTheTop) return null
    
    const SHELF_THICKNESS = 2 // 2cm shelf thickness
    
    // Position shelf at the top of the zone with margin
    const topShelfPositionY = plintHeight + zoneBottomY + zone.height - SHELF_THICKNESS / 2
    
    return (
      <Shelf
        key="zone-top-shelf"
        columnWidth={columnWidth-1}
        columnDepth={columnDepth}
        positionY={topShelfPositionY}
        selectedColor={selectedColor}
        thickness={SHELF_THICKNESS}
      />
    )
  }

  // Render zone contents based on type
  let zoneContent: React.ReactElement | null = null

  switch (zone.type) {
    case WardrobeZoneType.HANGING_LONG:
    case WardrobeZoneType.HANGING_MEDIUM:
    case WardrobeZoneType.HANGING_SHORT:
      // Render hanging rod
      if (zone.rodHeight !== undefined) {
        // Calculate absolute Y position: plintHeight + zoneBottomY + rodHeight within zone
        const rodPositionY = plintHeight + zoneBottomY + zone.rodHeight
        zoneContent = (
          <HangingRod
            columnWidth={columnWidth}
            columnDepth={columnDepth}
            positionY={rodPositionY}
          />
        )
      } else {
        zoneContent = null
      }
      break

    case WardrobeZoneType.HANGING_DOUBLE:
      // Render two hanging rods
      // TODO: Implement double hanging rod
      zoneContent = null
      break

    case WardrobeZoneType.SHELVES:
    case WardrobeZoneType.SHELVES_FIXED:
      // Render shelves
      if (zone.shelfCount !== undefined && zone.shelfCount > 0) {
        const shelfThickness = 2 // 2cm shelf thickness
        
        // Calculate spacing between shelves
        let spacing: number
        if (zone.shelfSpacing !== undefined) {
          // Use explicit spacing if provided
          spacing = zone.shelfSpacing
        } else {
          // Calculate even spacing based on zone height and number of shelves
          // Distribute shelves evenly within the zone
          spacing = zone.height / (zone.shelfCount + 1)
        }
        
        // Render each shelf
        const shelves = []
        for (let i = 0; i < zone.shelfCount; i++) {
          // Position shelves from bottom to top with even spacing
          // First shelf is at spacing distance from zone bottom
          const shelfPositionInZone = spacing * (i + 1)
          const absoluteShelfY = plintHeight + zoneBottomY + shelfPositionInZone
          
          shelves.push(
            <Shelf
              key={`shelf-${i}`}
              columnWidth={columnWidth-1}
              columnDepth={columnDepth}
              positionY={absoluteShelfY}
              selectedColor={selectedColor}
              thickness={shelfThickness}
            />
          )
        }
        
        zoneContent = <>{shelves}</>
      } else {
        zoneContent = null
      }
      break

    case WardrobeZoneType.DRAWERS:
    case WardrobeZoneType.DRAWERS_WITH_DIVIDERS:
      // Render drawer fronts using full-featured Drawer component
      if (zone.drawerCount !== undefined && zone.drawerCount > 0) {
        const DRAWER_MARGIN = 3 // 3cm margin below each drawer (except bottom)
        const BOTTOM_DRAWER_MARGIN = 5 // 1cm margin below the bottom-most drawer
        const SHELF_HEIGHT = 2 // 2cm shelf thickness
        const SHELF_TOP_MARGIN = 3 // 3cm margin above the shelf (from zone top)
        
        // Use explicit drawer heights if provided, otherwise distribute evenly
        let drawerHeights: number[]
        
        if (zone.drawerHeights && zone.drawerHeights.length === zone.drawerCount) {
          drawerHeights = zone.drawerHeights
        } else {
          // Distribute zone height evenly among drawers, accounting for margins and top shelf
          // Reserved for top: SHELF_TOP_MARGIN + SHELF_HEIGHT
          // Bottom drawer has 1cm margin, others have 3cm margins
          // Total drawer margins = BOTTOM_DRAWER_MARGIN + DRAWER_MARGIN * (drawerCount - 1)
          const reservedForShelf = SHELF_TOP_MARGIN + SHELF_HEIGHT
          const totalDrawerMargins = BOTTOM_DRAWER_MARGIN + (DRAWER_MARGIN * (zone.drawerCount - 1))
          const availableHeight = zone.height - reservedForShelf - totalDrawerMargins
          const evenHeight = availableHeight / zone.drawerCount
          drawerHeights = Array(zone.drawerCount).fill(evenHeight)
        }
        
        const elements = []
        
        // Render each drawer from bottom to top
        let currentDrawerBottomY = BOTTOM_DRAWER_MARGIN // Start with 1cm margin at bottom
        
        for (let i = 0; i < zone.drawerCount; i++) {
          const drawerHeight = drawerHeights[i]
          const absoluteDrawerBottomY = plintHeight + zoneBottomY + currentDrawerBottomY
          
          elements.push(
            <Drawer
              key={`drawer-${i}`}
              horizontalPanelObject={horizontalPanelObject}
              roundHandleObject={roundHandleObject}
              profileHandleObject={profileHandleObject}
              openingType={OpeningType.Push} // Wardrobes use push-to-open (no visible handles)
              drawerWidth={columnWidth-8}
              drawerHeight={drawerHeight}
              drawerDepth={columnDepth-5}
              selectedColor={selectedColor}
              drawerIndex={i}
              positionY={absoluteDrawerBottomY}
              positionX={0}
              drawerOffsetZ={0} // No opening animation for closed wardrobe drawers
              isHovered={false} // Never hover (controlled by wardrobe door)
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

    case WardrobeZoneType.SHOE_RACK:
      // Render shoe rack
      // TODO: Implement shoe rack
      zoneContent = null
      break

    case WardrobeZoneType.ACCESSORIES:
      // Render accessory organizers
      // TODO: Implement accessories
      zoneContent = null
      break

    case WardrobeZoneType.EMPTY:
      // Empty space - render nothing
      zoneContent = null
      break

    default:
      zoneContent = null
  }

  // Render zone content and optional top shelf
  const topShelf = renderTopShelf()
  
  if (!zoneContent && !topShelf) {
    return null
  }
  
  return (
    <>
      {zoneContent}
      {topShelf}
    </>
  )
}

export const WardrobeZoneRenderer = memo(WardrobeZoneRendererComponent)
