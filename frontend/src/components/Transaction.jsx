import React, { useState } from "react";
import { Button, Divider, Flex, Radio, Select } from "antd";
import { useStore } from "../store/store.js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Transaction = () => {
  const { form, setForm, accounts, setAccounts } = useStore((state) => ({
    form: state.form,
    setForm: state.setForm,
    accounts: state.accounts,
    setAccounts: state.setAccounts,
  }));
  const [isSending, setIsSending] = useState(false);

  const handleFromAddressChange = (value) => {
    setForm({ ...form, from_address: value });
  };

  const handleSendAmount = async () => {
    const { from_address, to_address, amount } = {
      from_address: form?.from_address,
      to_address: form?.to_address,
      amount: form?.amount,
    };
    const privateKey = accounts?.find((account) => account?.address === from_address)?.privateKey;
    console.log("privateKey", privateKey);
    try {
      setIsSending(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sendTransaction`, {
        fromAddress: from_address,
        privateKey,
        toAddress: to_address,
        value: amount,
        network: form?.network,
      });
      console.log(response);
      const data = response?.data;
      const new_accounts = accounts.map((account) => {
        if (account?.address === data.address) {
          return {
            address: data.address,
            privateKey: account.privateKey,
            balance: data.balance,
          };
          }
          return account;
        });
      setAccounts(new_accounts);
      toast.success("🦄 Transaction sent successfully!");
      setForm({ ...form, amount: "" });
      setIsSending(false);
    } catch (e) {
      setIsSending(false);
      toast.error("😣 Transaction failed!");
      console.log(e);
    }
  };

  return (
    <div
      className="p-5 mt-5 rounded-md mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset" }}
    >
      <div className="pt-5">
        <h1 className="text-center font-bold text-2xl">Send {form?.network == "ethereum" ? "ETH" : "BTC"}</h1>
        <div className="my-5 flex flex-col gap-6">
          <div className="flex flex-row items-baseline justify-center">
            <div className="w-full font-semibold text-base">From Address : </div>
            <Select
              defaultValue={accounts[0]?.address}
              className="w-full"
              placeholder="Select From Address"
              onChange={handleFromAddressChange}
              options={
                accounts.map((account) => ({
                  value: account.address,
                  label: account.address,
                })) || []
              }
            />
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              placeholder="To Address"
              className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              value={form?.to_address}
              onChange={(e) => setForm({ ...form, to_address: e.target.value })}
            />
            <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              To Address
            </label>
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              placeholder="Amount"
              className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              value={form?.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Amount
            </label>
          </div>
          <Button disabled={isSending} className="text-center max-w-20 bg-blue-600" type="primary" onClick={handleSendAmount}>
            Send
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Transaction;
