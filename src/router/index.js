import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

Vue.use(VueRouter);
Vue.use(VueMeta);


/** Routes */
const routes = [{
    path: '/',
    name: 'Home',
    component: () =>
      import ('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import ('../views/Login.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import ('../views/About.vue')
  },
  {
    path: '/settings',
    name: 'Setttings',
    component: () =>
      import ('../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/swipe1',
    name: 'Tinder-like swipe',
    component: () =>
      import ('../views/Swipe1.vue')
  },
  {
    path: '/swipe2',
    name: 'Swipe one card',
    component: () =>
      import ('../views/Swipe2.vue')
  },
  {
    path: '/bestworst1',
    name: 'NOT WORKING! Best-Worst-Scaling with 2 Actions (vuex)',
    component: () =>
      import ('../views/BestWorst1.vue')
  },
  {
    path: '/bestworst3',
    name: 'Best-Worst-Scaling with 2 Actions (xstate)',
    component: () =>
      import ('../views/BestWorst3.vue')
  },
  {
    path: '/demo-fit2box',
    name: 'Demo für vue-fit2box',
    component: () =>
      import ('../views/DemoFit2Box.vue')
  },
];


const router = new VueRouter({
  routes
});


/** check if route requires auth */
import store from "../store";
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.getters['login/isAuthenticated'];
  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});


export default router;