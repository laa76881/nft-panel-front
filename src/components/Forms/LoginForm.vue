<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <div class="auth-form__row">
      <label for="email" class="fz-sm">Email</label>
      <input
        v-model.trim="email.value.value"
        :error-message="email.errorMessage.value"
        name="email"
        type="text"
        maxlength="255"
        placeholder="Enter email"
        :disabled="false"
        class="auth-form__input"
      />
      <span class="auth-form__input-error fz-sm color-danger">
        {{ email.errorMessage.value }}
      </span>
    </div>

    <div class="auth-form__row">
      <label for="password" class="fz-sm">Password</label>
      <input
        v-model="password.value.value"
        :error-message="password.errorMessage.value"
        maxlength="32"
        placeholder="Enter Password"
        type="password"
        :disabled="false"
        class="auth-form__input"
      />
      <span class="auth-form__input-error fz-sm color-danger">
        {{ password.errorMessage.value }}
      </span>
    </div>

    <div class="auth-form__row">
      <button
        class="app-button auth-form__submit"
        type="submit"
        :disabled="loading"
      >
        Login
      </button>
    </div>
  </form>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { useAuth } from "@/store/auth.js";
import { loginForm } from "@/config/validation-schemas.js";

import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuth();
const router = useRouter();

const { handleSubmit } = useForm({
  validationSchema: loginForm,
  initialValues: {
    email: "",
    password: "",
    // rememberMe: false,
  },
});

const email = useField("email");
const password = useField("password");
// const rememberMe = useField("rememberMe");

const passwordShow = ref(false);
const loading = ref(false);

const onSubmit = handleSubmit(async (values, { setErrors }) => {
  loading.value = true;
  await authStore
    .login({
      email: values.email,
      password: values.password,
      //   rememberMe: values.rememberMe,
    })
    .then(() => {
      console.log("done login");
      //   await authStore
      //     .getMe()
      //     .then(() => {
      //       router.push({ name: "profile-settings" });
      //     })
      //     .catch((error) => {
      //       console.log("error", error);
      //       loading.value = false;
      //       const errorMessage = error.response._data?.message;
      //       $toast.error(errorMessage || "Oops... Something went wrong!");
      //     });
    })
    .catch((error) => {
      console.log("error validate", error);
      //   loading.value = false;
      const errors = error.response._data?.errors;

      setErrors({
        email: errors.email[0] === "" ? "ignored" : errors.email || "",
        password: errors.password || "",
      });
    })
    .finally(() => {
      console.log('finally')
      loading.value = false
    })
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/auth.scss";
</style>