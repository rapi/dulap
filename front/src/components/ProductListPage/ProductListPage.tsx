import { ProductList } from '~/components/ProductList/ProductList'
import { productTypes } from '~/components/ProductListPage/productTypes'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeSecondIcon } from '~/components/Icons/Icons'

export const ProductListPage: React.FC = () => {
  return (
    <>
      <ProductList>
        {productTypes.map(({ image, link, name }) => (
          <ProductItem
            image={image}
            name={name}
            key={link}
            button={
              <CustomButton
                icon={<WardrobeSecondIcon />}
                href={link}
                outlined
                size="small"
              >
                Creează
              </CustomButton>
            }
          />
        ))}
      </ProductList>
    </>
  )
}
