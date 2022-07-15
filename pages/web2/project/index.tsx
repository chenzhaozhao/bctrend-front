import { Table, Divider, AutoComplete, Spin } from "antd";
import { useState, useMemo, useEffect } from "react";
const Project = ({ data }: { data: any }) => {
  const titles = [
    {
      title: "Number of transactions in blockchain per day",
      btc: "btc_num_of_transactions_in_blockchain_per_day",
      etc: "eth_num_of_transactions_in_blockchain_per_day",
    },
    {
      title: "Average block size",
      btc: "btc_avr_block_size",
      etc: "eth_avr_block_size",
    },
    {
      title: '"Number of unique addresses per day',
      btc: "btc_num_of_uniq_address_per_day",
      etc: "eth_num_of_uniq_address_per_day",
    },
    {
      title: "Average mining difficulty per day",
      btc: "btc_avr_mining_difficulty_per_day",
      etc: "eth_avr_mining_difficulty_per_day",
    },
    {
      title: "Average hashrate per day",
      btc: "btc_hashrate",
      etc: "eth_hashrate",
    },
    { title: "Average price,per day, USD", btc: "btc_price", etc: "eth_price" },
    {
      title: "Mining Profitability",
      btc: "btc_mining_profitability",
      etc: "eth_mining_profitability",
    },
    {
      title: "Sent coins in USD per day",
      btc: "btc_sentinusd",
      etc: "eth_sentinusd",
    },
    {
      title: "Average transaction fee, USD",
      btc: "btc_transactionfees",
      etc: "eth_transactionfees",
    },
    {
      title: "Median transaction fee, USD",
      btc: "btc_median_transaction_fee",
      etc: "eth_median_transaction_fee",
    },
    {
      title: "Average block time (minutes)",
      btc: "btc_confirmationtime",
      etc: "eth_confirmationtime",
    },
    {
      title: "Market Capitalization, USD",
      btc: "btc_marketcap",
      etc: "eth_marketcap",
    },
    {
      title: "Avg. Transaction Value, USD",
      btc: "btc_transactionvalue",
      etc: "eth_transactionvalue",
    },
    {
      title: "Median transaction value, USD",
      btc: "btc_mediantransactionvalue",
      etc: "eth_mediantransactionvalue",
    },
    { title: "Tweets per day", btc: "btc_tweets", etc: "eth_tweets" },
    {
      title: "Google Trends to “Bitcoin”@ 2012-01-01",
      btc: "btc_google_trends",
      etc: "eth_google_trends",
    },
    {
      title: "Number of actived addresses per day",
      btc: "btc_activeaddresses",
      etc: "eth_activeaddresses",
    },
    {
      title: "Top 100 Richest Addresses to Total coins%",
      btc: "btc_top100cap",
      etc: "",
    },
    {
      title: "Average Fee Percentage in Total Block Reward",
      btc: "btc_fee_to_reward",
      etc: "eth_fee_to_reward",
    },
  ];
  const [counts, setCounts] = useState<string[]>(["Bitcoin", "Ethereum"]);
  const [loading] = useState(false);
  const onChange = (data: string, Index: number) =>
    setCounts(counts.map((count, index) => (index === Index ? data : count)));
  const columns = useMemo(() => {
    const calCounts = counts
      .filter((count) => count !== "" && count !== undefined)
      .map((count) => ({
        title: <div className=" text-gray-600  font-normal">{count}</div>,
        dataIndex: count === "Bitcoin" ? "btc" : "etc",
        key: count === "Bitcoin" ? "btc" : "etc",
      }));
    return [
      {
        title: "Project",
        key: "title",
        render: (item: any) => (
          <span className=" text-black font-semibold">{item.title}</span>
        ),
      },
      ...calCounts,
    ];
  }, [counts]);
  const dataSource = useMemo(() => {
    let result: { [key: string]: any } = {};
    data.map((item: any) => {
      if (!result[item[0]]) {
        result[item[0]] = Number(item[2]) || 0;
      }
      return null;
    });

    return titles.map(({ title, btc, etc }) => ({
      title,
      key: title,
      btc: result[btc],
      etc: result[etc],
    }));
  }, [data]);
  return (
    <div
      className=" w-full h-full  rounded-sm p-5 m-8"
      style={{ border: "1px solid #333" }}
    >
      <Spin spinning={loading}>
        <div className=" w-full flex items-center">
          {counts.map((count: string, index: number) => (
            <div className=" mr-2" key={index}>
              <AutoComplete
                options={[]}
                style={{ width: 180 }}
                onChange={(e) => onChange(e, index)}
                allowClear
                defaultValue={count}
                className=" mr-2"
                disabled
              />
              {index !== counts.length - 1 ? "VS." : ""}
            </div>
          ))}
        </div>
        <Divider />
        <div>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            tableLayout="fixed"
          />
        </div>
      </Spin>
    </div>
  );
};

export async function getStaticProps(context: any) {
  let data = [];
  try {
    data = await fetch("http://43.129.181.196/bitinforchartsnewdata").then(
      (res) => res.json()
    );
  } catch (error) {}
  return {
    props: { data },
  };
}

export default Project;
