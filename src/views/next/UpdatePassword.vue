<template>
  <div class="my-content">
    <van-field v-model="newPass" label="新密码" type="password" placeholder="" right-icon="closed-eye" />
    <van-field v-model="confPass" label="确认密码" type="password" placeholder="" right-icon="closed-eye" />
    <van-button type="primary" block @click="updatePassWord">确认修改</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPass: "",
      confPass: ""
    };
  },
  methods: {
    async updatePassWord() {
      if (this.newPass != this.confPass) {
        this.$toast("密码不一致");
        return;
      } else if (this.newPass == "" || this.confPass == "") {
        this.$toast("密码不能为空");
        return;
      }
      let res = await this.$post('/alumni/loginController/updatePassword',this.$qs.stringify({
        userId: this.$store.state.userId,
        password: this.newPass
      }));
      if (res.status == 200) {
        this.$toast.success("修改成功");
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.van-button {
  width: 90vw;
  margin: 10px auto 0;
  font-size: 18px;
}
</style>