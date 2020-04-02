// import Vue from 'vue'
// import Router from 'vue-router'
import Home from "./views/front/Home.vue";
import Login from "./views/front/Login.vue";
import Ktv from "./views/front/Ktv.vue";
import OrderHistory from "./views/front/OrderHistory.vue";
import Vip from "./views/admin/Vip.vue";
import Admin from "./views/admin/Admin.vue";

Vue.use(VueRouter);

export default new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/ktv",
      component: Home,
      children: [
        {
          path: "/ktv",
          name: "ktv",
          component: Ktv
        },
        {
          path: "/order",
          name: "order",
          component: OrderHistory
        },
        {
          path: "/vip",
          name: "vip",
          component: Vip
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      children: [
        {
          path: "report",
          name: "report",
          component: () => import("@/views/admin/reportForm")
        },
        {
          path: "goods",
          name: "goods",
          component: () => import("@/views/admin/Goods.vue")         
        },
        {
          path: "vip",
          name: "vip",
          component: () => import("@/views/admin/Vip.vue")
        },
        {
          path: "user",
          name: "user",
          component: () => import("@/views/admin/User.vue")
        }
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
});
