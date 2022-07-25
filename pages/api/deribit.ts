import request from "../../utils/request";
import dayjs from "dayjs";

export default async function handler(req: any, res: any) {
    try {
        const { start_time, func } = req.query;
        let data: any = await request({ url: "/deribit", params: { func, start_time } });
        // openinterest
        // 24hrvolume
        // price_btceth
        //数据过滤 15分钟
        data = data.result.filter(({ time }: { time: string }) => Number(dayjs(time).format("mm")) % 15 === 0).map((item: any) => ({ ...item, time: dayjs(item.time).format('YYYY-MM-DD HH:mm') }));
        let result: { [key: string]: any } = {}
        if (func === "openinterest") {
            result.times = data.map(({ time }: { time: string }) => time);
            result.ratio = data.map(({ ratio }: { ratio: string }) => parseFloat(ratio));
        }
        if (func === "24hrvolume") {
            result.times = data.map(({ time }: { time: string }) => time);
            result.ratio1 = data.map(({ ratio1 }: { ratio1: string }) => parseFloat(ratio1));
            result.ratio2 = data.map(({ ratio2 }: { ratio2: string }) => parseFloat(ratio2));
        }
        if (func === "price_btceth") {
            result.times = data.map(({ time }: { time: string }) => time);
            result.btc = data.map(({ btc }: { btc: string }) => parseFloat(btc));
        }

        res.status(200).json(result)
    } catch {
        res.status(500).json('server error')
    }

}