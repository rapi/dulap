import { CustomButton } from '../CustomButton/CustomButton'
import { products } from '~/components/ProductListPage/products'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ProductList } from '~/components/ProductList/ProductList'

export const ProductCatalog: React.FC = () => {
  return (
    <>
      <ProductList>
        {products.map(({ name, link, src, dimensions, color, price }) => (
          <ProductItem
            name={name}
            image={src}
            key={link}
            link={link}
            dimensions={dimensions}
            color={color}
            price={price}
            button={
              <CustomButton
                icon={<ShoppingCartIcon />}
                outlined
                size="large"
                variant="danger"
              >
                {/*<FormattedMessage id="homepage.button.addToCartShort" />*/}
              </CustomButton>
            }
          />
        ))}
      </ProductList>
    </>
  )
}
