import { useEffect, useState } from "react";
import { Button, Divider, Flex, Radio } from "antd";
import Progress from "./Progress";

const Home = () => {

  return (
    <div className="flex h-full mx-auto flex-col flex-1 items-center ">
      <div
        className="flex flex-col gap-10 p-5 mt-5 rounded-md mb-3 bg-white"
        style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset" }}
      >
        <h2 className="text-center font-bold text-3xl">MultiCurrency HD-WALLET</h2>
        <Progress />
      </div>
    </div>
  );
};

export default Home;
