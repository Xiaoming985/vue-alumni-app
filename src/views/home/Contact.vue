<!-- 通讯录 -->
<template>
  <div>
    <div class="my-content tip" v-if="show">
      <van-empty description="请先完成学籍认证" />
    </div>
    <div v-else>
      <van-search clearable v-model="value" shape="round" background="#4fc08d" placeholder="输入用户名或者账号试试" />
      <div class="contact-item" v-for="(item, index) in classmates" :key="index" @click="toDetail(item)">
        <img :src="item.headImage" alt="">
        <span>{{ item.userName }}</span>
      </div>
      <div class="mask" v-show="maskShow" @click="maskShow = false">
        <transition-group name="list" tag="div">
          <div v-for="(item, index) in searchResult" :key="index + 1" class="contact-item" @click="toDetail(item)">
            <img :src="item.headImage" alt="">
            <span>{{ item.userName }}</span>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { init } from "@/mixin/init.js";
export default {
  mixins: [init],
  data() {
    return {
      show: true,
      value: '',
      timer: '',
      searchResult: [],
      classmates: [],
      maskShow: false
    }
  },
  watch: {
    value(newVal) {
      this.searchResult = [];
      if (newVal.trim() !== "") {
        this.maskShow = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.getUserInfo(newVal.trim());
        }, 1000);
      } else {
        this.maskShow = false;
        clearTimeout(this.timer);
      }
    }
  },
  created() {
    this.getMyInfo().then(res => {
      let myInfo = res.data.userInfo;
      if (myInfo.tag == 2) {
        this.show = false;
        this.getClassmates();
      } else {
        this.show = true;
      }
    })
    this.$store.commit('changeTitle', '通讯录');
  },
  methods: {
    // 同班同学列表
    async getClassmates() {
      let res = await this.$get('/alumni/userController/getClassmates');
      if (res.status == 200) {
        this.classmates = res.data;
      }
    },
    // 查看通讯录好友详情
    toDetail(item) {
      this.$router.push(`/next/contact-detail?userId=${item.userId}`);
    },
    async getUserInfo(val) {
      let res1 = await this.$get('/alumni/userController/getUserInfo',{
        userName: val,
        classId: this.$store.state.classId
      });
      this.searchResult = res1.data;
      let reg_phone = /^1[3456789]\d{0,9}$/; // 验证输入的是否符合手机号格式,可以不完整
      let res2;
      if (reg_phone.test(val)) {
        res2 = await this.$get('/alumni/userController/getUserInfo', {
          phone: val,
          classId: this.$store.state.classId
        });
        this.searchResult.push(...res2.data);
      }
      this.searchResult.forEach((item, index) => {
        // 不包括自己
        if (item.userId == this.$store.state.userId) {
          this.searchResult.splice(index, 1);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  text-align: left;
}
// .my-content {
//   background-color: #fff;
// }
.tip {
  display: flex;
  align-items: center;
  justify-content: center;
}
.contact-item {
  background-color: #fff;
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 5px;
    box-shadow: 0 0 2px 2px rgba($color: #000000, $alpha: .1);
  }
  &>span {
    font-size: 18px;
  }
  &:active {
    background-color: #ecf0f1;
  }
}
.mask {
  position: absolute;
  overflow: hidden;
  top: 100px;
  z-index: 15;
  width: 100vw;
  min-height: calc(100vh - 100px);
  background-color: rgba($color: #7f8c8d, $alpha: .5);
  .contact-item {
    transition: all 0.5s;
  }
}
.list-enter {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
