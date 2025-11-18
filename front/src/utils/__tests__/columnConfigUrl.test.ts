// utils/__tests__/columnConfigUrl.test.ts
import { 
  encodeColumnConfigs, 
  decodeColumnConfigs,
  isValidColumnConfigCode 
} from '../columnConfigUrl'
import { ColumnConfigurationType } from '~/types/columnConfigurationTypes'
import { ColumnConfigurationWithOptions } from '~/types/furniture3D'

describe('columnConfigUrl', () => {
  describe('encodeColumnConfigs', () => {
    it('should encode drawer configurations without door side', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DRAWERS_2 },
        { type: ColumnConfigurationType.DRAWERS_5 },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('DR3,DR2,DR5')
    })

    it('should encode single door configurations with door side', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_3_SHELVES, doorOpeningSide: 'left' },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('D1SL,D2SR,D3SL')
    })

    it('should encode split door configurations without door side', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('DS2S,DS3S')
    })

    it('should encode mixed configurations', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('D1SL,DR3,D2SR,DS3S')
    })

    it('should handle empty array', () => {
      expect(encodeColumnConfigs([])).toBe('')
    })

    it('should encode single door without doorOpeningSide (should not add L/R)', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DOOR_3_SHELVES },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('D3S')
    })

    it('should encode all drawer types', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DRAWERS_1 },
        { type: ColumnConfigurationType.DRAWERS_2 },
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DRAWERS_4 },
        { type: ColumnConfigurationType.DRAWERS_5 },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('DR1,DR2,DR3,DR4,DR5')
    })

    it('should encode all single door types', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_3_SHELVES, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DOOR_4_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_5_SHELVES, doorOpeningSide: 'left' },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('D1SL,D2SR,D3SL,D4SR,D5SL')
    })

    it('should encode all split door types', () => {
      const configs: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DOOR_SPLIT_1_SHELF },
        { type: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_4_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_5_SHELVES },
      ]
      
      expect(encodeColumnConfigs(configs)).toBe('DS1S,DS2S,DS3S,DS4S,DS5S')
    })
  })

  describe('decodeColumnConfigs', () => {
    it('should decode drawer configurations', () => {
      const result = decodeColumnConfigs('DR3,DR2,DR5')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DRAWERS_2 },
        { type: ColumnConfigurationType.DRAWERS_5 },
      ])
    })

    it('should decode single door configurations with door side', () => {
      const result = decodeColumnConfigs('D1SL,D2SR,D3SL')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_3_SHELVES, doorOpeningSide: 'left' },
      ])
    })

    it('should decode split door configurations', () => {
      const result = decodeColumnConfigs('DS2S,DS3S')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES },
      ])
    })

    it('should decode mixed configurations', () => {
      const result = decodeColumnConfigs('D1SL,DR3,D2SR,DS3S')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES },
      ])
    })

    it('should handle empty string', () => {
      expect(decodeColumnConfigs('')).toEqual([])
    })

    it('should handle invalid input types', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(decodeColumnConfigs(null as any)).toEqual([])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(decodeColumnConfigs(undefined as any)).toEqual([])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(decodeColumnConfigs(123 as any)).toEqual([])
    })

    it('should skip invalid codes and warn', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const result = decodeColumnConfigs('DR3,INVALID,D1SL,BADCODE')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
      ])
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown column configuration code: INVALID')
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown column configuration code: BADCODE')
      
      consoleWarnSpy.mockRestore()
    })

    it('should handle whitespace in codes', () => {
      const result = decodeColumnConfigs(' DR3 , D1SL , DR2 ')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DRAWERS_2 },
      ])
    })

    it('should skip empty codes between commas', () => {
      const result = decodeColumnConfigs('DR3,,D1SL,')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
      ])
    })

    it('should decode door configurations without side suffix', () => {
      const result = decodeColumnConfigs('D3S,D4S')
      
      expect(result).toEqual([
        { type: ColumnConfigurationType.DOOR_3_SHELVES },
        { type: ColumnConfigurationType.DOOR_4_SHELVES },
      ])
    })
  })

  describe('isValidColumnConfigCode', () => {
    it('should validate drawer codes', () => {
      expect(isValidColumnConfigCode('DR1')).toBe(true)
      expect(isValidColumnConfigCode('DR2')).toBe(true)
      expect(isValidColumnConfigCode('DR3')).toBe(true)
      expect(isValidColumnConfigCode('DR4')).toBe(true)
      expect(isValidColumnConfigCode('DR5')).toBe(true)
    })

    it('should validate single door codes without suffix', () => {
      expect(isValidColumnConfigCode('D1S')).toBe(true)
      expect(isValidColumnConfigCode('D2S')).toBe(true)
      expect(isValidColumnConfigCode('D3S')).toBe(true)
      expect(isValidColumnConfigCode('D4S')).toBe(true)
      expect(isValidColumnConfigCode('D5S')).toBe(true)
    })

    it('should validate single door codes with L/R suffix', () => {
      expect(isValidColumnConfigCode('D1SL')).toBe(true)
      expect(isValidColumnConfigCode('D1SR')).toBe(true)
      expect(isValidColumnConfigCode('D3SL')).toBe(true)
      expect(isValidColumnConfigCode('D3SR')).toBe(true)
    })

    it('should validate split door codes', () => {
      expect(isValidColumnConfigCode('DS1S')).toBe(true)
      expect(isValidColumnConfigCode('DS2S')).toBe(true)
      expect(isValidColumnConfigCode('DS3S')).toBe(true)
      expect(isValidColumnConfigCode('DS4S')).toBe(true)
      expect(isValidColumnConfigCode('DS5S')).toBe(true)
    })

    it('should reject invalid codes', () => {
      expect(isValidColumnConfigCode('INVALID')).toBe(false)
      expect(isValidColumnConfigCode('DR6')).toBe(false)
      expect(isValidColumnConfigCode('D0S')).toBe(false)
      expect(isValidColumnConfigCode('XYZ')).toBe(false)
      expect(isValidColumnConfigCode('')).toBe(false)
    })

    it('should handle invalid input types', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidColumnConfigCode(null as any)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidColumnConfigCode(undefined as any)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidColumnConfigCode(123 as any)).toBe(false)
    })
  })

  describe('round-trip encoding/decoding', () => {
    it('should maintain data integrity through encode-decode cycle', () => {
      const original: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES },
        { type: ColumnConfigurationType.DRAWERS_5 },
      ]
      
      const encoded = encodeColumnConfigs(original)
      const decoded = decodeColumnConfigs(encoded)
      
      expect(decoded).toEqual(original)
    })

    it('should handle all 15 configuration types in round-trip', () => {
      const original: ColumnConfigurationWithOptions[] = [
        { type: ColumnConfigurationType.DRAWERS_1 },
        { type: ColumnConfigurationType.DRAWERS_2 },
        { type: ColumnConfigurationType.DRAWERS_3 },
        { type: ColumnConfigurationType.DRAWERS_4 },
        { type: ColumnConfigurationType.DRAWERS_5 },
        { type: ColumnConfigurationType.DOOR_1_SHELF, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DOOR_2_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_3_SHELVES, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DOOR_4_SHELVES, doorOpeningSide: 'right' },
        { type: ColumnConfigurationType.DOOR_5_SHELVES, doorOpeningSide: 'left' },
        { type: ColumnConfigurationType.DOOR_SPLIT_1_SHELF },
        { type: ColumnConfigurationType.DOOR_SPLIT_2_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_3_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_4_SHELVES },
        { type: ColumnConfigurationType.DOOR_SPLIT_5_SHELVES },
      ]
      
      const encoded = encodeColumnConfigs(original)
      const decoded = decodeColumnConfigs(encoded)
      
      expect(decoded).toEqual(original)
    })
  })
})

