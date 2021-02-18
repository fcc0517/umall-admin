<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin: 20px 0"
      row-key="id"
      border
    >
      <!-- prop:表示菜单数据中对应的数据 label列的名称-->
      <el-table-column prop="title" label="轮播图标题"> </el-table-column>
      <el-table-column label="图片">
        <template #default="props">
          <img
            :src="props.row.img | recombination"
            v-if="props.row.img !== ''"
            width="180"
            height="80"
          />
        </template>
      </el-table-column>
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
            ><i class="el-icon-edit"></i>删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deleteBanner } from "@/api/banner";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      list: state => state.banner.list
    })
  },
  mounted() {
    if (this.list.length === 0) {
      this.$store.dispatch("banner/getBannerList");
    }
  },
  methods: {
    // 编辑
    onEdit(data) {
      this.$emit("edit", data);
    },
    onDelete(data) {
      console.log(data);
      // $comfirm是elementui的弹出框组件(显示的信息，标题，其他的配置项)
      this.$confirm("确定要删除吗", "提示", { type: "error" })
        .then(() => {
          // 删除功能
          // 调用接口，删除数据
          deleteBanner(data.id)
            .then(() => {
              //成功后，删除数据
              this.$message.success({
                message: "删除成功",
                duration: "1000",
                onClose: () => {
                  // 关闭对话框
                  this.dialogFormVisible = false;
                  // 刷新数据
                  this.$store.dispatch("banner/getBannerList");
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
