import { useState, useEffect } from 'react'
import {
  DynamicContextProvider,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { Layout, Typography } from 'antd'
import styled from '@emotion/styled'
import Header from './components/Header'
import RecipientsTable from './components/RecipientsTable'
import RecipientProfile from './components/RecipientProfile'
import type { Recipient } from './types'
import { mockRecipients } from './data/mockRecipients'
import { SEPOLIA_CHAIN_ID, DYNAMIC_ENVIRONMENT_ID, APP_NAME } from './constants'
import { isSepoliaNetwork } from './utils/network'

const { Content } = Layout
const { Title, Paragraph } = Typography

const AppLayout = styled(Layout)`
  min-height: 100vh;
`

const AppContent = styled(Content)`
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
`

const PageHeader = styled.div`
  padding: 24px 24px 0;
  max-width: 1200px;
  margin: 0 auto;
`

function NetworkSwitcher() {
  const { primaryWallet, user } = useDynamicContext()

  useEffect(() => {
    const switchToSepolia = async () => {
      if (!user || !primaryWallet || isSepoliaNetwork(primaryWallet.chain)) {
        return
      }

      try {
        if (
          primaryWallet.connector &&
          typeof primaryWallet.connector.switchNetwork === 'function'
        ) {
          await primaryWallet.connector.switchNetwork({
            networkChainId: SEPOLIA_CHAIN_ID,
            networkName: 'Sepolia',
          })
        }
      } catch (error) {
        console.error('Network switch error:', error)
      }
    }

    switchToSepolia()
  }, [user, primaryWallet])

  return null
}

function AppInner() {
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  )

  const handleRecipientClick = (recipient: Recipient) => {
    setSelectedRecipient(recipient)
  }

  const handleBack = () => {
    setSelectedRecipient(null)
  }

  return (
    <AppLayout>
      <NetworkSwitcher />
      <Header />
      <AppContent>
        {selectedRecipient ? (
          <RecipientProfile
            recipient={selectedRecipient}
            onBack={handleBack}
          />
        ) : (
          <>
            <PageHeader>
              <Title level={2}>Donation Recipients</Title>
              <Paragraph>
                Browse available recipients and send donations to support their work.
              </Paragraph>
            </PageHeader>
            <RecipientsTable
              recipients={mockRecipients}
              onRecipientClick={handleRecipientClick}
            />
          </>
        )}
      </AppContent>
    </AppLayout>
  )
}

export default function App() {
  // Note: DYNAMIC_ENVIRONMENT_ID must be set via VITE_DYNAMIC_ENV_ID environment variable
  // If not set, the app will not function properly. See README.md for setup instructions.
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        appName: APP_NAME,
        appLogoUrl: undefined,
      }}
    >
      <AppInner />
    </DynamicContextProvider>
  )
}
