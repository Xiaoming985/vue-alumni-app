<!-- 我的相册 -->
<template>
  <div class="my-content">
    <van-tabs v-model="active" swipeable animated>
      <van-tab title="个人相册">
        <AlbumSection v-for="(item, index) in userAlbums" :key="index" :albumInfo="item"></AlbumSection>
      </van-tab>
      <van-tab title="班级相册">
        <AlbumSection v-for="(item, index) in classAlbums" :key="index" :albumInfo="item"></AlbumSection>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import AlbumSection from '@/components/AlbumSection.vue'
export default {
  data() {
    return {
      active: 0,
      userAlbums: [],
      classAlbums: []
    }
  },
  components: {
    AlbumSection
  },
  created() {
    if (this.$route.query.userId == this.$store.state.userId) {
      this.$store.commit('changeTitle', '我的相册');
    } else {
      this.$store.commit('changeTitle', 'Ta的相册');
    }
    this.getUserAlbum();
    this.getClassAlbum();
  },
  methods: {  
    async getUserAlbum() {
      let res = await this.$get('/alumni/albumController/getUserAlbum', {
        userId: this.$route.query.userId
      });
      if (res.status == 200) {
        this.userAlbums = res.data;
      }
    },
    async getClassAlbum() {
      let res = await this.$get('/alumni/albumController/getClassAlbum', {
        classId: this.$store.state.classId
      });
      if(res.status == 200) {
        this.classAlbums = res.data;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div.my-content {
  background-color: #fff;
  .van-tab__pane-wrapper {
    padding-left: 4vw;
    min-height: calc(100vh - 90px);
  }  
}
</style>