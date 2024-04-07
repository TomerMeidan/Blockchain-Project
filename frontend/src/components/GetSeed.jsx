import React, { useEffect, useState } from "react";
import { Button, Divider, Flex, Radio, Table, Input } from "antd";
import axios from "axios";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useStore } from "../store/store.js";
import toast, { Toaster } from "react-hot-toast";

const GetSeed = () => {
  const {
    form,
    setForm,
    accounts,
    setAccounts,
    isTransactionPossible,
    setIsTransactionPossible,
    setStep,
    setIsTransactionVisible,
  } = useStore((state) => ({
    form: state.form,
    setForm: state.setForm,
    accounts: state.accounts,
    setAccounts: state.setAccounts,
    isTransactionPossible: state.isTransactionPossible,
    setStep: state.setStep,
    setIsTransactionPossible: state.setIsTransactionPossible,
    setIsTransactionVisible: state.setIsTransactionVisible,
  }));

  const create_new_wallet = async () => {
    const network = form?.network;
    const number_of_addresses = form?.number_of_addresses;
    if (number_of_addresses < 1) {
      toast.error(" Number of addresses should be greater than 0");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/${network}/${number_of_addresses}`
      );
      const data = response?.data;
      console.log(data);
      const new_accounts = data.accounts.map((account) => {
        return {
          address: account.address,
          privateKey: account.privateKey,
          balance: account.balance,
        };
      });

      setForm({
        ...form,
        seed: data.seed,
        from_address: new_accounts[0].address,
      });
      setAccounts(new_accounts);
      setIsTransactionPossible(true);
      toast.success("🦄 Wallet created successfully!");
    } catch (error) {
      console.log(error);
      toast.error("😣 Wallet creation failed!");
    }
  };

  const handleGetAccounts = async () => {
    const seed = form?.seed;
    const number_of_addresses = form?.number_of_addresses;
    if (!seed || !number_of_addresses) {
      toast.error("🚨 Seed and Number of addresses are required");
      return;
    }

    if (Number(number_of_addresses) < 1) {
      toast.error("🚨 Number of addresses should be greater than 0");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/`,
        {
          network: form?.network,
          seed,
          number_of_addresses,
        }
      );
      const data = response?.data;
      console.log(data);
      const new_accounts = data.accounts.map((account) => {
        return {
          address: account.address,
          privateKey: account.privateKey,
          balance: account.balance,
        };
      });
      setAccounts(new_accounts);
      setIsTransactionPossible(true);
      toast.success("🦄 Accounts fetched successfully!");
    } catch (error) {
      toast.error("😣 Accounts fetch failed!");
    }
  };

  const columns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Private Key",
      dataIndex: "privateKey",
      key: "privateKey",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
  ];

  return (
    <div
      className="p-5 mt-5 rounded-md mb-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
      }}
    >
      <div className="flex flex-col gap-5">
        <Radio.Group
          value={form?.seed_type}
          onChange={(e) => setForm({ ...form, seed_type: e.target.value })}
        >
          <Radio.Button value="existing_seed">Existing Seed</Radio.Button>
          <Radio.Button value="create_new_wallet">
            Create New Wallet
          </Radio.Button>
        </Radio.Group>
        {form?.seed_type === "existing_seed" && (
          <div className="flex flex-col items-baseline gap-5">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="Enter 12 words Seed"
                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                value={form?.seed}
                onChange={(e) => setForm({ ...form, seed: e.target.value })}
              />
              <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Enter 12 words Seed
              </label>
            </div>
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="Enter Number of Addresses"
                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                value={form?.number_of_addresses}
                onChange={(e) =>
                  setForm({ ...form, number_of_addresses: e.target.value })
                }
                type="number"
                min={1}
              />
              <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Number of Addresses
              </label>
            </div>
            <Button onClick={handleGetAccounts}>Get Accounts</Button>
          </div>
        )}
        {form?.seed_type === "create_new_wallet" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-3 items-baseline">
              <div className="relative h-11 w-full min-w-[200px]">
                <input
                  placeholder="Number of Addresses"
                  className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                  value={form?.number_of_addresses}
                  onChange={(e) =>
                    setForm({ ...form, number_of_addresses: e.target.value })
                  }
                  type="number"
                />
                <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Number of Addresses
                </label>
              </div>
              <Button onClick={create_new_wallet}>Create</Button>
            </div>
            {form.seed ? (
              <Input.Password
                value={form?.seed}
                contentEditable={false}
                placeholder="Generated Seed"
              />
            ) : null}
          </div>
        )}
        <div className="details">
          <Divider dashed>Account Details</Divider>
          <Table
            dataSource={accounts}
            columns={columns}
            pagination={{ pageSize: 3 }}
          />
        </div>
        <Button
          disabled={!isTransactionPossible}
          onClick={() => {
            setStep(2);
            setIsTransactionVisible(true);
            setForm({ ...form, from_address: accounts[0].address });
          }}
        >
          Continue
        </Button>
      </div>
      <Toaster
        toastOptions={{
          duration: 5000,
          success: {
            duration: 5000,
          },
        }}
      />
    </div>
  );
};

export default GetSeed;
