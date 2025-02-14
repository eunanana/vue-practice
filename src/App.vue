<template>
  <div class="app" >
    <Header v-if="authStore.isLogin"/>
    <main>
      <RouterView />
    </main>
    <Footer v-if="authStore.isLogin"/>
  </div>
</template>

<script setup>
import Footer from '@/components/layouts/Footer.vue'
import Header from '@/components/layouts/Header.vue'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore(); // 로그인 상태
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
  padding: 20px;
  text-align: center;
}
</style>