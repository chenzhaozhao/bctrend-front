import { Button, Input, Table, Divider, Tooltip } from "antd";
import { PlusCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo, useCallback } from "react";
import request from "../../../utils/request";
import { formatCount } from "../../../utils";
import { useRouter } from "next/router";
import axios from "axios";
interface Count {
  count: string;
  isInput: boolean;
}
const Home = () => {
  //初始化counts
  const [counts, setCounts] = useState<Count[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([
    {
      id: "total_asset",
      title: "Total assets",
    },
    {
      id: "daily_pnl",
      title: "Daily PnL",
    },
    {
      id: "pnl_ratio",
      title: "Daily PnL Ratio",
    },
    {
      id: "daily_txn",
      title: "Daily Txns",
    },
    {
      id: "stable_coin",
      title: "Stable Coin",
    },
    {
      id: "days_activity",
      title: "7/30/90 Days Activity",
    },
  ]);
  const { query, push } = useRouter();
  const [loading,setLoading]=useState(false)
  const columns = useMemo(() => {
    const extendCo = counts
      .filter((item: Count) => item.count !== "")
      .map((item: Count) => ({
        title: (
          <Tooltip title={item.count}>
            <a
              className=" text-blue-400"
              href={`./chart?address=${item.count}`}
            >
              {formatCount(item.count)}
            </a>
          </Tooltip>
        ),
        key: item.count,
        align: "center",
        render: (Item: any) => (
          <span className=" text-black font-semibold ">
            {Item[item.count] || "0"}
          </span>
        ),
      }));
    return [
      {
        title: "Address",
        key: "title",
        align: "center",
        render: (item: any) => (
          <span className=" text-black font-semibold">{item.title}</span>
        ),
      },
      ...extendCo,
    ];
  }, [counts]);
  const addCount = useCallback(() => {
    if (counts.length < 5) {
      setCounts([...counts, { count: "", isInput: false }]);
    }
  }, [counts]);
  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data } = await axios({
        url: "/api",
        params: { address: query.counts },
      });
      setLoading(false)
      setCounts(data.map(({address}:{address:string}) => ({ count: address, isInput: false })))
      setDataSource(
        dataSource?.map((Item) => {
          let keys: { [key: string]: any } = {};
          data.map((item: any) => {
            if (!keys[item.address]) {
              keys[item.address] = item[Item.id] || 0;
            }
          });
          return { ...Item, ...keys };
        })
      );
    })();
  }, [query]);
  const getInfoByAddress = async ({ target }: { target: any }) => {
    if (target.value) {
      push({
        pathname: "./project",
        query: {
          counts: JSON.stringify([
            ...counts.map((item) => item.count),
            target.value,
          ]),
        },
      });
    }
  };
  const addCountByBlurOrEnter = useCallback(
    (e: any, index: number) => {
      setCounts(
        counts.map((item: Count, Index: number) => ({
          ...item,
          isInput: Index === index ? false : item.isInput,
          count: Index === index ? e.target.value : item.count,
        }))
      );
      getInfoByAddress(e);
    },
    [counts]
  );
  const deleteCount = useCallback(
    (e: any, index: number) => {
      e.stopPropagation();
      setCounts(counts.filter((item: Count, Index: number) => Index !== index));
      push({
        pathname: "./project",
        query: {
          counts: JSON.stringify(
            counts.filter((item: Count, Index: number) => Index !== index).map(item=>item.count)),
        },
      });
    },
    [counts]
  );
  return (
    <div
      className=" h-full py-8 px-8 mx-6 my-10 rounded-sm"
      style={{ border: "1px solid #333" }}
    >
      <div className=" w-full flex items-center">
        {counts.map((count: Count, index: number) => (
          <div className=" mr-2  w-40 h-8 flex items-center" key={index}>
            {count.isInput ? (
              <Input
                className=" w-40 mr-1"
                defaultValue={count.count}
                onPressEnter={(e) => addCountByBlurOrEnter(e, index)}
                onBlur={(e) => addCountByBlurOrEnter(e, index)}
                suffix={
                  <CloseOutlined onClick={(e) => deleteCount(e, index)} />
                }
              ></Input>
            ) : (
              <div
                className="h-8 w-40  flex items-center rounded-sm pl-2 relative"
                style={{ border: "1px solid #ccc" }}
                onClick={() =>
                  setCounts(
                    counts.map((item: Count, Index: number) => ({
                      ...item,
                      isInput: Index === index ? true : item.isInput,
                    }))
                  )
                }
              >
                {formatCount(count.count)}
                {counts.length !== 1 && (
                  <CloseOutlined
                    className=" absolute right-1"
                    onClick={(e) => deleteCount(e, index)}
                  />
                )}
              </div>
            )}
            <div className=" ml-1">
              {index !== counts.length - 1 ? "vs." : ""}
            </div>
          </div>
        ))}
        <Button
          shape="circle"
          icon={<PlusCircleOutlined />}
          size="small"
          className=" text-xl flex justify-center items-center border-0  ml-1"
          onClick={addCount}
          disabled={counts.length === 5 ? true : false}
        ></Button>
      </div>
      <Divider />
      <div>
        <Table
          dataSource={dataSource}
          // @ts-ignore
          columns={columns}
          pagination={false}
          tableLayout="fixed"
          loading={loading}
          rowKey="id"
        />
      </div>
    </div>
  );
};
export default Home;
