import { Table, Avatar, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styled from '@emotion/styled'
import type { Recipient } from '../types'
import { getInitials, formatWalletAddress } from '../utils/formatters'
import { RecipientStatusTag } from './StatusTag'

const { Text } = Typography

const TableContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

interface RecipientsTableProps {
  recipients: Recipient[]
  onRecipientClick: (recipient: Recipient) => void
}

export default function RecipientsTable({
  recipients,
  onRecipientClick,
}: RecipientsTableProps) {
  const columns: ColumnsType<Recipient> = [
    {
      title: 'Recipient',
      key: 'recipient',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {getInitials(record.firstName, record.lastName)}
          </Avatar>
          <div>
            <div>
              <strong>
                {record.firstName} {record.lastName}
              </strong>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (address: string) => (
        <Text copyable code style={{ fontSize: '12px' }}>
          {formatWalletAddress(address)}
        </Text>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ fontSize: '12px' }}>
          {record.email && <Text>{record.email}</Text>}
          {record.phone && <Text>{record.phone}</Text>}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <RecipientStatusTag status={status as 'active' | 'inactive'} />,
    },
  ]

  return (
    <TableContainer>
      <Table
        columns={columns}
        dataSource={recipients}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onRecipientClick(record),
          style: { cursor: 'pointer' },
        })}
        pagination={{ pageSize: 10 }}
      />
    </TableContainer>
  )
}
