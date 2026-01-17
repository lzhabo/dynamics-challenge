# Building a Stablecoin Donation Platform with Dynamic SDK

## Use Case: Direct Stablecoin Payouts

### Problem

Traditional donation platforms require intermediaries, charge fees, and often delay fund transfers. Recipients may wait days or weeks to receive funds, and the process involves multiple parties taking cuts. For organizations and individuals receiving regular donations, this creates friction and reduces the impact of contributions.

### Solution

This tutorial demonstrates how to build a direct stablecoin donation platform where:
- Donors send USDC (USD Coin) directly to recipient wallet addresses
- Transactions settle on-chain in minutes
- No intermediaries take fees beyond minimal network gas costs
- Recipients have immediate access to funds
- The entire flow is transparent and verifiable on the blockchain

We use **Dynamic SDK** to abstract away wallet complexity, allowing non-crypto-native users to connect their wallets and send donations with a familiar web application experience.

---

## Architecture Overview

The application follows a simple client-side architecture:

```
┌─────────────────────────────────────────┐
│         React Application               │
│  ┌───────────────────────────────────┐  │
│  │   Dynamic SDK Context Provider    │  │
│  │   - Wallet connection             │  │
│  │   - Network management            │  │
│  │   - Balance fetching              │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Application Components          │  │
│  │   - Recipient list/table          │  │
│  │   - Donation modal                │  │
│  │   - Transaction handling          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      Ethereum Sepolia Testnet           │
│  ┌───────────────────────────────────┐  │
│  │   USDC ERC-20 Token Contract       │  │
│  │   0x1c7D4B196Cb0C7B01d743Fbc...   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Key Components:**

1. **Dynamic SDK** handles wallet connections (MetaMask, WalletConnect, etc.) and provides a unified interface for blockchain interactions
2. **React components** manage UI state and user interactions
3. **Ethereum Sepolia testnet** provides a safe testing environment (no real money)
4. **USDC token contract** on Sepolia enables stablecoin transfers

The application is **fully client-side**—no backend server is required. All blockchain interactions happen directly from the user's browser through their connected wallet.

---

## Prerequisites

### Required Accounts

1. **Dynamic Account** (free tier is sufficient)
   - Sign up at [dynamic.xyz](https://dynamic.xyz)
   - Create a new project to get an Environment ID
   - The demo uses a shared test environment ID, but for production you'll want your own

2. **GitHub Account** (for deployment)
   - Free account works fine
   - Used for hosting the application on GitHub Pages

### Development Environment

- **Node.js**: Version 18 or higher
  - Check your version: `node --version`
  - Download from [nodejs.org](https://nodejs.org/) if needed

- **Package Manager**: npm (comes with Node.js) or pnpm
  - npm: `npm --version`
  - pnpm: `npm install -g pnpm` (optional, faster alternative)

- **Code Editor**: VS Code, WebStorm, or any editor with TypeScript support

- **Browser**: Modern browser with wallet extension (MetaMask recommended for testing)

### Environment Variables

Create a `.env` file in the project root (optional for local development):

```bash
VITE_DYNAMIC_ENV_ID=your_environment_id_here
```

**Note**: The application requires a Dynamic Environment ID to function. You can:
- Get your Environment ID from [app.dynamic.xyz](https://app.dynamic.xyz)
- Store it in the `.env` file (which is gitignored)
- For deployment, store it as a GitHub secret
- Never commit real secrets to version control

---

## Step-by-Step Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd fb-test-challenge

# Install dependencies
npm install
# or
pnpm install
```

This installs:
- React 19 and TypeScript for the UI
- Dynamic SDK packages for wallet integration
- Ant Design for UI components
- Vite as the build tool

### 2. Configure Environment (Optional)

If you're using your own Dynamic Environment ID:

```bash
# Create .env file
echo "VITE_DYNAMIC_ENV_ID=your_environment_id_here" > .env
```

The application requires `VITE_DYNAMIC_ENV_ID` to be set. If not provided, the app will not function properly. Make sure to set this value in your `.env` file.

