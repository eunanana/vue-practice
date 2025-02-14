<template>
  <header class="header">
    <h1>My Vue App</h1>
    <button @click="logout">로그아웃</button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
  await authStore.logout();
  router.push('/login');
}

</script>

<style lang="scss" scoped>
.header {
  background-color: #3498db;
  color: white;
  padding: 10px;
  text-align: center;
}
</style>