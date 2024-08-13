<template>
  <!-- <h2 class="app-heading">Your information</h2> -->

  <form v-if="me" class="profile" @submit.prevent="onSubmit">
    <h2 class="auth-form__heading">Your profile</h2>

    <div class="profile__avatar">
      <img v-if="me.avatar" :src="`${me.avatar}`" />
      <img v-else src="/img/default_avatar.svg" />
      <div class="profile__avatar-actions">
        <button
          type="button"
          class="profile__avatar-action profile__avatar-change"
          @click="open"
        >
          Change
        </button>
        <button
          type="button"
          :disabled="!me.avatar"
          class="profile__avatar-action profile__avatar-delete"
          @click="removeAvatar"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="app-input__wrap profile__row">
      <label for="first_name">First name</label>
      <input
        v-model.trim="first_name.value.value"
        :error-message="first_name.errorMessage.value"
        type="text"
        name="first_name"
        maxlength="255"
        placeholder="Enter first name"
        :disabled="false"
        class="app-input"
      />
      <span class="app-input__error">
        {{ first_name.errorMessage.value }}
      </span>
    </div>

    <div class="app-input__wrap profile__row">
      <label for="last_name">Last name</label>
      <input
        v-model.trim="last_name.value.value"
        :error-message="last_name.errorMessage.value"
        type="text"
        name="last_name"
        maxlength="255"
        placeholder="Enter last name"
        :disabled="false"
        class="app-input"
      />
      <span class="app-input__error">
        {{ last_name.errorMessage.value }}
      </span>
    </div>

    <div class="app-input__wrap profile__row">
      <label for="email">Email</label>
      <input
        v-model.trim="email.value.value"
        :error-message="email.errorMessage.value"
        type="text"
        name="email"
        maxlength="255"
        placeholder="Enter email"
        :disabled="true"
        class="app-input"
      />
      <span class="app-input__error">
        {{ email.errorMessage.value }}
      </span>
    </div>

    <div class="app-input__wrap profile__row">
      <label for="password">Password</label>
      <input
        v-model="password.value.value"
        :error-message="password.errorMessage.value"
        name="password"
        maxlength="32"
        placeholder="Enter Password"
        type="password"
        :disabled="true"
        class="app-input"
      />
      <span class="app-input__error">
        {{ password.errorMessage.value }}
      </span>
      <button
        class="app-input__change-button"
        @click.prevent="updatePassControl.open()"
      >
        <img src="/img/edit.svg" />
      </button>
    </div>

    <div class="profile__row">
      <button
        class="app-button auth-form__submit"
        type="submit"
        :disabled="loading"
      >
        Save
      </button>
    </div>
  </form>
</template>


<script setup>
import { computed, onMounted, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import { profileForm } from "@/config/validation-schemas.js";
import { useToast } from "@/main";
import { useAuth } from "@/store/auth.js";
import { useModal } from "vue-final-modal";
import { useProfile } from "@/store/profile.js";
import { useFileDialog } from "@vueuse/core";

import UpdatePasswordModal from "@/components/Modals/UpdatePasswordModal.vue";
const isUpdatePassword = ref(false);

const route = useRoute();
const router = useRouter();
const authStore = useAuth();
const profileStore = useProfile();
const me = computed(() => authStore.me);

import { uploadFile } from "@/composables/uploadFile.js";
const allowedFormats = ".jpg,.jpeg,.png,.heic,.svg";
const allowedFileSize = 5; // MB

const { open, onChange } = useFileDialog({
  accept: allowedFormats,
  multiple: false,
  reset: true,
  name: "hello",
});

onChange(async (files) => {
  if (!files) return;
  // uploading.value = true;
  await uploadFile({
    file: files[0],
    accepted: allowedFormats,
    size: allowedFileSize,
  }).then(async (file) => {
    console.log("file", file);
    const formData = new FormData();
    formData.append("avatar", file);
    await profileStore.updateAvatar(formData).then(({ path, req }) => {
      if (!path) return;
      authStore.me.avatar = path;
      useToast("Your avatar changed!", "success");
    });
  });
  // .finally(() => (uploading.value = false));
});

const removeAvatar = async () => {
  await profileStore.removeAvatar().then((res) => {
    authStore.me.avatar = null;
    if (res.message) useToast(res.message, "success");
  });
};

const { handleSubmit } = useForm({
  validationSchema: profileForm,
  initialValues: {
    first_name: me.value?.first_name,
    last_name: me.value?.last_name,
    email: me.value?.email,
    password: "********",
  },
});

const updatePassControl = useModal({
  component: UpdatePasswordModal,
  attrs: {
    onClose() {
      updatePassControl.close();
    },
  },
});

const first_name = useField("first_name");
const last_name = useField("last_name");
const email = useField("email");
const password = useField("password");

const loading = ref(false);

const onSubmit = handleSubmit(async (values, { setErrors }) => {
  loading.value = true;
  await profileStore
    .save({
      id: me.value.id,
      first_name: values.first_name,
      last_name: values.last_name,
    })
    .then((res) => {
      if (res.message) useToast(res.message, "success");
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>


<style lang="scss">
@import "@/assets/scss/auth.scss";

.profile {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__row {
    width: 50%;
  }

  &__avatar {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;

    img {
      width: 64px;
      height: 64px;
      border-radius: 100%;
      border: 1px solid;
      object-fit: cover;
    }

    &-actions {
      display: flex;
      gap: 10px;
    }

    &-action {
      border: 1px solid;
      width: 80px;
      height: 24px;
      cursor: pointer;
    }

    &-delete {
      background: $color-delete;
    }
  }

  &__file-input {
    opacity: 0;
    position: absolute;
    left: 0;
    height: 64px;
    width: 64px;
    cursor: pointer;
  }
}
</style>