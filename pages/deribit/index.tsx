import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Spin } from "antd";
import * as echarts from "echarts";
const sortRule = (a: any, b: any) =>
  (new Date(a) as unknown as number) - (new Date(b) as unknown as number);
const Home = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      var chartDom = document.getElementById("plot") as HTMLElement;
      var myChart = echarts.init(chartDom);
      const { data: dataSource } = await axios({ url: "/api/deribit" });
      setLoading(false);
      //所有数据
      let [data, data1, data2] = dataSource;
      // x轴上时间集合
      const times = Array.from(
        new Set(
          dataSource
            .flat()
            .map(({ time }: { time: string }) =>
              dayjs(time).format("YYYY-MM-DD HH:mm")
            )
            .filter(
              (time: string) => Number(dayjs(time).format("mm")) % 15 === 0
            )
            .sort(sortRule)
        )
      );
      const ratio = times.map((time) => {
        const raTime: string[] = data
          .map(({ time, ratio }: { time: string; ratio: string }) => ({
            time: dayjs(time).format("YYYY-MM-DD HH:mm"),
            ratio,
          }))
          .map(({ time }: { time: string }) => time);
        const Index = raTime.indexOf(time as string);
        let value: number = null as unknown as number;
        if (Index >= 0) {
          value = parseFloat(data[Index].ratio || "");
        }
        return value;
      });
      const ratio1 = times.map((time) => {
        const raTime: string[] = data1
          .map(({ time, ratio }: { time: string; ratio: string }) => ({
            time: dayjs(time).format("YYYY-MM-DD HH:mm"),
            ratio,
          }))
          .map(({ time }: { time: string }) => time);
        const Index = raTime.indexOf(time as string);
        let value: number = null as unknown as number;
        if (Index >= 0) {
          value = parseFloat(data1[Index].ratio1 || "");
        }
        return value;
      });
      const ratio2 = times.map((time) => {
        const raTime: string[] = data1
          .map(({ time, ratio }: { time: string; ratio: string }) => ({
            time: dayjs(time).format("YYYY-MM-DD HH:mm"),
            ratio,
          }))
          .map(({ time }: { time: string }) => time);
        const Index = raTime.indexOf(time as string);
        let value: number = null as unknown as number;
        if (Index >= 0) {
          value = parseFloat(data1[Index].ratio2 || "");
        }
        return value;
      });
      const btc = times.map((time) => {
        const raTime: string[] = data2
          .map(({ time, ratio }: { time: string; ratio: string }) => ({
            time: dayjs(time).format("YYYY-MM-DD HH:mm"),
            ratio,
          }))
          .map(({ time }: { time: string }) => time);
        const Index = raTime.indexOf(time as string);
        let value: number = null as unknown as number;
        if (Index >= 0) {
          value = parseFloat(data2[Index].btc || "");
        }
        return value;
      });

      var option;
      const ratioMin = Math.min(
        ...[...ratio, ...ratio1, ...ratio2].filter((num) => num)
      );
      const priceMin = Math.min(...btc.filter((num) => num));
      const ratioMax = Math.max(
        ...[...ratio, ...ratio1, ...ratio2].filter((num) => num)
      );
      const priceMax = Math.max(...btc.filter((num) => num));
      console.log(ratioMin, priceMax, "999999");
      option = {
        title: {
          text: "Long to Short Ratio",
          textStyle: {},
          x: "center",
          y: "top",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "40px",
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: 0, // 滚动条的起始位置（10%）
            end: 100, // 滚动条的
          },
        ],
        grid: {
          top: "120px",
          left: "100px",
          right: "100px",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: times,
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: [
          {
            type: "value",
            name: "",
            nameTextStyle: {
              align: "right",
            },
            axisLabel: {
              formatter: "{value}%",
            },
            min: ratioMin,
            max: ratioMax,
          },
          {
            type: "value",
            axisLabel: {
              formatter: function (value: number) {
                console.log(value);
                return value / 1000 + "k USD";
              },
            },
            nameTextStyle: {
              align: "right",
            },
            name: "",
            min: priceMin,
            max: priceMax,
          },
        ],
        series: [
          {
            name: "Ratio",
            type: "line",
            data: ratio,
            yAxisIndex: 0,
            symbol: "none",
            connectNulls: true,
            smooth: true,
          },
          {
            name: "Ratio1",
            type: "line",
            data: ratio1,
            yAxisIndex: 0,
            symbol: "none",
            connectNulls: true,
            smooth: true,
          },
          {
            name: "Ratio2",
            type: "line",
            data: ratio2,
            yAxisIndex: 0,
            symbol: "none",
            connectNulls: true,
            smooth: true,
          },
          {
            name: "BTC Price",
            type: "line",
            data: btc,
            yAxisIndex: 1,
            symbol: "none",
            connectNulls: true,
            smooth: true,
          },
        ],
      };
      option && myChart.setOption(option);
      addEventListener("resize", () => {
        myChart.resize();
      });
    })();
  }, []);
  return (
    <Spin tip="Loading..." spinning={loading}>
      <div
        className="rounded py-6 mx-6 mt-6"
        style={{ border: "1px solid #333" }}
      >
        <div id="plot" className=" w-full" style={{ height: "80vh" }}></div>
      </div>
    </Spin>
  );
};
export default Home;
