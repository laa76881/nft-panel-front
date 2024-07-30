<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h2 class="auth-form__heading">Log in</h2>
    <p class="auth-form__subheading">
      If you don't have an account
      <router-link to="/sign-up" class="color-violet">Sign up</router-link>
    </p>
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

    <router-link to="/reset-password" class="auth-form__row"
      >Forgot your password</router-link
    >

    <div class="auth-form__row">
      <button
        class="app-button auth-form__submit"
        type="submit"
        :disabled="loading"
      >
        Log in
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
    email: "some@some.com",
    // password: "",
    password: "vikavika",
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
    .then(async ({ token }) => {
      localStorage.setItem("token", token);
      // localStorage.setItem('token', 'ffff')
      await authStore.getMe().then((res) => {
        router.push({ name: "home" });
      });
      // .catch((error) => {
      //   console.log("login get me error ", error);
      // });
    })
    // .catch((error) => {
    //   console.log("login error page", error);
    //   const errors = error.response?._data?.errors;
    //   if (errors) {
    //     setErrors({
    //       email: errors.email[0] === "" ? "ignored" : errors.email || "",
    //       password: errors.password || "",
    //     });
    //   }
    // })
    .finally(() => {
      loading.value = false;
    });
});
</script>