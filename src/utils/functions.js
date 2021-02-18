// 公共的函数库
// data数据   rules规则
export const validate = (data,rules) => {
    for (const k in data) {
        if (Reflect.has(rules, k)) {
          // rules[k]如果有这个验证的函数调用，把数据带进去
          let v = rules[k](data[k]);
          if (v !== true) {
            return v;
          }
        }
      }
      return true;
}