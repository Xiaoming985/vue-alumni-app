<template>
  <div class="main">
    <div class="loginBox">
      <router-link class="toLogin" to="/">
        <van-icon name="exchange" size="20" />
      </router-link>
      <h1>注册</h1>
      <div class="inputBox">
        <span class="label">账号</span>
        <van-icon name="user-o" size="25" />
        <input v-model="user.account" :class="{'has-val': user.account!=''}" type="text" placeholder="请使用手机号注册" 
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
      <div class="inputBox">
        <span class="label">确认密码</span>
        <van-icon name="certificate" size="25" />
        <input v-model="user.repassword" :class="{'has-val': user.password!=''}" type="password" placeholder="请确认密码"  
          @focus="isFocus3 = true" @blur="isFocus3 = false">
        <span :class="['common',{'input-focus': isFocus3}]"></span>
      </div>
      <button @click="onRegist">注册</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        account: '',
        password: '',
        repassword: ''
      },
      isFocus: false,
      isFocus2: false,
      isFocus3: false
    }
  },
  methods: {
    async onRegist() {
      let reg_phone = /^1[3456789]\d{9}$/;
      if (this.user.account == '' || this.user.password == '' || this.user.repassword == '') {
        this.$dialog.alert({message: '请填写完整!'});
      } else if (this.user.password != this.user.repassword) {
        this.$dialog.alert({
          message: '密码不一致,请重新输入!'
        }).then(() => {
          this.user.password = '';
          this.user.repassword = '';
        })
      } else if(!reg_phone.test(this.user.account)) {
        this.$dialog.alert({message: '手机号码格式不正确,请重新填写!'});
        this.user.account = '';
        this.user.password = '';
        this.user.repassword = '';
      } else {
        let res = await this.$get('/alumni/userController/getUserByAccount',{account: this.user.account});
        if (res.status == 200) {
          this.$dialog.alert({message: '该账号已存在!'});
        }
        let res2 = await this.$post('/alumni/loginController/regist',this.$qs.stringify(this.user));
        if (res2.status == 200) {
          this.$dialog.alert({message: '注册成功,现在就去登录吧!'}).then(() => {
            this.$router.push("/");
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
  
  .toLogin {
    display: flex;
    justify-content: flex-start;
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