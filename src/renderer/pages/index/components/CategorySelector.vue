<template>
  <select v-model="category" @click.stop>
    <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      category: this.repo.category,
      id: this.repo.repo.id
    }
  },
  computed: {
    categories() {
      return this.$store.state.user.categories
    },
  },
  props: ['repo'],
  watch: {
    category() {
      this.$store.dispatch('update_category', {category: this.category, id: this.id})
    },
    repo() {
      this.category = this.repo.category
      this.id = this.repo.repo.id
    }
  }
}
</script>
