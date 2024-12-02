# Nature Petition System - README

Welcome to the **Nature Petition System**, a decentralized application (dApp) that allows users to connect their Ethereum wallet, view petitions, and vote for initiatives they care about. This application is built with React and uses the Ethereum blockchain for managing petitions and votes.

## Features
- **Connect MetaMask Wallet**: Enables users to interact with the dApp using their MetaMask wallet.
- **View Petitions**: Displays a list of active petitions retrieved from the Ethereum smart contract.
- **Vote for Petitions**: Allows users to vote for petitions directly from the app.
- **Real-time Updates**: Reflects updated vote counts and total votes instantly after interactions.

## Setup and Installation

1. Clone the repository:
git clone <repository-url> cd nature-petition-system

2. Install dependencies:
npm install

3. Start the development server:
npm start

4. Ensure your Ethereum wallet (e.g., MetaMask) is set up and connected to the correct network.

## Key Components

### State Variables
- `ethWallet`: Stores the MetaMask wallet instance.
- `account`: Stores the currently connected Ethereum account.
- `votingContract`: Stores the instance of the deployed voting smart contract.
- `petitions`: Contains the list of petitions retrieved from the smart contract.
- `totalVotes`: Tracks the total number of votes across all petitions.

### Functions
1. **`getWallet`**: Detects MetaMask and initializes the wallet.
2. **`handleAccount`**: Updates the application state with the connected Ethereum account.
3. **`connectAccount`**: Connects the user’s MetaMask wallet to the dApp.
4. **`getVotingContract`**: Initializes the voting contract instance using the provided ABI and contract address.
5. **`fetchPetitions`**: Retrieves the list of petitions from the smart contract.
6. **`fetchTotalVotes`**: Fetches the total number of votes from the smart contract.
7. **`voteForPetition`**: Submits a vote for a specific petition and updates the UI with new data.
8. **`initUser`**: Handles conditional rendering based on the wallet and account connection state.

## Usage

### Connect MetaMask
1. Install MetaMask and configure it for the required Ethereum network.
2. Open the application and click **"Please connect your MetaMask wallet"**.
3. Approve the connection in the MetaMask popup.

### Vote for a Petition
1. Browse available petitions on the homepage.
2. Click the **"Vote"** button on your chosen petition.
3. Confirm the transaction in MetaMask.

## Smart Contract Details
- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **ABI**: Located in `../artifacts/contracts/Assessment.sol/Assessment.json`

## UI Styling
The app includes responsive styling for a smooth user experience:
- A petition grid for displaying active petitions.
- Dynamic buttons for voting and connecting wallets.
- Accessible and intuitive layout for users of all technical levels.

## Future Enhancements
- Add a feature to create new petitions.
- Include analytics for petition performance.
- Implement support for multiple Ethereum networks.

## License
This project is licensed under the MIT License.

Enjoy using the **Nature Petition System**! 🌱
