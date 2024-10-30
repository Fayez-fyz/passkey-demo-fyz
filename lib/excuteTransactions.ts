import { PasskeyArgType } from "@safe-global/protocol-kit";
import { Safe4337Pack } from "@safe-global/relay-kit";
import { BUNDLER_URL,   PAYMASTER_URL, RPC_URL } from "../utils/constant";

export async function executeTransaction(passkey: PasskeyArgType) {
    const safe4337Pack = await Safe4337Pack.init({
        provider:RPC_URL ,
        signer: passkey,
        bundlerUrl: BUNDLER_URL,

        options: {
          owners: [],
          threshold: 1,
        },
        paymasterOptions:{
            isSponsored: true,
            paymasterUrl: PAYMASTER_URL,
            // sponsorshipPolicyId:PAYMASTER_ADDRESS
        }
    })

    //define transaction details
    const transaction  = {
       to: "0x6A6C462bB1F5219014C866f46afba81150b5DCcD",
        value: "0",
        data: "0x",
    } 

    // create the safe transaction
    const safeOperation = await safe4337Pack.createTransaction({
        transactions: [transaction],
    })

    // sign the transaction with the passkey
    const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation)

    // execute the transaction
    const txResponse = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation,
    })

    console.log("Transaction executed successfully:", txResponse)

    const safeAddress = await safe4337Pack.protocolKit.getAddress()
    const isSafeDeployed = await safe4337Pack.protocolKit.isSafeDeployed()

    return {
        txResponse,
        safeAddress,
        isSafeDeployed
    }
    
}

