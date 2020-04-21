<!-- 我的日志 -->
<template>
  <div class="my-content">
    <Cover :userInfo="myInfo"></Cover>
    <div style="height: 30px;"></div>
    <van-swipe-cell v-for="(item, index) in myLog" :key="index">
      <div class="log-box">
        <span class="log-title"># {{item.logTitle}} #</span>
        <span>{{item.logTime.slice(0, 10)}}</span>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" class="log-btn" />
        <van-button square type="info" text="编辑" class="log-btn" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import { init } from '@/mixin/init.js'
import Cover from "@/components/Cover.vue";
export default {
  mixins: [init],
  data() {  
    return {
      myInfo: {},
      myLog: []
    }  
  },
  components: {
    Cover
  },
  created() {
    this.$store.commit('changeTitle', '我的日志');
    this.getMyInfo().then(res => {
      this.myInfo = res.data.userInfo;
    });
    this.getMyLog();
  },
  mounted() {
    
  },
  methods: {  
    async getMyLog() {
      let res = await this.$get('/alumni/logController/getLog', {
        userId: this.$store.state.userId
      });
      if (res.status == 200) {
        this.myLog = res.data;
      } else {
        
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.my-content {
  background-color: #fff;
}
.van-swipe-cell {
  &:active {
    background-color: #d9d9d9;
  }
}
.log-box {
  height: 50px;
  border-bottom: 1px solid #d9d9d9;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .log-title {
    color: royalblue;
  }
}
.log-btn {
  height: 100%;
}
</style>