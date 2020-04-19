<!-- 学籍认证 -->
<template>
  <div class="my-content">
    <van-panel title="学籍信息" :status="tag">
      <van-field readonly clickable name="picker" :value="selectedSchool" label="学校" 
        placeholder="点击选择学校" @click="showSchool = true" />
      <van-field readonly clickable name="picker" :value="selectedGrade" label="年级" 
        placeholder="点击选择年级" @click="showGrade = true" />
      <van-field readonly clickable name="picker" :value="selectedClass" label="班级" 
        placeholder="点击选择班级" @click="showClass = true" />
    </van-panel>
    <van-divider dashed :style="{ color: '#ee0a24', borderColor: '#ee0a24', padding: '0 16px' }">
      <van-icon name="info-o" />注意：提交后无法修改,请认真选择
    </van-divider>
    <van-button type="primary" block @click="updateAcademic" ref="confirmBtn">确认</van-button>

    <!-- 弹出层 -->
    <van-popup v-model="showSchool" position="bottom">
      <van-picker
        show-toolbar
        :columns="schoolName"
        @confirm="onConfirmSchool"
        @cancel="showSchool = false"
      />
    </van-popup>
    <van-popup v-model="showGrade" position="bottom">
      <van-picker
        show-toolbar
        :columns="grade"
        @confirm="onConfirmGrade"
        @cancel="showGrade = false"
      />
    </van-popup>
    <van-popup v-model="showClass" position="bottom">
      <van-picker
        show-toolbar
        :columns="className"
        @confirm="onConfirmClass"
        @cancel="showClass = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tag: '未认证',

      selectedSchool: '',
      schoolName: [],
      schoolOptions: [],
      showSchool: false,

      selectedGrade: '',
      grade: [],
      showGrade: false,
      
      selectedClass: '',
      className: [],
      classOptions: [],
      showClass: false
    }
  },
  created() {
    this.$store.commit('changeTitle', '');
    this.getSchool();
    this.getAcademic();
  },
  methods: {
    onConfirmSchool(value) {
      if (this.selectedSchool !== value) {
        this.grade = []; // 联动,重新选择时,清空下一级(年级)
        this.selectedGrade = '';
        this.className = []; // 联动,重新选择时,清空下一级(班级)
        this.selectedClass = '';
      }
      this.selectedSchool = value;
      this.schoolOptions.forEach(item => {
        if (item.schoolName == value) {
          this.getGrade(item.schoolId);
        }
      });
      this.showSchool = false;
    },
    onConfirmGrade(value) {
      if (this.selectedGrade !== value) {
        this.className = []; // 联动,重新选择时,清空下一级(班级)
        this.selectedClass = '';
      }
      this.selectedGrade = value;
      var schoolId;
      this.schoolOptions.forEach(item => {
        if (item.schoolName == value) {
          schoolId = item.schoolId;
        }
      });
      this.getClass(schoolId, value);
      this.showGrade = false;
    },
    onConfirmClass(value) {
      this.selectedClass = value;
      this.showClass = false;
    },
    async getSchool() {
      let res = await this.$get('/alumni/schoolController/getSchool');
      if (res.status == 200) {
        this.schoolOptions = res.data
        this.schoolOptions.forEach(element => {
          this.schoolName.push(element.schoolName);
        });
      }
    },
    async getGrade(val) {
      let res = await this.$get('/alumni/classController/getGradeBySchoolId',{schoolId: val});
      if (res.status == 200) this.grade = res.data;
    },
    async getClass(id, val) {
      let res = await this.$get('/alumni/classController/getClass',{schoolId: id, grade: val});
      if (res.status == 200) {
        this.classOptions = res.data;
        this.classOptions.forEach(item => {
          this.className.push(item.className);
        })
      }
    },
    async getAcademic() {
      let res = await this.$get('/alumni/userController/getMyInfo');
      if (res.status == 200 && res.data.userInfo.tag != 0){
        switch (res.data.userInfo.tag) {
          case 1:
            this.tag = '审核中';
            break;
          case 2:
            this.tag = '已认证';
            break;
          default:
            this.tag = '未认证';
            break;
        }
        this.selectedSchool = res.data.userInfo.schoolName;
        this.selectedGrade = res.data.userInfo.grade;
        this.selectedClass = res.data.userInfo.className;
        this.$refs.confirmBtn.disabled = "disabled";
      }
    },
    updateAcademic() {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '提交后无法修改,请认真做出选择哦!'
      }).then(async () => {
        // on confirm
        let obj = {};
        obj.tag = 1;
        this.classOptions.forEach(item => {
          if(item.className === this.selectedClass) obj.classId = item.classId;
        })
        let res = await this.$post('/alumni/userController/updateUserInfo',this.$qs.stringify(obj));
        if(res.status == 200) {
          this.$toast.success('已提交,请耐心等待审核!');
          this.getUserInfoById();
        }
        else if (res.status == 500) 
          this.$toast.fail('网络似乎出现了故障');
      }).catch(() => {
        // on cancel
        this.$toast.fail('已取消');
      });
      
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
