<template>
  <div class="cover">
    <div class="bg-image"></div>
    <div class="user-box">
      <span>{{userInfo.userName}}</span>
      <img :src="userInfo.headImage" alt="" class="user-avatar" @click="headClick">
    </div>
  </div>
</template>

<script>
export default {
  props: ["userInfo"],
  methods: {
    headClick() {
      if (this.$route.name == "ClassMsg") {
        this.$emit("jump");
      }
      // console.log(this.$route)
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
  position: relative;
}
.bg-image {
  background-image: url('../assets/images/3.jpg');
  height: 200px;
  background-size: cover;
}
.user-box {
  display: flex;
  align-items: flex-end;
  position: absolute;
  top: 170px;
  right: 30px;
  span {
    margin-right: 10px;
    font-weight: bold;
  }
  span,
  img {
    z-index: 10;
  }
}
</style>