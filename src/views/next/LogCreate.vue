<!-- 新建日志 -->
<template>
  <div class="my-content">
    <van-field v-model="logTitle" label="日志标题：" />
    <div class="logContent">
      <quill-editor v-model="logContent"></quill-editor>
    </div>
  </div>
  
</template>

<script>
export default {
  data() {  
    return {
      logTitle: '',
      logContent: ''
    }
  },
  created() {
    this.$store.commit('changeTitle', '写日志');
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.van-field {
  border-bottom: 1px dashed #d9d9d9;
}
.logContent {
  background-color: #fff;
  // min-height: calc(100vh - 46px - 45px - 10px - 50px);
  padding: 10px;
}
</style>

<style>
.ql-toolbar {
  background-color: #d9d9d9;
  height: 60px;
}
.ql-editor{
  height: calc(100vh - 174px);
  background-image: url('../../assets/images/bg-log2.jpg');
  background-size: contain;
}
</style>