import { useState, useEffect } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { isEthereumWallet } from '@dynamic-labs/ethereum'
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Typography,
  Space,
  Alert,
} from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import type { Recipient } from '../types'
import { useBalance } from '../hooks/useBalance'
import { USDC_SEPOLIA_ADDRESS, SEPOLIA_EXPLORER_URL, SEPOLIA_CHAIN_ID } from '../constants'
import BalanceDisplay from './DonateModal/BalanceDisplay'
import { formatTransactionHash } from '../utils/formatters'
import { isSepoliaNetwork } from '../utils/network'

const { Text, Paragraph, Title } = Typography

const SuccessModalContent = styled.div`
  text-align: center;
  padding: 24px;
`

const SuccessIcon = styled.div`
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 16px;
`

interface DonateModalProps {
  visible: boolean
  recipient: Recipient
  onCancel: () => void
  onSuccess: () => void
}

const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const USDC_DECIMALS = 6

function parseUnits(value: string, decimals: number): bigint {
  const [integerPart, decimalPart = ''] = value.split('.')
  const paddedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(integerPart + paddedDecimal)
}

export default function DonateModal({
  visible,
  recipient,
  onCancel,
  onSuccess,
}: DonateModalProps) {
  const [form] = Form.useForm()
  const { primaryWallet, user } = useDynamicContext()
  const isAuthenticated = !!user
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successVisible, setSuccessVisible] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [successAmount, setSuccessAmount] = useState<number | null>(null)

  const { ethBalance, usdcBalance, isLoading: balancesLoading } = useBalance()

  const handleSubmit = async (values: { amount: number }) => {
    if (!isAuthenticated || !primaryWallet) {
      setError('Please connect your wallet first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!isEthereumWallet(primaryWallet)) {
        throw new Error('Wallet does not support EVM')
      }

      // Try to switch to Sepolia network if not already on it
      if (!isSepoliaNetwork(primaryWallet.chain)) {
        try {
          if (
            primaryWallet.connector &&
            typeof primaryWallet.connector.switchNetwork === 'function'
          ) {
            await primaryWallet.connector.switchNetwork({
              networkChainId: SEPOLIA_CHAIN_ID,
              networkName: 'Sepolia',
            })
            // Wait a bit for the network switch to complete
            await new Promise(resolve => setTimeout(resolve, 1500))
          } else {
            throw new Error('Please switch to Sepolia network before sending donation')
          }
        } catch (switchError) {
          throw new Error('Please switch to Sepolia network before sending donation')
        }
      }

      const walletClient = await primaryWallet.getWalletClient()
      const publicClient = await primaryWallet.getPublicClient()

      // Verify we're on Sepolia network by checking the chain ID from the client
      if (walletClient && publicClient) {
        const chainId = await publicClient.getChainId()
        if (chainId !== SEPOLIA_CHAIN_ID) {
          throw new Error('Please switch to Sepolia network before sending donation')
        }
      }

      if (!walletClient || !publicClient) {
        throw new Error('Failed to get wallet client or public client')
      }

      const amountInUnits = parseUnits(
        values.amount.toFixed(USDC_DECIMALS),
        USDC_DECIMALS
      )

      const hash = await walletClient.writeContract({
        address: USDC_SEPOLIA_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipient.walletAddress as `0x${string}`, amountInUnits],
      })

      setTransactionHash(hash)

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      
      if (receipt.status === 'success') {
        setSuccessAmount(values.amount)
        form.resetFields()
        onCancel()
        setTimeout(() => {
          setSuccessVisible(true)
        }, 300)
      } else {
        throw new Error('Transaction failed')
      }
    } catch (err: unknown) {
      console.error('Donation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send donation. Please try again.'
      setError(errorMessage)
      setTransactionHash(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessClose = () => {
    setSuccessVisible(false)
    setTransactionHash(null)
    setSuccessAmount(null)
    onSuccess()
  }

  const amount = Form.useWatch('amount', form)

  useEffect(() => {
    if (amount && parseFloat(usdcBalance || '0') >= amount && error && error.includes('Insufficient')) {
      setError(null)
    }
  }, [amount, usdcBalance, error])

  return (
    <>
    <Modal
      title="Send Donation"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ amount: 10 }}
      >
        {!isAuthenticated && (
          <Alert
            message="Authentication Required"
            description="Please connect your wallet to send a donation."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        {isAuthenticated && primaryWallet?.address && (
          <div style={{ marginBottom: 16 }}>
            <Text
              type="secondary"
              style={{ fontSize: '11px', marginBottom: 6, display: 'block' }}
            >
              Your Balances:
            </Text>
            <BalanceDisplay
              ethBalance={ethBalance}
              usdcBalance={usdcBalance}
              isLoading={balancesLoading}
            />
          </div>
        )}

        <Form.Item
          label="Enter how much USDC you want to send"
          name="amount"
          rules={[
            { required: true, message: 'Please enter amount' },
            { type: 'number', min: 0.01, message: 'Minimum amount is 0.01' },
            {
              validator: (_, value) => {
                if (value && parseFloat(usdcBalance || '0') < value) {
                  return Promise.reject(
                    new Error(
                      `Insufficient balance. You have ${usdcBalance} USDC`
                    )
                  )
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter amount"
            min={0.01}
            step={0.01}
            precision={2}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={
                !isAuthenticated ||
                !amount ||
                parseFloat(usdcBalance || '0') < amount
              }
            >
              Send {amount || 0} USDC
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      title={null}
      open={successVisible}
      onCancel={handleSuccessClose}
      footer={null}
      centered
      closable={true}
      width={500}
    >
      <SuccessModalContent>
        <SuccessIcon>
          <CheckCircleOutlined />
        </SuccessIcon>
        <Title level={3} style={{ marginBottom: 16 }}>
          Payment successful! 🎉
        </Title>
        <Paragraph style={{ marginBottom: 8 }}>
          You successfully sent <Text strong>{successAmount || 0} USDC</Text> to{' '}
          <Text strong>
            {recipient.firstName} {recipient.lastName}
          </Text>
        </Paragraph>
        {transactionHash && (
          <Paragraph style={{ marginBottom: 24 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Transaction:{' '}
              <a
                href={`${SEPOLIA_EXPLORER_URL}/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatTransactionHash(transactionHash)}
              </a>
            </Text>
          </Paragraph>
        )}
        <Button type="primary" size="large" onClick={handleSuccessClose}>
          Close
        </Button>
      </SuccessModalContent>
    </Modal>
    </>
  )
}
