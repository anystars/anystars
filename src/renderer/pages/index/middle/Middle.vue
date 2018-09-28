<template>
  <div id="wrapper">
    <div v-for="repo in repos" :key="repo.repo.id" @click="selectRepo(repo)" :class='["repo-item", repo.repo.id == activeId ? "active" : ""]'>
      <div class="user-info">
        <img :src="repo.repo.owner.avatar_url" width=16 height=16 class="user-avatars">
        <span class="user-name">{{ repo.repo.owner.login }}</span>
        <span class="starred-time">{{repo.starred_at | time}}</span>
      </div>

      <h3 class="repo-name">{{ repo.repo.name }}</h3>
      <div class="repo-description">{{ repo.repo.description }}</div>
      
      <div class="repo-info">
        <i v-if="repo.repo.language" :class="['devicon-' + Lang2Icon[repo.repo.language.toLowerCase()] + '-plain', 'colored', 'pr5']"></i>
        <span>{{ repo.repo.language }}</span>
        <div class="octicon-icons">
          <span class="pr5"><i class="octicon octicon-star pr2"></i>{{repo.repo.stargazers_count}}</span>
          <span><i class="octicon octicon-repo-forked pr2"></i>{{repo.repo.forks_count }}</span>
        </div>
      </div>

      <CategorySelector :repo="repo" class="category-selector"/>
    </div>    
  </div>
</template>

<script>
  import Lang2Icon from '@/utils/lang2Icon'
  import CategorySelector from '@/pages/index/components/CategorySelector'

  export default {
    data() {
      return {
        Lang2Icon: Lang2Icon,
        activeId: ''
      }
    },
    methods: {
      selectRepo(repo) {
        this.$store.commit('change_selected_repo', repo)
        this.activeId = repo.repo.id
      }
    },
    computed: {
      repos() {
        return this.$store.getters.chosenRepos
      },
      categories() {
        return this.$store.state.categories
      }
    },
    filters: {
      time(t) {
        let d = new Date(t)
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      }
    },
    components: {CategorySelector}
  }
</script>

<style lang="scss" scoped>
  #wrapper {
    .repo-item {
      padding: 15px;
      font-size: 10px;
      color: #333;
      border-bottom: 1px dashed #d2d2d2;
      word-wrap: break-word;
      &:hover {cursor: pointer;}

      .user-info {
        display: flex;
        align-items: center;
        color: #999;
        .user-avatars {margin-right: 5px;}
        .starred-time {flex: 1; text-align: right;}
      }

      .repo-name {
        font-size: 18px;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .repo-description {
        margin-bottom: 10px;
        font-size: 12px;
        color: #666;
      }

      .repo-info {
        margin-bottom: 10px;
        display: flex;
        color: #999;
        .octicon-icons {
          flex: 1;
          text-align: right;
          .octicon {font-size: 10px;}
        }
      }
    }

    .repo-item.active {
      background: #f6f6ff;
    }
  }
</style>
