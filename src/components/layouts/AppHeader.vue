<template>
  <header class="header">
    <nav>
      <router-link to="/">Main</router-link>
      <router-link to="/board">게시판</router-link>
      <button @click="logout">로그아웃</button>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  background-color: #3498db;
  align-items: center;
  color: white;
  padding: 30px;
  text-align: center;
}

nav {
  display: flex;
  gap: 30px;
}

button {
  text-decoration: none;
  padding: 8px 16px;
  background-color: white;
}
</style>
