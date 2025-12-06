import React from 'react'
import { BookcaseTemplate, BookcaseZoneType } from '~/types/bookcaseConfigurationTypes'

interface BookcaseConfigurationIconProps {
  template: BookcaseTemplate
  width?: number
  height?: number
  availableHeight?: number // Optional: actual bookcase height for better shelf/drawer estimates
}

/**
 * Visual representation of bookcase template configuration
 * Displays zones as simplified icons using heightProportion
 */
export const BookcaseConfigurationIcon: React.FC<BookcaseConfigurationIconProps> = ({
  template,
  width = 45,
  height = 60,
  availableHeight = 200, // Default to 200cm for estimation
}) => {
  // Total proportions (should sum to 100)
  const totalProportion = template.zones.reduce((sum, zone) => sum + zone.heightProportion, 0)
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Background/Frame */}
      <rect
        x="2"
        y="2"
        width={width - 4}
        height={height - 4}
        fill="white"
        stroke="#666"
        strokeWidth="1.5"
        rx="2"
      />
      
      {/* Render zones from top to bottom */}
      {template.zones.map((zone, index) => {
        const zoneHeightRatio = zone.heightProportion / totalProportion
        const zonePixelHeight = (height - 6) * zoneHeightRatio
        
        // Calculate Y position (cumulative height from top)
        const yOffset = template.zones
          .slice(0, index)
          .reduce((sum, z) => sum + ((height - 6) * (z.heightProportion / totalProportion)), 0)
        
        const y = 3 + yOffset
        const x = 3
        const w = width - 6
        const h = zonePixelHeight
        
        // Determine fill color and pattern based on zone type
        let fill = '#f0f0f0'
        let strokeColor = '#ccc'
        
        switch (zone.type) {
          case BookcaseZoneType.SHELVES:
            fill = '#e3f2fd'
            strokeColor = '#90caf9'
            break
          case BookcaseZoneType.SHELVES_WITH_DOOR:
            fill = '#fff3e0'
            strokeColor = '#ffb74d'
            break
          case BookcaseZoneType.DRAWERS:
            fill = '#e8f5e9'
            strokeColor = '#81c784'
            break
          case BookcaseZoneType.EMPTY:
            fill = '#fafafa'
            strokeColor = '#e0e0e0'
            break
          default:
            fill = '#f5f5f5'
            strokeColor = '#bdbdbd'
        }
        
        return (
          <g key={index}>
            {/* Zone background */}
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={fill}
              stroke={strokeColor}
              strokeWidth="0.5"
            />
            
            {/* Zone-specific icons/patterns */}
            {zone.type === BookcaseZoneType.SHELVES && (
              // Draw shelf lines - estimate count from height
              <>
                {(() => {
                  // Estimate shelf count based on proportion and optimal spacing
                  const optimalSpacing = zone.shelfOptimalSpacing || 30
                  const estimatedHeight = (availableHeight || 200) * (zone.heightProportion / 100)
                  const shelfCount = Math.max(2, Math.min(4, Math.floor(estimatedHeight / optimalSpacing)))
                  
                  return Array.from({ length: shelfCount }).map((_, shelfIndex) => {
                    const shelfY = y + (h / (shelfCount + 1)) * (shelfIndex + 1)
                  return (
                    <line
                      key={shelfIndex}
                      x1={x + 2}
                      y1={shelfY}
                      x2={x + w - 2}
                      y2={shelfY}
                      stroke="#666"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  )
                  })
                })()}
              </>
            )}
            
            {zone.type === BookcaseZoneType.DRAWERS && (
              // Draw drawer lines - estimate count
              <>
                {(() => {
                  // Estimate drawer count based on proportion and optimal height
                  const optimalHeight = zone.drawerOptimalHeight || 20
                  const estimatedHeight = (availableHeight || 200) * (zone.heightProportion / 100)
                  const drawerCount = Math.max(2, Math.min(4, Math.floor(estimatedHeight / optimalHeight)))
                  
                  return Array.from({ length: drawerCount }).map((_, drawerIndex) => {
                    const drawerY = y + (h / drawerCount) * (drawerIndex + 1)
                  return (
                    <g key={drawerIndex}>
                      <line
                        x1={x}
                        y1={drawerY}
                        x2={x + w}
                        y2={drawerY}
                        stroke="#666"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                      <rect
                        x={x + w / 2 - 3}
                          y={drawerY - (h / drawerCount) / 2 - 1}
                        width="6"
                        height="2"
                        fill="#333"
                        opacity="0.5"
                      />
                      </g>
                    )
                  })
                })()}
              </>
            )}
                    </g>
                  )
                })}
      
      {/* Render doors on top of zones */}
      {template.doors && template.doors.map((doorConfig, doorIndex) => {
        // Calculate door position based on covered zones
        const coveredZones = doorConfig.zoneIndices.map(i => ({
          zone: template.zones[i],
          position: template.zones
            .slice(0, i)
            .reduce((sum, z) => sum + ((height - 6) * (z.heightProportion / totalProportion)), 0)
        }))
        
        if (coveredZones.length === 0) return null
        
        const firstZone = coveredZones[0]
        const lastZone = coveredZones[coveredZones.length - 1]
        const doorY = 3 + firstZone.position
        const doorHeight = coveredZones.reduce((sum, cz) => 
          sum + ((height - 6) * (cz.zone.heightProportion / totalProportion)), 0
        )
        
        return (
          <g key={`door-${doorIndex}`}>
            {/* Door outline */}
            <rect
              x={3}
              y={doorY}
              width={width - 6}
              height={doorHeight}
              fill="none"
              stroke="#8B4513"
              strokeWidth="1.5"
              opacity="0.7"
            />
            
            {doorConfig.type === 'single' && (
              <>
                {/* Single door - vertical line and handle */}
                <line
                  x1={width / 2}
                  y1={doorY + 2}
                  x2={width / 2}
                  y2={doorY + doorHeight - 2}
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <circle
                  cx={width / 2 - 6}
                  cy={doorY + doorHeight / 2}
                  r="1.5"
                  fill="#333"
                  opacity="0.6"
                />
              </>
            )}
            
            {doorConfig.type === 'split' && (
              <>
                {/* Split doors - two vertical lines and handles */}
                <line
                  x1={width / 3}
                  y1={doorY + 2}
                  x2={width / 3}
                  y2={doorY + doorHeight - 2}
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <line
                  x1={(width * 2) / 3}
                  y1={doorY + 2}
                  x2={(width * 2) / 3}
                  y2={doorY + doorHeight - 2}
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <circle
                  cx={width / 3 + 3}
                  cy={doorY + doorHeight / 2}
                  r="1.5"
                  fill="#333"
                  opacity="0.6"
                />
                <circle
                  cx={(width * 2) / 3 - 3}
                  cy={doorY + doorHeight / 2}
                  r="1.5"
                  fill="#333"
                  opacity="0.6"
                />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

