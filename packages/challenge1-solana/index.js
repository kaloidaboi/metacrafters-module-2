// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

const airDropSol = async (userPubKey) => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Request airdrop of 2 SOL to the wallet
        console.log(`Airdropping SOL to ${userPubKey}\n`);
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(userPubKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

const mainFunction = async () => {
    // Get the user public key via the CLI as parameter
    // Assumption #1: the 3rd parameter is the public key
    // Assumption #2: public key entered by the user is correct
    let userPubKey = process.argv[2];
    if(!userPubKey) {
        console.log("Please enter a wallet address\n");
        return;
    }
    console.log(`\nWallet address: ${userPubKey}`);

    await airDropSol(userPubKey);
}

mainFunction();
