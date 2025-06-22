import { useRouter } from 'next/router'
import { productTypes } from '~/components/ProductTypesList/productTypes'
import Image from 'next/image'
import styles from './ProductTypesList.module.css'
import { CustomButton } from '../CustomButton/CustomButton'
import { FormattedMessage } from 'react-intl'
import clsx from 'clsx'
import Link from 'next/link'

export const ProductTypesList: React.FC = () => {
  const router = useRouter()
  return (
    <>
      <div className={styles.productListSelectContainer}>
        {productTypes.map(({ image, link, name }) => {
          const isAvailable =
            name === 'homepage.products.wardrobe' ||
            name === 'homepage.products.bedside' ||
            name === 'homepage.products.TVstand' ||
            name === 'homepage.products.stand'

          return (
            <div
              className={clsx(
                styles.productItemContainer,
                !isAvailable && styles.unavailable
              )}
              key={link}
            >
              <div
                onClick={() => {
                  if (isAvailable) router.push(link)
                }}
                style={{ cursor: isAvailable ? 'pointer' : 'default' }}
                className={styles.imageContainer}
              >
                <Image
                  width={2056}
                  height={1000}
                  src={image}
                  alt={'dulap.md ' + name}
                  className={[
                    styles.productImage,
                    !isAvailable && styles.blurredImage,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
                ></Image>
                {isAvailable ? (
                  <div className={styles.imageButton}>
                    <CustomButton variant="primary" size="small">
                      <FormattedMessage id="homepage.button.create" />
                    </CustomButton>
                  </div>
                ) : (
                  <div className={styles.comingSoonOverlay}>
                    <FormattedMessage id="homepage.label.comingSoon" />
                  </div>
                )}
              </div>
              <div className={styles.productTypeTitle}>
                {isAvailable ? (
                  <Link href={link} className={styles.nameLink}>
                    <FormattedMessage id={name} />
                  </Link>
                ) : (
                  <span className={styles.disabledName}>
                    <FormattedMessage id={name} />
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
