import { useRouter } from 'next/router'
import { productTypes } from '~/components/ProductTypesList/productTypes'
import Image from 'next/image'
import styles from './ProductTypesList.module.css'
import { CustomButton } from '../CustomButton/CustomButton'
import { WardrobeIconMedium } from '../Icons/Icons'
import { FormattedMessage } from 'react-intl'

export const ProductTypesList: React.FC = () => {
  const router = useRouter()
  return (
    <>
      <div className={styles.productListSelectContainer}>
        {productTypes.map(({ image, link, name }) => (
          <div className={styles.productItemContainer} key={link}>
            <div
              onClick={() => router.push(link)}
              style={{ cursor: 'pointer' }}
              className={styles.imageContainer}
            >
              <Image
                width={2056}
                height={1000}
                src={image}
                alt={'dulap.md ' + name}
                className={styles.productImage}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzQwMCcgdmlld0JveD0nMCAwIDYwMCA0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzYwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyNFMEUwRTAnLz48L3N2Zz4="
              ></Image>
              <div className={styles.imageButton}>
                <CustomButton
                  icon={<WardrobeIconMedium />}
                  variant="primary"
                  size="small"
                  // href={link}
                >
                  <FormattedMessage id="homepage.button.create" />
                </CustomButton>
              </div>
            </div>
            <div className={styles.productTypeTitle}>
              <span>
                <FormattedMessage id={name} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
