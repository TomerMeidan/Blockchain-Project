import React, { useState } from "react";
import { Button, Divider, Flex, Radio } from "antd";
import { useStore } from "../store/store.js";

const Network = () => {
  const {
    form,
    setForm,
    setStep,
    setAccounts,
    setIsTransactionPossible,
    setIsTransactionVisible,
  } = useStore((state) => ({
    form: state.form,
    setForm: state.setForm,
    setStep: state.setStep,
    setAccounts: state.setAccounts,
    setIsTransactionPossible: state.setIsTransactionPossible,
    setIsTransactionVisible: state.setIsTransactionVisible,
  }));

  const handleNetworkChange = (e) => {
    setForm({ number_of_addresses: "", network: e.target.value });
    setStep(1);
    setAccounts([]);
    setIsTransactionPossible(false);
    setIsTransactionVisible(false);
  };

  return (
    <div className="p-5">
      <Radio.Group value={form?.network} onChange={handleNetworkChange}>
        <Radio.Button value="ethereum">ETHEREUM</Radio.Button>
        <Radio.Button value="bitcoin">BITCOIN</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default Network;
