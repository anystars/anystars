<template>
  <div>
    <div class="action-bar">
      <span><i class="fa fa-plus" @click="isVisible = true"></i></span>
      <span><i class="fa fa-refresh" @click="getNewestRepos"></i></span>
      <span><i class="fa fa-search" @click="isFuzzySearchVisible = true"></i></span>
      <span><i class="fa fa-sign-out" id="logout-btn" @click="logout"></i></span>
    </div>

    <el-dialog title="新建分类" :visible.sync="isVisible" :modalAppendToBody="false" width="450px">
      <el-form>
        <el-form-item label="分类名" :label-width="formLabelWidth">
          <el-input v-model="newCategoryName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog 
      title="输入关键字模糊查询仓库" 
      :visible.sync="isFuzzySearchVisible" 
      :modalAppendToBody="false" 
      width="450px" 
      @close="fuzzySearchKeyWord = ''; fuzzySearchResults = []">
      <el-form>
        <el-badge :value="fuzzySearchResults.length">
          <el-input 
            v-model.trim="fuzzySearchKeyWord" 
            auto-complete="off"></el-input>
        </el-badge>
        
        <!-- 模糊查询结果 -->
        <div class="fuzzy-search-result">
          <div 
            v-if="fuzzySearchResults.length" 
            v-for="item in fuzzySearchResults" 
            :key="item.item.repo.id" 
            @click="open(item.item.repo.html_url)"
            class="fuzzy-search-result-item">
            <div class="mb5 repo-title">
              <i class="octicon octicon-repo pr10"></i>
              <span class="repo-name" v-html="item.item.repo.full_name"></span>
              <span class="repo-stars">
                <i class="octicon octicon-star pr2"></i><span>{{ item.item.repo.stargazers_count}}</span>
              </span>
            </div>
            <div :class="[item.item.remark ? 'mb5' : '']" v-html="item.item.repo.description"></div>
            <div v-html="item.item.remark"></div>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {addCategory} from '@/api/category'
import {getFuzzySearchResults} from '@/api/repository'
import _ from 'lodash'

export default {
  data() {
    return {
      isVisible: false,
      isFuzzySearchVisible: false,
      newCategoryName: '',
      fuzzySearchKeyWord: '',
      formLabelWidth: '60px',
      fuzzySearchResults: []
    }
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    getNewestRepos() {
      this.$store.dispatch('refresh_app')
    },
    logout() {
      localStorage.removeItem('token')
      location.reload()
    },
    addCategory() {
      this.isVisible = false

      addCategory(this.newCategoryName, this.$store.state.user.userId).then(res => {
        this.newCategoryName = ''
        this.$store.commit('set_categories', res.data)
      })
    },
    getFuzzySearch() {
      if (!this.fuzzySearchKeyWord) {
        this.fuzzySearchResults = []
        return 
      }

      getFuzzySearchResults(this.$store.state.user.userId, this.fuzzySearchKeyWord).then(res => {
        let repos = res.data

        // 给关键字加上 .key 类
        repos.forEach(repo => {
          if (repo.matches) {
            repo.matches.forEach(match => {
              let arr = [...match.value] 
              for (let i = match.indices.length; i--; ) {
                let start = match.indices[i][0]
                let end = match.indices[i][1]
                arr.splice(end + 1, 0, ...[...'</span>'])
                arr.splice(start, 0, ...[...'<span class="key">'])
              }
              
              let newVal = arr.join('')
              let key = match.key // 值为 "remark", "repo.description", repo.full_name"
              if (key === 'remark') repo.item.remark = newVal
              else if (key === "repo.description") repo.item.repo.description = newVal
              else repo.item.repo.full_name = newVal
              
              // repo.item.(eval(key)) = newVal
            })
          }
        })

        this.fuzzySearchResults = repos
      })
    },
    enter() {
      console.log('enter')
    }
  },
  watch: {
    fuzzySearchKeyWord() {
      this.debouncedGetFuzzySearch()
    }
  },
  created() {
    this.debouncedGetFuzzySearch = _.debounce(this.getFuzzySearch, 500)
  }
}
</script>

<style lang="scss">
.action-bar {
  position: fixed; 
  bottom: 0; 
  z-index: 10;
  width: 200px;
  background: #f7f3f0;
  display: flex;
  span {
    flex: 1;
    text-align: center;
    padding: 10px;
    color: #999;
    .fa:hover {cursor: pointer; color:#666}
  }
}

.fuzzy-search-result {
  position: absolute; 
  background: white; 
  max-height: 400px; 
  overflow: scroll;
  width: 410px;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 10px;
  &-item {
    display: block;
    padding: 8px 15px 8px;
    border-bottom: 1px dashed #dcdfe6;
    &:hover {
      cursor: pointer;
      background: #3a8ffe;
      color: #fff;
    }
    .repo-title {
      display: flex;
      align-items: center;
      .repo-name {font-size: 12px; font-weight: 900; flex: 1}
      .repo-stars {
        font-size: 10px;
        width: 50px;
        .octicon-star {font-size: 10px;}
      }
    }
    .key {color: red;}
  }
}

.el-badge {display: block}
</style>
