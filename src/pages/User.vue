<template>
  <div>
    {{ user }}
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useUsers } from "@/store/users.js";

const usersStore = useUsers();
const route = useRoute();
const user = ref({});

onMounted(() => {
  usersStore.getUser(route.params.id).then((data) => (user.value = data));
});
</script>

<style lang="scss" scoped>
.app {
}
</style>