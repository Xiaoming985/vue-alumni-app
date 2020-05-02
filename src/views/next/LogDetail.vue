<!-- 查看日志详情 -->
<template>
  <div class="my-content">
    <div class="log-title">{{ log.logTitle }}</div>
    <div class="user-info">
      <img :src="log.headImage" alt="">
      <div>
        <span>{{ log.userName }}</span>
        <span>{{ log.logTime }}</span>
      </div>
    </div>
    <div class="log-content" ref="logContent"></div>
  </div>
</template>

<script>
import { calcTime } from "@/util/handleTime.js";
export default {
  data() {
    return {
      log: {}
    };
  },
  created() {
    this.$store.commit('changeTitle', '');
    this.getLog();
  },
  mounted() {},
  methods: {
    async getLog() {
      let res = await this.$get('/alumni/logController/getLog', {
        logId: this.$route.query.logId
      });
      if (res.status == 200) {
        this.log = res.data[0];
        this.$refs.logContent.innerHTML = this.log.logContent;
        this.log.logTime = calcTime(this.log.logTime);
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.my-content {
  background-color: #fff;
  // background-image: url("../../assets/images/bg-log3.png");
  // background-size: contain;
}
.log-title,
.log-content {
  padding: 10px;
}
.log-title {
  font-weight: bold;
  font-size: 20px;
}
.user-info {
  margin-left: 10px;
  display: flex;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  span {
    &:nth-child(1) {
      color: #4a69bd;
      font-weight: bold;
    }
    &:nth-child(2) {
      color: #7f8c8d;
      font-size: 14px;
    }
    display: block;
  }
}
</style>
