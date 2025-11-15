// utils/__tests__/configUrl.test.ts
import { parseQueryToConfig, configToQuery, normalizeConfig } from '../configUrl'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import type { Constraints } from '../configTypes'

// Mock constraints for testing
const mockStandConstraints = {
  dimensions: {
    width: { min: 40, max: 240, default: 120 },
    height: { min: 40, max: 120, default: 80 },
    depth: { min: 30, max: 60, default: 40 },
    plintHeight: { min: 5, max: 20, default: 10 },
  },
  columns: { min: 1, max: 6, default: 1, allowCustomConfiguration: true },
  steps: {
    widthStep: 10,
    heightStep: 10,
    depthStep: 10,
    plintHeightStep: 1,
  },
} as Constraints

const mockBedsideConstraints = {
  dimensions: {
    width: { min: 30, max: 80, default: 50 },
    height: { min: 40, max: 80, default: 60 },
    depth: { min: 30, max: 50, default: 40 },
    plintHeight: { min: 5, max: 20, default: 10 },
  },
  columns: { min: 1, max: 2, default: 1, allowCustomConfiguration: false },
} as Constraints

describe('configUrl - parseQueryToConfig', () => {
  describe('basic parameters', () => {
    it('should parse basic dimensions from query', () => {
      const query = {
        width: '120',
        height: '80',
        depth: '40',
        color: '#fcfbf5',
      }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config).toMatchObject({
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
      })
    })

    it('should use defaults for missing parameters', () => {
      const query = {}

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config).toMatchObject({
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
        columns: 1,
        plintHeight: 10,
      })
    })

    it('should parse columns parameter', () => {
      const query = { columns: '3' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.columns).toBe(3)
    })

    it('should parse plintHeight for stand product', () => {
      const query = { plintHeight: '15' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.plintHeight).toBe(15)
    })

    it('should not set plintHeight for non-stand products', () => {
      const query = { plintHeight: '15' }

      const config = parseQueryToConfig(query, 'bedside', mockBedsideConstraints)

      expect(config.plintHeight).toBeUndefined()
    })

    it('should handle legacy colors parameter', () => {
      const query = { colors: '#ff0000' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.color).toBe('#ff0000')
    })

    it('should prefer color over colors parameter', () => {
      const query = { color: '#00ff00', colors: '#ff0000' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.color).toBe('#00ff00')
    })

    it('should lowercase color hex codes', () => {
      const query = { color: '#ABCDEF' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.color).toBe('#abcdef')
    })
  })

  describe('columnConfigurations parameter', () => {
    it('should parse colCfg parameter', () => {
      const query = {
        colCfg: 'D1SL,DR3,D2SR',
      }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.columnConfigurations).toEqual([
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
      ])
    })

    it('should handle missing colCfg parameter', () => {
      const query = {}

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.columnConfigurations).toBeUndefined()
    })

    it('should handle empty colCfg parameter', () => {
      const query = { colCfg: '' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.columnConfigurations).toBeUndefined()
    })

    it('should handle array colCfg parameter (take first)', () => {
      const query = { colCfg: ['DR3,DR2', 'D1SL'] }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.columnConfigurations).toEqual([
        { type: ColumnConfigurationType.DRAWERS_3, doorOpeningSide: undefined },
        { type: ColumnConfigurationType.DRAWERS_2, doorOpeningSide: undefined },
      ])
    })

    it('should parse complex column configurations', () => {
      const query = {
        colCfg: 'DR1,DR2,DR3,D1SL,D2SR,DS3S',
      }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.columnConfigurations).toHaveLength(6)
      expect(config.columnConfigurations![0].type).toBe(ColumnConfigurationType.DRAWERS_1)
      expect(config.columnConfigurations![3].type).toBe(ColumnConfigurationType.DOOR_1_SHELF)
      expect(config.columnConfigurations![3].doorOpeningSide).toBe('left')
      expect(config.columnConfigurations![5].type).toBe(ColumnConfigurationType.DOOR_SPLIT_3_SHELVES)
    })
  })

  describe('openingType parameter', () => {
    it('should parse openingType=push', () => {
      const query = { openingType: 'push' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.openingType).toBe('push')
    })

    it('should parse openingType=handle', () => {
      const query = { openingType: 'handle' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.openingType).toBe('handle')
    })

    it('should ignore invalid openingType values', () => {
      const query = { openingType: 'invalid' }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.openingType).toBeUndefined()
    })

    it('should handle missing openingType', () => {
      const query = {}

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.openingType).toBeUndefined()
    })

    it('should handle array openingType (take first)', () => {
      const query = { openingType: ['handle', 'push'] }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config.openingType).toBe('handle')
    })
  })

  describe('full configuration parsing', () => {
    it('should parse complete stand configuration', () => {
      const query = {
        width: '150',
        height: '90',
        depth: '45',
        plintHeight: '12',
        columns: '3',
        color: '#abc123',
        colCfg: 'D1SL,DR3,D2SR',
        openingType: 'handle',
      }

      const config = parseQueryToConfig(query, 'stand', mockStandConstraints)

      expect(config).toEqual({
        width: 150,
        height: 90,
        depth: 45,
        plintHeight: 12,
        columns: 3,
        color: '#abc123',
        columnConfigurations: [
          { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
          { type: ColumnConfigurationType.DRAWERS_3, doorOpeningSide: undefined },
          { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        ],
        openingType: 'handle',
      })
    })
  })
})

