<template>
  <div>
    <a
      v-for="user in users"
      :key="user.id"
      :href="`/user/${user._id}`"
      class="user"
    >
      <p>Email: {{ user.email }}</p>
      <p>Name: {{ user.name }}</p>
    </a>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUsers } from "@/store/users.js";

const usersStore = useUsers();
const users = ref([]);

onMounted(() => {
  usersStore.getUsers()
    .then(data => users.value = data)
    // .catch((error) => {
    //   console.log('mount error', error)
    // })
});
</script>