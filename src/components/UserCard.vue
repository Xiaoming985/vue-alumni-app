<template>
  <div class="card">
    <img :src="userInfo.headImage" alt="" @click="preview">
    <div class="desc">
      <span class="userName">{{userInfo.userName}}</span>
      <span class="account">账号:{{userInfo.phone}}</span>
      <span class="motto">个性签名:{{userInfo.motto}}</span>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
export default {
  props: ['userInfo'],
  data() {
    return {
      
    }
  },
  methods:{
    preview() {
      ImagePreview([this.userInfo.headImage]);
    },
  }
}
</script>

<style lang="scss" scoped>
.card {
  height: 104px;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;

  img {
    width: 88px;
    height: 88px;
    border: 1px solid rgba($color: #000000, $alpha: .1);
    border-radius: 5px;
    margin-left: 20px;
  }

  .desc {
    margin-left: 20px;
    text-align: left;
    display: flex;
    flex-direction: column;
    .userName,
    .account,
    .motto {
      display: block;
      padding-bottom: 5px;
      font-size: 14px;
    }
    .userName {
      font-size: 18px;
      font-weight: 600;
    }
    .motto {
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
