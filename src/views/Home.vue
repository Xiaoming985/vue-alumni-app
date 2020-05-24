<template>
  <div class="home">
    <van-nav-bar :title="headTitle" left-text="返回" left-arrow fixed @click-left="back" z-index="20">
      <template #right v-if="$route.name=='ClassMsg'">
        <van-icon name="add-o" size="20" @click="toAddMsg" /> 
      </template>
    </van-nav-bar>

    <transition name="van-fade">
      <router-view class="my-content"></router-view>
    </transition>

    <van-tabbar v-model="active" route z-index="10" v-show="$route.name=='ClassMsg' && $route.query.userId ? false : true">
      <!-- <van-tabbar-item icon="apps-o">校园动态</van-tabbar-item> -->
      <van-tabbar-item icon="home-o" to="/home/classMsg">班级留言板</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/home/Contact">通讯录</van-tabbar-item>
      <!-- <van-tabbar-item icon="photo-o" to="/home/album">相册</van-tabbar-item>
      <van-tabbar-item icon="notes-o" to="/home/log">日志</van-tabbar-item> -->
      <van-tabbar-item icon="user-circle-o" to="/home/me">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { init } from "@/mixin/init.js";
export default {
  mixins: [init],
  data() {
    return {
      active: 0,
    }
  },
  computed: {
    headTitle() {
      return this.$store.state.headTitle
    },
  },
  created() {
    this.getMyInfo().then(res => {
      this.userInfo = res.data.userInfo;
      this.$store.commit("initUserId", res.data.userInfo.userId);
      this.$store.commit("initClassId", res.data.userInfo.classId);
      this.$store.commit("initUserName", res.data.userInfo.userName);
    });
  },
  methods: {
    back(){
      this.$router.go(-1);//返回上一层
    },
    toAddMsg() {
      this.$router.push('/next/msg-create');
    }
  }
}
</script>

<style lang="scss" scoped>
.van-tabber {
  border-top: 2px solid black;
}
</style>
