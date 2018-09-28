<template>
  <div class="wrapper">
    <i class="octicon octicon-mark-github"></i>
    <el-button @click="redirect" :loading="isLoading">用 GitHub 账号登录</el-button>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

export default {
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    redirect() {
      this.isLoading = true
      ipcRenderer.send('oauth-login')
    }
  }
}
</script>

<style lang="scss">
@import url("http://cdnjs.cloudflare.com/ajax/libs/octicons/3.1.0/octicons.css");

.wrapper {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  background: #e9e9e9;
  .octicon {font-size: 150px; margin-top: 60px; margin-bottom: 70px;}
  a {font-size: 20px; color: #212121;}
}
</style>
