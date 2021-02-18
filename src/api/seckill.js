import http from "./http";
// 限时秒杀添加
export const addSeckill = data => {
    return http.post("/seckadd", data);
};

// 获取秒杀数据 
export const getSeckillList = () => {
    return http.get("/secklist");
};

// 修改秒杀
export const updateSeckill = data => {
    // 判断data中是否包含id属性
    if (!Reflect.has(data, 'id') || data.id <= 0) {
        // console.log(data);
        return Promise.reject(new Error("缺少ID的参数或者ID参数错误"));
    }
    return http.post("/seckedit", data);
};
// 删除商品
export const deleteSeckill = id => {
    return http.post("/seckdelete", { id });
};
