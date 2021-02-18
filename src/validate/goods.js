export default {
    first_cateid(value){
        value = parseInt(value)
        if(value === 0){
            return '请选择一级分类'
        }
        return true
    },
    second_cateid(value){
        value = parseInt(value)
        if(value === 0){
            return '请选择二级分类'
        }
        return true
    },
    goodsname(value){
        return value === ''?'请输入商品名称' : true
    },
    price(value){
        // 因为value传过来是个字符串，要转化为数字验证
        // value = 1* value
        if(!value){
            return '请输入本店价格'
        }
        if(isNaN(value)){
            return '本店价格必须是数字'
        }
        if(value < 0){
            return '本店价格有误，请重新输入'
        }
        return true
    },
    market_price(value){
        // 因为value传过来是个字符串，要转化为数字验证
        // value = 1* value
        if(!value){
            return '请输入市场价格'
        }
        if(isNaN(value)){
            return '市场价格必须是数字'
        }
        if(value < 0){
            return '市场价格有误，请重新输入'
        }
        return true
    },
    img(value){
        if(!value){
            return '请上传图片'
        }
        return true
    },
    description(value){
        return value === ''?'请输入商品详情' : true
    },
    specsid(value){
        value = parseInt(value)
        if(value === 0){
            return '请选择商品规格'
        }
        return true
    },
    specsattr(value){
        return value === ''?'请输入规格属性' : true
    },
}