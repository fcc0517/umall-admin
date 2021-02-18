import http from './http'
// 获取轮播图列表
export const getBannerList = () =>{
    return http.get('/bannerlist')
}

// 轮播图删除
export const deleteBanner = (id) =>{
    return http.post('/bannerdelete',{id})
}

// 添加轮播图
export const addBanner = (data) => {
    return http.post('/banneradd',data,{
        headers: {
            'content-type': 'multipart/form-data'
          }
    })
}
// 修改轮播图
export const updateBanner = (data) => {
    // 判断data中否包含id属性且大于0
    if (!data.get('id')) {
      return Promise.reject(new Error('缺少ID参数或ID参数错误'))
    }
    return http.post('/banneredit', data)
  }