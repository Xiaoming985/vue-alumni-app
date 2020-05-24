<!-- 班级留言板 -->
<template>
  <div>
    <div class="my-content" v-if="userInfo.tag == 2">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        class="content"
        head-height="46"
      >
        <Cover :userInfo="userInfo" v-on:jump="jump"></Cover>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="我也是有底线的"
          :immediate-check="check"
          @load="onLoad"
        >
          <div v-for="item in msgList" :key="item.msgId">
            <MsgSection
              :msg="item"
              :userName="myName"
              :index="item.msgId"
              v-on:delete="ondelete"
            ></MsgSection>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="my-content tip" v-else>
      <van-empty description="请先完成学籍认证" />
    </div>
  </div>
</template>

<script>
import { init } from "@/mixin/init.js";
import Cover from "@/components/Cover.vue";
import MsgSection from "@/components/MsgSection.vue";
import { calcTime } from "@/util/handleTime.js";
export default {
  mixins: [init],
  data() {
    return {
      userInfo: {},
      msgList: [],
      loading: false, // 是否处于加载状态，加载过程中不触发load事件
      finished: false, // 是否已加载完成，加载完成后不再触发load事件
      refreshing: false,
      check: false, // 检查当前滚动位置,若已滚动至底部,则会触发load事件
      start: 0,
      pageSize: 10
    };
  },
  components: {
    Cover,
    MsgSection
  },
  computed: {
    myName() {
      return this.$store.state.userName;
    }
  },
  created() {
    if (this.$route.query.userId) {
      this.getUserInfoById(this.$route.query.userId).then(res => {
        this.userInfo = res.data[0];
      });
      // if (this.userInfo.tag == 2) {
        this.getClassMsg();
      // }
      if (this.$route.query.userId == this.$store.state.userId) {
        this.$store.commit("changeTitle", "我的留言");
      } else {
        this.$store.commit("changeTitle", "Ta的留言");
      }
    } else {
      this.getMyInfo().then((res) => {
        this.userInfo = res.data.userInfo;
        if (this.userInfo.tag == 2) {
          this.getClassMsg();
        }
        this.$store.commit("changeTitle", res.data.userInfo.className);
      });
    }
  },
  mounted() {
    
  },
  methods: {
    onLoad() {
      this.start += 1;
      setTimeout(() => {
        if (this.refreshing) {
          this.msgList = [];
          this.refreshing = false;
        }
        this.loading = false;
        if (this.finished == false) this.getClassMsg();
      }, 1000);
    },
    onRefresh() {
      // 如果不设置false的话,假如上次已经加载完了,则finished的值依然是true,刷新时则清空了列表,不发送请求
      this.finished = false;
      // 重新加载数据
      this.start = -1;
      this.onLoad();
    },
    async getClassMsg() {
      let res = await this.$get("/alumni/leaveController/getLeaveByClassId", {
        classId: this.$store.state.classId,
        userId: this.$route.query.userId ? this.$route.query.userId : "",
        start: this.start * this.pageSize,
        pageSize: this.pageSize
      });
      if (res.status == 200) {
        this.finished = res.data.length < this.pageSize ? true : false;
        this.msgList.push(...res.data);
        this.msgList.forEach((item) => {
          item.msgTime = calcTime(item.msgTime);
        });
      }
    },
    ondelete(index) {
      this.msgList.forEach((ele, idx) => {
        if (ele.msgId == index) {
          this.msgList.splice(idx, 1);
        }
      });
    },
    jump() {
      this.$router.push(`/home/classMsg?userId=${this.$store.state.userId}`);
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.my-content {
  background-color: #fff;
}
.content {
  padding-bottom: 60px;
  background-color: #fff;
}
.van-list {
  padding-top: 10px;
}
.tip {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
