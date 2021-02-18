import http from './http'

export const addCategory = (data) => {
    // 有数据上传的，需要设置请求头
    return http.post('/cateadd',data,{
        headers:{
            'Content-type':'multipart/from-data'
        }
    })
}
// 获取分类数据 根据接口看需不需要参数  istree接口文档中
export const getCategoryList = (istree = true) =>{
    let params = {}
    if(istree){
        params={
            istree:1
        }
    }
    return http.get('catelist',{
        params
    })
}

// 修改商品
export const updateCategory = (data) => {
    // 判断data中是否包含id属性
    // 因为data是通过new FormData()获取的
    if(!data.get('id')){
        // console.log(data);
        return Promise.reject(new Error('缺少ID的参数或者ID参数错误'))
    }
    return http.post('/cateedit',data)
}
// 删除商品
export const deleteCategory = (id) => {
    return http.post('/catedelete',{id})
}