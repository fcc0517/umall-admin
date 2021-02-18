<template>
  <el-table
    :data="list"
    style="width: 100%; margin: 20px 0"
    row-key="id"
    border
  >
    <!-- prop:表示菜单数据中对应的数据 label列的名称-->
    <el-table-column prop="rolename" label="名称"> </el-table-column>
    <el-table-column label="状态">
      <template #default="props">
        <el-tag v-if="props.row.status === 1">正常</el-tag>
        <el-tag v-else type="danger">禁用</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="操作">
      <template #default="props">
        <el-button type="primary" size="mini" @click="onEdit(props.row)"
          ><i class="el-icon-edit"></i> 编辑</el-button
        >
        <el-button type="danger" size="mini" @click="onDelete(props.row)"
          ><i class="el-icon-edit"></i> 删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from "vuex";
import { deleteRole } from "@/api/role";
export default {
  computed: {
    // 获取vuex里面的数据，把数据传给list
    ...mapState({
      list: state => state.role.list
    })
  },
  mounted() {
    // 先获取服务器的数据
    if (this.list.length === 0) {
      //   console.log('menu list');
      this.$store.dispatch("role/getRoleList");
    }
  },
  methods: {
    // 编辑
    onEdit(data) {
      this.$emit("edit", data);
    },
    onDelete(data) {
      // $comfirm是elementui的弹出框组件(显示的信息，标题，其他的配置项)
      this.$confirm("确定要删除吗", "提示", {type: "error"})
        .then(() => {
          // 删除功能
          // 调用接口，删除数据
          deleteRole(data.id)
            .then(() => {
              //成功后，删除数据
              this.$message.success({
                message: "删除成功",
                duration: "1000",
                onClose: () => {
                  // 刷新数据
                  this.$store.dispatch("role/getRoleList");
                }
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped></style>
