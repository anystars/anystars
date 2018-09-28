<template>
  <div>
    <UserInfo/>
    <Menu/>
    <Action/>
  </div>
</template>

<script>
import UserInfo from './UserInfo'
import Menu from './Menu'
import Action from './Action'

export default {
  components: {Action, UserInfo, Menu},
}
</script>