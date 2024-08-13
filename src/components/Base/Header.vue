<template>
  <header class="app-header">
    <ul class="app-header__nav">
      <router-link
        v-for="link in pagesList"
        :key="link"
        v-slot="{ navigate }"
        :to="{ name: link }"
        custom
      >
        <li
          role="link"
          class="app-header__nav-link"
          @click="navigate"
          @keypress.enter="navigate"
        >
          {{ link }}
        </li>
      </router-link>
    </ul>

    <button class="app-button app-header__logout">Log out</button>
  </header>
</template>

<script setup>
const pagesList = ["home", "users", "nfts", "chat", "profile"];
</script>

<style lang="scss">
.app-header {
  padding: 20px 40px;
  background: lavender;
  // margin-bottom: 40px;
  display: flex;
  justify-content: space-between;

  &__nav {
    padding-left: 0;
    display: flex;

    &-link {
      text-transform: capitalize;
      list-style: none;
      cursor: pointer;

      &:not(:first-child) {
        margin-left: 20px;
      }
    }
  }

  &__logout {
    padding: 0 8px !important;
  }
}
</style>