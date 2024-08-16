<template>
  <div class="users">
    <div class="users__filters">
      <div class="app-input__wrap">
        <label for="search">Search</label>
        <input
          v-model.trim="search"
          type="text"
          name="search"
          maxlength="255"
          placeholder="Type something . . ."
          :disabled="false"
          class="app-input"
          style="padding-left: 32px"
        />
        <img src="/img/search.svg" class="app-input__icon" />
      </div>

      <div class="app-input__wrap">
        <label for="search">Status</label>
        <VueMultiselect
          v-model="filters.status"
          label="name"
          track-by="code"
          :searchable="false"
          :clear-on-select="false"
          :options="statusOptions"
        />
      </div>
    </div>
    <!-- {{ filters }} -->

    <div class="users__list">
      <div class="users__list-row users__list-head">
        <div v-for="(col, i) in headNames" :key="i" class="users__list-col">
          {{ col }}
        </div>
      </div>

      <div class="users__list-view">
        <template v-if="users.length">
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
            <p
              :class="`${user.is_verified ? 'color-success' : 'color-danger'}`"
            >
              {{ user.is_verified ? "Verified" : "Not verified" }}
            </p>
            <p>{{ dayjs(user.createdAt).format("DD.MM.YYYY HH:mm") }}</p>
          </a>

          <div class="users__list-pagination">
            <vue-awesome-paginate
              v-model="filters.page"
              :total-items="total_users"
              :items-per-page="filters.per_page"
              :max-pages-shown="5"
              paginationContainerClass="app-pagination"
              paginateButtonsClass="app-pagination__button"
              activePageClass="app-pagination__button--active"
            />
            <p class="">Total users count: {{ total_users }}</p>
          </div>
        </template>

        <template v-else>
          <p class="users__list--empty">No data found</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useUsers } from "@/store/users.js";
import dayjs from "dayjs";
import { refDebounced } from "@vueuse/core";
import VueMultiselect from "vue-multiselect";

const headNames = ["Full name", "E-mail", "Status", "Created date"];
const statusOptions = [
  {
    code: 0,
    name: "All",
  },
  {
    code: 1,
    name: "Verified",
  },
  {
    code: 2,
    name: "Not verified",
  },
];

const search = ref("");
const searchDebounced = refDebounced(search, 1000);

const usersStore = useUsers();
const users = ref([]);
const filters = ref({
  per_page: 5,
  page: 1,
  status: statusOptions[0],
  search: "",
});
const total_users = ref(0);

watch(searchDebounced, () => {
  filters.value.search = searchDebounced.value;
});

watch(filters.value, (newValue) => {
  console.log("watch", newValue);
  getUsersList();
  // if (newValue !== undefined) {
  //   refreshData();
  // }
});

const getUsersList = async () => {
  await usersStore
    .getUsers({
      per_page: filters.value.per_page,
      page: filters.value.page,
    })
    .then(({ total, data }) => {
      console.log("update list", total, data);
      total_users.value = total;
      users.value = data;
    })
    .catch((error) => {
      console.log("users error", error);
    });
};

onMounted(() => {
  getUsersList();
  // usersStore
  //   .getUsers()
  //   .then((data) => {
  //     users.value = data;
  //   })
  //   .catch((error) => {
  //     console.log("users error", error);
  //   });
});
</script>

<style lang="scss" scoped>
.users {
  .app-input__wrap {
    padding-bottom: 0;
  }

  &__filters {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 10px;
    align-items: center;
    padding: 20px 0;
  }

  &__list {
    border: 1px solid $default-border-color;

    &-row,
    &-pagination {
      padding: 10px;
    }

    &-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      align-items: center;
      color: $default-text-color;
      text-decoration: none;

      &:not(:last-child) {
        border-bottom: 1px solid $default-border-color;
      }
    }

    &-pagination {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-head {
      background: $default-border-color;
    }

    &--empty {
      padding: 10px;
      text-align: center;
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
        // border: 1px solid $default-border-color;
        object-fit: cover;
        margin-right: 10px;
      }
    }
  }
}
</style>