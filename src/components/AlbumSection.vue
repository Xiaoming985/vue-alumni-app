<template>
  <router-link class="album" :to="url">
    <img :src="albumInfo.albumCover" alt="">
    <span id="album-name">{{ albumInfo.albumName }}</span>
    <span id="album-desc">{{ albumInfo.albumDesc }}</span>
    <!-- <span id="album-count">总数</span> -->
  </router-link>
</template>

<script>
export default {
  props: ['albumInfo'],
  data() {
    return {
      
    }
  },
  computed: {
    url() {
      return '/next/album-detail?albumId=' + this.albumInfo.albumId;
    }
  },
}
</script>

<style lang="scss" scoped>
.album {
  width: 44vw;
  box-sizing: border-box;
  display: inline-block;
  margin-right: 4vw;
  margin-top: 10px;
  &:active {
    img {
      transform: scale(.95); // 缩放
    }
  }
  img {
    width: 100%;
    height: 150px;
    border-radius: 10px;
  }
  span {
    display: block;
    padding-left: 5px;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 18px;
    &#album-name {
      font-size: 14px;
      font-weight: 600;
      color: #000;
    }
    &#album-desc {
      font-size: 12px;
      color: #333;
    }
    // &#album-count {
    //   font-size: 12px;
    //   color: #7f8c8d;
    // }
  }
}
</style>