<template>
   <div>
      <el-button type="primary" plain size="medium" @click="showAddForm">添加角色</el-button>
      <u-form ref="form"/>
      <u-list @edit="showEditForm" />
   </div>
</template>
 

<script>
import UList from './components/List'
import UForm from './components/Form'
export default {
   components:{
      UList,
      UForm
   },
   methods:{
      showAddForm(){
         this.$refs.form.dialogFormVisible = true
         // 重新赋值
         this.$refs.form.title = '添加角色'
      },
      showEditForm(data){
         console.log(data);
         // 先显示对话框
         this.$refs.form.dialogFormVisible = true
         // 修改对话框的标题，显示为修改菜单，因为用的是同一个组件
         this.$refs.form.title = '修改角色'
         // console.log(this.$refs.form);
         this.$refs.form.setFormData(data)
      }
   }
}
</script>

<style  scoped>

</style>