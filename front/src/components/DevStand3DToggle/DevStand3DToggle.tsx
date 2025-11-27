import React from 'react'
import { use3DVersion } from '~/hooks/use3DVersion'
import styles from './DevStand3DToggle.module.css'

export const DevStand3DToggle: React.FC = () => {
  const is3DEnabled = use3DVersion()

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className={styles.toggleButton}>
      {is3DEnabled ? '3D Enabled' : '3D Disabled (WebGL not available)'}
    </div>
  )
}


