<!-- 相册详情 -->
<template>
  <div class="my-content">
    <!-- 相册详情头部,展示相册信息 -->
    <div class="album-header">
      <div class="album-bg" :style="albumCover"></div>
      <div class="album-info">
        <div class="album-cover" :style="albumCover"></div>
        <div class="msg">
          <div v-show="album.userId != $store.state.userId">用户名：{{ album.userName }}</div>
          <div>相册名称：{{ album.albumName }}</div>
          <div>相册描述：{{ album.albumDesc }}</div>
          <div>Sum：<span>{{ imgCount }}</span></div>
          <div v-show="album.userId == $store.state.userId">
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
          <span>{{item.date}}</span>
          <!-- <span>
            <van-checkbox shape="square" v-if="hidden" v-model="checkArr[idx]" @change="change(idx)"></van-checkbox>
          </span> -->
        </div>
        <van-checkbox-group v-model="checkArr[idx]">
          <div class="images" v-for="(item2, index2) in item.images" :key="index2">
            <van-checkbox shape="square" checked-color="#07c160" v-if="hidden" :name="item2.imgId"></van-checkbox>
            <img :src="item2.imgUrl" alt="" @click="previewImg(item2.imgUrl)">
          </div>
        </van-checkbox-group>
      </div>
    </div>
    <!-- 底部工具栏 -->
    <div class="tool">
      <div :class="['tool-bar', {'tool-bar__hidden': hidden}]">
        <van-button type="primary" icon="upgrade" @click="upload">上传</van-button>
        <van-uploader ref="uploader" :after-read="afterRead" multiple v-model="fileList"></van-uploader>
        <van-button type="warning" icon="setting-o" @click="hidden = !hidden">管理</van-button>
      </div>
      <div :class="['tool-bar', {'tool-bar__visible': hidden}]">
        <van-button type="danger" icon="delete" @click="deleteImg">删除</van-button>
        <van-button type="info" icon="cross" @click="cancel">取消</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
export default {
  data() {
    return {
      album: {}, // 相册基本信息
      imgCount: 0, // 图片总数
      imgList: [], // 相册中图片列表
      hidden: false, // 勾选框是否隐藏
      fileList: [], // uploader读取到文件列表
      checkArr: []
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
    this.getAlbumInfo(albumId);
    this.getImg(albumId);
  },
  methods: {
    // 获取相册的基本信息
    async getAlbumInfo(albumId) {
      let res = await this.$get('/alumni/albumController/getAlbumById', {
        albumId: albumId
      });
      if(res.status == 200) {
        this.album = res.data.album;
        // this.imgCount = res.data.imgCount;
      }
    },
    // 获取相册的图片
    async getImg(albumId) {
      let res = await this.$get('/alumni/albumController/getImg', {
        albumId: albumId
      });
      if (res.status == 200) {
        this.imgCount = res.data.imgCount;
        // 根据时间归类
        res.data.imgList.forEach((item, index) => {
          var idx = -1;
          var isExist = this.imgList.some((ele, i) => {
            if (item.imgTime.substring(0, 10) === ele.date.substring(0, 10)) {
              idx = i;
              return true;
            }
          });
          if (!isExist) { // 当前时间没有,添加新的时间项
            this.imgList.push({
              date: item.imgTime.substring(0 ,10),
              images: [
                {
                  imgId: item.imgId,
                  imgUrl: item.imgUrl,
                  // imgTime: item.imgTime,
                  userId: item.userId,
                  // albumId: item.albumId
                }
              ]
            });
          } else { // 当前时间已经有了,往images里添加
            this.imgList[idx].images.push({
              imgId: item.imgId,
              imgUrl: item.imgUrl,
              userId: item.userId
            })
          }
        });
      }
    },
    editAlbum() {
      this.$router.push(`/next/album-create?albumId=${this.album.albumId}`);
    },
    deleteAlbum() {
      this.$dialog.confirm({
        message: '删除相册后无法恢复，请少主三思!'
      }).then(async () => {
        let res = await this.$post("/alumni/albumController/deleteAlbum",this.$qs.stringify({
          albumId: this.album.albumId
        }));
        if (res.status == 200) {
          this.$toast("删除成功");
          this.$router.go(-1);
        }
      }).catch(() => {
        this.$toast("已取消");
      });
    },
    upload() {
      // 主动调起文件选择
      this.$refs.uploader.chooseFile();
    },
    // 文件读取完成后的回调函数
    async afterRead() {
      let fd = new FormData();
      fd.append("albumId", this.album.albumId);
      this.fileList.forEach(element => {
        fd.append("files", element.file);
      });
      let res = await this.$post("/alumni/albumController/uploadImg", fd);
      if (res.status == 200) {
        this.getImg(this.$route.query.albumId);
        this.$toast("上传成功");
      }
    },
    // change(idx) {
    //   if (this.arr[idx] == true) {
    //     let check = document.getElementsByClassName("check")[idx];
    //     check.toggleAll(true);
    //   }
    // },
    // 删除相片
    deleteImg() {
      this.$dialog.confirm({
        message: '删除相片后无法恢复，请少主三思!'
      }).then(async () => {
        let imgIdArr = [];
        this.checkArr.forEach(element => {
          element.forEach(item => {
            imgIdArr.push(item);
          });
        });
        console.log(imgIdArr);
        let res = await this.$post("/alumni/albumController/deleteImg", this.$qs.stringify({
          imgId: imgIdArr.join()
        }));
        if (res.status == 200) {
          this.getImg(this.$route.query.albumId);
          this.$toast("删除成功");
        }
      }).catch(() => {
        if (res.status == 500) {
          this.$toast("Network Error!");
        } else {
          this.$toast("已取消");
        }
      });
    },
    // 图片预览
    previewImg(imgUrl) {
      let imgUrlArr = [];
      this.imgList.forEach(element => {
        element.images.forEach(item => {
          imgUrlArr.push(item.imgUrl);
        });
      });
      let imgIndex = imgUrlArr.indexOf(imgUrl);
      // 未进入管理状态下,即勾选框未显示的情况下,预览图片
      if (!this.hidden) {
        ImagePreview({
          images: imgUrlArr,
          showIndex: true,
          loop: false,
          startPosition: imgIndex
        });
      } else {
        let clickDom = document.getElementsByClassName("images")[imgIndex];
        let checkbox = clickDom.firstElementChild;
        checkbox.click();
      }
    },
    // 取消管理
    cancel() {
      this.hidden = !this.hidden;
      this.checkArr = [];
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
      margin-top: 5px;
      &:nth-of-type(4) span {
        font-size: 18px;
        color: #fc0;
      }
      &:nth-of-type(5) {
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
      font-weight: bold;
      font-size: 18px;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;
      span{
        margin-right: 10px;
      }
    }
    .images {
      display: inline-block;
      width: 23.75vw;
      height: 23.75vw;
      padding-right: 1vw;
      position: relative;
      .van-checkbox-group {
        width: 100%;
        height: 100%;
      }
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
