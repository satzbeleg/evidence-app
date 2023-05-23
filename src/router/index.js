import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from '@/functions/axios-evidence.js';


/** Routes */
const routes = [{
    path: '/',
    name: 'Home',
    component: () =>
      import ( /* webpackPreload: true */ '../views/Home.vue'),
    //redirect: '/bestworst3' // REDIRECT FROM HOME(!)
  },
  {
    path: '/auth/signup', 
    name: 'Sign Up',
    component: () =>
      import ( /* webpackPreload: true */ '../views/auth/Signup.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () =>
      import ( /* webpackPreload: true */ '../views/auth/Login.vue')
  },
  {
    path: '/auth/verify/:verifyToken',
    props: true,
    name: 'Verify your email address',
    component: () =>
      import ( /* webpackPreload: true */ '../views/auth/Verify.vue')
  },
  {
    path: '/auth/recovery',
    name: 'Recover your account',
    component: () =>
      import ( /* webpackPreload: true */ '../views/auth/Recovery.vue')
  },
  // /auth/settings
  {
    path: '/info/about',
    name: 'About',
    component: () =>
      import ( /* webpackPreload: true */ '../views/info/About.vue')
  },
  {
    path: '/info/tips',
    name: 'Tips',
    component: () =>
      import ( /* webpackPreload: true */ '../views/info/Tips.vue')
  },
  {
    path: '/legal/imprint',
    name: 'Imprint',
    component: () =>
      import ( /* webpackPreload: true */ '../views/legal/Imprint.vue')
  },
  {
    path: '/legal/terms',
    name: 'Terms of use',
    component: () =>
      import ( /* webpackPreload: true */ '../views/legal/Terms.vue')
  },
  {
    path: '/legal/privacy',
    name: 'Privacy Policy',
    component: () =>
      import ( /* webpackPreload: true */ '../views/legal/Privacy.vue')
  },
  {
    path: '/legal/consent',
    name: 'Informed Constent',
    component: () =>
      import ( /* webpackPreload: true */ '../views/legal/Consent.vue')
  },
  {
    path: '/settings',
    name: 'Setttings',
    component: () =>
      import ( /* webpackPreload: true */ '../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bestworst3',
    name: 'Best-Worst-Scaling v3',
    component: () =>
      import ( /* webpackPreload: true */ '../views/bestworst/BestWorst3.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bestworst4',
    name: 'Best-Worst-Scaling v4',
    component: () =>
      import ( /* webpackPreload: true */ '../views/bestworst/BestWorst4.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/variation1',
    name: 'Curating diverse sentence examples',
    component: () =>
      import ( /* webpackPreload: true */ '../views/variation/Variation1.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/variation2',
    name: 'Curating diverse sentence examples',
    component: () =>
      import ( /* webpackPreload: true */ '../views/variation/Variation2.vue'),
    meta: { requiresAuth: false }
  },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes
});


/** check if route requires auth */
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const { isAuthenticated } = useAuth();
  if (requiresAuth && !isAuthenticated.value) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});

export default router;