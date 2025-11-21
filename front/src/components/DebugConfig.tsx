// front/src/components/DebugConfig.tsx
import { useConfiguratorConfig } from '~/context/urlConfigContext'

export function DebugConfig() {
  const { config } = useConfiguratorConfig()
  return (
    <pre
      style={{
        fontSize: 12,
        padding: 8,
        background: '#f6f6f6',
        borderRadius: 8,
      }}
    >
      {JSON.stringify(config, null, 2)}
    </pre>
  )
}
