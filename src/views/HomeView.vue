<template>
  <main>
    <button @click="openModal('모달 테스트', '동적 모달 테스트 컨텐츠 입니다.')">Modal Test</button>
    <!-- <Modal :is-open="isModalOpen" :close-modal="closeModal" :title="modalTitle" :contents="modalContents" /> -->
    <Modal v-bind="modal" />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '@/components/AppModal.vue';

const closeModal = () => {
  modal.value.isOpen = false;
};

const modal = ref({
  isOpen: false,
  closeModal: closeModal,
  title: '',
  contents: '',
});

// const isModalOpen = ref(false);
// const modalTitle = ref('title');
// const modalContents = ref('contents');

// const openModal = (title, contents) => {
//   modalTitle.value = title;
//   modalContents.value = contents;
//   isModalOpen.value = true;
// };

const openModal = (title, contents) => {
  modal.value.title = title;
  modal.value.contents = contents;
  modal.value.isOpen = true;
};
</script>
