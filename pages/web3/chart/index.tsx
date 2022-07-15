import { Button, DatePicker, Select, Spin, AutoComplete, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { Line, DualAxes } from "@ant-design/plots";
import dayjs from "dayjs";
import { formatCount } from "../../../utils";
import { CloseOutlined } from "@ant-design/icons";
import request from "../../../utils/request";
import { useRouter } from "next/router";
import moment from "moment";
const Home = () => {
  const tags = ["7D", "1M", "3M", "6M", "1Y", "All"];
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
  const [tag, setTag] = useState("1Y");
  const [title, setTitle] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<[string, string]>([
    dayjs().subtract(1, "years").format("YYYY/MM/DD"),
    dayjs().format("YYYY/MM/DD"),
  ]);
  const [chartColum, setChartColum] = useState("total_asset");
  const [compareColum, setCompareColum] = useState("");
  const { query } = useRouter();
  const [counts, setCounts] = useState<any[]>([]);
  const [range, setRange] = useState({ min: 0, max: 100 });
  const [otherRange, setOtherRange] = useState({ min: 0, max: 100 });
  useEffect(() => {
    if (query.address) {
      setCounts([{ address: query.address, id: 1, active: true }]);
    } else {
      setCounts([
        ...JSON.parse(sessionStorage.getItem('counts')||'[{"address":"0x781229c7a798c33ec788520a6bbe12a79ed657fc","id":1,"active":true}]')
        // {
        //   address: "0x260ee8f2b0c167e0cd6119b2df923fd061dc1093",
        //   id: 2,
        //   active: true,
        // },
        // {
        //   address: "0xceb69f6342ece283b2f5c9088ff249b5d0ae66ea",
        //   id: 3,
        //   active: true,
        // }
      ]);
    }
  }, [query.address]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await Promise.all(
        counts
          .filter(({ active }) => active === true)
          .map(({ address }) =>
            request({ url: `/history`, params: { address }, method: "GET" })
          )
      );
      let DATA = results
        //  @ts-ignore
        .map(({ result }, index: number) =>
          Object.entries(result).map(
            ([date, item]: [date: string, item: any]) => ({
              date,
              ...item,
              address: counts.filter(({ active }) => active === true)[index]
                .address,
            })
          )
        )
        .flat()
        .sort(
          (a: any, b: any) =>
            (new Date(a.date) as unknown as number) -
            (new Date(b.date) as unknown as number)
        );
      setLoading(false);
      const titleAccount = counts
        .map((count) => formatCount(count.address))
        .join(",");
      if (chartColum && compareColum) {
        setTitle(
          `${titleAccount} ${titles[chartColum]} vs. ${titles[compareColum]}`
        );
        const data1 = DATA.map((item: any) => ({
          date: item.date,
          value: parseFloat(item[chartColum as string]) || 0,
          type: `${formatCount(item.address)} ${titles[chartColum]}`,
        }));
        const data2 = DATA.map((item: any) => ({
          date: item.date,
          count: parseFloat(item[compareColum as string]) || 0,
          type: `${formatCount(item.address)} ${titles[compareColum]}`,
        }));
        const values1 = data1.map(({ value }) => value);
        const values2 = data2.map(({ count }) => count);
        setRange({ min: Math.min(...values1), max: Math.max(...values1) });
        setOtherRange({ min: Math.min(...values2), max: Math.max(...values2) });
        return setData([data1, data2]);
      }
      if (chartColum) {
        setTitle(`${titleAccount} ${titles[chartColum]} historical chart`);
        let resultData = DATA.map((item: any) => ({
          date: item.date,
          value: parseFloat(item[chartColum as string]) || 0,
          type: `${formatCount(item.address)} ${titles[chartColum]}`,
        }));
        const values = resultData.map(({ value }) => value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        setRange({ min, max });
        return setData(resultData);
      }
      if (compareColum) {
        setTitle(`${titleAccount} ${titles[compareColum]} historical chart`);
        let resultData = DATA.map((item: any) => ({
          date: item.date,
          value: parseFloat(item[compareColum as string]) || 0,
          type: `${formatCount(item.address)} ${titles[compareColum]}`,
        }));
        const values = resultData.map(({ value }) => value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        setRange({ min, max });
        return setData(resultData);
      }
    })();
  }, [chartColum, compareColum, counts]);
  const config = {
    data,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      nice: true,
      tickCount: 20,
    },
    yAxis: {
      min: range.min,
      max: range.max,
    },
    // smooth: true,
    height: 550,
    autoFit: false,
    slider:{
      start:0,
      end:1000
    }
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
        return;
    }
  };
  return (
    <div
      className=" h-full p-4 px-9 pb-8 m-8"
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
        {chartColum && compareColum ? (
          <DualAxes
            data={data}
            xField="date"
            yField={["value", "count"]}
            geometryOptions={[
              {
                geometry: "line",
                seriesField: "type",
                ...range,
              },
              {
                geometry: "line",
                seriesField: "type",
                ...otherRange,
              },
            ]}
            height={550}
            autoFit={false}
          />
        ) : (
          <Line {...config}></Line>
        )}
        <div className=" mt-8 ml-8 flex">
          <AutoComplete
            className=" w-40  mr-6"
            allowClear
            placeholder="Search"
            options={[]}
            onBlur={({ target }: { target: any }) => {
              const value = target.value;
              const values = counts.map(({ address }) => address);
              if (!values.includes(value) && value) {
                sessionStorage.setItem(
                  "counts",
                  JSON.stringify([
                    ...counts,
                    { address: target.value, id: counts.length, active: true },
                  ])
                );
                setCounts([
                  ...counts,
                  { address: target.value, id: counts.length, active: true },
                ]);
              }
            }}
          ></AutoComplete>
          {counts.map((count, index) => (
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
              onClick={() =>
                setCounts(
                  counts.map((item, Index) => ({
                    ...item,
                    active: Index === index ? !item.active : item.active,
                  }))
                )
              }
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
                      sessionStorage.setItem('counts',JSON.stringify(counts.filter((item, Index) => Index !== index)))
                      setCounts(
                        counts.filter((item, Index) => Index !== index)
                      );
                    }}
                  />
                </div>
              }
            ></Button>
          ))}
        </div>
        <div className=" flex justify-between mt-10 px-8">
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
              onChange={(value) => setCompareColum(value)}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Home;
