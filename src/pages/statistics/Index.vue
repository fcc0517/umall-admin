<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图表1</span>
          </div>
          <div ref="echart1" style="width: 100%; height: 500px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图表2</span>
          </div>
          <div ref="echart2" style="width: 100%; height: 500px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入ECharts组件
import * as ECharts from "echarts";
export default {
  mounted() {
    this.$nextTick(() => {
      this.echartInit1();
      this.echartInit2();
    });
  },
  methods: {
    echartInit1() {
      const chartObj = ECharts.init(this.$refs.echart1);
      const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line"
          }
        ]
      };
      chartObj.setOption(option);
    },
    echartInit2() {
      const chartObj = ECharts.init(this.$refs.echart2);
      const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "bar"
          }
        ]
      };
      chartObj.setOption(option);
    }
  }
};
</script>

<style scoped></style>
