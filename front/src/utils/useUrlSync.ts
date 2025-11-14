// src/utils/useUrlSync.ts
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

function sortQuery<T extends Record<string, string | number>>(q: T): T {
  const out = {} as T
  for (const k of Object.keys(q).sort())
    (out as Record<string, unknown>)[k] = q[k]
  return out
}

function serialize(q: Record<string, string | number>): string {
  const sp = new URLSearchParams()
  for (const k of Object.keys(q)) sp.set(k, String(q[k]))
  return sp.toString()
}

function pickFromSearch(keys: readonly string[]): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const k of keys) {
    const v = params.get(k)
    if (v !== null) out[k] = v
  }
  return out
}

/**
 * Keep URL in sync with `config`, while preserving selected query keys
 * (e.g. feature flags like `use3DVersion`).
 */
export function useUrlSync<T>(
  initial: T,
  toQuery: (cfg: T) => Record<string, string | number>,
  pathname: string,
  debounceMs = 250,
  preserveKeys: readonly string[] = []
) {
  const router = useRouter()
  const [config, setConfig] = useState<T>(initial)

  console.log('🟠 [USE URL SYNC] Hook called, initial config:', initial)

  const toQueryRef = useRef(toQuery)
  const prevSerializedRef = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const first = useRef(true)

  useEffect(() => {
    toQueryRef.current = toQuery
  }, [toQuery])

  useEffect(() => {
    if (!router.isReady) return

    const write = () => {
      // desired configurator params
      const desired = sortQuery(toQueryRef.current(config))
      // add preserved keys from current URL
      const preserved = pickFromSearch(preserveKeys)
      const merged: Record<string, string | number> = {
        ...preserved,
        ...desired,
      }

      const mergedStr = serialize(sortQuery(merged))

      // first run: if already matching current search, do nothing
      if (first.current) {
        first.current = false
        const currentStr =
          typeof window !== 'undefined'
            ? window.location.search.replace(/^\?/, '')
            : ''
        if (mergedStr === currentStr) {
          prevSerializedRef.current = mergedStr
          return
        }
      }

      // avoid redundant replaces
      if (prevSerializedRef.current === mergedStr) return
      prevSerializedRef.current = mergedStr

      router.replace({ pathname, query: merged }, undefined, {
        shallow: true,
        scroll: false,
      })
    }

    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(write, debounceMs)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [config, pathname, router.isReady, router, preserveKeys])

  return { config, setConfig }
}