describe('configUrl - configToQuery', () => {
  describe('basic serialization', () => {
    it('should serialize basic config', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      // Default values (120, 80, 40) should be excluded, only color remains
      expect(query).toEqual({
        color: '#fcfbf5',
      })
    })

    it('should include columns when present', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
        columns: 3,
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.columns).toBe(3)
    })

    it('should include plintHeight for stand', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
        plintHeight: 15,
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.plintHeight).toBe(15)
    })

    it('should not include plintHeight for non-stand', () => {
      const config = {
        width: 50,
        height: 60,
        depth: 40,
        color: '#fcfbf5',
        plintHeight: 15,
      }

      const query = configToQuery(config, 'bedside', mockBedsideConstraints)

      expect(query.plintHeight).toBeUndefined()
    })
  })

  describe('columnConfigurations serialization', () => {
    it('should serialize column configurations', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
        columnConfigurations: [
          { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' as const },
          { type: ColumnConfigurationType.DRAWERS_3 },
          { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' as const },
        ],
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.colCfg).toBe('D1SL,DR3,D2SR')
    })

    it('should not include colCfg when array is empty', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
        columnConfigurations: [],
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.colCfg).toBeUndefined()
    })

    it('should not include colCfg when undefined', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.colCfg).toBeUndefined()
    })
  })

  describe('openingType serialization', () => {
    it('should not serialize openingType=push (default)', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
        openingType: 'push' as const,
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.openingType).toBeUndefined()
    })

    it('should serialize openingType=handle (non-default)', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
        openingType: 'handle' as const,
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.openingType).toBe('handle')
    })

    it('should not include openingType when undefined', () => {
      const config = {
        width: 120,
        height: 80,
        depth: 40,
        color: '#fcfbf5',
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.openingType).toBeUndefined()
    })
  })

  describe('default value filtering', () => {
    it('should exclude default values to keep URL short', () => {
      const config = {
        width: 120, // default
        height: 80,  // default
        depth: 40,   // default
        color: '#fcfbf5',
        columns: 1,  // default
        plintHeight: 10, // default
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      // Defaults should be excluded
      expect(query.width).toBeUndefined()
      expect(query.height).toBeUndefined()
      expect(query.depth).toBeUndefined()
      expect(query.columns).toBeUndefined()
      expect(query.plintHeight).toBeUndefined()
      
      // Color is always included (no default in constraints)
      expect(query.color).toBe('#fcfbf5')
    })

    it('should include non-default values', () => {
      const config = {
        width: 150, // non-default
        height: 90,  // non-default
        depth: 50,   // non-default
        color: '#fcfbf5',
        columns: 3,  // non-default
        plintHeight: 15, // non-default
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query.width).toBe(150)
      expect(query.height).toBe(90)
      expect(query.depth).toBe(50)
      expect(query.columns).toBe(3)
      expect(query.plintHeight).toBe(15)
    })
  })

  describe('full configuration serialization', () => {
    it('should serialize complete stand configuration', () => {
      const config = {
        width: 150,
        height: 90,
        depth: 45,
        plintHeight: 12,
        columns: 3,
        color: '#abc123',
        columnConfigurations: [
          { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' as const },
          { type: ColumnConfigurationType.DRAWERS_3 },
          { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' as const },
        ],
        openingType: 'handle' as const,
      }

      const query = configToQuery(config, 'stand', mockStandConstraints)

      expect(query).toEqual({
        width: 150,
        height: 90,
        depth: 45,
        plintHeight: 12,
        columns: 3,
        color: '#abc123',
        colCfg: 'D1SL,DR3,D2SR',
        openingType: 'handle',
      })
    })
  })
})

describe('configUrl - round-trip parsing', () => {
  it('should maintain data integrity through parse-serialize cycle', () => {
    const originalQuery = {
      width: '150',
      height: '90',
      depth: '45',
      plintHeight: '12',
      columns: '3',
      color: '#abc123',
      colCfg: 'D1SL,DR3,D2SR',
      openingType: 'handle',
    }

    const config = parseQueryToConfig(originalQuery, 'stand', mockStandConstraints)
    const serialized = configToQuery(config, 'stand', mockStandConstraints)

    expect(serialized).toEqual({
      width: 150,
      height: 90,
      depth: 45,
      plintHeight: 12,
      columns: 3,
      color: '#abc123',
      colCfg: 'D1SL,DR3,D2SR',
      openingType: 'handle',
    })
  })

  it('should handle minimal configuration round-trip', () => {
    const originalQuery = {
      colCfg: 'DR3',
      openingType: 'handle',
    }

    const config = parseQueryToConfig(originalQuery, 'stand', mockStandConstraints)
    const serialized = configToQuery(config, 'stand', mockStandConstraints)

    // Defaults should not be serialized
    expect(serialized.width).toBeUndefined()
    expect(serialized.height).toBeUndefined()
    
    // Non-defaults should be serialized
    expect(serialized.colCfg).toBe('DR3')
    expect(serialized.openingType).toBe('handle')
    expect(serialized.color).toBe('#fcfbf5')
  })
})

describe('configUrl - normalizeConfig', () => {
  it('should clamp values to valid ranges', () => {
    const config = {
      width: 1000, // exceeds max
      height: 10,  // below min
      depth: 40,
      color: '#fcfbf5',
    }

    const normalized = normalizeConfig(config, 'stand', mockStandConstraints)

    expect(normalized.width).toBe(240) // clamped to max
    expect(normalized.height).toBe(40) // clamped to min
  })

  it('should snap values to step increments', () => {
    const config = {
      width: 125, // should snap to 120 or 130
      height: 85, // should snap to 80 or 90
      depth: 43,  // should snap to 40 or 50
      color: '#fcfbf5',
    }

    const normalized = normalizeConfig(config, 'stand', mockStandConstraints)

    expect(normalized.width % 10).toBe(0)
    expect(normalized.height % 10).toBe(0)
    expect(normalized.depth % 10).toBe(0)
  })

  it('should clamp columns to valid range', () => {
    const config = {
      width: 120,
      height: 80,
      depth: 40,
      color: '#fcfbf5',
      columns: 10, // exceeds max
    }

    const normalized = normalizeConfig(config, 'stand', mockStandConstraints)

    expect(normalized.columns).toBe(6) // clamped to max
  })
})

