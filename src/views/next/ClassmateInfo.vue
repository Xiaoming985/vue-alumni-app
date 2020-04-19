<template>
  <div>
    <van-nav-bar left-text="返回" left-arrow fixed @click-left="back"></van-nav-bar>

    <div class="my-content">
      <van-field readonly label="头像">
        <template #input>
          <img :src="classmate.headImage" alt="" class="avatar" @click="preview">
        </template>
      </van-field>
      <van-field readonly label="昵称" :value="classmate.userName" />
      <van-field readonly label="真实姓名" :value="classmate.name" />
      <van-field readonly label="性别" :value="classmate.gender" />
      <van-field readonly label="生日" :value="classmate.birth" />
      <van-field readonly label="手机号" :value="classmate.phone" />
      <van-field readonly label="邮箱" :value="classmate.email" />
      <van-field readonly label="住址" :value="classmate.address" />
      <van-field readonly label="个性签名" type="textarea" autosize rows="1" :value="classmate.motto" />
      <van-field readonly label="学校" :value="classmate.schoolName" />
      <van-field readonly label="年级" :value="classmate.grade" />
      <van-field readonly label="班级" :value="classmate.className" />
    </div>
  </div>
</template>

<script>
import { init } from '@/mixin/init.js'
import { ImagePreview } from 'vant';
export default {
  mixins: [init],
  data() {
    return {
      classmate: {}
    }
  },
  computed: {
    
  },
  created() {
    this.getUserInfoById(this.$route.query.userId).then(res => {
      this.classmate = res.data[0]
    })
    this.$store.commit('changeTitle', '');
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    preview() {
      ImagePreview([this.classmate.headImage]);
    },
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin-top: 46px;
  min-height: calc(100vh - 46px);
  background-color: rgba($color: #d9d9d9, $alpha: .3);
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 5px;
}
</style>
