<!-- 班级留言板 -->
<template>
  <div class="my-content">
    <Cover :userInfo="myInfo"></Cover>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class=" content" head-height="46">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我也是有底线的"
        :immediate-check="check"
        @load="onLoad"
      >
        <div v-for="(item, index) in msgList" :key="index">
          <MsgSection :msg="item" :userName="myInfo.userName" :index="index" v-on:delete="ondelete"></MsgSection>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { init } from '@/mixin/init.js'
import Cover from "@/components/Cover.vue";
import MsgSection from "@/components/MsgSection.vue";
import { calcTime } from "@/util/handleTime.js";
export default {
  mixins: [init],
  data() {
    return {
      myInfo: {},
      msgList: [],
      loading: false,
      finished: false,
      refreshing: false,
      check: false, // 检查当前滚动位置,若已滚动至底部,则会触发load事件
      start: 0,
      pageSize: 10
    }
  },
  components: {
    Cover,
    MsgSection
  },
  computed: {
    
  },
  created() {
    this.getMyInfo().then(res => {
      this.myInfo = res.data.userInfo;
      this.$store.commit('initUserId', res.data.userInfo.userId);
      this.$store.commit('initClassId', res.data.userInfo.classId);
      this.$store.commit('changeTitle', res.data.userInfo.className);
    });
  },
  mounted() {
    this.getClassMsg();
  },
  methods: {
    onLoad() {
      this.start += 1;
      setTimeout(()=>{
        if (this.refreshing) {
          this.msgList = [];
          this.refreshing = false;
        }
        this.loading = false;
        if(this.finished == false) this.getClassMsg();
      },1000);  
    },
    onRefresh() {
      // 如果不设置false的话,假如上次已经加载完了,则finished的值依然是true,刷新时则清空了列表,不发送请求
      this.finished = false; 
      // 重新加载数据
      this.start = -1;
      this.onLoad();
    },
    async getClassMsg() {
      let res = await this.$get('/alumni/leaveController/getLeaveByClassId',{
        classId: this.$store.state.classId,
        start: this.start * this.pageSize,
        pageSize: this.pageSize
      });
      if (res.status == 200) {
        this.finished = res.data.length<10 ? true : false;
        this.msgList.push(...res.data);
        this.msgList.forEach(item => {
          item.msgTime = calcTime(item.msgTime);
        })
      }
    },
    ondelete(index) {
      this.msgList.splice(index, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 60px;
  background-color: #fff;
}
.van-list {
  padding-top: 10px;
}
</style>
