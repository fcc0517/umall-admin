import Vue from "vue";
Vue.mixin({
  methods: {
    recombinationImg(imgSrc) {
      if (!/^(https?:\/\/).*/.test(imgSrc)) {
        return "http://localhost:3000" + imgSrc;
      }
      return imgSrc;
    }
  }
});
