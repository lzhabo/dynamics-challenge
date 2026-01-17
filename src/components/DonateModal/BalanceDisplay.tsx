import { Button, Typography, Spin } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { ETH_FAUCET_URL, USDC_FAUCET_URL } from '../../constants'

const { Text } = Typography

interface BalanceDisplayProps {
  ethBalance: string | null
  usdcBalance: string | null
  isLoading: boolean
}

export default function BalanceDisplay({
  ethBalance,
  usdcBalance,
  isLoading,
}: BalanceDisplayProps) {
  if (isLoading) {
    return <Spin size="small" />
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '8px 12px',
        background: '#fafafa',
        borderRadius: 4,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ETH:
          </Text>
          <Text style={{ fontSize: '12px', fontWeight: 500 }}>
            {ethBalance || '0.0000'}
          </Text>
        </div>
        <Button
          type="link"
          size="small"
          icon={<LinkOutlined />}
          href={ETH_FAUCET_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: 0, fontSize: '11px', height: 'auto' }}
        >
          Get ETH
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            USDC:
          </Text>
          <Text style={{ fontSize: '12px', fontWeight: 500 }}>
            {usdcBalance || '0.00'}
          </Text>
        </div>
        <Button
          type="link"
          size="small"
          icon={<LinkOutlined />}
          href={USDC_FAUCET_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: 0, fontSize: '11px', height: 'auto' }}
        >
          Get USDC
        </Button>
      </div>
    </div>
  )
}
