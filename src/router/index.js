import { createRouter, createWebHistory } from "vue-router";

//pages
const Home = () => import("@/pages/Home.vue");
const Login = () => import("@/pages/Login.vue")
const Users = () => import("@/pages/Users.vue");
const User = () => import("@/pages/User.vue");
const ErrorPage = () => import("@/pages/Error.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/users",
    name: "users",
    component: Users
  },
  {
    path: "/user/:id",
    name: "user",
    component: User
  },
  {
    path: "/:pathMatch(.*)*",
    name: "ErrorPage",
    component: ErrorPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
