import { useRouter } from 'next/router'
import React from 'react'
import { useStand3D } from '~/hooks/useStand3D'

export const DevStand3DToggle: React.FC = () => {
  const router = useRouter()
  const is3D = useStand3D()

  // Hide in production to avoid exposing dev toggle to users
  if (process.env.NODE_ENV === 'production') return null

  const handleClick = () => {
    const next = is3D ? '0' : '1'

    // Persist preference in cookie (30 days)
    document.cookie = `stand3d=${next}; path=/; max-age=${60 * 60 * 24 * 30}`

    // Update query param to trigger re-render without full page refresh
    const newQuery: Record<string, string | string[] | undefined> = {
      ...router.query,
      stand3d: next,
    }

    // Remove deprecated "3d" query param if present
    if ('3d' in newQuery) delete newQuery['3d']

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
      {is3D ? 'Disable 3D' : 'Enable 3D'}
    </button>
  )
} 