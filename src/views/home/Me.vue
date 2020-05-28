<!-- 我 -->
<template>
  <div>
    <UserCard :userInfo="myInfo"></UserCard>
    <van-cell-group>
      <van-cell title="个人信息" icon="contact" is-link to="/next/commonInfo" />
      <van-cell title="学籍认证" icon="idcard" is-link to="/next/academic" />
      <van-cell title="相册" icon="photo-o" is-link :to="albumUrl" />
      <van-cell title="我的日志" icon="notes-o" is-link :to="logUrl" />
      <van-cell title="修改密码" icon="lock" is-link to="/next/updatePassword" />
      <van-cell title="设置" icon="setting-o" is-link />
    </van-cell-group>
    <van-button type="danger" block @click="logout">退出登录</van-button>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import { init } from '@/mixin/init.js';
import UserCard from '@/components/UserCard.vue';
export default {
  mixins: [init],
  data() {
    return {
      myInfo: {}
    }
  },
  components: {
    UserCard,
  },
  computed: {
    albumUrl() {
      return `/next/album?userId=${this.myInfo.userId}`;
    },
    logUrl() {
      return `/next/log?userId=${this.myInfo.userId}`;
    }
  },
  created() {
    this.getMyInfo().then(res => {
      this.myInfo = res.data.userInfo
    });
    this.$store.commit('changeTitle', '');
  },
  methods: {
    // 退出
    async logout() {
      await this.$post('/alumni/loginController/logout'); // 无响应体
      localStorage.removeItem("userId");
      this.$router.push('/');
      // window.location.replace('localhost:9000');
    }
  }
}
</script>

<style lang="scss" scoped>
.van-cell {
  font-size: 18px;
  text-align: left;
  .van-icon {
    margin-right: 15px;
  }
}
.van-button {
  width: 90vw;
  margin: 10px auto 0;
  font-size: 18px;
}
</style>