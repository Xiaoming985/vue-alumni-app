<template>
  <div>
    <div class="bg-image"></div>
    <div class="user-box">
      <span>{{userInfo.userName}}</span>
      <img :src="userInfo.headImage" alt="" class="user-avatar">
    </div>
  </div>
</template>

<script>
export default {
  props: ['userInfo']
}
</script>

<style lang="scss" scoped>
.bg-image {
  background-image: url('../assets/images/3.jpg');
  height: 200px;
  background-size: cover;
}
.user-box {
  display: flex;
  align-items: flex-end;
  position: absolute;
  top: 215px;
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