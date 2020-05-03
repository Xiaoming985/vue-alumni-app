<!-- 我的日志 -->
<template>
  <div class="my-content">
    <Cover :userInfo="userInfo"></Cover>
    <div style="height: 20px;"></div>
    <van-swipe-cell v-for="(item, index) in log" :key="index">
      <div class="log-box" @click="toLogDetail(item.logId)">
        <div class="log-left">
          <div class="log-time">
            <div><span>{{ item.logTime.slice(8, 10) }}</span></div>
            <div class="log-month"><span>{{ item.logTime.slice(5, 7) }}</span></div>
          </div>
          <div>
            <span class="log-min">{{ item.logTime.slice(11, 16) }}</span>
            <span class="log-title">{{item.logTitle}}</span>
            <span class="log-day">{{ item.day }}</span>
          </div>
        </div>
        <div class="year">{{ item.logTime.slice(0, 4) }}</div>
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
        userId: this.$route.query.userId,
        start: 0,
        pageSize: 10
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
    },
    toLogDetail(logId) {
      this.$router.push(`/next/log-detail?logId=${logId}`);
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
  &:nth-of-type(2n) {
    .log-box {
      border: 1px solid #fd79a8;
      color: #fd79a8;
      .log-month {
        border-top: 1px solid #fd79a8;
      }
    }
  }
  &:nth-of-type(2n + 1) {
    .log-box {
      border: 1px solid #00cec9;
      color: #00cec9;
      .log-month {
        border-top: 1px solid #00cec9;
      }
    }
  }
}
.my-content {
  background-image: url("../../assets/images/bg-log2.jpg");
  background-size: contain;
}
.log-box {
  // font-family: STCaiyun;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  box-shadow: 2px 2px 2px 2px rgba($color: #000000, $alpha: 0.3);
  margin: 10px;
  padding: 5px 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .log-left {
    display: flex;
    .log-time {
      // font-size: 20px;
      margin-left: 5px;
      transform: rotate(-45deg);
      div span {
        display: inline-block;
        transform: rotate(45deg);
        padding: 5px;
        font-weight: 600;
      }
    }
    .log-min {
      font-size: 14px;
      margin-left: 20px;
      display: block;
    }
    .log-title {
      font-weight: bold;
      margin-left: 20px;
      display: block;
      // font-size: 20px;
    }
    .log-day {
      margin-left: 20px;
      display: block;
    }
  }
  .year {
    font-size: 24px;
    font-family: STCaiyun;
  }
}
.log-btn {
  height: 100%;
}
</style>