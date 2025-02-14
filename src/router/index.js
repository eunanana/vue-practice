import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


// 네비게이션 가드 (로그인 필수 페이지 보호)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.userInfo) {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      authStore.userInfo = JSON.parse(storedUser);
    }
  }

  if (to.path === '/login' && authStore.userInfo) {
    next('/home'); // 로그인한 사용자가 /login으로 접근하면 /home으로 이동
  }
  else if (to.meta.requiresAuth && !authStore.userInfo) {
    next('/login'); // 로그인 필요 페이지에 비로그인 상태로 접근 시 /login으로 이동
  }
  else {
    next();
  }
});

export default router
