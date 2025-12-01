// src/context/urlConfigContext.tsx
import { createContext, useContext, type ReactNode } from 'react'
import type { BaseConfig, Constraints } from '~/utils/configTypes'

interface Ctx {
  config: BaseConfig
  setConfig: (
    next:
      | Partial<BaseConfig>
      | ((prev: Partial<BaseConfig>) => Partial<BaseConfig>)
  ) => void
  constraints: Constraints
}

const UrlConfigContext = createContext<Ctx | null>(null)

export function UrlConfigProvider(props: { value: Ctx; children: ReactNode }) {
  return (
    <UrlConfigContext.Provider value={props.value}>
      {props.children}
    </UrlConfigContext.Provider>
  )
}

export function useConfiguratorConfig(): Ctx {
  const ctx = useContext(UrlConfigContext)
  if (!ctx) {
    throw new Error(
      'useConfiguratorConfig must be used within UrlConfigProvider'
    )
  }
  return ctx
}

export function useConfiguratorConfigOptional(): Ctx | null {
  return useContext(UrlConfigContext)
}
