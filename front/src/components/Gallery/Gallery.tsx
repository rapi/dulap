import React, { useState, useEffect, useRef } from 'react'
import styles from './Gallery.module.css'

interface GalleryImage {
  src: string
  alt?: string
}
interface GalleryProps {
  images: GalleryImage[]
}

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const cursorRef = useRef<HTMLDivElement | null>(null)

  const close = () => setActiveIndex(null)
  const prev = () =>
    setActiveIndex((i) => (i! - 1 + images.length) % images.length)
  const next = () => setActiveIndex((i) => (i! + 1) % images.length)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex])

  // move custom cursor
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    if (activeIndex !== null) {
      window.addEventListener('mousemove', moveCursor)
    } else {
      window.removeEventListener('mousemove', moveCursor)
    }
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [activeIndex])

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`
    }
  }, [cursorPos])

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((item, index) => (
          <button
            key={index}
            className={`${styles.tile} ${styles[`tile${index + 1}`]}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open image ${index + 1}`}
          >
            <img
              src={item.src}
              alt={item.alt ?? `Image ${index + 1}`}
              className={styles.image}
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeIndex].src}
              alt={images[activeIndex].alt ?? 'fullscreen'}
              className={styles.lightboxImage}
            />

            <button
              className={styles.close}
              onClick={close}
              aria-label="Close"
              title="Close"
            />

            {images.length > 1 && (
              <>
                <button
                  className={`${styles.nav} ${styles.prev}`}
                  onClick={prev}
                  aria-label="Previous"
                />
                <button
                  className={`${styles.nav} ${styles.next}`}
                  onClick={next}
                  aria-label="Next"
                />
              </>
            )}
          </div>

          {/* custom cursor */}
          <div ref={cursorRef} className={styles.cursorIcon} />
        </div>
      )}
    </>
  )
}
