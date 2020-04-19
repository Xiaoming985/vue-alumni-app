<template>
  <div>
    <van-nav-bar left-text="返回" left-arrow fixed @click-left="back">
      <template #right>
        <van-icon name="ellipsis" size="20" /> 
      </template>
    </van-nav-bar>

    <div class="my-content">
      <UserCard :userInfo="classmate"></UserCard>
      <van-cell-group>
        <van-cell title="Ta的信息" icon="contact" is-link :to="classmateURL" />
        <van-cell title="Ta的相册" icon="photo-o" is-link />
        <van-cell title="Ta的日志" icon="notes-o" is-link />
      </van-cell-group>
      <van-button type="info" block icon="chat-o" >发消息</van-button>
    </div>
    
  </div>
</template>

<script>
import { init } from '@/mixin/init.js';
import UserCard from '@/components/UserCard.vue';
export default {
  mixins: [init],
  data() {
    return {
      classmate: {}
    }
  },
  components: {
    UserCard
  },
  computed: {
    classmateURL() {
      return `/next/classmate-info?userId=${this.classmate.userId}`;
    }
  },
  created() {
    this.getUserInfoById(this.$route.query.userId).then(res => {
      this.classmate = res.data[0]
    });
    this.$store.commit('changeTitle', '');
  },
  methods: {
    back(){
      this.$router.go(-1);//返回上一层
    },
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
