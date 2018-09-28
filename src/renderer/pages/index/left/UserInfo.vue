<template>
  <div v-if="userInfo" class="user">
    <div class="user-avatars">
      <img :src="userInfo.avatar_url" @click="open(userInfo.html_url)">
      <span>{{ userInfo.name }}</span>
    </div>
    
    <div class="user-info-count">
      <span class="item" @click="open(`https://github.com/${userInfo.login}?tab=stars`)">{{ starredCount }}</span>
      <span class="item" @click="open(`https://github.com/${userInfo.login}?tab=followers`)">{{ userInfo.followers }}</span>
      <span class="item" @click="open(`https://github.com/${userInfo.login}?tab=following`)">{{ userInfo.following }}</span>
    </div>

    <div class="user-info-count-word">
      <span class="item">Starred</span>
      <span class="item">Followers</span>
      <span class="item">Followering</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    starredCount() {
      return this.$store.state.user.starredCount
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  position: sticky;
  top: 0;
  z-index: 10;
  padding-bottom: 10px;
  background-color: inherit;
}

.user-avatars {
  display: flex;
  align-items: center;
  padding: 15px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

.user-info-count {
  display: flex;
  // font-size: 14px;
  padding: 5px;
  color: #212121;
  &:hover {cursor: pointer;}
  .item {
    flex: 1;
    text-align: center;
  }
}

.user-info-count-word {
  display: flex;
  padding: 5px;
  font-size: 10px; 
  color:#666;
  .item {
    flex: 1;
    text-align: center;
  }
}
</style>