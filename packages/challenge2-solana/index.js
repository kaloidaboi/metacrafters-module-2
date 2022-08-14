// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        50,  82,   8,  19, 228, 122,  72,  64,  51, 121, 197,
        189,  52, 164,  86, 137,  99, 238, 102,  93,   9, 155,
        57, 167, 107, 135, 144,  47, 143, 171,  75,  26,  93,
        88, 164, 110, 255,  74, 164,  44, 100,  59,  14, 246,
        72,   2,  38,  31, 147,  47, 179,  92,  54, 252, 225,
        232, 146, 144, 185, 172,  27, 117, 248, 157
      ]            
);

const transferSol = async() => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Get Keypair from Secret Key
        var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

        // Get balance of "from" wallet
        let fromWalletBalance = await connection.getBalance(
            new PublicKey(from.publicKey)
        );
        console.log(`\nWallet #1 balance: ${parseInt(fromWalletBalance) / LAMPORTS_PER_SOL} SOL`);

        // Other things to try: 
        // 1) Form array from userSecretKey
        // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
        // 2) Make a new Keypair (starts with 0 SOL)
        // const from = Keypair.generate();

        // Generate another Keypair (account we'll be sending to)
        const to = Keypair.generate();

        // Get balance of "to" wallet
        let toWalletBalance = await connection.getBalance(
            new PublicKey(to.publicKey)
        );
        console.log(`Wallet #2 balance: ${parseInt(toWalletBalance) / LAMPORTS_PER_SOL} SOL`);

        // Aidrop 2 SOL to Sender wallet
        console.log("\nAirdopping some SOL to Sender wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(from.publicKey),
            2 * LAMPORTS_PER_SOL
        );

        // Latest blockhash (unique identifer of the block) of the cluster
        let latestBlockHash = await connection.getLatestBlockhash();

        // Confirm transaction using the last valid block height (refers to its time)
        // to check for transaction expiration
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAirDropSignature
        });

        console.log("Airdrop completed for the Sender account");

        // Get balance of "from" wallet
        fromWalletBalance = await connection.getBalance(
            new PublicKey(from.publicKey)
        );
        let balance = parseInt(fromWalletBalance) / LAMPORTS_PER_SOL;
        let halfOfBalance = (balance/2);
        console.log(`Wallet #1 balance: ${parseInt(fromWalletBalance) / LAMPORTS_PER_SOL} SOL`);
        console.log(`halfOfBalance: ${halfOfBalance}`);
        console.log('lamports:' + halfOfBalance * LAMPORTS_PER_SOL);

        // Send money from "from" wallet and into "to" wallet
        console.log('\nSending money from Wallet #1 to Wallet #2');
        var transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to.publicKey,
                // lamports: LAMPORTS_PER_SOL / 100
                lamports: halfOfBalance * LAMPORTS_PER_SOL
            })
        );

        // Sign transaction
        var signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log('Signature is ', signature);

        // Get balance of "from" wallet
        fromWalletBalance = await connection.getBalance(
            new PublicKey(from.publicKey)
        );
        console.log(`\nWallet #1 balance: ${parseInt(fromWalletBalance) / LAMPORTS_PER_SOL} SOL`);

        // Get balance of "to" wallet
        toWalletBalance = await connection.getBalance(
            new PublicKey(to.publicKey)
        );
        console.log(`Wallet #2 balance: ${parseInt(toWalletBalance) / LAMPORTS_PER_SOL} SOL\n`);
    } catch(err) {
        console.log(err);
    } 
}

transferSol();
