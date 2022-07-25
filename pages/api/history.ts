import request from "../../utils/request"
export default async function handler(req: any, res: any) {
    try {
        const { address } = req.query;
        const data: any = await request({ url: "/history", params: { address } })
        res.status(200).json(data.result)
    } catch {
        res.status(500).json('serve error')
    }

}