### 3. Run Locally

```bash
npm run dev
# or
pnpm dev
```

The development server starts at `http://localhost:5173`. Open this URL in your browser.

### 4. Verify the Application Works

#### 4.1 Check Initial State

When you first load the application, you should see:
- A header with "Donation Portal" title and a wallet connection button
- A table listing donation recipients with their names, wallet addresses, and contact information
- No wallet connected (the connection button is visible)

#### 4.2 Connect a Wallet

1. Click the wallet button in the header
2. Dynamic SDK will show a modal with wallet connection options
3. Choose a wallet (MetaMask, WalletConnect, etc.)
4. Approve the connection in your wallet
5. The header should update to show your wallet address

**Expected behavior:**
- The app automatically attempts to switch your wallet to Sepolia testnet
- If Sepolia isn't added to your wallet, you may need to add it manually
- Your ETH and USDC balances appear in the UI (may show 0.00 if you don't have testnet tokens)

#### 4.3 Browse Recipients

1. Click on any recipient row in the table
2. You should see a detailed profile page with:
   - Recipient name and description
   - Wallet address (copyable)
   - Contact information
   - A "Send USDC" button

#### 4.4 Test Donation Flow (Requires Test Tokens)

**Get test tokens first:**
- **Sepolia ETH** (for gas): Visit [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Sepolia USDC**: Visit [faucet.circle.com](https://faucet.circle.com/)

**Send a test donation:**
1. Click "Send USDC" on a recipient profile
2. Enter an amount (minimum 0.01 USDC)
3. Review your balance (shown in the modal)
4. Click "Send X USDC"
5. Approve the transaction in your wallet
6. Wait for confirmation (usually 10-30 seconds)
7. See success message with transaction hash

**Verify on blockchain:**
- Click the transaction hash link to view it on Sepolia Etherscan
- Confirm the transaction shows a USDC transfer to the recipient address

### 5. Build for Production

```bash
npm run build
# or
pnpm build
```

This creates an optimized production build in the `dist/` directory. To preview it:

```bash
npm run preview
# or
pnpm preview
```

---

## Deployment

### GitHub Pages Setup

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages.

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"** (not "Deploy from a branch")

#### Step 2: Configure Secrets (If Using Custom Environment ID)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `VITE_DYNAMIC_ENV_ID`
4. Value: Your Dynamic Environment ID
5. Click **"Add secret"**

#### Step 3: Push to Main Branch

```bash
git push origin main
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
1. Build the application
2. Deploy to GitHub Pages
3. Make it available at: `https://<username>.github.io/<repository-name>/`

**Note**: The first deployment may take a few minutes. Subsequent pushes trigger automatic redeployments.

#### Important Configuration Details

- **Base Path**: The Vite config automatically adjusts the base path based on the repository name for GitHub Pages
- **Environment Variables**: Secrets are injected during the build process
- **Build Output**: The `dist/` directory is deployed as static files

---

## Code Explanation

### Where Dynamic is Initialized

Dynamic SDK is initialized at the application root in `src/App.tsx`:

```typescript
// src/App.tsx, lines 107-119
export default function App() {
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
```

**What this does:**
- Wraps the entire app in `DynamicContextProvider` to make wallet state available everywhere
- Configures Ethereum wallet connectors (MetaMask, WalletConnect, etc.)
- Uses environment variable for Environment ID with a fallback constant
- All child components can access wallet state via `useDynamicContext()` hook

### Core Donation Flow Logic

The donation flow lives in `src/components/DonateModal.tsx`, specifically in the `handleSubmit` function (lines 87-171):

```typescript
const handleSubmit = async (values: { amount: number }) => {
  // 1. Validate wallet connection
  if (!isAuthenticated || !primaryWallet) {
    setError('Please connect your wallet first')
    return
  }

  // 2. Ensure we're on Sepolia network
  if (!isSepoliaNetwork(primaryWallet.chain)) {
    // Automatically attempt to switch networks
    await primaryWallet.connector.switchNetwork({
      networkChainId: SEPOLIA_CHAIN_ID,
      networkName: 'Sepolia',
    })
  }

  // 3. Get wallet and public clients for blockchain interaction
  const walletClient = await primaryWallet.getWalletClient()
  const publicClient = await primaryWallet.getPublicClient()

  // 4. Convert USDC amount to token units (6 decimals)
  const amountInUnits = parseUnits(
    values.amount.toFixed(USDC_DECIMALS),
    USDC_DECIMALS
  )

  // 5. Execute ERC-20 transfer
  const hash = await walletClient.writeContract({
    address: USDC_SEPOLIA_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [recipient.walletAddress, amountInUnits],
  })

  // 6. Wait for transaction confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  
  // 7. Show success message
  if (receipt.status === 'success') {
    setSuccessAmount(values.amount)
    // ... show success modal
  }
}
```

**Key steps:**
1. **Network validation**: Ensures the user is on Sepolia (attempts auto-switch)
2. **Amount conversion**: Converts human-readable USDC amounts (e.g., "10.50") to token units (10500000 with 6 decimals)
3. **Contract interaction**: Calls the USDC contract's `transfer` function
4. **Transaction waiting**: Polls for confirmation before showing success

### Error Handling

Errors are handled at multiple levels:

**Network Errors** (lines 102-120):
```typescript
if (!isSepoliaNetwork(primaryWallet.chain)) {
  try {
    await primaryWallet.connector.switchNetwork({...})
  } catch (switchError) {
    throw new Error('Please switch to Sepolia network before sending donation')
  }
}
```

**Transaction Errors** (lines 163-170):
```typescript
catch (err: unknown) {
  console.error('Donation error:', err)
  const errorMessage = err instanceof Error 
    ? err.message 
    : 'Failed to send donation. Please try again.'
  setError(errorMessage)
}
```

**Balance Validation** (lines 248-258):
```typescript
validator: (_, value) => {
  if (value && parseFloat(usdcBalance || '0') < value) {
    return Promise.reject(
      new Error(`Insufficient balance. You have ${usdcBalance} USDC`)
    )
  }
  return Promise.resolve()
}
```

**Error display**: All errors are shown to users via Ant Design `Alert` components with clear, actionable messages.

### Balance Fetching

Balances are fetched in `src/hooks/useBalance.ts`:

```typescript
export function useBalance(): UseBalanceReturn {
  const { primaryWallet, user } = useDynamicContext()
  
  // Uses Dynamic's useTokenBalances hook
  const { tokenBalances, isLoading } = useTokenBalances({
    accountAddress: primaryWallet?.address || '',
    networkId: SEPOLIA_CHAIN_ID,
  })

  // Fetches ETH balance directly from wallet
  const balance = await primaryWallet.getBalance()
  
  // Finds USDC token from token balances
  const usdcToken = tokenBalances?.find(
    (token) => token.address?.toLowerCase() === USDC_SEPOLIA_ADDRESS.toLowerCase()
  )
}
```

**Why this approach:**
- ETH balance comes directly from the wallet (native token)
- USDC balance comes from Dynamic's token balance API (more reliable for ERC-20 tokens)
- Falls back to token balances if direct balance fetch fails

---

## Security Hygiene

### Environment Variables

**Current approach:**
- Environment ID is read from `VITE_DYNAMIC_ENV_ID` environment variable
- The constant in `src/constants/index.ts` reads from `import.meta.env.VITE_DYNAMIC_ENV_ID`
- If not set, the app will not function (empty string fallback)
- `.env` file is gitignored (already included in `.gitignore`)

**Production approach:**
- Always store `VITE_DYNAMIC_ENV_ID` in `.env` file (not committed to git)
- Use GitHub Secrets for CI/CD deployments
- Never commit real API keys or private keys
- Consider using different Environment IDs for development and production

### Shortcuts Taken (Safe for Demo)

1. **Hardcoded recipient data**: `src/data/mockRecipients.ts` contains static recipient data
   - **Why safe**: This is demo data on testnet
   - **Production**: Load from authenticated backend API

2. **No transaction signing validation**: We trust the wallet's transaction approval
   - **Why safe**: Users explicitly approve each transaction in their wallet
   - **Production**: Add additional validation layers if needed

3. **Client-side only**: No backend validation of transactions
   - **Why safe**: All transactions are on-chain and verifiable
   - **Production**: Add backend for analytics, rate limiting, fraud detection

4. **No rate limiting**: Users can send unlimited donations
   - **Why safe**: Testnet tokens have no real value
   - **Production**: Implement rate limiting and transaction monitoring

5. **Environment ID required**: The app requires `VITE_DYNAMIC_ENV_ID` to be set
   - **Why safe**: Environment ID is not a secret, but should be managed via environment variables
   - **Production**: Always use environment variables, never commit production IDs to code

### What to Never Do

- ❌ Never commit private keys or seed phrases
- ❌ Never hardcode production API keys
- ❌ Never skip transaction confirmations
- ❌ Never send transactions without user approval
- ❌ Never use mainnet addresses in test code

---

## Design Decisions and Trade-offs

### What Was Intentionally Simplified

1. **No Backend Server**
   - **Decision**: Fully client-side application
   - **Trade-off**: Can't track analytics, can't validate recipients server-side
   - **Why**: Demonstrates Dynamic SDK's capability to build wallet-enabled apps without infrastructure
   - **Production change**: Add backend for recipient management, transaction history, analytics

2. **Static Recipient List**
   - **Decision**: Hardcoded mock data
   - **Trade-off**: Can't add/edit recipients without code changes
   - **Why**: Focuses tutorial on wallet integration, not data management
   - **Production change**: Database with admin interface for recipient management

3. **Single Network (Sepolia)**
   - **Decision**: Only support Ethereum Sepolia testnet
   - **Trade-off**: Can't use other networks or mainnet
   - **Why**: Simplifies tutorial, Sepolia is free to use
   - **Production change**: Support multiple networks, let users choose

4. **No Transaction History**
   - **Decision**: Only show current transaction, no history
   - **Trade-off**: Users can't see past donations
   - **Why**: Keeps UI simple, focuses on core flow
   - **Production change**: Add transaction history page, integrate with indexer APIs

5. **Basic Error Messages**
   - **Decision**: Show generic error messages from wallet/network
   - **Trade-off**: Less helpful for debugging
   - **Why**: Wallet errors are often technical and user-friendly messages are hard
   - **Production change**: Map common errors to user-friendly messages, add help docs

6. **No Multi-Signature Support**
   - **Decision**: Single wallet transactions only
   - **Trade-off**: Can't require multiple approvals
   - **Why**: Most users have single-signer wallets
   - **Production change**: Add support for multi-sig wallets if needed

### Production-Grade Improvements

If building for production, consider:

1. **Backend API**
   - Recipient CRUD operations
   - Transaction history and analytics
   - Rate limiting and fraud detection
   - Webhook notifications for successful donations

2. **Enhanced Security**
   - Transaction amount limits
   - Recipient address validation
   - Suspicious activity detection
   - Audit logging

3. **Better UX**
   - Transaction status polling with progress indicators
   - Estimated gas fees before transaction
   - Support for multiple tokens (not just USDC)
   - Recurring donation subscriptions

4. **Compliance**
   - KYC/AML checks for large donations
   - Tax reporting features
   - Regulatory compliance per jurisdiction

5. **Monitoring**
   - Error tracking (Sentry, etc.)
   - Performance monitoring
   - User analytics
   - Transaction success rate tracking

---

## UX Considerations

### How This Solution Improves Experience for Non-Crypto Users

1. **Familiar Web Interface**
   - Looks like a regular web application
   - No need to understand blockchain concepts
   - Standard form inputs and buttons

2. **Automatic Network Switching**
   - App automatically switches wallet to Sepolia when connecting
   - Users don't need to manually add networks or switch chains
   - Clear error messages if network switch fails

3. **Human-Readable Amounts**
   - Users enter "10.50" USDC, not "10500000" token units
   - Balance display shows formatted numbers (e.g., "1,234.56 USDC")
   - No need to understand token decimals

4. **Clear Transaction Feedback**
   - Loading states during transaction processing
   - Success modal with transaction hash
   - Direct link to blockchain explorer for verification
   - Error messages explain what went wrong

5. **Balance Visibility**
   - Shows both ETH (for gas) and USDC (for donations) balances
   - Prevents transactions when balance is insufficient
   - Real-time balance updates

6. **Wallet Connection Abstraction**
   - Dynamic SDK handles multiple wallet types (MetaMask, WalletConnect, etc.)
   - Users don't need to know which wallet they're using
   - Consistent experience across wallet providers

7. **Recipient Information**
   - Shows recipient names and descriptions (not just addresses)
   - Makes it feel like sending to a person, not a cryptographic address
   - Copyable addresses for verification

### Remaining Friction Points (Future Improvements)

1. **Gas Fees**: Users still need to understand they need ETH for gas
   - **Current**: Shows ETH balance, but doesn't explain why
   - **Improvement**: Add tooltip explaining gas fees, estimate gas cost

2. **Transaction Waiting**: Users wait 10-30 seconds for confirmation
   - **Current**: Loading spinner, but no progress indication
   - **Improvement**: Show transaction stages (pending → confirming → confirmed)

3. **Wallet Setup**: First-time users need to install a wallet
   - **Current**: Dynamic shows wallet options, but setup is manual
   - **Improvement**: Embedded wallet option (Dynamic supports this)

4. **Network Confusion**: Users might not understand what "Sepolia" means
   - **Current**: Technical network name shown
   - **Improvement**: Use friendly names like "Test Network" with explanation

---

## Troubleshooting

### Common Issues

**"Please switch to Sepolia network" error**
- Your wallet is on the wrong network
- Solution: The app should auto-switch, but if it fails, manually switch to Sepolia in your wallet

**"Insufficient balance" error**
- You don't have enough USDC or ETH
- Solution: Get test tokens from faucets (links in balance display)

**Transaction stuck/pending**
- Network congestion or low gas
- Solution: Wait longer, or check your wallet for pending transactions

**Wallet won't connect**
- Browser extension issue or network problem
- Solution: Refresh page, check wallet extension is enabled, try different wallet

**Build fails in GitHub Actions**
- Missing environment variable or dependency issue
- Solution: Check workflow logs, ensure secrets are set correctly

---

## Next Steps

### Extending the Application

1. **Add Transaction History**: Store transaction hashes in localStorage or backend
2. **Support Multiple Tokens**: Allow donations in ETH, DAI, etc.
3. **Recurring Donations**: Implement subscription-like recurring transfers
4. **Recipient Profiles**: Let recipients claim and customize their profiles
5. **Analytics Dashboard**: Show donation statistics and trends

### Learning Resources

- [Dynamic SDK Documentation](https://docs.dynamic.xyz/)
- [Ethereum Developer Resources](https://ethereum.org/en/developers/)
- [USDC on Sepolia](https://developers.circle.com/stablecoins/docs/usdc-on-testnets)
- [Vite Documentation](https://vitejs.dev/)

---

## Conclusion

This tutorial demonstrated how to build a functional stablecoin donation platform using Dynamic SDK. The application handles wallet connections, network management, balance fetching, and token transfers—all without requiring a backend server.

The key takeaway is that Dynamic SDK abstracts away much of the complexity of blockchain interactions, allowing developers to focus on building user experiences rather than managing wallet connections and network configurations.

For production use, you would add backend services, enhanced security, and more sophisticated features, but the core wallet integration pattern shown here remains the foundation.

---

## License

This project is provided as-is for educational purposes. See the repository license for details.
