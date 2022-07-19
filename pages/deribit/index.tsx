import { useEffect, useState } from "react";
import {DualAxes } from "@ant-design/plots";
import request from "../../utils/request";
import dayjs from "dayjs";
import { SetByArray } from "../../utils";
const Home = ({ dataSource }: { dataSource: [[], [], []] }) => {
  const [data, setData] = useState<any[]>([[], []]);
  const [range, setRange] = useState([
    { min: 0, max: 100 },
    { min: 0, max: 100 },
  ]);
  useEffect(() => {
    (async () => {
      const [data, data1, data2] = dataSource;
      const allData = [...data, ...data1, ...data2].sort(
        (a: any, b: any) =>
          (new Date(a.time) as unknown as number) -
          (new Date(b.time) as unknown as number)
      ).map((item:any)=>({...item,time:dayjs(item.time).format('YYYY-MM-DD HH:mm')}));
      const times=Array.from(new Set(allData.map(({time})=>time)));
      const ratio = allData.filter(({time,ratio})=>times.includes(time) && ratio).map(({ ratio,time}) => ({
        value: parseFloat(ratio || ""),
        type: "Ratio",
        time,
      }))
      const ratio1 =SetByArray(allData.map(({ ratio1, time }) => ({
        value: parseFloat(ratio1 || ""),
        type: "Ratio1",
        time,
      })),'time')
      const ratio2 = SetByArray(allData.map(({ ratio2, time }) => ({
        value: parseFloat(ratio2 || ""),
        type: "Ratio2",
        time,
      })),'time');
      const btc =SetByArray(allData.map(({ btc, time }) => ({
        amount: parseFloat(btc || ""),
        type: "BTC Price",
        time,
      })),'time');
      const values = [...ratio,...ratio1].map(({ value }: { value: number }) => value);
      const values1 =btc.map(
        ({  amount}: { amount: number }) => amount
      );
      setRange([
        { min: Math.min(...values), max: Math.max(...values) },
        { min: Math.min(...values1), max: Math.max(...values1) },
      ]);
      setData([[...ratio1, ...ratio2,...ratio], btc]);
    })();
  }, []);
  return (
    <div
      className=" h-full py-8 px-8 mx-6 my-10 rounded-sm"
      style={{ border: "1px solid #333" }}
    >
      <DualAxes
        data={data}
        xField="time"
        yField={["value", "amount"]}
        xAxis={{
          // type:"timeCat",
          tickInterval:1
        }}
        yAxis={{
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
        }}
        legend={{
          title: {
            text: "Long to Short Ratio",
            spacing: 50,
            style: {
              fontSize: 16,
              fontWeight: 500,
            },
          },
        }}
        geometryOptions={[
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
        ]}
        autoFit={true}
        slider={{
          start: 0,
          end: 100,
        }}
      />
    </div>
  );
};
export async function getServerSideProps() {
  try {
    const data: any = await Promise.all([
      request({ url: "/deribit?func=openinterest" }),
      request({ url: "/deribit?func=24hrvolume" }),
      request({ url: "/deribit?func=price_btceth" }),
    ]);
    return {
      props: {
        dataSource: data.map(({ result }: { result: any[] }) =>
          result.sort(
            (a: any, b: any) =>
              (new Date(a.date) as unknown as number) -
              (new Date(b.date) as unknown as number)
          )
        ),
      },
    };
  } catch (error) {
    return {
      props: { data: [] },
    };
  }
}
export default Home;
