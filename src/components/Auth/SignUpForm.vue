<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h2 class="auth-form__heading">Sign up</h2>
    <p class="auth-form__subheading">
      If you have account <router-link to="/login">Log in</router-link>
    </p>
    <div class="auth-form__row">
      <label for="first_name" class="fz-sm">First name</label>
      <input
        v-model.trim="first_name.value.value"
        :error-message="first_name.errorMessage.value"
        type="text"
        name="first_name"
        maxlength="255"
        placeholder="Enter first name"
        :disabled="false"
        class="auth-form__input"
      />
      <span class="auth-form__input-error fz-sm color-danger">
        {{ first_name.errorMessage.value }}
      </span>
    </div>

    <div class="auth-form__row">
      <label for="last_name" class="fz-sm">Last name</label>
      <input
        v-model.trim="last_name.value.value"
        :error-message="last_name.errorMessage.value"
        type="text"
        name="last_name"
        maxlength="255"
        placeholder="Enter last name"
        :disabled="false"
        class="auth-form__input"
      />
      <span class="auth-form__input-error fz-sm color-danger">
        {{ last_name.errorMessage.value }}
      </span>
    </div>

    <div class="auth-form__row">
      <label for="email" class="fz-sm">Email</label>
      <input
        v-model.trim="email.value.value"
        :error-message="email.errorMessage.value"
        type="text"
        name="email"
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
        name="password"
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
      <label for="password_confirmation" class="fz-sm">Repeat password</label>
      <input
        v-model="password_confirmation.value.value"
        :error-message="password_confirmation.errorMessage.value"
        name="password"
        maxlength="32"
        placeholder="Repeat password"
        type="password"
        :disabled="false"
        class="auth-form__input"
      />
      <span class="auth-form__input-error fz-sm color-danger">
        {{ password_confirmation.errorMessage.value }}
      </span>
    </div>

    <div class="auth-form__row">
      <button
        class="app-button auth-form__submit"
        type="submit"
        :disabled="loading"
      >
        Sign up
      </button>
    </div>
  </form>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { useAuth } from "@/store/auth.js";
import { signUpForm } from "@/config/validation-schemas.js";
import { useToast } from "@/main";
import { ref } from "vue";

const authStore = useAuth();
const emit = defineEmits(["submitted"]);

const { handleSubmit } = useForm({
  validationSchema: signUpForm,
  initialValues: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  },
});

const first_name = useField("first_name");
const last_name = useField("last_name");
const email = useField("email");
const password = useField("password");
const password_confirmation = useField("password_confirmation");

const loading = ref(false);

const onSubmit = handleSubmit(async (values, { setErrors }) => {
  loading.value = true;
  await authStore
    .signUp({
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    })
    .then((res) => {
      if (res.message) useToast(res.message, "success");
      emit("submitted", { email: values.email });
    })
    .catch((error) => {
      const errors = error.response?._data?.errors;
      if (errors) {
        setErrors({
          first_name: errors.first_name || "",
          last_name: errors.last_name || "",
          email: errors.email[0] === "" ? "ignored" : errors.email || "",
          password: errors.password || "",
          password_confirmation: errors.password_confirmation || "",
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>