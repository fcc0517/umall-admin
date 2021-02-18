<template>
  <div>
    <!--
  普通数据表格
  data:  要显示的数据
  row-key:  循环的tr的key值 对应的菜单数据中的编号
  border 是否添加表格的边框
  default-expand-all 是否展开所有的数据
  tree-props:  下级数据的结构 {children(表格组件的属性): 'children(菜单数据对应的下级菜单)'}
-->
    <el-table
      :data="list"
      style="width: 100%;margin: 20px 0;"
      row-key="id"
      border
    >
      <!--
    el-table-column 表格的列组件
    prop:  菜单数据中对应的数据
    label:  表头
  -->
      <el-table-column prop="goodsname" label="名称"> </el-table-column>
      <el-table-column prop="price" label="本店价格"> </el-table-column>
      <el-table-column prop="market_price" label="市场价格"> </el-table-column>
      <el-table-column label="图片">
        <template #default="props">
          <img
            v-if="props.row.img !== ''"
            :src="props.row.img | recombination"
            height="80"
          />
        </template>
      </el-table-column>
      <el-table-column label="新品" width="60">
        <template #default="props">
          <el-tag v-if="props.row.isnew === 1">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="热卖" width="60">
        <template #default="props">
          <el-tag v-if="props.row.ishot === 1">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="60">
        <template #default="props">
          <el-tag v-if="props.row.status === 1">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="props">
          <el-button type="primary" size="mini" @click="onEdit(props.row)"
            ><i class="el-icon-edit"></i
          ></el-button>
          <el-button type="danger" size="mini" @click="onDelete(props.row)"
            ><i class="el-icon-delete"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
  分页组件
  layout 组件布局，子组件名用逗号分隔 sizes, prev, pager, next, jumper, ->, total, slot
  total: 总数量
  page-size: 每页的数量
  @current-change 当前页码发生改变时触发

  至少有2页时才显示分页组件
-->
    <el-pagination
      @current-change="onCurrentChange"
      class="page-container"
      :page-size="size"
      background
      layout="prev, pager, next"
      :total="total"
      v-if="total > size"
    >
    </el-pagination>
  </div>
</template>

<script>
import { deleteGoods } from "@/api/goods";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      list: state => state.goods.list, // 当前页的管理员列表数据
      size: state => state.goods.size, // 每页显示的数量
      page: state => state.goods.page, // 当前页
      total: state => state.goods.total // 管理员总数量
    })
  },
  mounted() {
    // 通过vuex分页获取管理员数据
    this.$store.dispatch("goods/getGoodsList");
    // 通过vuex获取管理员总数量
    this.$store.dispatch("goods/getGoodsTotal");
  },
  methods: {
    onCurrentChange(page) {
      // 更改vuex中的当前页
      this.$store.commit("goods/SET_PAGE", page);
      // 重新获取当前页的管理员数据
      this.$store.dispatch("goods/getGoodsList");
    },
    onEdit(data) {
      // 触发编辑按钮
      // 通知父组件显示编辑菜单的对话框，把当前要编辑的数据传递出去
      this.$emit("edit", data);
    },
    onDelete(data) {
      // element-ui的弹出框 this.$confirm(显示的信息[, 标题, 其他的配置项目])
      // 是一个Promise函数
      this.$confirm("确定要删除吗？", "提示", { type: "error" })
        .then(() => {
          // 做删除功能
          // 调用接口删除角色
          deleteGoods(data.id)
            .then(() => {
              this.$message.success({
                message: "删除成功",
                duration: 1000,
                onClose: () => {
                  // 重新获取总数量
                  this.$store.dispatch("goods/getGoodsTotal");
                  // 如果当前页的数据已经全部删除，就修改page
                  // 刷新列表数据之前，要删除的数据还没有变化
                  if (this.list.length === 1) {
                    let page = 0;
                    if (this.page === 1) {
                      page = 1;
                    } else {
                      page = this.page - 1;
                    }
                    this.$store.commit("goods/SET_PAGE", page);
                  }
                  // 刷新列表数据
                  this.$store.dispatch("goods/getGoodsList");
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
