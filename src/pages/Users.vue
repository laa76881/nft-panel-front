<template>
  <div>
    <a v-for="user in users" :key="user.id" :href="`/user/${user._id}`" class="user">
      <p>Email: {{ user.email }}</p>
      <p>Name: {{ user.name }}</p>
    </a>
  </div>
</template>

<script setup>
import { getUsers } from "/api/users.js";
import { onMounted, ref } from "vue";

const users = ref([]);

onMounted(() => {
  getUsers()
    .then(({ data }) => {
      users.value = data;
    })
    .catch((error) => console.log(error));
});
</script>