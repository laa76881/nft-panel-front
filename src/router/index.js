import { createRouter, createWebHistory } from "vue-router";

//pages
const Home = () => import("@/pages/Home.vue");
const Login = () => import("@/pages/Login.vue")
const SignUp = () => import("@/pages/SignUp.vue")
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
    path: "/sign-up",
    name: "sign-up",
    component: SignUp
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    // meta: {
    //   requiresAuth: true
    // }
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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    console.log('need auth')
    const token = localStorage.getItem('token');
    console.log('token', token)
    if (token) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
