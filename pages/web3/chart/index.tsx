import { Button, DatePicker, Select, Spin, AutoComplete, Tooltip } from "antd";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { formatCount,tags} from "../../../utils";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import * as echarts from "echarts";
import axios from "axios";
const Home = () => {
 
  const chartOptions = [
    {
      label: "Total assets",
      value: "total_asset",
      title: "Total assets",
    },
    {
      label: "Daily PnL",
      value: "daily_pnl",
      title: "Daily PnL",
    },
    {
      label: "Daily PnL Ratio",
      value: "pnl_ratio",
      title: "Daily PnL Ratio",
    },
    {
      label: "Daily Txns",
      value: "daily_txn",
      title: "Daily Txns",
    },
    {
      label: "Stable Coin",
      value: "stable_coin",
      title: "Stable Coin",
    },
  ];
  const titles: { [key: string]: string } = {
    total_asset: "Total Assets",
    daily_pnl: "Daily PnL",
    pnl_ratio: "Daily PnL Ratio",
    daily_txn: "Daily Txns",
    stable_coin: "Stable Coin",
  };
  const [data, setData] = useState<any[]>([]);
  const [tag, setTag] = useState("7D");
  const [date, setDate] = useState<[string, string]>([
    dayjs().subtract(7, "day").format("YYYY/MM/DD"),
    dayjs().format("YYYY/MM/DD"),
  ]);
  const [chartColum, setChartColum] = useState("total_asset");
  const [compareColum, setCompareColum] = useState("");
  const [account, setAccount] = useState([
    {
      address: "0xceb69f6342ece283b2f5c9088ff249b5d0ae66ea",
      active: true,
      id: 0,
    },
    // {
    //   address: "0x781229c7a798c33ec788520a6bbe12a79ed657fc",
    //   active: true,
    //   id: 2,
    // },
  ]);
  const [loading, setLoading] = useState(false);
  const plot = useRef(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      let data: any[] = await Promise.all(
        account.map(({ address }) =>
          axios({ url: "/api/history", params: { address } })
        )
      );
      setLoading(false);
      data = data.map(({ data }) =>
        Object.entries(data).map(
          ([key, value]: [key: string, value: any]) => ({ ...value, date: key })
        )
      );
      setData(data);
    })();
  }, [account]);
  useEffect(() => {
    var chartDom = plot.current as unknown as HTMLElement;
    var myChart = echarts.init(chartDom);
    const startDate = date[0];
    if (data.length > 0) {
      const times = data[0]
        .map(({ date }: { date: string }) => date)
        .filter((date: string) => new Date(date) >= new Date(startDate));
      let title = "";
      let yAxis = [];
      let series: any[] = [];
      if (chartColum && compareColum) {
        title = `${account
          .map(({ address }) => formatCount(address))
          .join("、")} ${titles[chartColum]} vs. ${titles[compareColum]}`;
        yAxis = [
          {
            type: "value",
            name: "",
            nameTextStyle: {
              align: "right",
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "",
            nameTextStyle: {
              align: "right",
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ];
        series = [
          ...data.map((item, index) => {
            return {
              name: `${formatCount(account[index].address)} ${
                titles[chartColum]
              }`,
              type: "line",
              data: item.map((serie: any) => parseFloat(serie[chartColum])),
              yAxisIndex: 0,
              symbol: "none",
              connectNulls: true,
              smooth: true,
            };
          }),
          ...data.map((item, index) => {
            return {
              name: `${formatCount(account[index].address)} ${
                titles[compareColum]
              }`,
              type: "line",
              data: item.map((serie: any) => parseFloat(serie[compareColum])),
              yAxisIndex: 1,
              symbol: "none",
              connectNulls: true,
              smooth: true,
            };
          }),
        ];
      } else {
        title = `${account
          .map(({ address }) => formatCount(address))
          .join("、")} ${titles[chartColum] || ""}  ${
          titles[compareColum] || ""
        }`;
        yAxis = [
          {
            type: "value",
            name: "",
            nameTextStyle: {
              align: "right",
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ];
        series = data.map((item, index) => {
          return {
            name: `${formatCount(account[index].address)} ${
              titles[chartColum || compareColum]
            }`,
            type: "line",
            data: item.map((serie: any) =>
              parseFloat(serie[chartColum || compareColum])
            ),
            yAxisIndex: 0,
            symbol: "none",
            connectNulls: true,
            smooth: true,
          };
        });
      }
      var option = {
        title: {
          text: title,
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
          top: "100px",
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
        yAxis,
        series,
      };
      myChart.setOption(option,true);
    }
    addEventListener("resize", () => {
      myChart.resize();
    });
    return () => {
      removeEventListener("resize", () => {});
    };
  }, [data, chartColum, compareColum, date]);
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
        return;
    }
  };
  return (
    <div
      className=" rounded pt-6 px-8 m-8 pb-12"
      style={{ border: "1px solid #333", boxSizing: "border-box" }}
    >
      <Spin spinning={loading}>
        <div className=" flex justify-between mb-3 mx-10">
          <div className=" flex text-center w-80 justify-between">
            {tags.map((item) => (
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
        <div ref={plot} style={{ height: "50vh" }}></div>
        <div className=" mt-10 ml-8 flex">
          <AutoComplete
            className=" w-40  mr-6"
            allowClear
            placeholder="Search"
            options={[]}
            onBlur={({ target }: { target: any }) => {
              const value = target.value;
              const values = account.map(({ address }) => address);
              if (!values.includes(value) && value) {
                setAccount([
                  ...account,
                  {
                    address: target.value,
                    id: account.length,
                    active: true,
                  },
                ]);
                sessionStorage.setItem('account',JSON.stringify([ ...account,
                  {
                    address: target.value,
                    id: account.length,
                    active: true,
                  },]))
              }
            }}
          ></AutoComplete>
          {account.map((count, index) => (
            <Button
              key={count.id}
              type="text"
              className=" mr-2 w-28 h-8 flex pr-2"
              style={{
                backgroundColor: count.active
                  ? "rgba(24, 144, 255, 1)"
                  : "#FFF",
                color: count.active ? "#FFF" : "#333",
              }}
              // onClick={() =>
              //   setAccount(
              //     account.map((item, Index) => ({
              //       ...item,
              //       active: Index === index ? !item.active : item.active,
              //     }))
              //   )
              // }
              icon={
                <div className=" flex items-center h-8 p-2 pb-4">
                  <div className=" mr-1">
                    <Tooltip title={count.address}>
                      {formatCount(count.address as string)}
                    </Tooltip>
                  </div>
                  <CloseOutlined
                    className=" ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccount(
                        account.filter((item, Index) => Index !== index)
                      );
                    }}
                  />
                </div>
              }
            ></Button>
          ))}
        </div>
        <div className="justify-between mt-10 px-8 md:flex">
          <div className=" flex items-center">
            <div>Chart:</div>
            <Select
              options={chartOptions.map((item) => ({
                ...item,
                disabled: item.value === compareColum ? true : false,
              }))}
              className=" w-80 ml-2"
              defaultValue={chartColum}
              placeholder="Avg. Transaction Value"
              onChange={(value) => setChartColum(value)}
              style={{ width: "330px" }}
            />
          </div>
          <div className=" flex  items-center">
            <div>Compare with:</div>
            <Select
              allowClear
              options={chartOptions.map((item) => ({
                ...item,
                disabled: item.value === chartColum ? true : false,
              }))}
              defaultValue={compareColum}
              className=" w-80 ml-2"
              style={{ width: "330px" }}
              onChange={(value) => {
                setCompareColum(value);
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};
export default Home;
