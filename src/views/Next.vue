<template>
  <div>
    <van-nav-bar left-text="返回" :title="headTitle" left-arrow fixed @click-left="back" z-index="10">
      <template #right>
        <!-- <van-button type="primary" size="small" @click="toSend" 
          v-if="$route.name=='MsgCreate'">发布</van-button> -->
        <van-button type="info" size="small" @click="toCreate" 
          v-if="$route.name=='Album' || $route.name=='Log'">新建</van-button>
        <van-button type="primary" size="small" @click="onSave" 
          v-else-if="$route.name=='LogCreate'">保存</van-button>
      </template>
    </van-nav-bar>
    <div>
      <router-view ref="nextChild"></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['headTitle'])
  },
  created() {

  },
  methods: {
    back() {
      if ((this.$route.name == 'LogCreate' && this.$refs.nextChild.logTitle != '')
        || (this.$route.name == 'MsgCreate' && this.$refs.nextChild.msg != '')) {
        this.$dialog.confirm({
          message: '退出此次编辑?'
        }).then(() => {
          this.$router.go(-1);
        }).catch(()=> {
          this.$toast("已取消");
        });
      }else{
        this.$router.go(-1);
      }
    },
    toSend() {

    },
    toCreate() {
      if (this.$route.name == 'Album') {
        this.$router.push('/next/album-create'); // 跳转至新建相册页面;
      } else if (this.$route.name == 'Log') {
        this.$router.push('/next/log-create'); // 跳转至新建日志页面;
      }
    },
    async onSave() {
      // 保存日志
      let res;
      if (this.$route.query.logId) {
        // 编辑日志
        res = await this.$post("/alumni/logController/editLog", this.$qs.stringify({
          logId: this.$route.query.logId,
          logTitle: this.$refs.nextChild.logTitle,
          logContent: this.$refs.nextChild.logContent
        }));
      } else {
        // 新建日志
        res = await this.$post('/alumni/logController/saveLog',this.$qs.stringify({
          logTitle: this.$refs.nextChild.logTitle,
          logContent: this.$refs.nextChild.logContent,
          userId: this.$store.state.userId
        }));
      }
      if (res.status == 200) {
        this.$toast.success("保存成功");
        this.$router.go(-1);
      } else if (res.status == 500) {
        this.$toast.error("网络似乎出现了问题,请稍后重试!");
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
