import type { NextPage } from "next";
import { Divider, Row, Col, Avatar, Spin } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import SwitchSelect from "../components/switch-select";
interface RankProps {
  title: string;
  data: any[];
  mode: string;
  type: string;
  tabs: string[];
}
const src =
  "data:image/jpeg;base64,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";
const Ranking = ({ title, data, mode, type,tabs }: RankProps) => {
  const [loading, setLoading] = useState(false);
  const changeStatus = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return (
    <div className=" bg-white w-1/5 " style={{ borderRadius: "4px" }}>
      <Spin spinning={loading}>
        <div className="flex p-3 pb-1 justify-between">
          <div>{title}</div>
          <div className="ml-8">
            <SwitchSelect onChange={changeStatus} tabs={tabs} />
          </div>
        </div>
        <Divider className="p-0 m-0 my-1" />
        <Row className="w-full p-3 pb-1">
          <Col span={3}>#</Col>
          <Col span={16}>{type}</Col>
          <Col span={5} className=" text-right">
            {mode}
          </Col>
        </Row>
        {data.map((item, index) => (
          <Row className=" w-full p-3 pb-4" key={index}>
            <Col span={3}>{index + 1}</Col>
            <Col span={16} className=" text-blue-500 flex  items-center">
              <Avatar src={src} size="small" className=" mr-1" />
              <a href="#">{item.user}</a>
            </Col>
            <Col span={5} className=" text-right">
              {item.rate}
            </Col>
          </Row>
        ))}
      </Spin>
    </div>
  );
};
const Home: NextPage = () => {
  const data = [
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
    {
      user: "小明",
      rate: "10%",
    },
  ];
  return (
    <div className=" w-full h-full  bg-gray-200  text-base p-10  flex justify-around">
      <Ranking
        title={"Return For Wallet"}
        data={data}
        mode="Return"
        type="User"
        tabs={["Month", "Year"]}
      />
      <Ranking
        title={"Activity For Wallet"}
        data={data}
        mode="Txns"
        type="User"
        tabs={["Week", "Month"]}
      />
      <Ranking
        title={"Activity For Project"}
        data={data}
        mode="Txns"
        type="Project"
        tabs={["Week", "Month"]}
      />
      <Ranking
        title={"Return For NFT"}
        data={data}
        mode="Return"
        type="NFT Collection"
        tabs={["Month", "Year"]}
      />
    </div>
  );
};

export default Home;
