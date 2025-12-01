import React from 'react'
import { WardrobeTemplate, WardrobeZoneType } from '~/types/wardrobeConfigurationTypes'

interface WardrobeConfigurationIconProps {
  template: WardrobeTemplate
  width?: number
  height?: number
  className?: string
}

/**
 * Icon component that renders SVG icons for wardrobe configurations
 * Shows a visual representation of the interior layout
 */
export const WardrobeConfigurationIcon: React.FC<WardrobeConfigurationIconProps> = ({
  template,
  width = 60,
  height = 100,
  className = '',
}) => {
  const viewBox = "0 0 80 120"

  // Common styles - cleaner, more minimalist
  const frameStyle = { fill: 'none', stroke: '#374151', strokeWidth: 1.5 }
  const rodStyle = { stroke: '#374151', strokeWidth: 2 }
  const hangerStyle = { fill: 'none', stroke: '#374151', strokeWidth: 1.2 }
  const shelfStyle = { stroke: '#374151', strokeWidth: 1.5 }
  const drawerStyle = { fill: 'none', stroke: '#374151', strokeWidth: 1.5 }
  const handleStyle = { stroke: '#374151', strokeWidth: 2, strokeLinecap: 'round' as const }

  // Calculate zone positions based on template zones
  const totalHeight = 90 // Interior height in SVG units (leaving room for frame)
  const zoneHeightSum = template.zones.reduce((sum, zone) => sum + zone.height, 0)
  
  let currentY = 15 // Start from top with padding
  const zonePositions = template.zones.map(zone => {
    const height = (zone.height / zoneHeightSum) * totalHeight
    const position = { y: currentY, height }
    currentY += height
    return position
  })

  const renderZone = (zoneType: WardrobeZoneType, y: number, height: number, zoneData: any) => {
    switch (zoneType) {
      case WardrobeZoneType.HANGING_LONG:
      case WardrobeZoneType.HANGING_MEDIUM:
      case WardrobeZoneType.HANGING_SHORT:
        // Simplified hanging rod with minimal hangers
        const rodY = y + height * 0.2
        return (
          <g key={`hanging-${y}`}>
            {/* Hanging rod */}
            <line x1="20" y1={rodY} x2="60" y2={rodY} {...rodStyle} />
            {/* Simplified hangers - just triangular shapes */}
            <g {...hangerStyle}>
              <path d={`M 30 ${rodY} L 27 ${rodY + 4} L 33 ${rodY + 4} Z`} fill="none" />
              <path d={`M 40 ${rodY} L 37 ${rodY + 4} L 43 ${rodY + 4} Z`} fill="none" />
              <path d={`M 50 ${rodY} L 47 ${rodY + 4} L 53 ${rodY + 4} Z`} fill="none" />
            </g>
          </g>
        )

      case WardrobeZoneType.HANGING_DOUBLE:
        // Two hanging rods - simplified
        const rod1Y = y + height * 0.25
        const rod2Y = y + height * 0.65
        return (
          <g key={`double-hanging-${y}`}>
            {/* Top rod */}
            <line x1="20" y1={rod1Y} x2="60" y2={rod1Y} {...rodStyle} />
            <g {...hangerStyle}>
              <path d={`M 35 ${rod1Y} L 33 ${rod1Y + 4} L 37 ${rod1Y + 4} Z`} fill="none" />
              <path d={`M 45 ${rod1Y} L 43 ${rod1Y + 4} L 47 ${rod1Y + 4} Z`} fill="none" />
            </g>
            
            {/* Bottom rod */}
            <line x1="20" y1={rod2Y} x2="60" y2={rod2Y} {...rodStyle} />
            <g {...hangerStyle}>
              <path d={`M 35 ${rod2Y} L 33 ${rod2Y + 4} L 37 ${rod2Y + 4} Z`} fill="none" />
              <path d={`M 45 ${rod2Y} L 43 ${rod2Y + 4} L 47 ${rod2Y + 4} Z`} fill="none" />
            </g>
          </g>
        )

      case WardrobeZoneType.SHELVES:
      case WardrobeZoneType.SHELVES_FIXED:
        // Simplified shelves
        const shelfCount = zoneData.shelfCount || 3
        const shelfSpacing = height / (shelfCount + 1)
        return (
          <g key={`shelves-${y}`}>
            {Array.from({ length: shelfCount }).map((_, i) => {
              const shelfY = y + shelfSpacing * (i + 1)
              return (
                <line 
                  key={i} 
                  x1="18" 
                  y1={shelfY} 
                  x2="62" 
                  y2={shelfY} 
                  {...shelfStyle} 
                />
              )
            })}
          </g>
        )

      case WardrobeZoneType.DRAWERS:
      case WardrobeZoneType.DRAWERS_WITH_DIVIDERS:
        // Simplified drawers
        const drawerCount = zoneData.drawerCount || 2
        const drawerHeight = height / drawerCount
        return (
          <g key={`drawers-${y}`}>
            {Array.from({ length: drawerCount }).map((_, i) => {
              const drawerY = y + drawerHeight * i
              const handleY = drawerY + drawerHeight / 2
              return (
                <g key={i}>
                  {/* Drawer divider line */}
                  {i > 0 && (
                    <line 
                      x1="18" 
                      y1={drawerY} 
                      x2="62" 
                      y2={drawerY} 
                      {...drawerStyle} 
                    />
                  )}
                  {/* Handle */}
                  <line 
                    x1="36" 
                    y1={handleY} 
                    x2="44" 
                    y2={handleY} 
                    {...handleStyle} 
                  />
                </g>
              )
            })}
          </g>
        )

      case WardrobeZoneType.SHOE_RACK:
        // Angled shoe shelves
        const shoeShelfCount = 4
        const shoeSpacing = height / (shoeShelfCount + 1)
        return (
          <g key={`shoes-${y}`}>
            {Array.from({ length: shoeShelfCount }).map((_, i) => {
              const shoeY = y + shoeSpacing * (i + 1)
              return (
                <line 
                  key={i} 
                  x1="12" 
                  y1={shoeY + 2} 
                  x2="68" 
                  y2={shoeY - 2} 
                  {...shelfStyle}
                  strokeDasharray="2 2"
                />
              )
            })}
          </g>
        )

      case WardrobeZoneType.ACCESSORIES:
        // Small compartments/dividers
        return (
          <g key={`accessories-${y}`}>
            {/* Grid of small compartments */}
            <rect x="12" y={y} width="28" height={height / 2} {...drawerStyle} />
            <rect x="40" y={y} width="28" height={height / 2} {...drawerStyle} />
            <rect x="12" y={y + height / 2} width="56" height={height / 2} {...drawerStyle} />
            {/* Small dots to indicate accessories */}
            <circle cx="26" cy={y + height / 4} r="1" fill="currentColor" opacity="0.5" />
            <circle cx="54" cy={y + height / 4} r="1" fill="currentColor" opacity="0.5" />
          </g>
        )

      default:
        return null
    }
  }

  const renderIcon = () => {
    return (
      <g>
        {/* Simplified main frame */}
        <rect x="15" y="10" width="50" height="100" {...frameStyle} rx="2" />
        
        {/* Render each zone */}
        {template.zones.map((zone, index) => {
          const pos = zonePositions[index]
          return renderZone(zone.type, pos.y, pos.height, zone)
        })}
      </g>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {renderIcon()}
    </svg>
  )
}

/**
 * Alternative simplified icon for very small sizes
 */
export const WardrobeConfigurationMiniIcon: React.FC<{
  templateId: string
  size?: number
  className?: string
}> = ({ templateId, size = 24, className = '' }) => {
  const viewBox = "0 0 24 24"
  
  // Simplified representations for small icons
  const renderMiniIcon = () => {
    switch (templateId) {
      case 'FULL_HANGING_WITH_1_SHELF':
      case 'FULL_HANGING_WITH_2_DRAWERS':
        return (
          <g>
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="2" />
            <path d="M 9 7 L 9 8 L 8 9 L 10 9 L 9 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M 15 7 L 15 8 L 14 9 L 16 9 L 15 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </g>
        )
      
      case 'DOUBLE_HANGING':
        return (
          <g>
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.5" />
            <line x1="6" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.5" />
          </g>
        )
      
      case 'SHELVES_ONLY':
        return (
          <g>
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          </g>
        )
      
      case 'HANGING_WITH_DRAWERS':
        return (
          <g>
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="1" />
            <rect x="5" y="15" width="14" height="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="12" cy="17" r="0.8" fill="currentColor" />
          </g>
        )
      
      default:
        return (
          <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
        )
    }
  }
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {renderMiniIcon()}
    </svg>
  )
}
