<template>
  <div>
   <el-button size="small" type="primary" plain @click = "showAddForm">添加活动</el-button>
   <u-list @edit = "showEditForm"/>
   <u-form ref = "form"/>
  </div>
</template>

<script>
import UList from './components/List'
import UForm from './components/Form'
export default {
  components: {
    UList,
    UForm
  },
  methods: {
    showAddForm () {
      // 显示对话框
      this.$refs.form.dialogFormVisible = true
      // 修改对话框的标题
      this.$refs.form.title = '添加限时秒杀'
    },
    showEditForm (data) {
      // console.log(data)
      // 显示菜单对话框
      this.$refs.form.dialogFormVisible = true
      // 修改对话框的标题
      this.$refs.form.title = '修改限时秒杀'
      // 把要编辑的菜单的数据复制给对话框
      this.$refs.form.setFormData(data)
    }
  }
}
</script>

<style scoped>
</style>
