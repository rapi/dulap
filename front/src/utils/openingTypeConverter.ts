import { OpeningType } from '~/components/ThreeDModel/furnitureConfig'

/**
 * Converts string opening method to OpeningType enum
 * Handles legacy string values and ensures type safety
 */
export function convertToOpeningType(
  method?: string | OpeningType
): OpeningType {
  if (!method) return OpeningType.Push
  
  // If already an OpeningType enum, return it
  if (typeof method === 'object' || Object.values(OpeningType).includes(method as OpeningType)) {
    return method as OpeningType
  }
  
  // Convert string values to enum
  switch (method) {
    case 'maner':
      return OpeningType.RoundHandle
    case 'profile-handle':
      return OpeningType.ProfileHandle
    case 'push':
    default:
      return OpeningType.Push
  }
}

