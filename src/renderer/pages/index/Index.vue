<template>
  <div id="main" v-loading="isLoading">
    <Left class="left" :style="styleObject"/>
    <Middle class="middle" :style="styleObject"/>
    <Right class="right" :style="styleObject"/>
  </div>
</template>

<script>
import Left from './left/Left'
import Middle from './middle/Middle'
import Right from './right/Right'
const {ipcRenderer} = require('electron')

export default {
  data() {
    return {
      styleObject: {
        height: '500px'
      }
    }
  },
  components: {Left, Middle, Right},
  created() {
    this.styleObject.height = this.getClientHeight()

    const self = this
    window.onresize = function() {
      self.styleObject.height = self.getClientHeight()
    }

    // login 验证
    const token = localStorage.getItem('token')

    // 本地有数据
    if (token) {
      this.login(token)
    } else {
      ipcRenderer.send('no-token')

      ipcRenderer.on('send-token', (event, token) => {
        this.login(token)
      })
    }
  },
  methods: {
    getClientHeight() {
      return document.documentElement.clientHeight + 'px'
    },
    login(token) {
      this.$store.commit('set_token', token)

      this.$store.dispatch('get_userInfo').then(() => {
        this.$store.dispatch('init_app')
      })
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.user.isLoading
    } 
  }
}
</script>

<style lang="scss">
#main {
  display: flex;
  .left {min-width: 200px; border-right: 1px solid #d2d2d2; overflow: scroll; background: #f7f3f0}
  .middle {min-width: 250px; max-width: 250px; border-right: 1px solid #d2d2d2; overflow: scroll;}
  .right { overflow: scroll; flex: 1}
}
</style>
