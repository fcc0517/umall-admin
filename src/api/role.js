import http from './http'

// 添加角色
export const addRole = (data) => {
    return http.post('/roleadd',data)
}
// 获取角色列表
export const getRoleList = () => {
    return http.get('/rolelist')
}

// 修改角色
export const updateRole = (data) => {
    // 判断data中是否包含id属性
    // 判断一个对象中是否含有某个属性 Reflect.has
    if(!Reflect.has(data,'id') || data.id <=0){
        // console.log(data);
        return Promise.reject(new Error('缺少ID的参数或者ID参数错误'))
    }
    return http.post('/roleedit',data)
}
// 删除菜单
export const deleteRole = (id) => {
    return http.post('/roledelete',{id})
}