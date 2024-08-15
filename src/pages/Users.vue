<template>
  <div class="users">
    <div class="users__filters">Search</div>

    <div class="users__list">
      <div class="users__list-row users__list-head">
        <div class="users__list-col" v-for="(col, i) in headNames" :key="i">
          {{ col }}
        </div>
      </div>

      <div class="users__list-view">
        <a
          v-for="user in users"
          :key="user.id"
          :href="`/user/${user._id}`"
          class="users__list-row users__item"
        >
          <div class="users__item-fullname">
            <img v-if="user.avatar" :src="`${user.avatar}`" />
            <img v-else src="/img/default_avatar.svg" />
            <p>{{ user.first_name }} {{ user.last_name }}</p>
          </div>
          <p>{{ user.email }}</p>
          <p :class="`${user.is_verified ? 'color-success' : 'color-danger'}`">
            {{ user.is_verified ? "Verified" : "Not verified" }}
          </p>
          <p>{{ dayjs(user.createdAt).format("DD.MM.YYYY HH:mm") }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUsers } from "@/store/users.js";
import dayjs from "dayjs";

const usersStore = useUsers();
const users = ref([]);

const headNames = ["Full name", "E-mail", "Status", "Created date"];

onMounted(() => {
  usersStore
    .getUsers()
    .then((data) => {
      users.value = data;
    })
    .catch((error) => {
      console.log("users error", error);
    });
});
</script>

<style lang="scss" scoped>
.users {
  &__filters {
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  &__list {
    border: 1px solid $table-border-color;

    &-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      align-items: center;
      padding: 10px;
      color: black;
      text-decoration: none;

      &:not(:last-child) {
        border-bottom: 1px solid $table-border-color;
      }
    }

    &-head {
      background: $table-border-color;
    }

    &-view {
    }

    &-col {
    }
  }

  &__item {
    &:hover {
      cursor: pointer;
      background: rgba(235, 235, 235, 0.4);
    }

    &-fullname {
      display: flex;
      align-items: center;

      img {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        // border: 1px solid $table-border-color;
        object-fit: cover;
        margin-right: 10px;
      }
    }
  }
}
</style>