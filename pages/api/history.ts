import request from "../../utils/request"
export default async function handler(req: any, res: any) {
   const {address}=req.query;
   const data=await Promise.all(address.map((str:string)=>request({url:'/',params:{address:str}})))
    res.status(200).json(data)
}