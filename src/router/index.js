import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/regist',
    name: 'Regist',
    component: () => import('../views/Regist.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: '/home/classMsg',
    children: [
      {
        path: 'classMsg',
        name: 'ClassMsg',
        component: () => import('../views/home/ClassMsg.vue')
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('../views/home/Contact.vue')
      },
      {
        path: 'me',
        name: 'Me',
        component: () => import('../views/home/Me.vue'),
      },
      
    ]
  },
  {
    path: '/next',
    name: 'Next',
    component: () => import('../views/Next.vue'),
    children: [
      {
        path: 'msg-create',
        name: 'MsgCreate',
        component: () => import('../views/next/MsgCreate.vue')
      },
      {
        path: 'contact-detail',
        name: 'ContactDetail',
        component: () => import('../views/next/ContactDetail.vue')
      },
      {
        path: 'classmate-info',
        name: 'ClassmateInfo',
        component: () => import('../views/next/ClassmateInfo.vue')
      },
      {
        path: 'album',
        name: 'Album',
        component: () => import('../views/next/Album.vue')
      },
      {
        path: 'album-create',
        name: 'AlbumCreate',
        component: () => import('../views/next/AlbumCreate.vue')
      },
      {
        path: 'album-detail',
        name: 'AlbumDetail',
        component: () => import('../views/next/AlbumDetail.vue')
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('../views/next/Log.vue')
      },
      {
        path: 'log-create',
        name: 'LogCreate',
        component: () => import('../views/next/LogCreate.vue')
      },
      {
        path: 'commonInfo',
        name: 'CommonInfo',
        component: () => import('../views/next/CommonInfo.vue')
      },
      {
        path: 'academic',
        name: 'Academic',
        component: () => import('../views/next/Academic.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
