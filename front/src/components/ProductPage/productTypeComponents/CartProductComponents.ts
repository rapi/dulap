import { ProductComponent as WardrobePC } from '~/components/ProductPage/WardrobeProductPage'
import { PredefinedValue as WardrobePF } from '~/components/ProductPage/WardrobeProductPage'
import { ProductComponent as StandPC } from '~/components/ProductPage/StandProductPage'
import { PredefinedValue as StandPF } from '~/components/ProductPage/StandProductPage'

export type CartProductComponent = WardrobePC | StandPC
export type CartPredefinedValue = WardrobePF | StandPF
