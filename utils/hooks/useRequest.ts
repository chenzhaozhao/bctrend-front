import axios from "axios";
import { useEffect, useState } from "react";
interface Props {
    url: string, method: string, data?: any, params?: any
}
const useRequest = ({ url, method, data, params }: Props) => {
    const [result, setResult] = useState<any>([])
    useEffect(() => {
        (async () => {
            const res = await axios({
                baseURL: "http://81.68.236.10:10086",
                url,
                method,
                data,
                params,
                headers: {
                    Authorization: 'edfibheiaufh2308jebf4rvi'
                }
            })
            setResult(res.data)
        })()
    }, [data, params])

    return { result }
}


export default useRequest;