<!-- 我的日志 -->
<template>
  <div class="my-content">
    <Cover :userInfo="userInfo"></Cover>
    <div style="height: 30px;"></div>
    <van-swipe-cell v-for="(item, index) in log" :key="index">
      <div class="log-box">
        <span>{{item.logTime.slice(0, 10)}}</span>
        <span class="log-title">{{item.logTitle}}</span>
        <span>{{item.day}}</span>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" class="log-btn" @click="deleteLog(item.logId, index)" />
        <van-button square type="info" text="编辑" class="log-btn" @click="editLog(item.logId)" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import { init } from '@/mixin/init.js';
import Cover from "@/components/Cover.vue";
import { calcDay } from "@/util/handleTime.js";
export default {
  mixins: [init],
  data() {  
    return {
      userInfo: {},
      log: []
    }  
  },
  components: {
    Cover
  },
  created() {
    if (this.$route.query.userId == this.$store.state.userId) {
      this.$store.commit('changeTitle', '我的日志');
    } else {
      this.$store.commit('changeTitle', 'Ta的日志');
    }
    this.getUserInfoById(this.$route.query.userId).then(res => {
      this.userInfo = res.data[0];
    });
    this.getLog();
  },
  mounted() {
    
  },
  methods: {
    async getLog() {
      let res = await this.$get('/alumni/logController/getLog', {
        userId: this.$route.query.userId
      });
      if (res.status == 200) {
        this.log = res.data;
        this.log.forEach(item => {
          let day = calcDay(item.logTime);
          item.day = day;
        });
      } else {
        
      }
    },
    deleteLog(logId, index) {
      this.$dialog.confirm({
        message: '删除日志后无法恢复，请少主三思!'
      }).then(async () => {
        let res = await this.$post("/alumni/logController/deleteLog", this.$qs.stringify({
          logId: logId
        }));
        if (res.status == 200) {
          this.$toast("删除成功");
          this.log.splice(index, 1);
        }
      }).catch(() => {
        this.$toast("已取消");
      })
    },
    editLog(logId) {
      this.$router.push(`/next/log-create?logId=${logId}`);
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
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  // box-shadow: 0 0 2px 2px rgba($color: #000000, $alpha: 0.5);
  margin: 10px;
  padding: 10px;
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