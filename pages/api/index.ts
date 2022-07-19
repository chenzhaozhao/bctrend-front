import request from "../../utils/request"
export default async function handler(req: any, res: any) {
   const address=JSON.parse(req.query.address||'["0xceb69f6342ece283b2f5c9088ff249b5d0ae66ea"]').filter((str:string)=>str)
   const data=await Promise.all(address.map((str:string)=>request({url:'/',params:{address:str}})))
    res.status(200).json(data.map((item: any,index:number) => ({...item.result,address:address[index]})))
}