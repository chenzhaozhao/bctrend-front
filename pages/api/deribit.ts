import request from "../../utils/request"
export default async function handler(req: any, res: any) {
    const { start_time, func } = req.query;
    const data: any = await request({ url: "/deribit?", params: { func, start_time } });
    // const data = await Promise.all([request({ url: "/deribit?",params:{func:"openinterest",start_time} }),
    // request({ url: "/deribit",params:{func:"24hrvolume",start_time} }),
    // request({ url: "/deribit",params:{func:"price_btceth",start_time} }),])
    res.status(200).json(data.result)
}