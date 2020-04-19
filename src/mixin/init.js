export const init = {
  methods: {
    // 获取我的信息
    async getMyInfo() {
      return await this.$get('/alumni/userController/getMyInfo');
    },
    // 根据userId查询用户信息
    async getUserInfoById(userId) {
      return await this.$get('/alumni/userController/getUserInfo', {
        userId: userId
      });
    }
  }
}