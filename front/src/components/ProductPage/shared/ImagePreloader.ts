// Image preloading system for better configurator performance
export class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>()
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>()

  // Preload images based on current configuration
  async preloadConfigurationImages(
    productType: string,
    currentConfig: {
      color: string
      width: number
      height: number
      sections?: number
      openingMethod?: string
    }
  ): Promise<void> {
    const imagePaths = this.generateImagePaths(productType, currentConfig)
    
    // Preload current images
    await Promise.all(imagePaths.map(path => this.preloadImage(path)))
    
    // Preload likely next images (color variations, size variations)
    const predictiveImages = this.generatePredictiveImages(productType, currentConfig)
    // Don't await these - load in background
    predictiveImages.forEach(path => this.preloadImage(path))
  }

  private async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.cache.set(src, img)
        this.loadingPromises.delete(src)
        resolve(img)
      }
      img.onerror = () => {
        this.loadingPromises.delete(src)
        reject(new Error(`Failed to load image: ${src}`))
      }
      img.src = src
    })

    this.loadingPromises.set(src, promise)
    return promise
  }

  private generateImagePaths(
    productType: string,
    config: {
      color: string
      width: number
      height: number
      sections?: number
      openingMethod?: string
    }
  ): string[] {
    const { color, width, height, sections, openingMethod } = config
    const paths: string[] = []

    switch (productType) {
      case 'wardrobe':
        paths.push(
          `/${productType}/${color}/${openingMethod}/Base 20/H${height < 210 ? 2100 : 2400}/right/${width}-${sections || 1}.png`,
          `/${productType}/renders/render-${productType}-1-${color}.png`,
          `/${productType}/renders/render-${productType}-2-${color}.png`
        )
        break
      case 'stand':
        paths.push(
          `/${productType}/${color}/${openingMethod}/Base 20/H${height}/S${sections}/${width}.png`,
          `/${productType}/render/${color} 1.png`,
          `/${productType}/render/${color} 2.png`
        )
        break
      // Add other product types...
    }

    return paths
  }

  private generatePredictiveImages(
    productType: string,
    currentConfig: {
      color: string
      width: number
      height: number
      sections?: number
      openingMethod?: string
    }
  ): string[] {
    const predictiveImages: string[] = []
    
    // Predict color variations user might try
    const colors = ['White', 'Biege', 'Light Grey', 'Grey']
    colors.forEach(color => {
      if (color !== currentConfig.color) {
        const paths = this.generateImagePaths(productType, {
          ...currentConfig,
          color
        })
        predictiveImages.push(...paths)
      }
    })

    return predictiveImages
  }

  // Get cached image if available
  getCachedImage(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null
  }

  // Clear cache to free memory
  clearCache(): void {
    this.cache.clear()
    this.loadingPromises.clear()
  }
}

// Singleton instance
export const imagePreloader = new ImagePreloader() 