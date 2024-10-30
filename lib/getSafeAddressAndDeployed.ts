import { PasskeyArgType } from "@safe-global/protocol-kit";
import { Safe4337Pack } from "@safe-global/relay-kit";
import { BUNDLER_URL, RPC_URL } from "../utils/constant";

export async function getSafeAddressAndDeployed(passkey: PasskeyArgType) {
    const safe4337Pack = await Safe4337Pack.init({
        provider:RPC_URL ,
        signer: passkey,
        bundlerUrl: BUNDLER_URL,

        options: {
          owners: [],
          threshold: 1,
        },
        // paymasterOptions:{
        //     isSponsored: true,
        //     paymasterUrl: PAYMASTER_URL,
        //     // sponsorshipPolicyId:PAYMASTER_ADDRESS
        // }
    })

    const safeAddress = await safe4337Pack.protocolKit.getAddress()
    const isSafeDeployed = await safe4337Pack.protocolKit.isSafeDeployed()

    return {
        safeAddress,
        isSafeDeployed
    }
    
}

