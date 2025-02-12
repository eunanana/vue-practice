<template>
  <div class="app" >
    <Header v-if="ShowHeaderFooter"/>
    <main>
      <RouterView />
    </main>
    <Footer v-if="ShowHeaderFooter"/>
  </div>
</template>

<script setup>
import Footer from '@/components/layouts/Footer.vue'
import Header from '@/components/layouts/Header.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const ShowHeaderFooter = computed(() => route.path !== '/login')
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