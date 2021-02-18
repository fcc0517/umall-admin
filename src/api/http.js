import axios from 'axios'
// 创建axios实例,不要污染全局的axios的对象
const http = axios.create({
    baseURL:'/api', //会在所有的axios请求上面添加/api
    timeout:5000  //什么时候超时
})
// 拦截
// 响应拦截
http.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log('响应拦截',response);
    // response就是返回回来的数据
    response = response.data
    if(response.code === 200){
        return response.list || null
    }else{
        // Promise.reject(Error对象)
        return Promise.reject(new Error(response.msg));
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 请求失败
    return Promise.reject(error);
  });
export default http