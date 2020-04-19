<!-- 发表留言 -->
<template>
  <div class="my-content">
    <van-cell-group>
      <van-field v-model="msg" type="textarea" rows="5" placeholder="这一刻的想法..." />
    </van-cell-group>
    <div class="upload">
      <span>选择图片:</span>
      <van-uploader v-model="fileList" :max-count="8" multiple />
    </div>
    <van-button type="primary" block @click="toSend">发布</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '',
      fileList: []
    }
  },
  created() {
    this.$store.commit('changeTitle', '发表留言')
  },
  methods: {
    // 发表留言
    async toSend() {
      let fd = new FormData();
      fd.append("content", this.msg);
      // let arr = [];
      this.fileList.forEach(item => {
        // arr.push(item.file);
        fd.append("images", item.file);
      })
      // fd.append("images", arr);
      let res = await this.$post('/alumni/leaveController/saveLeave', fd);
      if(res.status == 200) {
        this.$toast.success("发布成功!");
        this.$router.go(-1);
      } else {
        this.$toast.fail("网络似乎出现了问题!");
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  background-color: #fff;
  padding-top: 10px;
  padding-left: 10px;
  span {
    display: block;
    padding-bottom: 8px;
  }
}
.van-button {
  width: 90vw;
  margin: 10px auto 0;
  font-size: 18px;
}
</style>