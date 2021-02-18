<template>
   <div>
      <el-button type="primary" plain size="medium" @click="showAddUpdate">添加菜单</el-button>
      <u-form ref="form"/>
      <u-list @edit="showEditMenu"  />
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
      showAddUpdate(){
         this.$refs.form.dialogFormVisible = true
         // 重新赋值
         this.$refs.form.title = '添加菜单'
      },
      showEditMenu(data){
         // console.log(data);
         // 先显示对话框
         this.$refs.form.dialogFormVisible = true
         // 修改对话框的标题，显示为修改菜单，因为用的是同一个组件
         this.$refs.form.title = '修改菜单'
         console.log(this.$refs.form);
         this.$refs.form.form = {...data}
      }
   }
}
</script>

<style  scoped>

</style>