import React from 'react'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'

interface ColumnConfigurationIconProps {
  type: ColumnConfigurationType
  width?: number
  height?: number
  className?: string
}

/**
 * Icon component that renders SVG icons for all column configuration types
 */
export const ColumnConfigurationIcon: React.FC<ColumnConfigurationIconProps> = ({
  type,
  width = 80,
  height = 100,
  className = '',
}) => {
  const viewBox = "0 0 100 120"

  // Common styles
  const frameStyle = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 }
  const handleStyle = { stroke: 'currentColor', strokeWidth: 3 }
  const shelfStyle = { stroke: 'currentColor', strokeWidth: 1.5, opacity: 0.7 }
  const doorLineStyle = { stroke: 'currentColor', strokeWidth: 1, opacity: 0.5 }

  const renderIcon = () => {
    switch (type) {
      // ============ DRAWERS ============
      case ColumnConfigurationType.DRAWERS_1:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            {/* Handle */}
            <line x1="45" y1="60" x2="55" y2="60" {...handleStyle} />
          </g>
        )

      case ColumnConfigurationType.DRAWERS_2:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            {/* Divider */}
            <line x1="10" y1="60" x2="90" y2="60" stroke="currentColor" strokeWidth="2" />
            {/* Handles */}
            <line x1="45" y1="35" x2="55" y2="35" {...handleStyle} />
            <line x1="45" y1="85" x2="55" y2="85" {...handleStyle} />
          </g>
        )

      case ColumnConfigurationType.DRAWERS_3:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            {/* Dividers */}
            <line x1="10" y1="43.33" x2="90" y2="43.33" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="76.67" x2="90" y2="76.67" stroke="currentColor" strokeWidth="2" />
            {/* Handles */}
            <line x1="45" y1="26.67" x2="55" y2="26.67" {...handleStyle} />
            <line x1="45" y1="60" x2="55" y2="60" {...handleStyle} />
            <line x1="45" y1="93.33" x2="55" y2="93.33" {...handleStyle} />
          </g>
        )

      case ColumnConfigurationType.DRAWERS_4:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            {/* Dividers */}
            <line x1="10" y1="35" x2="90" y2="35" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="60" x2="90" y2="60" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="85" x2="90" y2="85" stroke="currentColor" strokeWidth="2" />
            {/* Handles */}
            <line x1="45" y1="22.5" x2="55" y2="22.5" {...handleStyle} />
            <line x1="45" y1="47.5" x2="55" y2="47.5" {...handleStyle} />
            <line x1="45" y1="72.5" x2="55" y2="72.5" {...handleStyle} />
            <line x1="45" y1="97.5" x2="55" y2="97.5" {...handleStyle} />
          </g>
        )

      case ColumnConfigurationType.DRAWERS_5:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            {/* Dividers */}
            <line x1="10" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2" />
            {/* Handles */}
            <line x1="45" y1="20" x2="55" y2="20" {...handleStyle} />
            <line x1="45" y1="40" x2="55" y2="40" {...handleStyle} />
            <line x1="45" y1="60" x2="55" y2="60" {...handleStyle} />
            <line x1="45" y1="80" x2="55" y2="80" {...handleStyle} />
            <line x1="45" y1="100" x2="55" y2="100" {...handleStyle} />
          </g>
        )

      // ============ SINGLE DOOR WITH SHELVES ============
      case ColumnConfigurationType.DOOR_1_SHELF:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            {/* Door edge line */}
            <line x1="30" y1="15" x2="30" y2="105" {...doorLineStyle} />
            {/* Door handle */}
            <circle cx="25" cy="60" r="3" fill="currentColor" />
            {/* Shelf */}
            <line x1="30" y1="60" x2="85" y2="60" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_2_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="30" y1="15" x2="30" y2="105" {...doorLineStyle} />
            <circle cx="25" cy="60" r="3" fill="currentColor" />
            {/* Shelves */}
            <line x1="30" y1="43.33" x2="85" y2="43.33" {...shelfStyle} />
            <line x1="30" y1="76.67" x2="85" y2="76.67" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_3_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="30" y1="15" x2="30" y2="105" {...doorLineStyle} />
            <circle cx="25" cy="60" r="3" fill="currentColor" />
            {/* Shelves */}
            <line x1="30" y1="35" x2="85" y2="35" {...shelfStyle} />
            <line x1="30" y1="60" x2="85" y2="60" {...shelfStyle} />
            <line x1="30" y1="85" x2="85" y2="85" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_4_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="30" y1="15" x2="30" y2="105" {...doorLineStyle} />
            <circle cx="25" cy="60" r="3" fill="currentColor" />
            {/* Shelves */}
            <line x1="30" y1="30" x2="85" y2="30" {...shelfStyle} />
            <line x1="30" y1="50" x2="85" y2="50" {...shelfStyle} />
            <line x1="30" y1="70" x2="85" y2="70" {...shelfStyle} />
            <line x1="30" y1="90" x2="85" y2="90" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_5_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="30" y1="15" x2="30" y2="105" {...doorLineStyle} />
            <circle cx="25" cy="60" r="3" fill="currentColor" />
            {/* Shelves */}
            <line x1="30" y1="26" x2="85" y2="26" {...shelfStyle} />
            <line x1="30" y1="42" x2="85" y2="42" {...shelfStyle} />
            <line x1="30" y1="60" x2="85" y2="60" {...shelfStyle} />
            <line x1="30" y1="78" x2="85" y2="78" {...shelfStyle} />
            <line x1="30" y1="94" x2="85" y2="94" {...shelfStyle} />
          </g>
        )

      // ============ SPLIT DOORS WITH SHELVES ============
      case ColumnConfigurationType.DOOR_SPLIT_1_SHELF:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            {/* Vertical split */}
            <line x1="50" y1="10" x2="50" y2="110" stroke="currentColor" strokeWidth="2" />
            {/* Left door edge */}
            <line x1="25" y1="15" x2="25" y2="105" {...doorLineStyle} />
            {/* Right door edge */}
            <line x1="75" y1="15" x2="75" y2="105" {...doorLineStyle} />
            {/* Door handles */}
            <circle cx="45" cy="60" r="2.5" fill="currentColor" />
            <circle cx="55" cy="60" r="2.5" fill="currentColor" />
            {/* Shelf */}
            <line x1="25" y1="60" x2="45" y2="60" {...shelfStyle} />
            <line x1="55" y1="60" x2="75" y2="60" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_SPLIT_2_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="50" y1="10" x2="50" y2="110" stroke="currentColor" strokeWidth="2" />
            <line x1="25" y1="15" x2="25" y2="105" {...doorLineStyle} />
            <line x1="75" y1="15" x2="75" y2="105" {...doorLineStyle} />
            <circle cx="45" cy="60" r="2.5" fill="currentColor" />
            <circle cx="55" cy="60" r="2.5" fill="currentColor" />
            {/* Shelves */}
            <line x1="25" y1="43.33" x2="45" y2="43.33" {...shelfStyle} />
            <line x1="55" y1="43.33" x2="75" y2="43.33" {...shelfStyle} />
            <line x1="25" y1="76.67" x2="45" y2="76.67" {...shelfStyle} />
            <line x1="55" y1="76.67" x2="75" y2="76.67" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_SPLIT_3_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="50" y1="10" x2="50" y2="110" stroke="currentColor" strokeWidth="2" />
            <line x1="25" y1="15" x2="25" y2="105" {...doorLineStyle} />
            <line x1="75" y1="15" x2="75" y2="105" {...doorLineStyle} />
            <circle cx="45" cy="60" r="2.5" fill="currentColor" />
            <circle cx="55" cy="60" r="2.5" fill="currentColor" />
            {/* Shelves */}
            <line x1="25" y1="35" x2="45" y2="35" {...shelfStyle} />
            <line x1="55" y1="35" x2="75" y2="35" {...shelfStyle} />
            <line x1="25" y1="60" x2="45" y2="60" {...shelfStyle} />
            <line x1="55" y1="60" x2="75" y2="60" {...shelfStyle} />
            <line x1="25" y1="85" x2="45" y2="85" {...shelfStyle} />
            <line x1="55" y1="85" x2="75" y2="85" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_SPLIT_4_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="50" y1="10" x2="50" y2="110" stroke="currentColor" strokeWidth="2" />
            <line x1="25" y1="15" x2="25" y2="105" {...doorLineStyle} />
            <line x1="75" y1="15" x2="75" y2="105" {...doorLineStyle} />
            <circle cx="45" cy="60" r="2.5" fill="currentColor" />
            <circle cx="55" cy="60" r="2.5" fill="currentColor" />
            {/* Shelves */}
            <line x1="25" y1="30" x2="45" y2="30" {...shelfStyle} />
            <line x1="55" y1="30" x2="75" y2="30" {...shelfStyle} />
            <line x1="25" y1="50" x2="45" y2="50" {...shelfStyle} />
            <line x1="55" y1="50" x2="75" y2="50" {...shelfStyle} />
            <line x1="25" y1="70" x2="45" y2="70" {...shelfStyle} />
            <line x1="55" y1="70" x2="75" y2="70" {...shelfStyle} />
            <line x1="25" y1="90" x2="45" y2="90" {...shelfStyle} />
            <line x1="55" y1="90" x2="75" y2="90" {...shelfStyle} />
          </g>
        )

      case ColumnConfigurationType.DOOR_SPLIT_5_SHELVES:
        return (
          <g>
            <rect x="10" y="10" width="80" height="100" {...frameStyle} />
            <line x1="50" y1="10" x2="50" y2="110" stroke="currentColor" strokeWidth="2" />
            <line x1="25" y1="15" x2="25" y2="105" {...doorLineStyle} />
            <line x1="75" y1="15" x2="75" y2="105" {...doorLineStyle} />
            <circle cx="45" cy="60" r="2.5" fill="currentColor" />
            <circle cx="55" cy="60" r="2.5" fill="currentColor" />
            {/* Shelves */}
            <line x1="25" y1="26" x2="45" y2="26" {...shelfStyle} />
            <line x1="55" y1="26" x2="75" y2="26" {...shelfStyle} />
            <line x1="25" y1="42" x2="45" y2="42" {...shelfStyle} />
            <line x1="55" y1="42" x2="75" y2="42" {...shelfStyle} />
            <line x1="25" y1="60" x2="45" y2="60" {...shelfStyle} />
            <line x1="55" y1="60" x2="75" y2="60" {...shelfStyle} />
            <line x1="25" y1="78" x2="45" y2="78" {...shelfStyle} />
            <line x1="55" y1="78" x2="75" y2="78" {...shelfStyle} />
            <line x1="25" y1="94" x2="45" y2="94" {...shelfStyle} />
            <line x1="55" y1="94" x2="75" y2="94" {...shelfStyle} />
          </g>
        )

      default:
        return null
    }
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

