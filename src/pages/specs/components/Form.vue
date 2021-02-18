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
      <el-form-item label="规格名称" prop="specsname">
        <el-input
          v-model.trim="form.specsname"
          placeholder="请输入规格名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格属性" v-for="(item,index) of attrList" :key="index">
        <div class="item-container">
          <el-input
            v-model.trim="item.value"
            placeholder="请输入规格名称"
          ></el-input>
          <el-button type="primary" v-if="index === 0" @click="addAttr">新增</el-button>
          <el-button type="danger" v-else @click="removeAttr(index)">删除</el-button>
        </div>
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
import { mapState } from "vuex";
// 引入接口的方法
import * as model from "@/api/specs";
const defaultData = {
  specsname: "", //规格名称
  attrs: "", //商品规格属性值
  status: 1 // 菜单的状态
};
export default {
  data() {
    return {
      title: "添加菜单", //对话框的标题
      dialogFormVisible: false,
      // 参照项目接口
      form: { ...defaultData }, //复制一份原始默认值
      rules: {
        // validator:checkRole 自定义验证
        specsname: [
          { required: true, message: "请输入规格名称", trigger: "blur" }
        ]
      },
      attrList:[{value:''}] //属性的数组
    };
  },
  mounted() {
    // 先获取服务器的数据
    if (this.roleList.length === 0) {
      //   console.log('menu list');
      this.$store.dispatch("role/getRoleList");
    }
  },
  computed: {
    ...mapState({
      roleList: state => state.role.list
    })
  },
  methods: {
    // 新增属性的方法
    addAttr(){
      this.attrList.push({ value:'' })
    },
    // 移除属性的方法
    removeAttr(index){
      this.attrList.splice(index,1)
    },
    editSpecs(method = "addSpecs") {
      this.form.attrs = this.attrList.filter(item => item.value !== '').map(item => item.value).join(',')
      // 规格属性不能为空
      if (this.form.attrs === '') {
        this.$message.error('请输入规格属性')
        return
      }
      model[method](this.form).then(() => {
        this.$message.success({
          duration: 1000,
          message: method === "addSpecs" ? "添加成功" : "修改成功",
          onClose: () => {
            // 关闭对话框，会自动触发关闭事件
            this.dialogFormVisible = false;
            // 添加的时候，需要重新获取一下总数
            if (method === "addSpecs") {
              this.$store.dispatch("specs/getSpecsTotal");
            }
            // // 刷新列表数据
            this.$store.dispatch("specs/getSpecsList");
          }
        });
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 处理菜单的添加(把表单的数据发送到接口)
          if (this.form.id && this.form.id > 0) {
            // 修改
            this.editSpecs("updateSpecs");
          } else {
            // 添加
            this.editSpecs();
            // console.log(this.form,this.attrList);
          }
        }
      });
    },
    clearForm() {
      // 恢复默认数据
      this.form = { ...defaultData };
      // 情况规格属性
      this.attrList = [{value : ''}]
      // 清空表单验证数据
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    // 修改时设置表单的数据
    setFormData(data) {
      if(data.attrs !== ''){
        this.attrList = data.attrs.map(item => ({value : item}))
      }
      this.form = { ...data };
    }
  }
};
</script>

<style scoped>
.item-container{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
