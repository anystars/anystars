<template>
  <div>
    <el-menu 
      :collapse="false" 
      :default-openeds="['1']"
      >
      <el-submenu index="1" :show-timeout=0 :hide-timeout=0>
        <template slot="title">
          <!-- <i class="el-icon-location"></i> -->
          <span slot="title">书签分类</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="item in categories" 
            :key="item.id" 
            @click="changeCategory(item.id)" 
            @click.right="rightClick"
            :index="'1-'+item.id">
            <span @click.right="rightClick(item.id)" class="item-wrapper">
              <span>{{ item.name }}</span>
              <span class="item-count">{{ classifiedRepos[item.id] ? classifiedRepos[item.id].length : 0}}</span>
            </span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2" :show-timeout=0 :hide-timeout=0>
        <template slot="title">
          <!-- <i class="el-icon-location"></i> -->
          <span slot="title">Language</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(value, key) in langedRepos" :key="key" @click="changeLang(key)" :index="'1-'+key">
            <span class="item-wrapper">
              <i :class="['devicon-' + Lang2Icon[key.toLowerCase()] + '-plain', 'colored', 'pr10']" v-if="Lang2Icon[key.toLowerCase()]"></i>
              <i class="fa fa-tag pr10" aria-hidden="true" v-else-if="key !== 'null'"></i>
              <i class="fa fa-question pr10" aria-hidden="true" v-else></i>
              {{ key === 'null' ? 'NULL' : key }} 
              <span class="item-count">{{ value.length }}</span>
            </span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-menu-item index="3" @click="chooseAll" >
        <!-- <i class="el-icon-document"></i> -->
        <span slot="title" @click="chooseAll">ALL</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import Lang2Icon from '@/utils/lang2Icon'
import {delCategory} from '@/api/category'
import {emptyCategory} from '@/api/repository'
import {remote} from 'electron'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

export default {
  data() {
    return {
      Lang2Icon: Lang2Icon,
      menu: null,
      removedMenuId: 0
    }
  },
  computed: {
    classifiedRepos() {
      return this.$store.getters.classifiedRepos
    },
    langedRepos() {
      return this.$store.getters.langedRepos
    },
    categories() {
      return this.$store.state.user.categories
    }
  },
  methods: {
    changeCategory(key) {
      this.$store.commit('change_category', key)
    },
    changeLang(key) {
      this.$store.commit('change_lang', key)
    },
    chooseAll() {
      this.$store.commit('choose_all')
    },
    rightClick(removedMenuId) {
      this.removedMenuId = removedMenuId
      this.menu.popup(remote.getCurrentWindow());
    }
  },
  created() {
    this.menu = new Menu()
    this.menu.append(new MenuItem({ label: '删除该分类', click: () => {
      console.log('删除了 ' + this.removedMenuId)
      delCategory(this.removedMenuId, this.$store.state.user.userId).then(res => {
        this.$store.commit('set_categories', res.data)
      })
      emptyCategory(this.removedMenuId, this.$store.state.user.userId).then(res => {
        this.$store.commit('set_repos', res.data)
      })
    }}))
  }
}
</script>

<style lang="scss">
.el-menu {
  border-right: none;
  background-color: inherit;
}

// .el-menu-item-group__title {padding: 0}

.el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
  padding: 0 35px !important;
  font-size: 12px;
  &.is-active {
    background: #3a8ffe;
    color: #fff;
  }
  .item-wrapper {
    display: flex;
    align-items: center;
    .item-count {
      flex: 1;
      text-align: right;
    }
  }
}

.el-menu-item:focus {background-color: inherit}

.el-menu-item.is-active {
  background: #3a8ffe;
  color: #fff;
}

.el-menu-item i {
  width: 12px;
}
</style>