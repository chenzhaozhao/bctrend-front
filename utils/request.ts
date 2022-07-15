import axios from "axios";
const cancelToken = axios.CancelToken
const source = cancelToken.source()
const request = axios.create(
    {
        baseURL: 'http://81.68.236.10:10086',
        // timeout: 1000,
        // `withCredentials` 表示跨域请求时是否需要使用凭证
        withCredentials: false, // default
        // cancelToken: source.token,
        headers: {
            Authorization: 'edfibheiaufh2308jebf4rvi'
        }
    }
)
request.interceptors.response.use(function ({data}) {
    return data
}, function (error) {
    return error
})
// source.cancel('user cancel')
export default request;