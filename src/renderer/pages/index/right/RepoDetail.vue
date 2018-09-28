<template>
  <div v-html="html" v-loading="loading" class="detail-content">
  </div>
</template>

<script>
import 'github-markdown-css/github-markdown.css'
import {getRepoDetail} from '@/api/repository'

export default {
  data() {
    return {
      html: '',
      loading: false
    }
  },
  watch: {
    repo() {
      this.getRepoDetail()
    }
  },
  props: ['repo'],
  created() {
    this.getRepoDetail()
  },
  methods: {
    getRepoDetail() {
      this.html = ''
      this.loading = true

      getRepoDetail(this.repo.repo.full_name).then(res => {
        this.html = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 100%;
		margin: 0 auto;
		padding: 30px;
    font-size: 14px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>