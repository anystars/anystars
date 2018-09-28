<template>
  <div class="wrapper" v-if="repo">
    <RepoInfo :repo="repo"/>
    <RepoDetail :repo="repo"/>
  </div>
</template>

<script>
import RepoInfo from './RepoInfo'
import RepoDetail from './RepoDetail'

export default {
  components: {RepoInfo, RepoDetail},
  computed: {
    repo() {
      return this.$store.state.user.selectedRepo
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  .detail-content {flex: 1}
  z-index: 20;
}
</style>
