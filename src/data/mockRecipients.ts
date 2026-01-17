import type { Recipient } from '../types'

// Mock data - в реальном приложении это будет загружаться с бэкенда
export const mockRecipients: Recipient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    description: 'Project participant',
    walletAddress: '0x1234567890123456789012345678901234567890',
    phone: '+1234567890',
    email: 'john.doe@example.com',
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    description: 'Volunteer',
    walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    email: 'jane.smith@example.com',
    status: 'active',
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Wilson',
    description: 'Content creator',
    walletAddress: '0x9876543210987654321098765432109876543210',
    phone: '+9876543210',
    status: 'active',
  },
]
