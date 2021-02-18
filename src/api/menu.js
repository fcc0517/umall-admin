import http from './http'
// 添加菜单
export const addMenu = (data) =>{
    return http.post('/menuadd',data)
}
// 修改菜单
export const updateMenu = (data) => {
    // 判断data中是否包含id属性
    // 判断一个对象中是否含有某个属性 Reflect.has
    if(!Reflect.has(data,'id') || data.id <=0){
        // console.log(data);
        return Promise.reject(new Error('缺少ID的参数或者ID参数错误'))
    }
    return http.post('/menuedit',data)
}
// 获取菜单数据 根据接口看需不需要参数  istree接口文档中
export const getMenuList = (istree = true) =>{
    let params = {}
    if(istree){
        params={
            istree:1
        }
    }
    return http.get('/menulist',{
        params
    })
}
// 删除菜单
export const deleteMenu = (id) => {
    return http.post('/menudelete',{id})
}