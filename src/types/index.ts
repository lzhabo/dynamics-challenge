export interface Recipient {
  id: string
  firstName: string
  lastName: string
  description: string
  walletAddress: string
  phone?: string
  email?: string
  status: 'active' | 'inactive'
}
