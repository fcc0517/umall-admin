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
      <el-form-item label="轮播图名称" prop="title">
        <el-input
          v-model.trim="form.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <!--商品图片 start-->
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
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="2">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添 加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// import { mapState } from "vuex";
// 引入接口的方法
import * as model from "@/api/banner";
const defaultData = {
  title: "", //图片名称
  img: "", //图片
  status: 1 // 菜单的状态
};
export default {
  data() {
    return {
      title: "添加菜单", //对话框的标题
      dialogFormVisible: false,
      dialogVisible: false, // 是否展示大图片
      imgLimit: 1,
      fileList: [], // 选择的文件列表
      dialogImageUrl: "", // 大图片的地址
      editDefaultImg: "", // 存储修改传入的图片
      hideUploadBtn: false, // 是否隐藏选择图片的按钮
      // 参照项目接口
      form: { ...defaultData }, //复制一份原始默认值
      rules: {
        // validator:checkRole 自定义验证
        title: [
          { required: true, message: "请输入图片名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 选择图片
    changeImg(file, fileList) {
      // 需要做限制(类型和大小)
      const allowType = ["image/png", "image/gif", "image/jpeg", "image/jfif"];
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
    clearForm() {
      // 恢复默认数据
      this.form = { ...defaultData };
      // 清空所有的表单验证
      this.$refs.form.clearValidate()
      // 还原上传组件的数据
      this.hideUploadBtn = false
      this.editDefaultImg = ''
      this.fileList = []
    },
    // 修改时设置表单的数据
    setFormData(data) {
      this.editDefaultImg = data.img
      this.form = {...data}
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 根据form数据中是否有id属性来判断当前是修改菜单还是添加菜单
          if (this.form.id && this.form.id > 0) {
            // 修改
            this.editBanner("updateBanner");
          } else {
            // 如果没有上传图片
            if (this.fileList.length === 0) {
              this.$message.error("请添加轮播图");
              return;
            }
            // 添加
            this.editBanner();
            // console.log(this.form)
          }
        }
      });
    },
    editBanner(method = "addBanner") {
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
            message: method === "addBanner" ? "添加成功" : "修改成功",
            duration: 1000,
            onClose: () => {
              // 关闭对话框(一旦对话框关闭就会自动触发对话框的close事件)
              this.dialogFormVisible = false;
              if (method === "addSpecs") {
                // 添加时重新获取总数量
                this.$store.dispatch("banner/getBannerList");
              }
              // 刷新列表数据
              this.$store.dispatch("banner/getBannerList");
            }
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style scoped>
.item-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.hide /deep/ .el-upload {
  display: none !important;
}
</style>
