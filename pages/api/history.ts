import request from "../../utils/request"
export default async function handler(req: any, res: any) {
    const { address } = req.query;
    const data:any = await request({ url: "/history", params: { address } })
    res.status(200).json(data.result)
}