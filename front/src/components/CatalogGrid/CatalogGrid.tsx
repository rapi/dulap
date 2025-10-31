// components/Catalog/CatalogGrid.tsx
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { ProductList } from '~/components/ProductList/ProductList'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { deepOrange } from '@mui/material/colors'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'

type CatalogGridProps<T> = {
  items: T[]
  renderCard: (item: T, ctaButton: React.ReactNode) => React.ReactNode
  onAdd: (item: T) => void
  getKey?: (item: T, index: number) => React.Key
  renderCTA?: (onClick: () => void, item: T) => React.ReactNode
  cartPath?: string
  backPath?: string
  emptyState?: React.ReactNode
}

export function CatalogGrid<T>({
  items,
  renderCard,
  onAdd,
  getKey,
  renderCTA,
  cartPath = '/cart',
  backPath = '/',
  emptyState = null,
}: CatalogGridProps<T>) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = (item: T) => {
    onAdd(item) // <-- you provide this
    setIsModalOpen(true)
  }

  const defaultCTA = (onClick: () => void) => (
    <CustomButton
      icon={
        <ShoppingCartIcon fontSize="inherit" sx={{ color: deepOrange[300] }} />
      }
      outlined
      size="large"
      variant="danger"
      onClick={onClick}
    />
  )

  return (
    <>
      <ProductList>
        {items.length === 0
          ? emptyState
          : items.map((item, index) => {
              const onClick = () => handleClick(item)
              const button = renderCTA
                ? renderCTA(onClick, item)
                : defaultCTA(onClick)
              return (
                <React.Fragment key={getKey ? getKey(item, index) : index}>
                  {renderCard(item, button)}
                </React.Fragment>
              )
            })}
      </ProductList>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>
          <FormattedMessage id="modal.addedToCart.title">
            {() => 'Товар добавлен в корзину!'}
          </FormattedMessage>
        </h3>
        <div className={styles.buttonRow}>
          <CustomButton onClick={() => router.push(cartPath)}>
            <FormattedMessage id="homepage.button.openCart">
              {() => 'Открыть корзину'}
            </FormattedMessage>
          </CustomButton>
          <CustomButton
            variant="grey"
            onClick={() => {
              setIsModalOpen(false) // close modal immediately
            }}
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
