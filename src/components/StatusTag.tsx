import { Tag } from 'antd'

interface StatusConfig {
  color: string
  text: string
}

const STATUS_CONFIGS: Record<'active' | 'inactive', StatusConfig> = {
  active: { color: 'green', text: 'Active' },
  inactive: { color: 'default', text: 'Inactive' },
}

export function RecipientStatusTag({ status }: { status: 'active' | 'inactive' }) {
  const config = STATUS_CONFIGS[status] || { color: 'default', text: status }
  return <Tag color={config.color}>{config.text}</Tag>
}
