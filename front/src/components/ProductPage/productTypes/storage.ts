import { ProductComponent } from '~/components/ProductPage/WardrobeProductPage'
import { useMemo } from 'react'
import { 
  useBaseProductConfigurator, 
  createDimensionsComponent, 
  createColorsComponent, 
  createPriceComponent 
} from '../shared/BaseProductConfigurator'
import { STORAGE_CONSTRAINTS, STORAGE_PRICING } from '../shared/ProductConfigs'

export const StorageProductConfiguration: () => ProductComponent[] = () => {
  // Use shared base configurator
  const base = useBaseProductConfigurator(STORAGE_CONSTRAINTS, STORAGE_PRICING)

  // Storage-specific price calculation
  const storagePrice = useMemo(() => {
    return Math.round(
      (STORAGE_PRICING.baseCost +
        base.width * STORAGE_PRICING.widthMultiplier +
        base.height * STORAGE_PRICING.heightMultiplier +
        base.depth * STORAGE_PRICING.depthMultiplier) *
        STORAGE_PRICING.markup
    )
  }, [base.width, base.height, base.depth])

  return [
    // Storage-specific image select
    {
      type: 'imageSelect',
      options: [
        { value: '1x1', imageURL: '/storage/1x1.svg' },
        { value: '2x1', imageURL: '/storage/2x1.svg' },
        { value: '3x1', imageURL: '/storage/3x1.svg' },
        { value: '1x2', imageURL: '/storage/1x2.svg' },
        { value: '2x2', imageURL: '/storage/2x2.svg' },
        { value: '3x2', imageURL: '/storage/3x2.svg' },
        { value: '1x3', imageURL: '/storage/1x3.svg' },
        { value: '2x3', imageURL: '/storage/2x3.svg' },
        { value: '3x3', imageURL: '/storage/3x3.svg' },
      ],
    },
    
    // Use shared components
    createDimensionsComponent(base),
    createColorsComponent(base),
    
    // Storage-specific select component
    {
      type: 'select',
      options: ['Standard (cu bile)', 'Premium', 'Deluxe'],
      title: 'Furnitura',
      subTitle: 'Glisiere pentru sertare:',
    },
    
    // Storage-specific furniture component
    {
      type: 'furniture',
      selectedOpeningMethod: base.openingOption,
      setSelectedOpeningMethod: base.setOpeningOption,
      hinges: '',
      setHinges: () => {},
      guides: base.guides,
      setGuides: base.setGuides,
    },
    
    // Use calculated price
    createPriceComponent(storagePrice),
  ]
}
