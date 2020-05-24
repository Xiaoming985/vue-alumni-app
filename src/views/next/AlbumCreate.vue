<!-- 新建相册/修改相册 -->
<template>
  <div class="my-content">
    <van-field label="相册名称：" v-model="albumName" maxlength="10" show-word-limit />
    <van-field label="相册描述：" v-model="albumDesc" maxlength="20" show-word-limit />
    <van-field label="相册类型：">
        <template #input>
          <van-radio-group v-model="isClass" direction="horizontal" :disabled="$route.query.albumId?true:false">
            <van-radio name="0">个人相册</van-radio>
            <van-radio name="1">班级相册</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    <van-field name="uploader" label="相册封面: " clickable>
      <template #input>
        <van-uploader v-model="albumCover" :after-read="afterRead" :deletable="true" :max-count="1" /> 
      </template>
    </van-field>
    <van-button type="info" block @click="createAlbum" v-show="$route.query.albumId?false:true">创建</van-button>
    <van-button type="primary" block @click="editAlbum" v-show="$route.query.albumId?true:false">保存</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      albumId: '',
      albumName: '',
      albumDesc: '',
      isClass: '0', // '0'默认选择个人相册,'1'班级相册
      albumCover: [],
      oldUrl: '' // 旧的相册封面路径
    }
  },
  created() {
    if (this.$route.query.albumId) {
      this.$store.commit('changeTitle', '修改相册');
      this.getAlbumById(this.$route.query.albumId);
    } else {
      this.$store.commit('changeTitle', '新建相册');
    }
  },
  methods: {
    afterRead(file) {
      // 读取文件后执行
    },
    async getAlbumById(albumId) {
      let res = await this.$get('/alumni/albumController/getAlbumById',{
        albumId: albumId
      });
      if (res.status == 200) {
        this.albumId =res.data.album.albumId;
        this.albumName = res.data.album.albumName;
        this.albumDesc = res.data.album.albumDesc;
        this.isClass = res.data.album.classId? '1' : '0';
        this.albumCover = [{url: res.data.album.albumCover}];
        this.oldUrl = res.data.album.albumCover;
      }
    },
    async createAlbum() {
      // 新建相册
      let fd= new FormData();
      fd.append("albumName", this.albumName);
      fd.append("albumDesc", this.albumDesc);
      fd.append("albumCover", this.albumCover[0].file);
      fd.append("isClass", this.isClass==='0'?false:true);
      let res = await this.$post('/alumni/albumController/createAlbum', fd);
      if (res.status == 200) {
        // 创建成功,跳转至我的相册页面
        this.$router.push('/next/album');
      }
    },
    async editAlbum() {
      // 编辑相册,修改相册信息
      let flag = this.albumCover[0].file?true:false;
      if (flag) {
        // 包含新的封面
        let arr = this.oldUrl.split("/"); // 根据 "/" 将字符串分割成字符串数组
        let fileName = arr[arr.length - 1]; // 数组最后一个元素即文件名
        let fd = new FormData();
        fd.append("albumId", this.albumId);
        fd.append("albumName", this.albumName);
        fd.append("albumDesc", this.albumDesc);
        fd.append("albumCover", this.albumCover[0].file);
        fd.append("isClass", this.isClass==='0'?false:true);
        fd.append("fileName", fileName);
        let res = await this.$post('/alumni/albumController/updateAlbumWithCover', fd);
        if (res.status == 200) {
          this.$router.go(-1);
        }
      } else {
        // 不包含封面
        let res = await this.$post('/alumni/albumController/updateAlbum',this.$qs.stringify({
          albumId: this.albumId,
          albumName: this.albumName,
          albumDesc: this.albumDesc
        }));
        if (res.status == 200) {
          this.$router.go(-1);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.van-button {
  width: 90vw;
  margin: 10px auto 0;
  font-size: 18px;
}
</style>
