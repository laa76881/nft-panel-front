import { createRouter, createWebHistory } from "vue-router";

//pages
const Home = () => import("@/pages/Home.vue");
const Login = () => import("@/pages/Login.vue")
const SignUp = () => import("@/pages/SignUp.vue")
const EmailConfirmed = () => import("@/pages/EmailConfirmed.vue")
const Expired = () => import("@/pages/Expired.vue")
const Users = () => import("@/pages/Users.vue");
const User = () => import("@/pages/User.vue");
const ErrorPage = () => import("@/pages/Error.vue");

const routes = [
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
    path: "/email-confirmed",
    name: "email-confirmed",
    component: EmailConfirmed
  },
  {
    path: "/expired",
    name: "expired",
    component: Expired
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/user/:id",
    name: "user",
    component: User,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "ErrorPage",
    component: ErrorPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  console.log('token', token)

  if ((token && to.meta.requiresAuth) || (!token && !to.meta.requiresAuth) || to.name === 'ErrorPage') {
    next();
  } else if (token && !to.meta.requiresAuth) {
    next('/')
  } else {
    next('/login');
  }
});

export default router;
