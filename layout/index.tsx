import Head from "next/head";
import { Menu } from "antd";
import { useRouter} from "next/router";
import {
  FireOutlined,
  GlobalOutlined,
  LineChartOutlined,
  TableOutlined,
  CreditCardOutlined
} from "@ant-design/icons";
import { useEffect,useState} from "react";
const Layout = ({ children }: { children: any }) => {
  const items = [
    {
      label: "Ranking",
      key: "ranking",
      url: "/",
      icon: <FireOutlined />,
    },
    {
      label: "Web2.0",
      key: "web2",
      icon: <GlobalOutlined />,
      children: [
        {
          label:'Deribit',
          key:"deribit",
          url:"/deribit",
          icon:<CreditCardOutlined />
        },
        {
          label: "Chart",
          key: "chart2",
          url: "/web2/chart",
          icon: <LineChartOutlined />,
        },
        {
          label: "Project",
          key: "project2",
          url: "/web2/project",
          icon: <TableOutlined />,
        }
      ],
    },
    {
      label: "Web3.0",
      key: "web3",
      icon: <GlobalOutlined />,
      children: [
        {
          label: "Chart",
          key: "chart3",
          url: "/web3/chart",
          icon: <LineChartOutlined />,
        },
        {
          label: "Project",
          key: "project3",
          url: "/web3/project",
          icon: <TableOutlined />,
        },
      ],
    },
  ];
  const [keys,setKeys]=useState<string[]>([])
  const urlAndKey:{[key:string]:string} = {
    "/web2/chart": "chart2",
    "/web2/project": "project2",
    "/web3/chart": "chart3",
    "/web3/project": "project3",
    "/deribit":"deribit"
  };
  const router = useRouter();
  useEffect(() => {
    if(router.route){
      setKeys([urlAndKey[router.route]||'ranking'])
    }
    
  }, [router.route]);
  const jumpURL = ({ item }: { item: any }) => {
    const { props } = item;
    if (props.url) {
      router.push(props.url);
    }
  };
  return (
    <>
      <Head>
        <title>BCtrend</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main
        className=" w-full  h-full pt-4"
        style={{ paddingTop: "20px", paddingRight: "16px" }}
        id="layout"
      >
        <Menu
          items={items}
          onSelect={jumpURL}
          mode="horizontal"
          className="w-full"
          selectedKeys={keys}
        />
        <div className="w-full  h-full">{children}</div>
      </main>
    </>
  );
};

export default Layout;
