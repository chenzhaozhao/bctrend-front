import { useEffect, useState } from "react";
import { Line, DualAxes } from "@ant-design/plots";
import request from "../../utils/request";
import dayjs from "dayjs";

const Home = () => {
  const [data, setData] = useState<any[]>([[], []]);
  const [range, setRange] = useState([
    { min: 0, max: 100 },
    { min: 0, max: 100 },
  ]);
  useEffect(() => {
    (async () => {
      const data: any = await request({ url: "/deribit?func=24hrvolume" });
      const data1: any = await request({ url: "/deribit?func=openinterest" });
      const ratio = data1.result?.map((item: any) => ({
        count: parseFloat(item.ratio),
        type: "Ratio",
        time: dayjs(item.time).format("YYYY-MM-DD HH:mm"),
      }));
      const ratio1 = data.result?.map((item: any) => ({
        value: parseFloat(item.ratio1),
        type: "Ratio1",
        time: dayjs(item.time).format("YYYY-MM-DD HH:mm"),
      }));
      const ratio2 = data.result?.map((item: any) => ({
        value: parseFloat(item.ratio2),
        type: "Ratio2",
        time: dayjs(item.time).format("YYYY-MM-DD HH:mm"),
      }));

      const values = ratio.map(({count}:{count:number}) => count);
      const values1 = [...ratio1,...ratio2].map(({value}:{value:number}) => value);
      setRange([{ min:Math.min(...values), max:Math.max(...values) },{min:Math.min(...values1),max:Math.max(...values1)}]);
      setData([ratio, [...ratio1, ...ratio2]]);
    })();
  }, []);  //   //   console.log(data, "9999");
  return (
    <div
      className=" h-full py-8 px-8 mx-6 my-10 rounded-sm"
      style={{ border: "1px solid #333" }}
    >
      <DualAxes
        data={data}
        xField="time"
        yField={["count", "value"]}
        yAxis={{
          count: {
            title: {
              text: "Ratio %",
            },
          },
          value: {
            title: {
              text: "Ratio1、Ratio2 %",
            },
          },
        }}
        legend={{
          title: {
            text: "多空比",
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
            ...range[0]
          },
          {
            geometry: "line",
            seriesField: "type",
            ...range[1]
          },
        ]}
        height={700}
        autoFit={false}
        slider={{
          start: 0,
          end: 100,
        }}
      />
    </div>
  );
};

export default Home;
