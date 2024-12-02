import { useState, useEffect } from "react";
import { ethers } from "ethers";
import votingSystemABI from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function VotingPage() {
  // State variables for managing Ethereum wallet, account, contract, petitions, and votes
  const [ethWallet, setEthWallet] = useState(undefined); // MetaMask wallet instance
  const [account, setAccount] = useState(undefined); // Current connected Ethereum account
  const [votingContract, setVotingContract] = useState(undefined); // Contract instance
  const [petitions, setPetitions] = useState([]); // List of petitions from the contract
  const [totalVotes, setTotalVotes] = useState(undefined); // Total votes across all petitions

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Deployed contract address
  const votingABI = votingSystemABI.abi; // Contract ABI for interaction

  // Function to detect and connect to the MetaMask wallet
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum); // Set the MetaMask wallet
    } else {
      alert("Please install MetaMask to interact with this application."); // Alert if MetaMask is not detected
      return;
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" }); // Fetch existing accounts
      handleAccount(accounts); // Update the account state
    }
  };

  // Function to set the connected account state
  const handleAccount = (account) => {
    if (account && account.length > 0) {
      setAccount(account[0]); // Use the first account
    }
  };

  // Function to connect to an account in MetaMask
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect"); // Ensure wallet is available
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" }); // Request account access
    handleAccount(accounts); // Update the account state
    getVotingContract(); // Initialize contract instance
  };

  // Function to set up the contract instance
  const getVotingContract = () => {
    if (!ethWallet || !account) {
      return; // Ensure wallet and account are connected
    }

    const provider = new ethers.providers.Web3Provider(ethWallet); // Set up Ethereum provider
    const signer = provider.getSigner(); // Get the user's signer

    try {
      const contract = new ethers.Contract(contractAddress, votingABI, signer); // Initialize contract instance
      setVotingContract(contract); // Store contract in state
    } catch (error) {
      console.error("Error setting up contract:", error); // Log errors if contract setup fails
    }
  };

  // Fetch petitions from the contract
  const fetchPetitions = async () => {
    if (votingContract) {
      try {
        const petitionsCount = await votingContract.petitionsCount(); // Get the total number of petitions
        let loadedPetitions = [];
        for (let i = 1; i <= petitionsCount.toNumber(); i++) { // Iterate through petitions
          const petition = await votingContract.petitions(i); // Fetch each petition
          loadedPetitions.push({
            name: petition.name, // Petition name
            voteCount: petition.voteCount.toString(), // Petition vote count
          });
        }
        setPetitions(loadedPetitions); // Update state with fetched petitions
      } catch (error) {
        console.error("Error fetching Petitions:", error); // Log errors
      }
    }
  };

  // Fetch the total number of votes from the contract
  const fetchTotalVotes = async () => {
    if (votingContract) {
      try {
        const totalVotes = await votingContract.totalVotes(); // Get total votes
        setTotalVotes(totalVotes.toNumber()); // Update state
      } catch (error) {
        console.error("Error fetching total votes:", error); // Log errors
      }
    }
  };

  // Function to vote for a specific petition
  const voteForPetition = async (petitionId) => {
    if (votingContract && account) {
      try {
        const tx = await votingContract.vote(petitionId); // Submit vote transaction
        await tx.wait(); // Wait for transaction confirmation
        fetchPetitions(); // Refresh petitions
        fetchTotalVotes(); // Refresh total votes
      } catch (error) {
        console.error("Error voting:", error); // Log errors
      }
    }
  };

  // Render UI based on wallet and account state
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this Voting System.</p>; // Prompt MetaMask installation
    }

    if (!account) {
      return <button onClick={connectAccount} className="connect-btn">Please connect your MetaMask wallet</button>; // Prompt account connection
    }

    return (
      <div>
        <h3>Choose a Petition and lock in your vote for our future:</h3>
        <div className="petition-grid">
          {petitions.map((petition, index) => (
            <div key={index} className="petition-card">
              <h4>{petition.name}</h4>
              <p>Votes: {petition.voteCount}</p>
              <button className="vote-btn" onClick={() => voteForPetition(index + 1)}>
                Vote for {petition.name}
              </button>
            </div>
          ))}
        </div>
        <p className="total-votes">Total Votes: {totalVotes}</p> {/* Show total votes */}
      </div>
    );
  };

  // Effect hook to initialize wallet on component mount
  useEffect(() => {
    getWallet();
  }, []);

  // Effect hook to initialize contract when account changes
  useEffect(() => {
    if (account) {
      getVotingContract();
    }
  }, [account]);

  // Effect hook to fetch data when contract instance changes
  useEffect(() => {
    if (votingContract) {
      fetchPetitions();
      fetchTotalVotes();
    }
  }, [votingContract]);

  return (
    <main className="container">
      <header className="header">
        <h1>Welcome to the Nature Petition System!</h1>
        <p>Connected Wallet: {account}</p>
      </header>
      {initUser()}
      <footer className="footer">
        <p>&copy; 2024 Nature Petition System. All Rights Reserved.</p>
      </footer>
      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }
        .header {
          background-color: #28a745;
          color: white;
          padding: 20px;
          border-radius: 5px;
        }
        .petition-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .petition-card {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          background: #f9f9f9;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        }
        .petition-card h4 {
          margin-bottom: 10px;
          color: #333;
        }
        .vote-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .vote-btn:hover {
          background-color: #0056b3;
        }
        .connect-btn {
          background-color: #ffc107;
          color: #212529;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .connect-btn:hover {
          background-color: #e0a800;
        }
        .total-votes {
          margin-top: 20px;
          font-weight: bold;
          color: #28a745;
        }
        .footer {
          margin-top: 40px;
          padding: 10px;
          background: #333;
          color: white;
          border-radius: 5px;
        }
      `}</style>
    </main>
  );
}
