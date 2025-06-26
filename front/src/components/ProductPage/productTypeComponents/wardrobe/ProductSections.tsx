import React, { FC, useEffect, useState } from 'react'
import { ButtonOptionsType, ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { ImageOptionProps, ImageSelect } from '~/components/ImageSelect/ImageSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Modal } from '~/components/Modal/Modal'
import { FormattedMessage } from 'react-intl'

export type ProductSectionsComponent = {
  type: 'sections'
  maxNumber: number
  minNumber: number
  onSelect?: (section: number) => void
  possibleSections: ImageOptionProps[]
  activeOpening: ImageOptionProps[]
  selectedMaxSections: number
  selectedSections: ImageOptionProps[]
  setSelectedSections: React.Dispatch<React.SetStateAction<ImageOptionProps[]>>
  setSelectedMaxSections: (value: number) => void
  selectedMirrorOption?: string
  setSelectedMirrorOption?: (value: string) => void
  predefinedValue?: string
}

export const mirroringOptions: ButtonOptionsType[] = [
  { value: 'standard', label: 'homepage.configurator.wardrobeArrangement.mirroring.options.1' },
  { value: 'mirrored', label: 'homepage.configurator.wardrobeArrangement.mirroring.options.2' },
]

export type ProductSectionPredefinedValue = {
  number?: number
  mirror?: string
  arrangement?: ImageOptionProps[]
  opening?: ImageOptionProps[]
}

interface ProductSelectProps {
  configuration: ProductSectionsComponent
  predefinedValue?: ProductSectionPredefinedValue
}

export const ProductSections: FC<ProductSelectProps> = ({
  configuration: {
    possibleSections,
    maxNumber,
    minNumber,
    activeOpening,
    selectedSections,
    setSelectedSections,
    selectedMaxSections,
    setSelectedMaxSections,
    selectedMirrorOption,
    setSelectedMirrorOption,
  },
  predefinedValue,
}) => {
  const [minSections, setMinSections] = useState(String(minNumber))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<number | null>(null)

  useEffect(() => {
    setSelectedMaxSections(minNumber)
  }, [minNumber, setSelectedMaxSections])

  useEffect(() => {
    setMinSections(String(minNumber))
  }, [minNumber])

  const replaceSection = (index: number, src: string) =>
    setSelectedSections(prev => prev.map((item, i) => (i === index ? { ...item, src } : item)))

  const formattedSections: ButtonOptionsType[] = new Array(maxNumber)
    .fill(0)
    .map((_, i) => ({
      value: String(i + 1),
      label: `homepage.configurator.sections.nr.${i + 1}`,
      disabled: i + 1 < parseInt(minSections),
    }))

  const predefined = predefinedValue ?? {}

  return (
    <>
      <div>
        <p className={styles.sectionTitle}>
          <FormattedMessage id="homepage.configurator.wardrobeArrangement.title" />
        </p>

        <label className={styles.sectionLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.sectionsNr" />
          </p>
          {predefined.number ?? (
            <ButtonSelect
              options={formattedSections}
              defaultSelected={String(selectedMaxSections)}
              onChange={v => setSelectedMaxSections(parseInt(v, 10))}
            />
          )}
        </label>

        <label className={styles.mirroringLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.mirroring" />
          </p>
          {predefined.mirror ?? (
            <ButtonSelect
              options={mirroringOptions}
              defaultSelected={selectedMirrorOption ?? 'standard'}
              onChange={v => setSelectedMirrorOption?.(v)}
            />
          )}
        </label>

        <label className={styles.sectionArrangementLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.shelvesArrangement" />
          </p>
          <div className={styles.imageWrapper}>
            <ImageSelect
              images={
                predefined.arrangement?.map(({ src, width, height }) => ({ src, width, height }))
                  ?? selectedSections
              }
              defaultSelected={1}
              flipped={selectedMirrorOption === 'mirrored'}
              effectsEnabled
              onChange={i => {
                if (predefined.arrangement == null) {
                  setActiveSection(i)
                  setIsModalOpen(true)
                }
              }}
            />
          </div>
        </label>

        <label className={styles.sectionArrangementLabel}>
          <p>
            <FormattedMessage id="homepage.configurator.wardrobeArrangement.doorsArrangement" />
          </p>
          <div className={styles.imageWrapper}>
            <ImageSelect
              images={
                predefined.opening?.map(({ src, width, height }) => ({ src, width, height }))
                  ?? activeOpening
              }
              defaultSelected={8}
              flipped={selectedMirrorOption === 'mirrored'}
              onChange={i => setActiveSection(i)}
            />
          </div>
        </label>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className={styles.subtitle}>
          <FormattedMessage id="homepage.configurator.wardrobeArrangement.shelvesArrangement.modal.title" />
        </p>
        <div className={styles.imageSelectContainer}>
          <ImageSelect
            gap={10}
            images={possibleSections}
            defaultSelected={0}
            onChange={i => {
              if (activeSection != null && i != null) {
                const idx =
                  (selectedMirrorOption === 'standard')
                    ? activeSection
                    : selectedSections.length - activeSection - 1
                replaceSection(idx, possibleSections[i].src)
              }
              setIsModalOpen(false)
            }}
          />
        </div>
      </Modal>
    </>
  )
}