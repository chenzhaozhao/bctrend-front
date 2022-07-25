import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Spin, DatePicker } from "antd";
import * as echarts from "echarts";
import { sortRule, tags } from "../../utils";
import moment from "moment";
const Home = () => {
  const [loading, setLoading] = useState(false);
  const plot = useRef(null);
  const [tag, setTag] = useState("7D");
  const [date, setDate] = useState<[string, string]>([
    dayjs().subtract(7, "day").format("YYYY/MM/DD"),
    dayjs().format("YYYY/MM/DD"),
  ]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      var chartDom = plot.current as unknown as HTMLElement;
      var myChart = echarts.init(chartDom);
      const start_time = dayjs(date[0]).format("YYYY-MM-DD/HH:mm");
      const url = "/api/deribit";
       let dataSource:any[] = await Promise.all([
        axios({
          url,
          params: {
            start_time,
            func: "openinterest",
          },
        }),
        axios({
          url,
          params: {
            start_time,
            func: "24hrvolume",
          },
        }),
        axios({
          url,
          params: {
            start_time,
            func: "price_btceth",
          },
        }),
      ]);
      dataSource=dataSource.map(({data})=>data)
      setLoading(false);
      //所有数据
      let [data, data1, data2] = dataSource;
      // x轴上时间集合
      let times:string[]=[]
      for(let i=0;i<data.times.length;i++){
        if(data1.times.includes(data.times[i]) &&data2.times.includes(data.times[i])){
          times.push(data.times[i])
        }
      }
      times=Array.from(new Set(times.sort(sortRule)));
      // const dealData = (times: string[], data: any[], key: string) => {
      //   return times.map((time) => {
      //     const raTime: string[] = data
      //       .map(({ time, ratio }: { time: string; ratio: string }) => ({
      //         time: dayjs(time).format("YYYY-MM-DD HH:mm"),
      //         ratio,
      //       }))
      //       .map(({ time }: { time: string }) => time);
      //     const Index = raTime.indexOf(time as string);
      //     let value: number = null as unknown as number;
      //     if (Index >= 0) {
      //       value = parseFloat(data[Index][key] || "");
      //     }
      //     return value;
      //   });
      // };
      const {ratio} = data;
      const {ratio1,ratio2} = data1;
      const {btc} = data2;
     
      var option;
      const ratioMin = Math.min(
        ...[...ratio, ...ratio1, ...ratio2].filter((num) => num)
      );
      const priceMin = Math.min(...btc.filter((num:number) => num));
      const ratioMax = Math.max(
        ...[...ratio, ...ratio1, ...ratio2].filter((num) => num)
      );
      const priceMax = Math.max(...btc.filter((num:number) => num));
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
            yAxisIndex:[0,1],
            start: 0, // 滚动条的起始位置（10%）
            end: 100, // 滚动条的
            filterMode:"filter"
          },
          {
            type: "inside",
            show: true,
            xAxisIndex: [0],
            yAxisIndex:[0,1],
            start: 0, // 滚动条的起始位置（10%）
            end: 100, // 滚动条的
            filterMode:"filter"
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
      option && myChart.setOption(option, true);
      addEventListener("resize", () => {
        myChart.resize();
      });
      removeEventListener("resize", () => {});
    })();
  }, [date]);
  const changeDate = (tag: string) => {
    setTag(tag);
    const now = dayjs().format("YYYY/MM/DD");
    switch (tag) {
      case "7D":
        return setDate([dayjs().subtract(7, "d").format("YYYY/MM/DD"), now]);
      case "1M":
        return setDate([dayjs().subtract(30, "d").format("YYYY/MM/DD"), now]);
      case "3M":
        return setDate([dayjs().subtract(90, "d").format("YYYY/MM/DD"), now]);
      case "6M":
        return setDate([dayjs().subtract(180, "d").format("YYYY/MM/DD"), now]);
      case "1Y":
        return setDate([
          dayjs().subtract(1, "years").format("YYYY/MM/DD"),
          now,
        ]);
      default:
        return  setDate([
          dayjs().subtract(2, "years").format("YYYY/MM/DD"),
          now,
        ]);;
    }
  };
  return (
    <Spin tip="Loading..." spinning={loading}>
      <div
        className="rounded py-6 mx-6 mt-6"
        style={{ border: "1px solid #333" }}
      >
        <div className=" flex justify-between mb-1 mx-10">
          <div className=" flex text-center w-80 justify-between">
            {tags?.map((item) => (
              <div
                className=" w-10 rounded-sm flex justify-center items-center"
                style={{
                  background: item === tag ? "#1890ff" : "#fff",
                  color: item === tag ? "#fff" : "#333",
                }}
                key={item}
                onClick={() => changeDate(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <div>
            <DatePicker.RangePicker
              value={[moment(date[0]), moment(date[1])]}
              onChange={(e: any) =>
                setDate([
                  dayjs(e[0] as unknown as string).format("YYYY/MM/DD"),
                  dayjs(e[1] as unknown as string).format("YYYY/MM/DD"),
                ])
              }
            />
          </div>
        </div>
        <div
          id="plot"
          className=" w-full"
          style={{ height: "80vh" }}
          ref={plot}
        ></div>
      </div>
    </Spin>
  );
};
export default Home;
