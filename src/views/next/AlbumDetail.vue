<!-- 相册详情 -->
<template>
  <div class="my-content">
    <!-- 相册详情头部,展示相册信息 -->
    <div class="album-header">
      <div class="album-bg" :style="albumCover"></div>
      <div class="album-info">
        <div class="album-cover" :style="albumCover"></div>
        <div class="msg">
          <div>相册名称：{{ this.album.albumName }}</div>
          <div>相册描述：{{ this.album.albumDesc }}</div>
          <div>Sum：<span>0</span></div>
          <div v-show="this.album.userId == this.$store.state.userId">
            <van-button icon="edit" type="info" size="small" @click="editAlbum">编辑</van-button>
            <van-button icon="delete" type="danger" size="small" @click="deleteAlbum">删除</van-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 相片列表 -->
    <div class="album-list">
      <div class="album-list-item" v-for="(item, idx) in imgList" :key="idx">
        <div class="album-list-hd">
          <div class="hd__time">
            <span>{{item.imgTime}}</span>
            <span>
              <van-checkbox shape="square" v-if="hidden"></van-checkbox>
            </span>
          </div>
        </div>
        <div class="images">
          <img :src="item.imgUrl" alt="">
          <van-checkbox shape="square" v-if="hidden"></van-checkbox>
        </div>
      </div>
    </div>
    <!-- 底部工具栏 -->
    <div class="tool">
      <div :class="['tool-bar', {'tool-bar__hidden': hidden}]">
        <van-button type="primary" icon="upgrade" @click="upload">上传</van-button>
        <van-uploader ref="uploader" :after-read="afterRead" multiple></van-uploader>
        <van-button type="warning" icon="setting-o" @click="hidden = !hidden">管理</van-button>
      </div>
      <div :class="['tool-bar', {'tool-bar__visible': hidden}]">
        <van-button type="danger" icon="delete" @click="deleteImg">删除</van-button>
        <van-button type="info" icon="cross" @click="hidden = !hidden">取消</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      album: {},
      imgList: [
        {
          imgTime: "2020/4/17",
          imgDesc: "真好看",
          imgUrl: "/alumni/leave/class4/20200410_234651_2.jpg"
        }
      ],
      hidden: false
    }
  },
  computed: {
    albumCover() {
      return `background-image: url(${this.album.albumCover})`;
    }
  },
  created() {
    this.$store.commit('changeTitle', '相册详情');
    // 当前路由对象下的query对象,包含请求参数
    // query会在地址栏显示请求参数,params在地址栏中不显示请求参数
    // console.log(this.$route)
    let albumId = this.$route.query.albumId;
    this.getImg(albumId);
  },
  methods: {
    // 获取相册的信息(包括相册的基本信息,和相册的内容)
    async getImg(albumId) {
      let res = await this.$get('/alumni/albumController/getImg', {
        albumId: albumId
      });
      if (res.status == 200) {
        this.album = res.data.album;
        // this.imgList = res.data.imgList;
      }
    },
    editAlbum() {
      this.$router.push(`/next/album-create?albumId=${this.album.albumId}`);
    },
    deleteAlbum() {
      this.$dialog.confirm({
        message: '删除相册不能恢复，请少主三思!'
      }).then(async () => {

      }).catch(() => {
        this.$toast("已取消");
      });
    },
    upload() {
      // 主动调起文件选择
      this.$refs.uploader.chooseFile();
    },
    // 文件读取完成后的回调函数
    async afterRead(files) {
      let fd = new FormData();
      fd.append("albumId", this.album.albumId);
      files.forEach(element => {
        fd.append("files", element.file);
      });
      let res = await this.$post("/alumni/albumController/uploadImg", fd);
      if (res.status == 200) {
        this.$toast("上传成功");
      }
    },
    deleteImg() {
      
    }
  }
}
</script>

<style lang="scss" scoped>
div.my-content {
  background-color: #fff;
  .album-header {
    margin-bottom: 7px;
  }
}
.album-bg {
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(5px);
}
.album-info {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;
  position: absolute;
  z-index: 5;
  top: 46px;
  .album-cover {
    width: 45vw;
    height: 150px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border: solid 1px #f0f2f3;
  }
  .msg {
    margin-left: 10px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    div {
      margin-top: 10px;
      &:nth-of-type(3) span {
        font-size: 18px;
        color: #fc0;
      }
      &:nth-of-type(4) {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.album-list {
  padding-bottom: 60px;
  padding-left: 1vw;
  .album-list-item {
    .album-list-hd {
      .hd__time {
        font-weight: bold;
        font-size: 18px;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        span{
          margin-right: 10px;
        }
      }
    }
    .images {
      display: inline-block;
      width: 23.75vw;
      height: 23.75vw;
      padding-right: 1vw;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .van-checkbox {
        position: absolute;
        top: 0.5vw;
        right: 1.5vw;
        z-index: 2;
        background-color: #fff;
      }
    }
  }
}
.tool {
  width: 100%;
  height: 50px;
  position: fixed;
  z-index: 5;
  bottom: -1px;
}
.tool-bar {
  height: 50px;
  box-sizing: border-box;
  border-top: 1px solid #d9d9d9;
  transform: translateY(0);
  transition: all 0.6s ease-in-out; // all即下面两个变换属性?
  .van-button {
    width: 50%;
    height: 100%;
  }
  .van-uploader {
    display: none;
  }
}
.tool-bar__hidden {
  transform: translateY(100%);
  transition: transform 0.6s ease-in-out;
}
.tool-bar__visible {
  transform: translateY(-100%);
  transition: transform 0.6s ease-in-out;
}
</style>
