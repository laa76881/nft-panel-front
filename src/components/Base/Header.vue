<template>
  <header class="app-header">
    <router-link to="/">Home</router-link>
    <router-link to="post">Post</router-link>
    <router-link to="users">Users</router-link>
  </header>
</template>

<style lang="scss">
.app-header {
  padding: 20px 0;
  background: lavender;
  margin-bottom: 40px;
  a {
    margin-left: 20px;
  }
}
</style>