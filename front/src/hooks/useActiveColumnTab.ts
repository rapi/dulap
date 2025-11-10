import { useState, useEffect } from 'react'

/**
 * Hook to manage active column tab state with external control support
 */
export function useActiveColumnTab(
  externalActiveTab: number | undefined,
  onActiveTabChange: ((index: number) => void) | undefined,
  selectedColumns: number
) {
  const [internalActiveTab, setInternalActiveTab] = useState(0)

  // Use external activeTab if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab
  const setActiveTab = onActiveTabChange || setInternalActiveTab

  // Reset active tab to first column when it becomes out of bounds
  useEffect(() => {
    if (activeTab >= selectedColumns) {
      setActiveTab(0)
    }
  }, [selectedColumns, activeTab, setActiveTab])

  // Sync internal state when external activeTab changes
  useEffect(() => {
    if (externalActiveTab !== undefined && externalActiveTab !== internalActiveTab) {
      setInternalActiveTab(externalActiveTab)
    }
  }, [externalActiveTab, internalActiveTab])

  // Calculate safe active tab (always within bounds)
  const safeActiveTab = activeTab >= selectedColumns ? 0 : activeTab
  const currentColumnIndex = selectedColumns === 1 ? 0 : safeActiveTab

  return {
    activeTab,
    setActiveTab,
    safeActiveTab,
    currentColumnIndex,
  }
}

