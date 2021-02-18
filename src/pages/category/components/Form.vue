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
      <el-form-item label="分类名称" prop="title">
        <el-input
          v-model.trim="form.catename"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="上级分类">
        <el-select v-model="form.pid" placeholder="请选择">
          <!--v-model 和 value是全等比较  :value="0"-->
          <el-option label="顶级分类" :value="0"></el-option>
          <!-- 循环一级分类 -->
          <el-option
            v-for="item of firstCategoryList"
            :key="item.id"
            :label="'|-' + item.catename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片">
        <!-- 上传图片  limit允许上传的个数-->
        <el-upload
          action="#"
          :class="{ hide: hideUploadBtn }"
          list-type="picture-card"
          :auto-upload="false"
          :limit="imgLimit"
          :on-change="changeImg"
          :file-list="fileList"
          accept="image/jpeg,image/gif,image/png,image/jfif"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <!-- 预览小图片 -->
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <!-- 预览大图片的按钮 -->
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <!-- 删除图片的按钮 -->
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <!-- 展示大图片的对话框 -->
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- v-if="editDefaultImg !== ''"修改的时候且有图片的时候显示 -->
      <el-form-item label="分类图片" v-if="form.id > 0 && editDefaultImg !== ''">
        <el-image style="width: 146px; height: 146px" fit='fill' :src='editDefaultImg | recombination' />
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
import { mapGetters } from "vuex";
// 引入接口的方法
import * as model from "@/api/category";
const defaultData = {
  pid: 0, //上次菜单的编号，顶级菜单就是0
  catename: "", //商品分类的名称
  img: "", //图片(文件，一般用于二级分类)
  status: 1 // 菜单的状态
};
export default {
  data() {
    return {
      title: "", //对话框的标题
      dialogFormVisible: false,
      // 参照项目接口
      form: { ...defaultData }, //复制一份原始默认值
      rules: {
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      dialogVisible: false, //是否展示大图片
      dialogImageUrl: "", //大图片的地址
      hideUploadBtn: false, //是否隐藏选择图片的按钮
      imgLimit: 1, //上传图片的数量
      fileList: [], //选择文件的列表
      editDefaultImg:''//存储修改时传入的图片
    };
  },
  computed: {
    ...mapGetters({
      firstCategoryList: "category/firstCategoryList"
    })
  },
  methods: {
    // 选择图片
    changeImg(file, fileList) {
      // console.log(file);
      // 需要限制图片的格式和大小
      const allowType = ["image/jpeg", "image/gif", "image/png", "image/jfif"];
      if (!allowType.includes(file.raw.type)) {
        this.$message.error("图片格式不正确");
        // 移除图片
        this.fileList = this.fileList.filter(item => item.url !== file.url);
        return;
      }
      // 设置允许的图片的大小
      const allowMaxSize = 1024 * 1024;
      // 文件大小超出
      if (file.size > allowMaxSize) {
        this.$message.error("文件超出允许的大小");
        this.fileList = this.fileList.filter(item => item.url !== file.url);
        return;
      }
      if (fileList.length === this.imgLimit) {
        // 隐藏图片的按钮
        this.hideUploadBtn = true;
      }
      this.fileList = fileList;
      this.form.img = file.raw; //把文件的资源保存到表单数据中
    },
    editCategory(method = "addCategory") {
      // 因为提交的是文件，需要提交FormData  new FormData() 原生js
      const data = new FormData();
      // console.log(data);
      // return
      for (const k in this.form) {
        // console.log(k, this.form[k]);
        data.append(k, this.form[k]);
      }
      model[method](data).then(() => {
        this.$message.success({
          duration: 1000,
          message: method == "addCategory" ? "添加成功" : "修改成功",
          onClose: () => {
            // 关闭对话框，会自动触发关闭事件
            this.dialogFormVisible = false;
            // 刷新列表数据
            this.$store.dispatch("category/getCategoryList");
          }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 处理菜单的添加(把表单的数据发送到接口)
          if (this.form.id && this.form.id > 0) {
            // 修改
            this.editCategory("updateCategory");
            // console.log(this.form);
          } else {
            // 添加
            // console.log(this.form);
            this.editCategory();
          }
        }
      });
    },
    // 图片预览（展示大图片）
    handlePictureCardPreview(file) {
      // 把大图的地址赋值给他
      // console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除已经选择的图片
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.url !== file.url);
      console.log(this.fileList);
      // 显示选择图片的按钮
      this.hideUploadBtn = false;
      // 如果是添加清空表单的图片数据，如果是修改要还原到修改之前的数据
      this.form.img = this.editDefaultImg
    },
    clearForm() {
      // 恢复默认数据
      this.form = { ...defaultData };
      // 清空表单验证数据
      this.$refs.form.clearValidate();
      // 显示选择图片的按钮
      this.hideUploadBtn = false;
      this.editDefaultImg = ''
      this.fileList = []
    },
    setEditForm(data) {
      this.editDefaultImg = data.img
      // console.log(this.edifDefaultImg);
      this.form = { ...data };
    }
  }
};
</script>

<style scoped>
.hide >>> .el-upload {
  display: none;
}
</style>
