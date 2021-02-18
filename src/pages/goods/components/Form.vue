<template>
  <!--
  el-dialog: 弹出对话框组件
  title: 对话框的标题
  visible: 是否显示
-->
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    @close="clearForm"
    width="80%"
    top="5vh"
  >
    <el-form :model="form" ref="form" label-width="120px" label-suffix="：">
      <el-tabs v-model="activeName">
        <!--基本信息 start-->
        <el-tab-pane label="基本信息" name="base">
          <el-form-item label="一级分类">
            <el-select
              v-model="form.first_cateid"
              placeholder="请选择"
              @change="onChangeCategory"
            >
              <!-- 当value和v-model的值相等的时候就选中 value和v-model是全等比较-->
              <el-option label="请选择一级分类" :value="0"></el-option>
              <!--循环一级分类-->
              <el-option
                v-for="item of firstCategoryList"
                :key="item.id"
                :label="item.catename"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类">
            <el-select v-model="form.second_cateid" placeholder="请选择">
              <!-- 当value和v-model的值相等的时候就选中 value和v-model是全等比较-->
              <el-option label="请选择二级分类" :value="0"></el-option>
              <!--循环一级分类-->
              <el-option
                v-for="item of secondCategoryList"
                :key="item.id"
                :label="item.catename"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsname">
            <el-input
              v-model.trim="form.goodsname"
              placeholder="请输入商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="本店价格" prop="price">
            <el-input
              v-model.trim="form.price"
              placeholder="请输入本店价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="市场价格" prop="market_price">
            <el-input
              v-model.trim="form.market_price"
              placeholder="请输入市场价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品规格">
            <el-select
              v-model="form.specsid"
              placeholder="请选择"
              @change="onChangeSpecs"
            >
              <!-- 当value和v-model的值相等的时候就选中 value和v-model是全等比较-->
              <el-option label="请选择商品规格" :value="0"></el-option>
              <!--循环一级分类-->
              <el-option
                v-for="item of specsList"
                :key="item.id"
                :label="item.specsname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格属性">
            <el-select v-model="form.specsattr" placeholder="请选择">
              <!-- 当value和v-model的值相等的时候就选中 value和v-model是全等比较-->
              <el-option label="请选择规格属性" value=""></el-option>
              <!--循环一级分类-->
              <el-option
                v-for="item of attrList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <!--商品图片 start-->
        <el-tab-pane label="商品图片" name="img">
          <el-form-item label="上传图片">
            <!--
          上传图片
          action: 上传的地址(api的地址)
          list-type: 文件列表的类型  text/picture/picture-card
          auto-upload:  是否自动上传
          limit 允许上传的文件的最大数量
          on-change 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        -->
            <el-upload
              :class="{ hide: hideUploadBtn }"
              action="#"
              :limit="imgLimit"
              :file-list="fileList"
              accept="image/png,image/gif,image/jpeg"
              list-type="picture-card"
              :on-change="changeImg"
              :auto-upload="false"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <!--预览的小图-->
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <!--预览大图片的按钮-->
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <!--删除图片的按钮-->
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <!--
          展示大图片的对话框
          append-to-body: 是否挂载在body上
        -->
            <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <!--修改的时候且有图片时显示商品图片-->
          <el-form-item
            label="商品图片"
            v-if="form.id > 0 && editDefaultImg !== ''"
          >
            <el-image
              style="width: 148px; height: 148px"
              fit="fill"
              :src="editDefaultImg | recombination"
            />
          </el-form-item>
        </el-tab-pane>
        <!--促销信息 start-->
        <el-tab-pane label="促销信息" name="promote">
          <el-form-item label="新品">
            <el-switch
              v-model="form.isnew"
              :active-value="1"
              :inactive-value="2"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="热卖">
            <el-switch
              v-model="form.ishot"
              :active-value="1"
              :inactive-value="2"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="2"
            >
            </el-switch>
          </el-form-item>
        </el-tab-pane>
        <!--商品详情 start-->
        <el-tab-pane label="商品详情" name="detail">
          <!--
        富文本
        id: 创建编辑器的唯一标识(必填)
        :disabledMenus="['location', 'insertcode','video']"
      -->
          <vue-wangeditor
            ref="editor"
            :disabledMenus="['location', 'insertcode', 'video']"
            id="editor"
            width="100%"
            height="340"
            :value="form.description"
          ></vue-wangeditor>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import vueWangeditor from "vue-wangeditor";
