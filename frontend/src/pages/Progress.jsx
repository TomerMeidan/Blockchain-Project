import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import Network from "../components/Network";
import GetSeed from "../components/GetSeed";
import Transaction from "../components/Transaction";
import { useStore } from "../store/store.js";

const Progress = () => {
  const { form, step, isTransactionVisible } = useStore((state) => ({
    form: state.form,
    setForm: state.setForm,
    step: state.step,
    setStep: state.setStep,
    accounts: state.accounts,
    setAccounts: state.setAccounts,
    isTransactionVisible: state.isTransactionVisible,
  }));
  console.log("🔥  form: ", form);

  return (
    <Steps
      direction="vertical"
      size="default"
      current={step}
      items={[
        {
          title: (
            <div
              className="px-3 m-1 rounded-md w-full"
              style={{
                boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
              }}
            >
              Select a Network
            </div>
          ),
          description: <Network />,
        },
        {
          title: (
            <div
              className="px-3 m-1 rounded-md w-full"
              style={{
                boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
              }}
            >
              Create wallet or use your existing wallet by entering your secret 12 words.
            </div>
          ),
          description: <>{form?.network !== "" ? <GetSeed /> : null}</>,
        },
        {
          title: (
            <div
              className="px-3 m-1 rounded-md w-full"
              style={{
                boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
              }}
            >
              Transection Process
            </div>
          ),
          description: <>{isTransactionVisible ? <Transaction /> : null}</>,
        },
      ]}
    />
  );
};
export default Progress;
