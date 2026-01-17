import { Layout, Typography, Space } from 'antd'
import styled from '@emotion/styled'
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'

const { Header: AntHeader } = Layout
const { Title } = Typography

const StyledHeader = styled(AntHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #001529;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export default function Header() {
  return (
    <StyledHeader>
      <Logo>
        <Title level={4} style={{ margin: 0, color: '#fff' }}>
            Donation Portal
        </Title>
      </Logo>
      <Space>
        <DynamicWidget />
      </Space>
    </StyledHeader>
  )
}
