<template>
  <div class="top">
    <h1 class="repo-name" @click="open(repo.repo.html_url)">
      <i class="mega-octicon octicon-home pr10"></i>{{ repo.repo.name }}
    </h1>
    <div class="repo-date-info">
      <span class="pr10">Created: {{ repo.repo.created_at | time}}</span>
      <span>Pushed: {{ repo.repo.pushed_at | time }}</span>
    </div>

    <p class="repo-description">{{ repo.repo.description }}</p>

    <p class="repo-remark" v-if="remark">
      {{ remark }}
    </p>
    
    <div class="repo-operation">
      <i class="fa fa-edit" aria-hidden="true" @click="editRemark"></i>
      <i class="fa fa-clipboard" aria-hidden="true" 
        v-clipboard:copy="repo.repo.ssh_url"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        >
      </i>
      <i class="fa fa-star" aria-hidden="true" @click="unstar"></i>
      <CategorySelector :repo="repo" class="category-selector"/>
      <!-- <gh-btns-star slug="vuejs/vue" show-count></gh-btns-star> -->
    </div>

    <el-dialog :title="remark ? '编辑备注' : '新增备注'" :visible.sync="isVisible" :modalAppendToBody="false">
      <el-form>
        <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入对该仓库的备注"
          v-model="textarea">
        </el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {starRepo, unstarRepo, addRepos} from '@/api/repository'
import {addRemark} from '@/api/remark'
import CategorySelector from '@/pages/index/components/CategorySelector'
// import Vue from 'vue';
// import VueGitHubButtons from 'vue-github-buttons';
 
// // Stylesheet
// import 'vue-github-buttons/dist/vue-github-buttons.css';

// Vue.use(VueGitHubButtons);

export default {
  data() {
    return {
      isVisible: false,
      textarea: '',
    }
  },
  computed: {
    // repo() {
    //   return this.$store.state.user.selectedRepo
    // },
    remark() {
      return this.$store.getters.showedRemark
    },
    remarks() {
      return this.$store.state.user.remarks
    }
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    clickCb() {
      return false
    },
    unstar() {
      unstarRepo(this.repo.repo.full_name).then(res => {
        this.$message({
          message: 'unstar 操作成功！',
          type: 'success'
        });

        this.$store.commit('set_starred_count', this.$store.state.user.starredCount - 1)

        // 把这个 repo 去掉
        let newRepos = this.$store.state.user.repos.filter(item => item.repo.id !== this.repo.repo.id)
        this.$store.commit('set_repos', newRepos)
        this.$store.commit('change_selected_repo', '')
    
        // 新数据入库
        addRepos(JSON.stringify(newRepos), this.$store.state.user.userId).then(res => {})
      })
    },
    onCopy() {
      this.$message({
        message: 'SSH URL 复制成功！',
        type: 'success'
      });
    },
    onError() {
      console.log('复制失败')
    },
    editRemark() {
      this.isVisible = true
      this.textarea = this.remark
    },
    addRemark() {
      let remark = this.textarea.trim()
      addRemark(this.repo.repo.id, this.$store.state.user.userId, remark).then(res => {
        this.isVisible = false 
        
        // 更新 vuex 中的 remarks=
        this.$store.commit('set_remarks', res.data)

        this.$message({
          message: '添加备注成功！',
          type: 'success'
        });
      })
    }
  },
  components: {CategorySelector},
  filters: {
    time(t) {
      let d = new Date(t)
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    }
  },
  props: ['repo']
}
</script>

<style lang="scss">
  .top {
    position: sticky;
    top: 0;
    background: #fff;
    padding: 0 30px 15px 15px;
    font-size: 12px;

    .repo-name {
      display: flex;
      align-items: center;
      &:hover {cursor: pointer; }
      .octicon-home {color: #999; font-size: 24px;}
    }

    .repo-date-info {
      color: #999;
      margin-bottom: 10px;
    }

    .repo-description {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .repo-remark {
      background-color: #f4f4f5;
      color: #909399;
      margin-bottom: 10px;
      border-radius: 4px;
      padding: 10px;
    }

    .repo-operation {
      display: flex;
      align-items: center;
      font-size: 14px;
      .fa {
        margin-right: 10px;
        color: #999;
        &:hover {cursor: pointer; color: #666}
      }
      .category-selector {font-size: 12px}
    }
  }
</style>