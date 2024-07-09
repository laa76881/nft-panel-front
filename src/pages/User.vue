<template>
  <div>
    {{ user }}
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { getUser } from "/api/users.js";

const route = useRoute();
const router = useRouter();

const user = ref({});

onMounted(() => {
  getUser(route.params.id)
    .then(({ data }) => {
      console.log("done", data);
      user.value = data;
    })
    .catch((error) => console.log(error));
});
</script>

<style lang="scss" scoped>
.app {
}
</style>