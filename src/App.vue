
<template>
  <div id="app">
    <app-header v-if="route.name !== 'ErrorPage'" />

    <div class="app__inner">
      <router-view />
    </div>

    <app-footer v-if="route.name !== 'ErrorPage'" />
  </div>
</template>

<script setup>
import AppHeader from "@/components/Base/Header.vue";
import AppFooter from "@/components/Base/Footer.vue";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

</script>

<style lang="scss" scoped>
.app {
}
</style>
