import { ApiRequest } from '../../utils/request';
export default async function handler(req: any, res: any) {
    const { address } = req.query
    // @ts-ignore
    const { result } = await ApiRequest({ url: `/`, params: { address }, method: "GET" })
    res.status(200).json(result)
}