<template>
  <!-- el-dialog弹出对话框  
        visible显示 -->
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    @close="clearForm"
  >
    <el-form
      :model="form"
      ref="form"
      label-suffix=":"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item label="活动名称" prop="title">
        <el-input
          v-model.trim="form.title"
          placeholder="请输入活动名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动期限">
        <el-date-picker
          v-model="createTime"
          type="daterange"
          align="left"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="一级分类" prop="first_cateid">
        <el-select
          v-model="form.first_cateid"
          placeholder="请选择一级分类"
          @change="onChangeFirstCategory"
        >
          <!-- 循环一级分类 -->
          <el-option label="请选择一级分类" :value="0"></el-option>
          <el-option
            v-for="item in firstCategoryList"
            :key="item.id"
            :label="item.catename"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" prop="second_cateid">
        <el-select
          v-model="form.second_cateid"
          placeholder="请选择二级分类"
          @change="onChangeSecondCategory"
        >
          <!-- 循环二级分类 -->
          <el-option label="请选择二级分类" :value="0"></el-option>
          <el-option
            v-for="item in secondCategoryList"
            :key="item.id"
            :label="item.catename"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品" prop="goodsid">
        <el-select v-model="form.goodsid" placeholder="请选择商品">
          <el-option label="请选择商品" :value="0"></el-option>
          <!-- 循环商品分类 -->
          <el-option
            v-for="item in selectedGoodsList"
            :key="item.id"
            :label="item.goodsname"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="2">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添 加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
// 引入接口的方法
import * as model from "@/api/seckill";
const defaultData = {
  title: "", //限时秒杀名称
  begintime: "", //开始时间
  endtime: "", //结束时间
  first_cateid: 0, //商品一级分类编号
  second_cateid: 0, //商品二级分类编号
  goodsid: 0, //商品编号
  status: 1 // 菜单的状态
};
export default {
  data() {
    // 自定义验证
    const checkFirstCate = (rule, value, callback) => {
      // 值为0，就不允许通过
      if (value === 0) {
        callback(new Error("请选择一级分类"));
      } else {
        callback();
      }
    };
    const checkSecondCate = (rule, value, callback) => {
      // 值为0，就不允许通过
      if (value === 0) {
        callback(new Error("请选择二级分类"));
      } else {
        callback();
      }
    };
    const checkGoods = (rule, value, callback) => {
      // 值为0，就不允许通过
      if (value === 0) {
        callback(new Error("请选择商品"));
      } else {
        callback();
      }
    };
    return {
      title: "", //对话框的标题
      dialogFormVisible: false,
      form: { ...defaultData }, //复制一份原始默认值
      createTime: [], //存放时间数据的数组
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        first_cateid: [{ validator: checkFirstCate, trigger: "change" }],
        second_cateid: [{ validator: checkSecondCate, trigger: "change" }],
        goodsid: [{ validator: checkGoods, trigger: "change" }]
      },
      secondCategoryList: [], // 二级分类数据
      selectedGoodsList: [] // 商品列表数据
    };
  },
  computed: {
    // 获取一级分类
    ...mapGetters({
      firstCategoryList: "category/firstCategoryList"
    }),
    ...mapState({
      // 获取分类列表
      categoryList: state => state.category.list,
      // 获取商品列表
      goodsList: state => state.goods.allList
    })
  },
  mounted() {
    // 如果没有一级分类信息, 则重新获取信息
    if (this.categoryList.length === 0) {
      this.$store.dispatch("category/getCategoryList");
    }
    if (this.goodsList.length === 0) {
      this.$store.dispatch("goods/getAllGoods");
    }
  },
  methods: {
    changeTime() {
      // console.log(this.form,this.createTime);
      // 获取到开启关闭的时间戳
      this.form.begintime = this.createTime[0].getTime();
      this.form.endtime = this.createTime[1].getTime();
      // console.log(this.form.begintime, this.form.endtime);
      let curTime = new Date().getTime();
      // console.log(curTime);
      // 如果结束时间还未到当前时间，则启用
      if (this.form.endtime > curTime) {
        this.form.status = 1;
      } else {
        this.form.status = 0;
        this.$message.error("结束时间选择错误");
      }
      // console.log(this.form.status);
    },
    onChangeFirstCategory(id) {
      // 清空二级分类的id
      this.form.second_cateid = 0;
      // 清空商品的id
      this.form.goodsid = 0;
      // 如果id大于0
      if (id > 0) {
        const category = this.categoryList.find(item => item.id === id);
        this.secondCategoryList = category.children || [];
      } else {
        this.secondCategoryList = [];
      }
    },
    onChangeSecondCategory(id) {
      // console.log(id)
      // 清空商品列表
      this.form.goodsid = 0;
      if (id > 0) {
        this.selectedGoodsList = this.goodsList.filter(
          item => item.second_cateid === id
        );
      } else {
        this.selectedGoodsList = [];
      }
    },
    clearForm() {
      // 恢复默认数据
      this.form = { ...defaultData };
      this.createTime = [];
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    // 修改时设置表单的数据
    setFormData(data) {
      console.log(data);
      // console.log(data.begintime, data.endtime);
      let begin = parseFloat(data.begintime);
      let end = parseFloat(data.endtime);
      // console.log(begin, end);
      this.form = { ...data }; //复制一份数据
      // begin = new Date(begin).toLocaleString();
      // end = new Date(end).toLocaleString();
      // console.log(begin, end);
      this.createTime.push(begin);
      this.createTime.push(end);
      // console.log(this.createTime);
      // 根据商品的一级分类设置二级分类的数据
      const category = this.categoryList.find(
        item => item.id === data.first_cateid
      );
      this.secondCategoryList = category.children || [];
      // 根据商品的二级分类设置商品数据
      this.selectedGoodsList = this.goodsList.filter(
        item => item.second_cateid === data.second_cateid
      );
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 根据form数据中是否有id属性来判断当前是修改菜单还是添加菜单
          if (this.form.id && this.form.id > 0) {
            // 修改
            this.editBanner("updateSeckill");
          } else {
            // 添加
            this.editBanner();
            // console.log(this.form);
          }
        }
      });
    },
    editBanner(method = "addSeckill") {
      model[method](this.form)
        .then(() => {
          // 修改成功
          // 显示添加成功的信息
          this.$message.success({
            message: method === "addSeckill" ? "添加成功" : "修改成功",
            duration: 1000,
            onClose: () => {
              // 关闭对话框(一旦对话框关闭就会自动触发对话框的close事件)
              this.dialogFormVisible = false;
              // 刷新列表数据
              this.$store.dispatch("seckill/getSeckillList");
            }
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style scoped>
.item-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.hide /deep/ .el-upload {
  display: none !important;
}
</style>
