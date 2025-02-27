<template>
  <div>
    <main>
      <LoadingOverlay />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import LoadingOverlay from '@/components/LoadingOverlay.vue';
</script>
