import { useRouter } from 'next/router'
import React from 'react'
import { QUERY_PARAM_KEY_3D_ENABLED, use3DVersion } from '~/hooks/use3DVersion'

export const DevStand3DToggle: React.FC = () => {
  const router = useRouter()
  const is3DEnabled = use3DVersion()

  if (process.env.NODE_ENV === 'production') return null

  const handleClick = () => {
    const newQuery: Record<string, string | string[] | undefined> = {
      ...router.query,
      [QUERY_PARAM_KEY_3D_ENABLED]: `${!is3DEnabled}`,
    }

    router.replace({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    })
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        background: '#000',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: 4,
        cursor: 'pointer',
        opacity: 0.7,
      }}
    >
      {is3DEnabled ? 'Disable 3D' : 'Enable 3D'}
    </button>
  )
} 