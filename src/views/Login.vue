<template>
  <div class="main">
    <div class="loginBox">
      <router-link class="toRegist" to="/regist">
        <van-icon name="exchange" size="20" />
      </router-link>
      <h1>登录</h1>
      <div class="inputBox">
        <span class="label">账号</span>
        <van-icon name="user-o" size="25" />
        <input v-model="user.account" :class="{'has-val': user.account!=''}" type="text" placeholder="手机号" 
          @focus="isFocus = true" @blur="isFocus = false">
        <span :class="['common',{'input-focus': isFocus}]"></span>
      </div>
      <div class="inputBox">
        <span class="label">密码</span>
        <van-icon name="lock" size="25" />
        <input v-model="user.password" :class="{'has-val': user.password!=''}" type="password" placeholder="请输入密码"  
          @focus="isFocus2 = true" @blur="isFocus2 = false">
        <span :class="['common',{'input-focus': isFocus2}]"></span>
      </div>
      <span class="link">忘记密码?</span>
      <button @click="onLogin">登录</button>
    </div>
  </div>
</template>

<script>
import { init } from '@/mixin/init.js'
export default {
  mixins: [init],
  data() {
    return {
      user: {
        account: '',
        password: ''
      },
      isFocus: false,
      isFocus2: false
    }
  },
  methods: {
    async onLogin() {
      let reg_phone = /^1[3456789]\d{9}$/;
      if (this.user.account == '' || this.user.password == '') {
        this.$dialog.alert({
          message: '账号或密码不能为空!'
        }).then(() => {
          // on close
        });
      } else if (!reg_phone.test(this.user.account)) {
        this.$dialog.alert({message: '手机号码格式不正确,请重新输入!'});
      } else {
        let res = await this.$post("/alumni/loginController/login",this.$qs.stringify(this.user));
        if (res.status == 200) {
          this.getMyInfo(res.data[0].userId).then(response => {
            this.$store.commit('initUserId', response.data.userInfo.userId);
            this.$store.commit('initClassId', response.data.userInfo.classId);
            // this.$router.push(`/home/classMsg?userId=${response.data.userInfo.userId}`);
            this.$router.push(`/home`);
          }); // 登录成功,获取登录用户的信息
        } else if(res.status == 500) {
          this.$dialog.alert({
            message: '账号或密码错误,请重新登录!'
          }).then(() => {
            // on close
          });
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  background-image: url('../assets/images/bg-01.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}

.loginBox {
  background-color: #fff;
  width: 300px;
  padding: 20px 20px;
  box-shadow: 0 0 2px 2px rgba(#000,.3);
  border-radius: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  .toRegist {
    display: flex;
    justify-content: flex-end;
    font-weight: bold;
    color: #00dbde;
    &:active {
      color: #fc00ff;
    }
  }

  .inputBox{
    .van-icon {
      position: absolute;
      line-height: 40px;
      left: 25px;
    }
  }
}

.label {
  display: flex;
}

input {
  font-family: Poppins-Medium;
  font-size: 16px;
  color: #333333;
  display: block;
  // margin: 10px auto;
  width: 100%;
  background: transparent;
  box-sizing: border-box;
  padding: 10px 10px 10px 40px;
  outline: none !important;
	border: none;
  border-bottom: 2px solid #d9d9d9;
}

.has-val {
  border-color: #fc00ff;
}

.common {
  display: block;
  margin: -2px auto 10px;
  border-top: 2px solid transparent;
}

.input-focus {
  border-color: #fc00ff;
  animation: inputFocus 0.4s ease-in-out;
}

@keyframes inputFocus {
  from {
    width: 0%;
    border-color: #00dbde;
  }
  to {
    width: 100%;
    border-color: #fc00ff;
  }
}

.link {
  display: block;
  width: 100%;
  text-align: end;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
  &:active {
    color: #fc00ff;
  }
}

button {
  width: 100%;
  height: 50px;
  color: #fff;
  font-size: 20px;
  outline: none !important;
	border: none;
  border-radius: 25px;
	background: linear-gradient(to right, #00dbde, #fc00ff);
  margin:10px auto 20px;
  &:active {
    transform: scale(.95); // 缩放
  }
}
</style>