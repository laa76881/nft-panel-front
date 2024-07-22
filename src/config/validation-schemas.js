import { object, string, mixed, ref, array, bool, number, boolean } from "yup";
// import {
//   emailRegexp,
//   digitRegexp,
//   lowercaseRegexp,
//   uppercaseRegexp,
//   symbolRegexp,
// } from "@/config/regexp.js";

export const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const loginForm = object({
  email: string()
    .required("This field is required")
    .matches(emailRegexp, "Please enter a valid email: e.g. email@domain.com"),
  password: string().required("This field is required"),
});

export const signUpForm = object({
  first_name: string().required("This field is required"),
  last_name: string().required("This field is required"),
  email: string()
    .required("This field is required")
    .matches(emailRegexp, "Please enter a valid email: e.g. email@domain.com"),
  password: string().required("This field is required"),
  password_confirmation: string()
    .required("This field is required")
    .oneOf([ref("password")], "The passwords do not match"),
  // role ???
});

