<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin: 20px 0"
      row-key="id"
      border
    >
      <!-- prop:表示菜单数据中对应的数据 label列的名称-->
      <el-table-column prop="username" label="账号"> </el-table-column>
      <el-table-column prop="rolename" label="角色"> </el-table-column>
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
          <!-- ID为1的时候不允许删除 -->
          <el-button
            type="danger"
            size="mini"
            @click="onDelete(props.row)"
            v-if="props.row.id > 1"
            ><i class="el-icon-edit"></i> 删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- total总数量  page-size每页的数量 -->
    <el-pagination
      class="page-container"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="onCurrentChange"
      v-if="total > size"
    >
    </el-pagination>
  </div>
</template>

<script>
import { deleteUser } from "@/api/user";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      list: state => state.user.list,
      size: state => state.user.size, //当前管理员列表数据
      page: state => state.user.page, //每页显示的数量
      total: state => state.user.total
    })
  },
  mounted() {
    //   通过vuex分页获取管理员数据
    this.$store.dispatch("user/getUserList");
    //   通过vuex分页获取总数量
    this.$store.dispatch("user/getUserTotal");
  },
  methods: {
    //   参数就是当前页数
    onCurrentChange(page) {
      console.log(page);
      // 根据不用的page切换不同的数据
      this.$store.commit("user/SET_PAGE", page);
      //   通过vuex分页获取管理员数据
      this.$store.dispatch("user/getUserList");
    },
    // 编辑
    onEdit(data) {
      this.$emit("edit", data);
    },
    onDelete(data) {
      // $comfirm是elementui的弹出框组件(显示的信息，标题，其他的配置项)
      this.$confirm("确定要删除吗", "提示", { type: "error" })
        .then(() => {
          // 删除功能
          // 调用接口，删除数据
          deleteUser(data.uid)
            .then(() => {
              //成功后，删除数据
              this.$message.success({
                message: "删除成功",
                duration: "1000",
                onClose: () => {
                  // 重新获取总数量
                  this.$store.dispatch("user/getUserTotal");
                  // 如果当前页的数据全部删除了，就修改page
                  if(this.list.length === 1){
                    let page = 0
                    if(this.page === 1){
                      page = 1
                    }else{
                      page = this.page -1 
                    }
                    this.$store.commit('user/SET_PAGE',page)
                  }
                  // 刷新数据
                  this.$store.dispatch("user/getUserList");
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

<style scoped>
.page-container {
  display: flex;
  justify-content: flex-end;
}
</style>
