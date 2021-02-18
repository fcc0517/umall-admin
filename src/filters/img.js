// 处理图片的过滤器
import Vue from 'vue'
// 注册全局过滤器 
// 重组图片的路径
Vue.filter('recombination',(imgSrc) => {
    // 判断图片的路径是否为远程路径
    if(!/^(https?:\/\/).*/.test(imgSrc)){
        return 'http://localhost:3000'+ imgSrc
    }else{
        return imgSrc
    }
})