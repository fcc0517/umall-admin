import http from './http'
// 添加商品
export const addGoods = (data) =>{
    // 有数据上传的，需要设置请求头
    return http.post('/goodsadd',data,{
        headers:{
            'Content-type':'multipart/from-data'
        }
    })
}
// 修改商品
export const updateGoods = (data) => {
    // 判断data中是否包含id属性
    // 因为data是通过new FormData()获取的
    if(!data.get('id')){
        // console.log(data);
        return Promise.reject(new Error('缺少ID的参数或者ID参数错误'))
    }
    return http.post('/goodsedit',data,{
        headers:{
            'Content-type':'multipart/from-data'
        }
    })
}

// 删除商品
export const deleteGoods = (id) => {
    return http.post('/goodsdelete',{id})
}

/*
   @ 分页获取规格数据
   @param page number 当前的页码
   @param size number 每页获取的数量  需要先赋值默认值
   @return Promise
*/
export const getPageGoods = (page = 1, size = 10) => {
    return http.get('/goodslist',{
        params:{
            page,
            size
        }
    })
};


/* 获取规格总数量 */
export const getGoodsTotal = () => {
    return http.get('/goodscount')
}