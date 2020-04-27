<template>
  <div class="msg-section">
    <img :src="msg.headImage" alt="" class="avatar">
    <div class="msg-content">
      <span class="user name">{{msg.userName}}</span>
      <div>
        {{msg.content}}
      </div>
      <div class="images">
        <img :src="item" alt="" v-for="(item, index) in imgList" :key="index" @click="previewImg(imgList, index)">
      </div>
      <div class="content-btn">
        <div>
          <span class="time">{{msg.msgTime}}</span>
          <span class="delete" @click="deleteMsg(index)" v-show="msg.userId == userId">删除</span>
        </div>
        <div class="comment">
          <van-icon name="like" size="20" color="#eb2f06" @click="like()" />
          <van-icon name="comment" size="20" color="#07c160" @click="show=true" />
        </div>
      </div>
      <div class="content-like" v-if="praise!=''">
        <van-icon name="like" size="20" color="#eb2f06" />
        <span class="name">{{names}}</span>
      </div>
      <div class="content-comment" v-if="reply!=''">
        <div v-for="(item,index) in reply" :key="index" @click="deleteCommmet(item ,index)">
          <span class="name">{{item.userName}}</span>
          <span>：{{item.reContent}}</span>
        </div>
      </div>
    </div>
    <van-popup v-model="show" position="bottom" class="reply-bottom">
      <van-field v-model="message" rows="1" placeholder="评论" autosize type="textarea" autofocus>
        <template #button>
          <van-button size="small" type="primary" @click="send">发送</van-button>
        </template>
      </van-field>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ImagePreview } from 'vant';
export default {
  props: ['msg','index','userName'],
  data() {
    return {
      praise: [],
      names: '',
      show: false,
      message: '',
      imgList: [], // 图片列表
      show: false,
    }
  },
  mounted() {
    this.returnNames();
    if(this.msg.images) {
      this.imgList = this.msg.images.trim().split(" ");
    }
  },
  computed: {
    ...mapGetters(['userId']),
    reply: function() {
      return this.msg.reply
    }
  },
  methods: {
    // 图片预览
    previewImg(imgList, index) {
      ImagePreview({
        images: imgList,
        showIndex: true,
        loop: false,
        startPosition: index
      })
    },
    // 点赞的名字 字符串
    returnNames() {
      this.praise = this.msg.praise;
      let arr = [];
      this.praise.forEach(element => {
        arr.push(element.userName);
      });
      this.names = arr.join("、");
    },
    deleteMsg(index) {
      this.$dialog.confirm(
        {message: '确定要删除这条留言吗?'}
      ).then(async () => {
        this.$emit('delete', index);
        console.log(this.msg.msgId);
        await this.$post('/alumni/leaveController/deleteLeave',this.$qs.stringify({msgId: this.msg.msgId}));
      }).catch(() => {
        this.$toast("已取消删除");
      })
    },
    like(msg) {
      let flag = false; // 是否已经点过赞
      let temp = null;
      this.praise.some(item => {
        if (item.userId == this.userId) {
          flag = true;
          temp = item;
        } 
      });
      switch (flag) {
        case true:
          let index = this.praise.indexOf(temp);
          this.praise.splice(index, 1);
          this.returnNames();
          console.log("取消赞");
          this.cancelLike();
          break;
        case false:
          this.praise.push({userId: this.userId, userName: this.userName});
          this.returnNames();
          console.log("点赞");
          this.onLike();
          break;
        default:
          break;
      }
    },
    // 点赞
    async onLike() {
      await this.$post('/alumni/leaveController/addPraise',this.$qs.stringify({msgId: this.msg.msgId, userId: this.userId}));
    },
    // 取消赞
    async cancelLike() {
      await this.$post('/alumni/leaveController/cancelPraise',this.$qs.stringify({msgId: this.msg.msgId, userId: this.userId}));
    },
    async send() {
      if (this.message == '') {
        this.$toast("输入内容不能为空");
      } else {
        this.reply.push({
          userId: this.userId,
          userName: this.userName,
          reContent: this.message
        });
        await this.$post('/alumni/leaveController/replyLeave',this.$qs.stringify({
          msgId: this.msg.msgId, 
          reContent: this.message,
          userId: this.userId
        }));
        this.show = false;
        this.message = '';
      }
    },
    deleteCommmet(item, index) {
      if(item.userId == this.userId) {
        this.$dialog.confirm({
          message: '确定要删除这条评论吗?'
        }).then(async () => {
          this.reply.splice(index, 1);
          await this.$post('/alumni/leaveController/deleteReply',this.$qs.stringify({reId: item.reId}));
        }).catch(() => {
          this.$toast("已取消删除");
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.msg-section {
  display: flex;
  box-sizing: border-box;
  padding: 10px 16px;
  border-bottom: 1px solid #d9d9d9;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 5px;
    box-shadow: 0 0 2px 2px rgba($color: #000000, $alpha: .1);
    margin: 0 16px 0 0;
  }

  .msg-content {
    width: 100%;
    text-align: left;

    .user {
      display: block;
      margin-bottom: 3px;
    }

    .name{
      color: #4a69bd;
      font-weight: bold;
    }

    .content-btn {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .time {
        font-size: 12px;
        color: #7f8c8d;
      }
      .delete {
        font-size: 12px;
        color: #3498db;
        margin-left: 10px;
        &:active {
          color: #c0392b;
        }
      }
      .comment > .van-icon{
        margin-left: 30px;
        &:active{
          transform: scale(.9); // 缩放
        }
      }
    }

    .content-like {
      border-bottom: 1px solid #d9d9d9;
      display: flex;
    }

    .content-like,
    .content-comment {
      background-color: #ecf0f1;
      padding: 5px;
      font-size: 14px;
      div:active {
        background-color: #7f8c8d;
      }
    }
  }

  .reply-bottom {
    padding: 10px;
    display: flex;
    background-color: #d9d9d9;
    box-sizing: border-box;
    .van-field {
      padding: 5px;
      border-radius: 5px;
    }
  }

  .images {
    margin-top: 5px;
    img {
      width: 60px;
      height: 60px;
      margin-right: 5px;
    }
  }
}
</style>