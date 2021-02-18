import http from "./http";
// 登录接口设置
export const login = (username, password) => {
  if (!username || !password) {
    return Promise.reject(new Error("账号或密码为空"));
  }
  return http.post("/userlogin", {
    username,
    password
  });
};

// 添加管理员
export const addUser = data => {
  return http.post("/useradd", data);
};

/*
   @ 分页获取管理员数据
   @param page number 当前的页码
   @param size number 每页获取的数量  需要先赋值默认值
   @return Promise
*/
export const getPageUser = (page = 1, size = 10) => {
    return http.get('/userlist',{
        params:{
            page,
            size
        }
    })
};


/* 获取管理员总数量 */
export const getUserTotal = () => {
    return http.get('/usercount')
}

//修改管理员
export const updateUser = (data) => {
  // 判断data中是否包含id属性
  // 判断一个对象中是否含有某个属性 Reflect.has
  if(!Reflect.has(data,'id') || data.id <=0){
      // console.log(data);
      return Promise.reject(new Error('缺少ID的参数或者ID参数错误'))
  }
  return http.post('/useredit',data)
}

// 删除管理员
export const deleteUser = (uid) => {
  return http.post('/userdelete',{uid})
}