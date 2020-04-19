<template>
  <div class="common my-content">
    <van-panel title="个人信息">
      <van-field name="uploader" label="头像" clickable is-link @click="myclick">
        <template #input>
          <img :src="userInfo.headImage" alt="">
          <van-uploader :after-read="afterRead" :max-count="1" ref="uploader" style="display: none" /> 
        </template>
      </van-field>

      <van-field v-model="userInfo.userName" label="昵称" placeholder="用户名" />
      <van-field v-model="userInfo.name" label="真实姓名" placeholder="输入真实姓名有利于同学认出你哦!" />
      <van-field label="性别">
        <template #input>
          <van-radio-group v-model="userInfo.gender" direction="horizontal">
            <van-radio name="男">男</van-radio>
            <van-radio name="女">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field readonly clickable name="picker" :value="userInfo.birth" label="生日" placeholder="点击选择日期" @click="showDate = true" />
      <van-field v-model="userInfo.phone" type="tel" label="手机号" placeholder="输入有效手机号" readonly />
      <van-field v-model="userInfo.email" label="邮箱" placeholder="输入有效邮箱" />
      <van-field name="area" :value="userInfo.address" label="住址" readonly clickable
        placeholder="点击选择省市区" @click="showArea = true" />
      <van-field v-model="userInfo.motto" label="个性签名" type="textarea" autosize rows="1" placeholder="你就是这条gai最靓的仔!" />
    </van-panel>

    <van-button type="primary" block @click="updateUserInfo">确认</van-button>

    <!-- 弹出层 -->
    <van-popup v-model="showDate" position="bottom">
      <van-datetime-picker  @confirm="onConfirmDate" type="date"
        :min-date="new Date(1990, 0, 1)" :max-date=" new Date()" />
    </van-popup>
    
    <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onConfirmArea"
        @cancel="showArea = false"
      />
    </van-popup>
  </div>
</template>

<script>
import areaList from '@/assets/js/area';
import { init } from '@/mixin/init.js';
export default {
  mixins: [init],
  data() {
    return {
      // headImage: [], // 头像选中后,预览
      userInfo: { // 用户信息
        userName: '',
        name: '',
        gender: '',
        birth: '',
        phone: '',
        email: '',
        address: '',
        motto: '',
        headImage: '', // 头像路径
      },

      showDate: false,

      areaList,
      showArea: false,
    }
  },
  created() {
    this.$store.commit('changeTitle', '');
    this.getMyInfo().then(res => {
      this.userInfo = res.data.userInfo;
      // this.headImage = [{url: res.data.userInfo.headImage}];
    });
  },
  methods: {
    myclick() {
      this.$refs.uploader.chooseFile(); // 主动调起文件选择
    },
    // 文件读取完成后的回调函数
    async afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
      let arr = this.userInfo.headImage.split("/"); // 根据 "/" 将字符串分割成字符串数组
      let fileName = arr[arr.length - 1]; // 数组最后一个元素即文件名
      let fd = new FormData();//通过form数据格式来传
      fd.append("headImage", fileName);
      fd.append("file", file.file); //传文件
      // console.log(fd.get('file'));
      let res = await this.$post('/alumni/userController/uploadHead', fd); // 上传头像
      if(res.status == 200) {
        this.$toast.success('上传成功');
      } else if(res.status == 500) {
        this.$toast.fail('网络似乎出现了故障');
      }
    },
    onConfirmDate(date) {
      this.userInfo.birth = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      this.showDate = false;
    },
    onConfirmArea(values) {
      this.userInfo.address = values.map(item => item.name).join('/');
      this.showArea = false;
    },
    async updateUserInfo() {
      let res = await this.$post('/alumni/userController/updateUserInfo',this.$qs.stringify(this.userInfo));
      if(res.status == 200) {
        this.$toast.success("修改成功!");
        setTimeout(()=>{
          this.$router.go(-1);
        },500);
      } else {
        this.$toast.fail('网络似乎出现了故障');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.common {
  padding-bottom: 60px;
}
.van-panel__header {
  font-weight: 600;
}
.van-panel__header,
.van-panel__content {
  text-align: left;
}
.van-button {
  width: 90vw;
  margin: 10px auto 0;
}

.van-cell {
  width: 100%;
  align-items: center;
  .van-cell__value {
    text-align: left;
  }
  img {
    width: 60px;
    height: 60px;
    border: 1px solid rgba($color: #000000, $alpha: .1);
    border-radius: 5px;
  }
}
</style>