import { mapGetters, mapState } from "vuex";
import goodsRules from "@/validate/goods";
import { validate } from "@/utils/functions";
// 引入接口方法
// 导出所有的非default的内容
import * as model from "@/api/goods";

const defaultData = {
  first_cateid: 0, // 1级分类ID(必填)
  second_cateid: 0, // 2级分类ID(必填)
  goodsname: "", // 商品名称(必填)
  price: "", // 商品价格(必填)
  market_price: "", // 市场价格(必填)
  img: "", // 商品图片(添加时必填)
  description: "", // 商品详情(必填)
  specsid: 0, // 规格ID(必填)
  specsattr: "", // 规格属性(必填)
  isnew: 1, // 是否新品 1-是 2-否
  ishot: 1, // 是否热卖推荐 1-是 2-否
  status: 1 // 状态 1正常2禁用
};
export default {
  components: {
    vueWangeditor
  },
  data() {
    return {
      dialogFormVisible: false,
      title: "", // 对话框的标题
      activeName: "base", // 标签页选中的名称
      form: { ...defaultData }, // 复制一份默认数据
      secondCategoryList: [], // 二级分类数据
      attrList: [], // 规格的属性数据
      imgLimit: 1, // 单次允许上传的文件最大数量
      fileList: [], // 选择的文件列表
      dialogVisible: false, // 是否展示大图片
      dialogImageUrl: "", // 大图片的地址
      hideUploadBtn: false, // 是否隐藏选择图片的按钮
      editDefaultImg: "" // 存储修改传入的图片
    };
  },
  computed: {
    ...mapState({
      categoryList: state => state.category.list, // 获取分类列表
      specsList: state => state.specs.allList // 获取所有的规格
    }),
    ...mapGetters({
      // 获取一级分类
      firstCategoryList: "category/firstCategoryList"
    })
  },
  mounted() {
    // 如果没有分类数据，重新获取分类数据
    if (this.categoryList.length === 0) {
      this.$store.dispatch("category/getCategoryList");
    }
    this.$store.dispatch("specs/getAllSpecs");
  },
  methods: {
    // 选择图片
    changeImg(file, fileList) {
      // 需要做限制(类型和大小)
      const allowType = ["image/png", "image/gif", "image/jpeg","image/jfif"];
      if (!allowType.includes(file.raw.type)) {
        // 选择了不允许的类型
        this.$message.error("不是正确的图片格式");
        // 异常当前选择的文件
        this.fileList = this.fileList.filter(item => item.url !== file.url); // 过滤出不是当前的图片地址的文件
        return;
      }
      const allowMaxSize = 1024 * 1024; // 不能随意设置，需要和服务器配合
      if (file.size > allowMaxSize) {
        // 文件超过允许的大小
        this.$message.error("文件超过允许的大小");
        // 异常当前选择的文件
        this.fileList = this.fileList.filter(item => item.url !== file.url); // 过滤出不是当前的图片地址的文件
        return;
      }
      // 当选择的文件的列表等于允许的最大数量时隐藏选择图片的按钮
      if (fileList.length === this.imgLimit) {
        this.hideUploadBtn = true;
      }
      this.fileList = fileList;
      this.form.img = file.raw; // 把文件的资源保存到表单数据中
    },
    // 图片预览(展示大图)
    handlePictureCardPreview(file) {
      // 把file的链接赋值给大图片的src
      this.dialogImageUrl = file.url;
      // 显示大图的对话框
      this.dialogVisible = true;
    },
    // 删除已经选择的图片
    handleRemove(file) {
      // 从fileList中删除选择的图片
      this.fileList = this.fileList.filter(item => item.url !== file.url); // 过滤出不是当前的图片地址的文件
      // 显示选择图片的按钮
      this.hideUploadBtn = false;
      // 如果是添加清空表单的图片数据，如果是修改要还原到修改之前的数据
      this.form.img = this.editDefaultImg;
    },
    // 切换一级分类时更换二级分类数据
    onChangeCategory(id) {
      // 清空表单的second_cateid
      this.form.second_cateid = 0;
      if (id > 0) {
        // 如果id>0则获取当前分类的二级分类
        const category = this.categoryList.find(item => item.id === id); // 根据id在分类数据中查找对应的分类
        this.secondCategoryList = category.children || [];
      } else {
        // 如果id为0则清空二级分类
        this.secondCategoryList = [];
      }
    },
    // 切换商品规格是更换规格属性
    onChangeSpecs(id) {
      // 清空表单的specsattr
      this.form.specsattr = "";
      if (id > 0) {
        // 如果id>0则获取当前规格的属性
        const specs = this.specsList.find(item => item.id === id); // 根据id在规格数据中查找对应的规格
        this.attrList = specs.attrs || [];
      } else {
        // 如果id为0则清空规格属性
        this.attrList = [];
      }
    },
    onSubmit() {
      // 调用表单验证方法
      // 把富文本中的纯文本添加到this.form中
      this.form.description = this.$refs.editor.getText();
      const valid = validate(this.form, goodsRules);
      if (valid !== true) {
        this.$message.error(valid);
        return;
      }
      // 验证通过之后才处理数据
      if (this.form.id && this.form.id > 0) {
        // 修改
        this.eidtGoods("updateGoods");
      } else {
        // 添加
        this.eidtGoods();
      }
    },
    eidtGoods(method = "addGoods") {
      // 如果是修改，删除数据中多余的属性 secondcatename，firstcatename
      if (this.form.id > 0) {
        Reflect.deleteProperty(this.form, "secondcatename"); // delete this.form.secondcatename
        Reflect.deleteProperty(this.form, "firstcatename");
      }
      // 把富文本中的内容(包含html)添加到this.form中
      this.form.description = this.$refs.editor.getHtml();
      // 有文件的上传，必须使用FormData
      const data = new FormData();
      for (const k in this.form) {
        data.append(k, this.form[k]);
      }
      model[method](data)
        .then(() => {
          // 修改成功
          // 显示添加成功的信息
          this.$message.success({
            message: method === "addGoods" ? "添加成功" : "修改成功",
            duration:1000,
            onClose: () => {
              // 关闭对话框(一旦对话框关闭就会自动触发对话框的close事件)
              this.dialogFormVisible = false;
              if (method === "addSpecs") {
                // 添加时重新获取总数量
                this.$store.dispatch("goods/getGoodsTotal");
              }
              // 刷新列表数据
              this.$store.dispatch("goods/getGoodsList");
            }
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    clearForm() {
      // 把表单数据还原到原始值
      this.form = { ...defaultData };
      // 还原上传组件的数据
      this.hideUploadBtn = false;
      this.editDefaultImg = "";
      this.fileList = [];
    },
    // 修改时设置表单的数据
    setFormData(data) {
      // 根据商品的1级分类设置2级分类的数据
      const category = this.categoryList.find(
        item => item.id === data.first_cateid
      );
      this.secondCategoryList = category.children || [];
      // 保存商品的图片
      this.editDefaultImg = data.img;
      this.form = { ...data };
    }
  }
};
</script>
<style scoped>
.hide /deep/ .el-upload {
  display: none !important;
}
/deep/ .wangEditor-txt {
  height: 301px !important;
}
</style>
