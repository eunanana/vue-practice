<template>
  <div v-if="loadingStore.isLoading" class="overlay">
    <div class="loader"></div>
  </div>
</template>

<script setup>
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
</script>

<style scoped>
/* 전체 화면 덮는 오버레이 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 로딩 스피너 */
.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
