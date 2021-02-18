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
      <el-form-item
        :label="form.type === 1 ? '目录名称' : '菜单名称'"
        prop="title"
      >
        <el-input v-model.trim="form.title" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单">
        <el-select v-model="form.pid" placeholder="请选择">
          <!--v-model 和 value是全等比较  :value="0"-->
          <el-option label="顶级菜单" :value="0"></el-option>
          <el-option
            v-for="item of firstMenuList"
            :key="item.id"
            :label="'|-' + item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <!-- 单选框组 -->
        <el-radio-group v-model="form.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="form.type === 1 ? '目录图标' : '菜单图标'">
        <el-input
          v-model="form.icon"
          placeholder="请输入图标的样式名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜单链接" v-show="form.type === 2" prop="url">
        <el-input
          v-model.trim="form.url"
          placeholder="请输入菜单链接"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="2">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
// 引入接口的方法
import * as model from "@/api/menu";
const defaultData = {
  pid: 0, //上次菜单的编号，顶级菜单就是0
  title: "", //菜单的名称
  icon: "", //菜单的图标
  type: 1, // 菜单的类型 1目录2菜单
  url: "", //菜单的链接
  status: 1 // 菜单的状态
};
export default {
  data() {
    // 自定义验证规则
    const checkUrl = (rule, value, callback) => {
      // 如果是菜单的时候，链接就是必填
      // this.form.type === 1 验证是目录，就是直接通过
      if (this.form.type === 1) {
        callback();
      } else {
        // 如果输入为空
        if (value === "") {
          callback(new Error("请输入菜单的链接"));
        } else {
          callback();
        }
      }
    };
    return {
      title: "添加菜单", //对话框的标题
      dialogFormVisible: false,
      // 参照项目接口
      form: { ...defaultData }, //复制一份原始默认值
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        url: [
          // validator验证器
          { validator: checkUrl, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      firstMenuList: "menu/firstMenuList"
    })
  },
  methods: {
    editMenu(method = 'updateMenu'){
       model[method](this.form).then(()=>{
        this.$message.success({
            duration: 1000,
            message: method == 'updateMenu' ? "修改成功" :"添加成功",
            onClose: () => {
              // 关闭对话框，会自动触发关闭事件
              this.dialogFormVisible = false;
              // 刷新列表数据
              this.$store.dispatch("menu/getMenuList");
            }
          });
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 处理菜单的添加(把表单的数据发送到接口)
          if(this.form.id && this.form.id > 0){
              // 修改
              this.editMenu('updateMenu')
          }else{
            // 添加
              this.editMenu('addMenu')
          } 
          
        }
      });
    },
    // updateMenu(){
    //   updateMenu(this.form).then(()=>{
    //     this.$message.success({
    //         duration: 1000,
    //         message: "修改成功",
    //         onClose: () => {
    //           // 关闭对话框，会自动触发关闭事件
    //           this.dialogFormVisible = false;
    //           // 刷新列表数据
    //           this.$store.dispatch("menu/getMenuList");
    //         }
    //       });
    //   })
    // },
    // addMenu() {
    //   addMenu(this.form)
    //     .then(() => {
    //       this.$message.success({
    //         duration: 1000,
    //         message: "添加成功",
    //         onClose: () => {
    //           // 关闭对话框，会自动触发关闭事件
    //           this.dialogFormVisible = false;
    //           // 刷新列表数据
    //           this.$store.dispatch("menu/getMenuList");
    //         }
    //       });
    //     })
    //     .catch(err => {
    //       this.$message.error(err.message);
    //     });
    // },
    clearForm() {
      // 恢复默认数据
      this.form = { ...defaultData };
      // 清空表单验证数据
      this.$refs.form.clearValidate();
    }
  }
};
</script>

<style scoped></style>
