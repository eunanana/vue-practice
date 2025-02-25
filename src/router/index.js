import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Notice from '../views/notice/NoticeListView.vue'
import NoticeDetail from '../views/notice/NoticeDetailView.vue'
import NoticeWrite from '../views/notice/NoticeWriteView.vue'

/**
 * path : route를 찾을 수 있는 url path
 * name : route로 연결할 때 사용하는 이름 (선택 사항)
 * component : route에서 불러와질 컴포넌트
 * props :  path부분의 :name을 props로 전달 (선택 사항)
 */
const routes = [
  {
    path: '/',
    name: 'emptyLayout',
    component: () => import('@/components/layouts/EmptyLayout.vue'),
    children: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/login',
        component: Login
      },
    ],
  },
  {
    path: '/',
    name: 'defaultLayout',
    meta: {
      requiresAuth: true
    },
    component: () => import('@/components/layouts/DefaultLayout.vue'),
    children: [
      {
        path: "/home",
        component: Home,
        meta: { requiresAuth: true }
      },
      {
        path: "/notice",
        component: Notice,
        meta: { requiresAuth: true }
      },
      {
        path: "/notice/:noticeSn",
        name: "NoticeDetail",
        component: NoticeDetail,
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: "/notice/write",
        component: NoticeWrite,
        meta: { requiresAuth: true }
      },
    ]
  }
  // { path: '/', redirect: '/home' },
  // { path: '/login', component: Login },
  // { path: '/home', component: Home, meta: { requiresAuth: true } },
  // { path: '/notice', component: Notice, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


// 네비게이션 가드 (로그인 필수 페이지 보호)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.user) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      authStore.user = JSON.parse(storedUser);
    }
  }

  if (to.path === '/login' && authStore.user) {
    next('/home'); // 로그인한 사용자가 /login으로 접근하면 /home으로 이동
  }
  else if (to.meta.requiresAuth && !authStore.user) {
    next('/login'); // 로그인 필요 페이지에 비로그인 상태로 접근 시 /login으로 이동
  }
  else {
    next();
  }
});

export default router
