import { useState } from 'react'
import {
  Card,
  Avatar,
  Typography,
  Space,
  Descriptions,
  Button,
  message,
} from 'antd'
import styled from '@emotion/styled'
import type { Recipient } from '../types'
import DonateModal from './DonateModal'
import { getInitials } from '../utils/formatters'
import { RecipientStatusTag } from './StatusTag'

const { Title, Paragraph, Text } = Typography

const ProfileContainer = styled.div`
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
`

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`

const BackButton = styled(Button)`
  margin-bottom: 16px;
`

interface RecipientProfileProps {
  recipient: Recipient
  onBack: () => void
}

export default function RecipientProfile({
  recipient,
  onBack,
}: RecipientProfileProps) {
  const [donateModalVisible, setDonateModalVisible] = useState(false)

  return (
    <ProfileContainer>
      <BackButton onClick={onBack}>← Back to Recipients</BackButton>

      <StyledCard>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar size={80} style={{ backgroundColor: '#1890ff' }}>
              {getInitials(recipient.firstName, recipient.lastName)}
            </Avatar>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {recipient.firstName} {recipient.lastName}
              </Title>
              <Paragraph type="secondary">{recipient.description}</Paragraph>
              <RecipientStatusTag status={recipient.status} />
            </div>
          </div>

          <Descriptions bordered column={1}>
            <Descriptions.Item label="Payment Address">
              <Space>
                <Text copyable code>
                  {recipient.walletAddress}
                </Text>
              </Space>
            </Descriptions.Item>
            {recipient.email && (
              <Descriptions.Item label="Email">{recipient.email}</Descriptions.Item>
            )}
            {recipient.phone && (
              <Descriptions.Item label="Phone">{recipient.phone}</Descriptions.Item>
            )}
          </Descriptions>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              onClick={() => setDonateModalVisible(true)}
              disabled={recipient.status !== 'active'}
            >
              Send USDC
            </Button>
          </div>
        </Space>
      </StyledCard>

      <DonateModal
        visible={donateModalVisible}
        recipient={recipient}
        onCancel={() => setDonateModalVisible(false)}
        onSuccess={() => {
          setDonateModalVisible(false)
          message.success('Donation sent successfully!')
        }}
      />
    </ProfileContainer>
  )
}
