import React from 'react'
import { RackTemplate, RackZoneType } from '~/types/rackConfigurationTypes'

interface RackConfigurationIconProps {
  template: RackTemplate
  width?: number
  height?: number
  availableHeight?: number // Optional: actual rack height for better shelf/drawer estimates
}

/**
 * Visual representation of rack template configuration
 * Displays zones as simplified icons using heightProportion
 * Uses monochrome design with patterns for better clarity
 */
export const RackConfigurationIcon: React.FC<RackConfigurationIconProps> = ({
  template,
  width = 45,
  height = 60,
  availableHeight = 200, // Default to 200cm for estimation
}) => {
  // Total proportions (should sum to 100)
  const totalProportion = template.zones.reduce(
    (sum, zone) => sum + zone.heightProportion,
    0
  )

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Define patterns for different zone types */}
      <defs>
        {/* Pattern for zones with doors (diagonal lines) */}
        <pattern
          id="doorPattern"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <line
            x1="0"
            y1="0"
            x2="4"
            y2="4"
            stroke="#000"
            strokeWidth="0.3"
            opacity="0.15"
          />
        </pattern>

        {/* Pattern for drawer zones (horizontal lines) */}
        <pattern
          id="drawerPattern"
          patternUnits="userSpaceOnUse"
          width="4"
          height="3"
        >
          <line
            x1="0"
            y1="1.5"
            x2="4"
            y2="1.5"
            stroke="#000"
            strokeWidth="0.3"
            opacity="0.1"
          />
        </pattern>
      </defs>

      {/* Background/Frame */}
      <rect
        x="2"
        y="2"
        width={width - 4}
        height={height - 4}
        fill="white"
        stroke="#000"
        strokeWidth="0.7"
        rx="2"
      />

      {/* Render zones from top to bottom */}
      {template.zones.map((zone, index) => {
        const zoneHeightRatio = zone.heightProportion / totalProportion
        const zonePixelHeight = (height - 6) * zoneHeightRatio

        // Calculate Y position (cumulative height from top)
        const yOffset = template.zones
          .slice(0, index)
          .reduce(
            (sum, z) =>
              sum + (height - 6) * (z.heightProportion / totalProportion),
            0
          )

        const y = 3 + yOffset
        const x = 3
        const w = width - 6
        const h = zonePixelHeight

        // Check if this zone has a door covering it
        const hasDoor =
          template.doors?.some((door) => door.zoneIndices.includes(index)) ??
          false

        // Determine fill pattern based on zone type
        let fill = 'white'

        switch (zone.type) {
          case RackZoneType.SHELVES:
          case RackZoneType.SHELVES_FIXED:
            // Shelves with doors get a subtle pattern
            fill = hasDoor ? 'url(#doorPattern)' : 'white'
            break
          case RackZoneType.DRAWERS:
            // Drawers get horizontal line pattern
            fill = 'url(#drawerPattern)'
            break
          case RackZoneType.EMPTY:
            // Empty zones stay white
            fill = 'white'
            break
          default:
            fill = 'white'
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
              stroke="#000"
              strokeWidth="0.8"
            />

            {/* Zone-specific icons/patterns */}
            {(zone.type === RackZoneType.SHELVES ||
              zone.type === RackZoneType.SHELVES_FIXED) && (
              // Draw shelf lines - estimate count from height
              <>
                {(() => {
                  // Estimate shelf count based on proportion and optimal spacing
                  const optimalSpacing = zone.shelfOptimalSpacing || 30
                  const estimatedHeight =
                    (availableHeight || 200) * (zone.heightProportion / 100)
                  const shelfCount = Math.max(
                    2,
                    Math.min(5, Math.floor(estimatedHeight / optimalSpacing))
                  )

                  return Array.from({ length: shelfCount }).map(
                    (_, shelfIndex) => {
                      const shelfY =
                        y + (h / (shelfCount + 1)) * (shelfIndex + 1)
                      return (
                        <line
                          key={shelfIndex}
                          x1={x + 2}
                          y1={shelfY}
                          x2={x + w - 2}
                          y2={shelfY}
                          stroke="#000"
                          strokeWidth="1.2"
                          opacity="0.8"
                        />
                      )
                    }
                  )
                })()}
              </>
            )}

            {zone.type === RackZoneType.DRAWERS && (
              // Draw drawer lines and handles - estimate count
              <>
                {(() => {
                  // Estimate drawer count based on proportion and optimal height
                  const optimalHeight = zone.drawerOptimalHeight || 20
                  const estimatedHeight =
                    (availableHeight || 200) * (zone.heightProportion / 100)
                  const drawerCount = Math.max(
                    2,
                    Math.min(5, Math.floor(estimatedHeight / optimalHeight))
                  )

                  return Array.from({ length: drawerCount }).map(
                    (_, drawerIndex) => {
                      const drawerY = y + (h / drawerCount) * (drawerIndex + 1)
                      const drawerMidY = drawerY - h / drawerCount / 2
                      return (
                        <g key={drawerIndex}>
                          {/* Drawer separator line */}
                          <line
                            x1={x}
                            y1={drawerY}
                            x2={x + w}
                            y2={drawerY}
                            stroke="#000"
                            strokeWidth="1"
                            opacity="0.8"
                          />
                          {/* Drawer handle - more prominent */}
                          <rect
                            x={x + w / 2 - 4}
                            y={drawerMidY - 1}
                            width="8"
                            height="2"
                            fill="#000"
                            opacity="0.8"
                            rx="0.5"
                          />
                        </g>
                      )
                    }
                  )
                })()}
              </>
            )}
          </g>
        )
      })}

      {/* Render doors on top of zones */}
      {template.doors &&
        template.doors.map((doorConfig, doorIndex) => {
          // Calculate door position based on covered zones
          const coveredZones = doorConfig.zoneIndices.map((i) => ({
            zone: template.zones[i],
            position: template.zones
              .slice(0, i)
              .reduce(
                (sum, z) =>
                  sum + (height - 6) * (z.heightProportion / totalProportion),
                0
              ),
          }))

          if (coveredZones.length === 0) return null

          const firstZone = coveredZones[0]
          const doorY = 3 + firstZone.position
          const doorHeight = coveredZones.reduce(
            (sum, cz) =>
              sum + (height - 6) * (cz.zone.heightProportion / totalProportion),
            0
          )

          return (
            <g key={`door-${doorIndex}`}>
              {/* Door shadow/depth effect for open door */}
              <rect
                x={4}
                y={doorY + 0.5}
                width={width - 8}
                height={doorHeight}
                fill="#f0f0f0"
                stroke="none"
                rx="1"
              />

              {/* Door panel - slightly offset to show it's open */}
              <rect
                x={5}
                y={doorY}
                width={width - 10}
                height={doorHeight}
                fill="white"
                stroke="#000"
                strokeWidth="1.2"
                rx="1"
              />

              {doorConfig.type === 'single' && (
                <>
                  {/* Single door - vertical center line */}
                  <line
                    x1={width / 2}
                    y1={doorY + 2}
                    x2={width / 2}
                    y2={doorY + doorHeight - 2}
                    stroke="#000"
                    strokeWidth="0.6"
                    opacity="0.4"
                  />
                  {/* Door handle - circular and prominent */}
                  <circle
                    cx={width / 2 - 5}
                    cy={doorY + doorHeight / 2}
                    r="1.5"
                    fill="#000"
                    opacity="0.8"
                  />
                </>
              )}

              {doorConfig.type === 'split' && (
                <>
                  {/* Split doors - two vertical lines */}
                  <line
                    x1={width / 3 + 1}
                    y1={doorY + 2}
                    x2={width / 3 + 1}
                    y2={doorY + doorHeight - 2}
                    stroke="#000"
                    strokeWidth="0.6"
                    opacity="0.4"
                  />
                  <line
                    x1={(width * 2) / 3 - 1}
                    y1={doorY + 2}
                    x2={(width * 2) / 3 - 1}
                    y2={doorY + doorHeight - 2}
                    stroke="#000"
                    strokeWidth="0.6"
                    opacity="0.4"
                  />
                  {/* Door handles - circular and prominent */}
                  <circle
                    cx={width / 3 + 4}
                    cy={doorY + doorHeight / 2}
                    r="1.5"
                    fill="#000"
                    opacity="0.8"
                  />
                  <circle
                    cx={(width * 2) / 3 - 4}
                    cy={doorY + doorHeight / 2}
                    r="1.5"
                    fill="#000"
                    opacity="0.8"
                  />
                </>
              )}
            </g>
          )
        })}
    </svg>
  )
}
