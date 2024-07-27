
<template>
  <div id="app">
    <app-header v-if="me" />

    <div class="app__inner">
      <router-view />
    </div>

    <app-footer v-if="me" />
  </div>
</template>

<script setup>
import { computed } from "vue";

import AppHeader from "@/components/Base/Header.vue";
import AppFooter from "@/components/Base/Footer.vue";

import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/store/auth.js";

const route = useRoute();
const router = useRouter();

const authStore = useAuth();
const me = computed(() => authStore.me);

console.log('app me', me.value)
</script>

<style lang="scss" scoped>
.app {
}
</style>
