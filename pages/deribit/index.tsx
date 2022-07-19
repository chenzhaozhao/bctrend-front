import { useEffect, useState } from "react";
import { DualAxes } from "@ant-design/plots";
import dayjs from "dayjs";
import { SetByArray } from "../../utils";
import axios from "axios";
import { Spin } from "antd";
const Home = () => {
  const [data, setData] = useState<any[]>([[], []]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState([
    { min: 0, max: 100 },
    { min: 0, max: 100 },
  ]);
  const config = {
    data: data,
    xField: "time",
    yField: ["value", "amount"], 
    yAxis: {
      value: {
        title: {
          text: "%",
        },
      },
      amount: {
        title: {
          text: "BTC price(USD)",
        },
      },
    },
    legend: {
      title: {
        text: "Long to Short Ratio",
        spacing: 50,
        style: {
          fontSize: 16,
          fontWeight: 500,
        },
      },
    },
    geometryOptions: [
      {
        geometry: "line",
        seriesField: "type",
        connectNulls: true,
        ...range[0],     
      },
      {
        geometry: "line",
        seriesField: "type",
        connectNulls: true,
        ...range[1],
      },
    ],
    autoFit: true,
    slider: {
      start: 0,
      end: 100,
    },
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: dataSource } = await axios({ url: "/api/deribit" });
      setLoading(false);
      const [data, data1, data2] = dataSource;
      const allData = [...data, ...data1, ...data2]
        .sort(
          (a: any, b: any) =>
            (new Date(a.time) as unknown as number) -
            (new Date(b.time) as unknown as number)
        )
        .map((item: any) => ({
          ...item,
          time: dayjs(item.time).format("YYYY-MM-DD HH:mm"),
        })).filter(({time})=>Number(dayjs(time).format('mm'))%15===0);
      const ratio = SetByArray(allData
        .map(({ ratio, time }) => ({
          value: parseFloat(ratio || ""),
          type: "Ratio",
          time,
        })),'time','value');
      const ratio1 = SetByArray(
        allData.map(({ ratio1, time }) => ({
          value: parseFloat(ratio1 || ""),
          type: "Ratio1",
          time,
        })),
        "time",'value'
      );
      const ratio2 = SetByArray(
        allData.map(({ ratio2, time }) => ({
          value: parseFloat(ratio2 || ""),
          type: "Ratio2",
          time,
        })),
        "time",'value'
      );
      const btc = SetByArray(
        allData.map(({ btc, time }) => ({
          amount: parseFloat(btc || ""),
          type: "BTC Price",
          time,
        })),
        "time",'amount'
      );
      const values = [...ratio, ...ratio1].map(
        ({ value }: { value: number }) => value
      );
      const values1 = btc.map(({ amount }: { amount: number }) => amount);
      setRange([
        { min: Math.min(...values), max: Math.max(...values) },
        { min: Math.min(...values1), max: Math.max(...values1) },
      ]);
      setData([[...ratio, ...ratio1, ...ratio2], btc]);
    })();
  }, []);
  return (
    <div
      className=" rounded-sm py-5 px-10 m-10"
      style={{ border: "1px solid #333", boxSizing: "border-box" }}
    >
      <Spin tip="Loading..." spinning={loading}>
        <div style={{ height: "70vh" }}>
          <DualAxes {...config} />
        </div>
      </Spin>
    </div>
  );
};
export default Home;
