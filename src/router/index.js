import { createRouter, createWebHashHistory } from 'vue-router';
import { useLoginAuth } from '@/functions/axios-evidence.js';


/** Routes */
const routes = [{
    path: '/',
    name: 'Home',
    component: () =>
      import ( /* webpackPreload: true */ '../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import ( /* webpackPreload: true */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () =>
      import ( /* webpackPreload: true */ '../views/SignUp.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import ( /* webpackPreload: true */ '../views/About.vue')
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
    name: 'Best-Worst-Scaling with 2 Actions (xstate)',
    component: () =>
      import ( /* webpackPreload: true */ '../views/BestWorst3.vue')
  },
  {
    path: '/demo-fit2box',
    name: 'Demo für vue-fit2box',
    component: () =>
      import ( /* webpackPreload: true */ '../views/DemoFit2Box.vue')
  },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes
});


/** check if route requires auth */
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const { isAuthenticated } = useLoginAuth()
  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});


export default router;