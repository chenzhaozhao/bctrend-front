import request from "../../utils/request"
export default async function handler(req: any, res: any) {
    const data = await Promise.all([request({ url: "/deribit?func=openinterest" }),
    request({ url: "/deribit?func=24hrvolume" }),
    request({ url: "/deribit?func=price_btceth" }),])
    res.status(200).json(data.map((item: any) => item.result))
}