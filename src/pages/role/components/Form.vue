<template>
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
      <el-form-item label="角色名称" prop="rolename">
        <el-input
          v-model.trim="form.rolename"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择权限" prop="menus">
         <!-- 树形控件的数据就是菜单数据，获取菜单的数据 -->
         <!-- props节点控制 -->
         <!-- check-strictly 是否父子节点联动选择 -->
        <el-tree
        ref="tree"
         :data="menuList"
          show-checkbox
          node-key="id"
          :props="{children:'children',label:'title'}"
          default-expand-all
          :check-strictly='checkStrictly'
        >
        </el-tree>
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
// 从vuex里面拿到菜单数据
import {mapState} from 'vuex'
import * as model from '@/api/role'
// 设置默认的数据
const defaultData = {
  rolename: "", //角色名称
  menus: "",
  status: 1
};
export default {
  data() {
     const checkMeuns = (rule,value,callback) => {
      //   获取树形的结构节点
      // console.log(this.$refs.tree.getCheckedKeys(),this.$refs.tree.getHalfCheckedKeys());
      // 合并数据
      const selectMenus = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
      if(selectMenus.length === 0){
         // 没有选择任何菜单
         // 验证没通过，还原数据
         this.form.menus = ''
         callback(new Error('请选择权限'))
      }else{
         this.form.menus = selectMenus //把选择的全选赋值给表单数据
         callback()
      }
     }
    return {
      title: "", //对话框的标题
      dialogFormVisible: false, // 是否显示对话框
      form: { ...defaultData }, //复制一份默认数据
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        menus:[
           {validator:checkMeuns,trigger:'change'}
        ]
      },
      checkStrictly:false
    };
  },
//   判断是否加载过数据
  mounted(){
     if(this.menuList.length === 0){
        this.$store.dispatch('menu/getMenuList')
     }
  },
//   从vuex里面拿到之前的菜单数据，用mounted()判断是否已经获取
  computed:{
     ...mapState({
        menuList: state => state.menu.list
     })
  },
  methods: {
    clearForm() {
      // 清空树形控件
      this.$refs.tree.setCheckedKeys([])
      // 还原表单数据
      this.form = {...defaultData}
      // 清楚表单验证
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
         // 获取树形控件的数据
        if(valid){
          // 处理角色的添加(把表单的数据发送到接口)
          if(this.form.id || this.form.id > 0){
              // 修改
              this.editRole('updateRole')
          }else{
            // 添加
              this.editRole('addRole')
          } 
        }
      });
    },
    editRole(method = 'updateRole'){
       model[method](this.form).then(()=>{
        this.$message.success({
            duration: 1000,
            message: method == 'updateRole' ? "修改成功" :"添加成功",
            onClose: () => {
              // 关闭对话框，会自动触发关闭事件
              this.dialogFormVisible = false;
              // 刷新列表数据
              this.$store.dispatch("role/getRoleList");
            }
          });
      })
    },
    // 修改的时候设置表单的数据
    setFormData(data){
      this.form = {...data}
      // 给树型控件赋值
      // data.menus -->  "1,2,3,4,5" 要将字符串转化为数组
      const keys = data.menus.split(",")
      this.checkStrictly= true
      // console.log(keys);
      // this.$nextTick 是等待本次DOM完全渲染之后才会触发
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys) //参数必须是数组
        this.checkStrictly= false
      })
      
    }
  }
};
</script>

<style scoped></style>
