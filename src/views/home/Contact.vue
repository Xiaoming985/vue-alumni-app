<!-- 通讯录 -->
<template>
  <div>
    <van-search clearable v-model="value" shape="round" background="#4fc08d" placeholder="输入用户名或者账号试试" />
    <div class="contact-item" v-for="(item, index) in classmates" :key="index" @click="toDetail(item)">
      <img :src="item.headImage" alt="">
      <span>{{ item.userName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      classmates: []
    }
  },
  created() {
    this.getClassmates();
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
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  text-align: left;
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
</style>
