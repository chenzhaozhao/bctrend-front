import type { NextPage } from "next";
import { Button, DatePicker, Select, Spin } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import moment from "moment";
const BaseURL = "http://43.129.181.196";
const Home: NextPage = () => {
  const tags = ["7D", "1M", "3M", "6M", "1Y", "ALL"];
  const chartOptions = [
    {
      label: "Number of transactions in blockchain per day",
      value: "1",
      title: "Number of Transactions",
    },
    { label: "Average block size", value: "2", title: "Avg. Block Size" },
    {
      label: "Number of unique addresses per day",
      value: "3",
      title: "Number of Unique Addresses",
    },
    {
      label: "Average mining difficulty per day",
      value: "4",
      title: "Avg. Mining difficulty",
    },
    {
      label: "Average hashrate per day",
      value: "5",
      title: "Avg. Mining difficulty",
    },
    { label: "Average price,per day, USD", value: "6", title: "Avg. Price" },
    {
      label: "Mining Profitability",
      value: "7",
      title: "Mining Profitability",
    },
    {
      label: "Sent coins in USD per day",
      value: "8",
      title: "Sent Coins in USD",
    },
    {
      label: "Average transaction fee, USD",
      value: "9",
      title: "Avg. Transaction Fee",
    },
    {
      label: "Median transaction fee, USD",
      value: "10",
      title: "Median Transaction Fee,",
    },
    {
      label: "Average block time (minutes)",
      value: "11",
      title: "Avg. Block Time",
    },
    {
      label: "Market Capitalization, USD",
      value: "12",
      title: "Market Capitalization",
    },
    {
      label: "Avg. Transaction Value, USD",
      value: "13",
      title: "Avg. Transaction Value",
    },
    {
      label: "Median transaction value, USD",
      value: "14",
      title: "Median Transaction Value",
    },
    { label: "Tweets per day", value: "15", title: "Tweets Per Day" },
    {
      label: "Google Trends to “Bitcoin”@ 2012-01-01",
      value: "16",
      title: "Google Trends",
    },
    {
      label: "Number of actived addresses per day",
      value: "17",
      title: "Number of Actived addresses",
    },
    {
      label: "Top 100 Richest Addresses to Total coins%",
      value: "18",
      title: "Top 100 Richest Addresses",
    },
    {
      label: "Average Fee Percentage in Total Block Reward",
      value: "19",
      title: "Fee Percentage in Total Block Reward",
    },
  ];
  const urls: { [key: string]: any } = {
    1: {
      btc: "btc_num_of_transactions_in_blockchain_per_day",
      etc: "eth_num_of_transactions_in_blockchain_per_day",
    },
    2: {
      btc: "btc_avr_block_size",
      etc: "eth_avr_block_size",
    },
    3: {
      btc: "btc_num_of_uniq_address_per_day",
      etc: "eth_num_of_uniq_address_per_day",
    },
    4: {
      btc: "btc_avr_mining_difficulty_per_day",
      etc: "eth_avr_mining_difficulty_per_day",
    },
    5: {
      btc: "btc_hashrate",
      etc: "eth_hashrate",
    },
    6: {
      btc: "btc_price",
      etc: "eth_price",
    },
    7: {
      btc: "btc_mining_profitability",
      etc: "eth_mining_profitability",
    },
    8: {
      btc: "btc_sentinusd",
      etc: "eth_sentinusd",
    },
    9: {
      btc: "btc_transactionfees",
      etc: "eth_transactionfees",
    },
    10: {
      btc: "btc_median_transaction_fee",
      etc: "eth_median_transaction_fee",
    },
    11: {
      btc: "btc_confirmationtime",
      etc: "eth_confirmationtime",
    },
    12: {
      btc: "btc_marketcap",
      etc: "eth_marketcap",
    },
    13: {
      btc: "btc_transactionvalue",
      etc: "eth_transactionvalue",
    },
    14: {
      btc: "btc_mediantransactionvalue",
      etc: "eth_mediantransactionvalue",
    },
    15: {
      btc: "btc_tweets",
      etc: "eth_tweets",
    },
    16: {
      btc: "btc_google_trends",
      etc: "eth_google_trends",
    },
    17: {
      btc: "btc_activeaddresses",
      etc: "eth_activeaddresses",
    },
    18: {
      btc: "btc_top100cap",
      etc: "",
    },
    19: {
      btc: "btc_fee_to_reward",
      etc: "eth_fee_to_reward",
    },
  };
  const [data, setData] = useState<any[]>([]);
  const [tag, setTag] = useState("1Y");
  const [title, setTitle] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<[string, string]>([
    dayjs().subtract(1, "years").format("YYYY/MM/DD"),
    dayjs().format("YYYY/MM/DD"),
  ]);
  const [chartColum, setChartColum] = useState("1");
  const [compareColum, setCompareColum] = useState("");
  const [types, setTypes] = useState(["BTC"]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let queue = [];
        if (types.includes("BTC")) {
          if (chartColum) {
            queue.push({
              type: 1,
              url: urls[chartColum].btc,
            });
          }
          if (compareColum) {
            queue.push({
              type: 3,
              url: urls[compareColum].btc,
            });
          }
        }
        if (types.includes("ETH")) {
          if (chartColum) {
            queue.push({
              type: 2,
              url: urls[chartColum].etc,
            });
          }
          if (compareColum) {
            queue.push({
              type: 4,
              url: urls[compareColum].etc,
            });
          }
        }
        console.log(queue);
        let allData = await Promise.all(
          queue.map((item) =>
            fetch(`${BaseURL}/${item.url}`).then((res) => res.json())
          )
        );
        const [startTime, endTime] = date;
        queue = queue.map((item, index) => ({
          ...item,
          data: allData[index].filter(
            ([date]: [date: string]) =>
              date >= (startTime || "1900/01/01") &&
              date <= (endTime || dayjs().format("YYYY/MM/DD"))
          ),
        }));
        //统计过滤后的总数
        queue = queue.map((item) => ({
          ...item,
          total: (
            item.data.reduce(
              (pre: any, next: any) => pre + (Number(next[1]) || 0),
              0
            ) / 1000
          ).toFixed(1),
        }));
        //数据维度分类
        const title1 = chartOptions[Number(chartColum) - 1]?.title || "";
        const title2 = chartOptions[Number(compareColum) - 1]?.title || "";
        setTitle(
          `${
            types.length === 2
              ? "Bitcoin, Ethereum"
              : types.includes("BTC")
              ? "Bitcoin"
              : "Ethereum"
          } ${title1} ${title1 && title2 && "vs."} ${title2}  historical char`
        );
        queue = queue.map((item) => ({
          ...item,
          data: item.data.map(([date, value]: [string, string]) => ({
            date,
            value: Number(value) || 0,
            type: `${item.type === 1 || item.type == 3 ? "BTC" : "ETH"} ${
              item.type === 1 || item.type == 2 ? title1 : title2
            } : ${item.total}k`,
          })),
        }));
        setData(queue.map((item) => item.data).flat());
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [date, chartColum, types, compareColum]);

  const config = {
    data,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      type: "time",
      nice: true,
      tickCount: 20,
    },
    smooth: true,
    // label:{
    //   autoHide:true
    // }
  };
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
        return setDate(["", ""]);
    }
  };
  return (
    <div
      className="h-full p-4 px-9 pb-44 m-8"
      style={{ border: "1px solid #333" }}
    >
      <Spin spinning={loading}>
        <div className=" text-center w-full text-xl mb-3">{title}</div>
        <div className=" flex justify-between mb-3">
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
              //@ts-ignore
              value={date.map((item) => moment(item))}
              onChange={(e: any) =>
                setDate([
                  dayjs(e[0] as unknown as string).format("YYYY/MM/DD"),
                  dayjs(e[1] as unknown as string).format("YYYY/MM/DD"),
                ])
              }
            />
          </div>
        </div>
        <div className=" mt-8 ml-8">
          <Button
            type="text"
            className=" mr-2"
            style={{
              backgroundColor: types.includes("BTC")
                ? "rgba(24, 144, 255, 1)"
                : "#FFF",
              color: types.includes("BTC") ? "#FFF" : "#333",
            }}
            onClick={() =>
              types.includes("BTC")
                ? setTypes(types.filter((type) => type !== "BTC"))
                : setTypes([...types, "BTC"])
            }
          >
            BTC
          </Button>
          <Button
            type="text"
            style={{
              backgroundColor: types.includes("ETH")
                ? "rgba(24, 144, 255, 1)"
                : "#FFF",
              color: types.includes("ETH") ? "#FFF" : "#333",
            }}
            onClick={() =>
              types.includes("ETH")
                ? setTypes(types.filter((type) => type !== "ETH"))
                : setTypes([...types, "ETH"])
            }
          >
            ETH
          </Button>
        </div>
        <div className=" flex justify-between mt-10 px-8">
          <div className=" flex items-center">
            <div>Chart:</div>
            <Select
              options={chartOptions}
              className=" w-96 ml-2"
              defaultValue={chartColum}
              placeholder="Avg. Transaction Value"
              onChange={(value) => setChartColum(value)}
              style={{ width: "330px" }}
            />
          </div>
          <div className=" flex  items-center">
            <div>Compare with:</div>
            <Select
              options={chartOptions}
              defaultValue={compareColum}
              className=" w-96 ml-2"
              placeholder="Sent in USD"
              style={{ width: "330px" }}
              onChange={(value) => setCompareColum(value)}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Home;
