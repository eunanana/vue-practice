<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <h2>{{ title }}</h2>
      <p>{{ contents }}</p>
      <button class="close-btn" @click="closeModal">닫기</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  contents: String,
  closeModal: Function,
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 350px;
}

.close-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
</style>
