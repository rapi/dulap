import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { products } from '~/components/ProductListPage/products'
import { ProductItem } from '~/components/ProductItem/ProductItem'
import { ProductList } from '~/components/ProductList/ProductList'
import { useCart } from '~/context/cartContext'
import { CustomButton } from '../CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { WardrobeProductConfiguration } from '~/components/ProductPage/productTypes/wardrobe'
import { deepOrange } from '@mui/material/colors';
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'

export const ProductCatalog: React.FC = () => {
  const router = useRouter()
  const { addItem } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const baseConfig = WardrobeProductConfiguration()

  const handleAddToCart = (product: typeof products[number]) => {
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
      }
    )
    setIsModalOpen(true)
  }

  return (
    <>
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
                icon={
                  <ShoppingCartIcon
                    fontSize="inherit"
                    sx={{ color: deepOrange[300] }}
                  />
                }
                outlined
                size="large"
                variant="danger"
                onClick={() => handleAddToCart(product)}
              >
              </CustomButton>
            }
          />
        )
      })}
    </ProductList>
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <h3>
        <FormattedMessage id="modal.addedToCart.title">
          {() => 'Товар добавлен в корзину!'}
        </FormattedMessage>
      </h3>
      <div className={styles.buttonRow}>
        <CustomButton onClick={() => router.push('/cart')}>
          <FormattedMessage id="homepage.button.openCart">
            {() => 'Открыть корзину'}
          </FormattedMessage>
        </CustomButton>
        <CustomButton
          variant="grey"
          onClick={() => router.push('/')}
        >
          <FormattedMessage id="homepage.button.backToPurchase">
            {() => 'Вернуться к покупкам'}
          </FormattedMessage>
        </CustomButton>
      </div>
    </Modal>
    </>
  )
}