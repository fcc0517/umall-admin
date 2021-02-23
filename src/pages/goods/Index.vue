<template>
<div>
<el-button type="primary" plain size="small" @click="showAddForm">添加商品</el-button>
<u-form ref="form"/>
  <u-list @edit="showEditForm"/>
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
      // 显示菜单对话框
      this.$refs.form.dialogFormVisible = true
      // 修改对话框的标题
      this.$refs.form.title = '添加商品'
    },
    showEditForm (data) {
      // console.log(data)
      // 显示菜单对话框， 添加和修改使用的是同一个组件
      this.$refs.form.dialogFormVisible = true
      // 修改对话框的标题
      this.$refs.form.title = '修改商品'
      // 把要编辑的菜单的数据复制给对话框
      this.$refs.form.setFormData(data)
    }
  }
}
</script>
<style scoped>
</style>
