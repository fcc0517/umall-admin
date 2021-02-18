import http from './http'
// 添加规格
export const addSpecs = (data) =>{
    return http.post('/specsadd',data)
}
// 修改规格
export const updateSpecs = (data) => {
    // 判断data中是否包含id属性
    // 判断一个对象中是否含有某个属性 Reflect.has
    if(!Reflect.has(data,'id') || data.id <=0){
        // console.log(data);
        return Promise.reject(new Error('缺少ID的参数或者ID参数错误'))
    }
    return http.post('/specsedit',data)
}

// 删除菜单
export const deleteSpecs = (id) => {
    return http.post('/specsdelete',{id})
}

/*
   @ 分页获取规格数据
   @param page number 当前的页码
   @param size number 每页获取的数量  需要先赋值默认值
   @return Promise
*/
export const getPageSpecs = (page = 1, size = 10) => {
    return http.get('/specslist',{
        params:{
            page,
            size
        }
    })
};


/* 获取规格总数量 */
export const getSpecsTotal = () => {
    return http.get('/specscount')
}