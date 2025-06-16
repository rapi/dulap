import { products } from '~/components/ProductListPage/products'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import { ProductList } from '~/components/ProductList/ProductList'
import { useCart } from '~/context/cartContext'
import { CustomButton } from '../CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'

export const ProductCatalog: React.FC = () => {
  const { addItem } = useCart()

  const baseConfig = WardrobeProductConfiguration()

  return (
    <ProductList>
      {products.map(product => {
        return (
          <ProductItem
            key={product.id}
            name={product.name}
            image={product.src}
            link={product.link}
            dimensions={product.dimensions}
            color={product.color}
            price={product.price}
            button={
              <CustomButton
                icon={<ShoppingCartIcon />}
                outlined
                size="large"
                variant="danger"
                onClick={() => {
                  console.log('test here')
                  addItem(
                    product.name,
                    baseConfig,
                    {
                      imageCarousel: product.imageCarousel,
                      colors: product.color,
                      dimensions: product.dimensions,
                      furniture: product.furniture,
                      sections: product.sections,
                      price: product.price,
                    })
                }}
              >
              </CustomButton>
            }
          />
        )
      })}
    </ProductList>
  )
}