import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Painting from '../components/PaintingComponent.vue';
import DamageClass from '../components/DamageClassComponent.vue';
import DamageDepth from '../components/DamageDepthComponent.vue';
import Cost from '../components/CostComponent.vue';

Vue.use(VueRouter)
const ifNotAuthenticated = (to, from, next) => {
  // Si existe un token, la sesion existe, por lo cual, redirecciona a home
           if (window.localStorage.getItem('_token')) {
            console.log("inicio");
          //if (store.state.authModule.authenticated) {
            next({ path: '/' });
          } else {
            next();
          }
};
  const routes = [
    { 
      name: 'painting',
      path: '/painting', 
      component: Painting,
      meta: { Auth: false, title: 'Painting'}
    },{ 
      name: 'damageClass',
      path: '/damageClass', 
      component: DamageClass,
      meta: { Auth: false, title: 'DamageClass'}
    },{ 
      name: 'damageDepth',
      path: '/damageDepth', 
      component: DamageDepth,
      meta: { Auth: false, title: 'DamageDepth'}
    },{ 
      name: 'cost',
      path: '/cost', 
      component: Cost,
      meta: { Auth: false, title: 'Cost'}
    },{ 
      name: 'welcome',
      path: '/', 
      component: Home,
      meta: { Auth: false, title: 'Welcome'},
      beforeEnter: ifNotAuthenticated
    },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {



  const { authorize } = to.meta;
  
    if (to.meta.Auth) {
          if (!store.state.authModule.authenticated) {
              // not logged in so redirect to login page with the return url
              return next({ path: '/login',  returnUrl: to.path  });
          }
  
          // check if route is restricted by role
          if (authorize.length && !authorize.includes(store.getters['authModule/getUser'].type_user)) {
              // role not authorised so redirect to home page
              return next({ path: '/'});
          }
      }
      console.log("es mana");
      console.log(store.getters['authModule/isManager']);
      document.title = to.meta.title;
      next();
  
  
  });

export default router
