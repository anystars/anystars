import _ from 'lodash'
import {getUserInfo, getStarredRepoCount} from '@/api/user'
import {getRepos, addRepos, getNewestRepos, updateCategory} from '@/api/repository'
import {getCategories} from '@/api/category'
import {getRemarks} from '@/api/remark'

const state = {
  token: '',
  userId: '',
  userInfo: null,
  repos: [],
  remarks: [],
  selectedRepo: null,
  categories: [],
  chosenType: '', 
  chosenCategory: 0,
  chosenLang: '',
  starredCount: 0,
  isLoading: true
}

const mutations = {
  set_token(state, token) {
    localStorage.setItem('token', token)
    state.token = token
  },
  set_repos(state, repos) {
    repos.forEach(item => {
      item.category = ~~item.category
    })
    state.repos = repos
  },
  set_remarks(state, remarks) {
    state.remarks = remarks
  },
  set_categories(state, categories) {
    state.categories = categories
  },
  change_category(state, type) {
    state.chosenType = 'category'
    state.chosenCategory = type
  },
  change_lang(state, type) {
    state.chosenType = 'lang'
    state.chosenLang = type
  },
  choose_all(state) {
    state.chosenType = 'all'
  },
  change_selected_repo(state, repo) {
    state.selectedRepo = repo
  },
  set_userId(state, userId) {
    state.userId = userId
  },
  set_starred_count(state, count) {
    state.starredCount = count
  },
  set_userInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  set_isLoading(state, isLoading) {
    state.isLoading = isLoading
  }
}

const actions = {
  init_app({ commit, state }) { 
    // 获取数据库存储的 repos     
    const p0 = new Promise(resolve => {
      getRepos(state.userId).then(res => {
        commit('set_repos', res.data)
        resolve()
      })
    })

    // 获取分类
    const p1 = new Promise(resolve => {
      getCategories(state.userId).then(res => {
        let data = res.data 
        commit('set_categories', data)
        resolve()
      })
    });

    // 获取 starred 数目
    const p2 = new Promise(resolve => {
      getStarredRepoCount().then(res => {
        commit('set_starred_count', res.data)
        resolve()
      })
    })

    // get remarks
    const p3 = new Promise(resolve => {
      getRemarks(state.userId).then(res => {
        commit('set_remarks', res.data)
        resolve()
      })
    })
    
    const promiseArr = [p0, p1, p2, p3]

    Promise.all(promiseArr).then(res => {
      commit('set_isLoading', false)
    })
  },
  refresh_app({commit, state}) {
    commit('set_isLoading', true)

    // 先获取 starred 数目 -> 获取最新 repos 信息
    const p0 = new Promise(resolve => {
      getStarredRepoCount().then(res => {
        commit('set_starred_count', res.data)
        getNewestRepos(state.starredCount).then(res => {
          let data = res.data // 新数据
          let repos = state.repos // 老数据

          // 标签信息转移
          data.forEach(item => {
            for (let i = 0; i < repos.length; i++) {
              if (item.repo.id === repos[i].repo.id) {
                item.category = repos[i].category
                break;
              }
            }
          })

          commit('set_repos', data)

          // 新数据入库
          addRepos(JSON.stringify(data), state.userId).then(res => {
            resolve()
          })
        })
      })
    })

    // 获取用户个人信息
    const p1 = new Promise(resolve => {
      getUserInfo(state.token).then(res => {
        commit('set_userInfo', res.data)
        resolve()
      })
    })

    const promiseArr = [p0, p1]

    Promise.all(promiseArr).then(res => {
      commit('set_isLoading', false)
    })
  },
  update_category({commit, state}, obj) {
    updateCategory(obj.category, obj.id, state.userId).then(res => {
      commit('set_repos', res.data)
    })
  },
  get_userInfo({commit, state}) {
    return new Promise(resolve => {
      getUserInfo().then(res => {
        commit('set_userInfo', res.data)
        commit('set_userId', res.data.id)
        resolve()
      })
    })
  }
}

const getters = {
  // 根据分类归类后的 repos
  classifiedRepos: state => {
    return _.groupBy(state.repos, 'category')
  },
  langedRepos: state => {
    return _.groupBy(state.repos, function(repo) {
      return repo.repo.language
    })
  },
  chosenRepos: (state, getters) => {
    if (state.chosenType === 'category') {
      return getters.classifiedRepos[state.chosenCategory]
    } else if (state.chosenType === 'lang') {
      return getters.langedRepos[state.chosenLang]
    } else { // choose all
      return state.repos
    }
  },
  showedRemark: state => { // 显示在详情页的 remark
    let repo = state.selectedRepo
    if (!repo) return ''

    let remarks = state.remarks 
    // 找到当前选中的 repo 的 remark
    let res = remarks.filter(item => item.repo_id === repo.repo.id)
    if (!res.length) return ''

    return res[0].remark
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}