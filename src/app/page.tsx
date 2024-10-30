"use client";

import { PasskeyArgType } from "@safe-global/protocol-kit";
import {
  createPasskey,
  loadPasskeysFromLocalStorage,
  storePasskeyInLocalStorage,
} from "../../lib/passkeys";
import { executeTransaction } from "../../lib/excuteTransactions";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CHAIN_NAME } from "../../utils/constant";
import { getSafeAddressAndDeployed } from "../../lib/getSafeAddressAndDeployed";

export default function Home() {
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType | null>(
    null
  );
  const [safeAddress, setSafeAddress] = useState("");
  const [userTransactionHash, setUserTransactionHash] = useState("");
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean | null>(null);
  const [safeLoading, setSafeLoading] = useState(false);
  useEffect(() => {
    getLocalStoragePasskey();
    getSafeAddressFromSafe();
  }, []);

  const getLocalStoragePasskey = () => {
    const passkeys: PasskeyArgType[] = loadPasskeysFromLocalStorage();
    setSelectedPasskey(passkeys[0]);
  };

  const getSafeAddressFromSafe = async () => {
    try {
      setSafeLoading(true);
      const passkeys: PasskeyArgType[] = loadPasskeysFromLocalStorage();
      setSelectedPasskey(passkeys[0]);
      const { safeAddress, isSafeDeployed } = await getSafeAddressAndDeployed(
        passkeys[0]
      );
      console.log(safeAddress, "safeAddress");
      setSafeAddress(safeAddress);
      console.log(isSafeDeployed, "isSafeDeployed");
      setIsSafeDeployed(isSafeDeployed);
      setSafeLoading(false);
    } catch (error) {
      console.log(error);
      setSafeLoading(false);
    }
  };

  const handleCreatePasskey = async () => {
    const passkey = await createPasskey();
    // we can store passkey in local storage or in a database
    storePasskeyInLocalStorage(passkey); // Store passkey in local storage
    setSelectedPasskey(passkey);
   getSafeAddressFromSafe();
  };

  const handleExecuteTransaction = async () => {
    const passkeys: PasskeyArgType[] = loadPasskeysFromLocalStorage();
    const { txResponse } =
      await executeTransaction(passkeys[0]); // Use the first passkey
    console.log(txResponse, "user");
    setUserTransactionHash(txResponse);
  await getSafeAddressFromSafe();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gradient-to-r  from-black via-slate-900 to-black p-5 rounded-xl shadow-xl w-fit flex flex-col items-center gap-5">
        <h1 className="text-2xl font-bold">Safe Passkey</h1>
        {!selectedPasskey && (
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded-md`}
            onClick={handleCreatePasskey}
          >
            Create Passkey
          </button>
        )}
        {selectedPasskey && <p>Passkey: {selectedPasskey?.rawId}</p>}
        {safeLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <button
              className={`bg-green-500 text-white px-4 py-2 rounded-md ${
                !selectedPasskey || isSafeDeployed === true
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleExecuteTransaction}
              disabled={!selectedPasskey || isSafeDeployed === true}
            >
              Execute Transaction and Deploy Safe
            </button>

            {userTransactionHash && (
              <Link
                target="_blank"
                className="underline text-blue-500"
                href={`https://jiffyscan.xyz/userOpHash/${userTransactionHash}?network=${CHAIN_NAME}`}
              >
                Jiffyscan : {userTransactionHash}
              </Link>
            )}

            {safeAddress && (
              <Link
                target="_blank"
                className="underline text-blue-500"
                href={`https://app.safe.global/home?safe=sep:${safeAddress}`}
              >
                Safe Address : {safeAddress}
              </Link>
            )}
            {isSafeDeployed && <p>Safe Deployed</p>}
          </>
        )}
      </div>
    </div>
  );
}
