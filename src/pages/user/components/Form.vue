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
      <el-form-item label="选择角色" prop="roleid">
        <el-select v-model="form.roleid" placeholder="请选择">
          <!--v-model 和 value是全等比较  :value="0"-->
          <el-option label="请选择角色" :value="0"></el-option>
          <!-- 循环角色信息 -->
          <el-option
            v-for="item of roleList"
            :key="item.id"
            :label="item.rolename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input
          v-model.trim="form.username"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          show-password
          v-model="form.password"
          :placeholder="form.id > 0 ? '不填代表不修改密码' : '请输入密码'"
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
import { mapState } from "vuex";
// 引入接口的方法
import * as model from "@/api/user";
const defaultData = {
  roleid: 0, //角色编号
  username: "", //账号
  password: "", //密码 添加的时候必填，修改不一定要填
  status: 1 // 菜单的状态
};
export default {
  data() {
    // 账号自定义验证规则
    const checkRole = (rule, value, callback) => {
      // 如果是菜单的时候，链接就是必填
      // 值不为0，就代表已经选择了角色
      if (value === 0) {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    // 密码的自定义验证
    const checkPassword = (rule, value, callback) => {
      if (this.form.id > 0) {
        callback();
      } else {
        if (value === "") {
          callback(new Error("请输入密码"));
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
        // validator:checkRole 自定义验证
        roleid: [{ validator: checkRole, trigger: "change" }],
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }]
      }
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
    editUser(method = "addUser") {
      model[method](this.form).then(() => {
        this.$message.success({
          duration: 1000,
          message: method === "addUser" ? "添加成功" : "修改成功",
          onClose: () => {
            // 关闭对话框，会自动触发关闭事件
            this.dialogFormVisible = false;
            // 添加的时候，需要重新获取一下总数
            if(method === "addUser"){
              this.$store.dispatch("user/getUserTotal");
            }
            // 刷新列表数据
            this.$store.dispatch("user/getUserList");
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
            this.editUser("updateUser");
          } else {
            // 添加
            this.editUser("addUser");
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
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    // 修改时设置表单的数据
    setFormData(data) {
      // 修改的时候要清空密码
      const editData = { ...data };
      editData.password = "";
      this.form = editData;
    }
  }
};
</script>

<style scoped></style>
