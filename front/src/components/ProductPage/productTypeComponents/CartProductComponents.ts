import { ProductComponent as WardrobePC } from '~/components/ProductPage/WardrobeProductPage'
import { PredefinedValue as WardrobePF } from '~/components/ProductPage/WardrobeProductPage'
import { ProductComponent as StandPC } from '~/components/ProductPage/StandProductPage'
import { PredefinedValue as StandPF } from '~/components/ProductPage/StandProductPage'
import { ProductComponent as TVStandPC } from '~/components/ProductPage/TVStandProductPage'
import { PredefinedValue as TVStandPF } from '~/components/ProductPage/TVStandProductPage'
import { ProductComponent as BedsidePC } from '~/components/ProductPage/BedsideProductPage'
import { PredefinedValue as BedsidePF } from '~/components/ProductPage/BedsideProductPage'
import { ProductComponent as BookcasePC } from '~/components/ProductPage/BookcaseProductPage'
import { PredefinedValue as BookcasePF } from '~/components/ProductPage/BookcaseProductPage'

export type CartProductComponent = WardrobePC | StandPC | TVStandPC | BedsidePC | BookcasePC
export type CartPredefinedValue = WardrobePF | StandPF | TVStandPF | BedsidePF | BookcasePF
