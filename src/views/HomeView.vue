<template>
  <main>
    <button @click="openModal('모달 테스트', '모달 테스트 컨텐츠 입니다.')">
      Modal Test
    </button>
    <Modal
      :isOpen="isModalOpen"
      :closeModal="closeModal"
      :title="modalTitle"
      :contents="modalContents"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '@/components/layouts/AppModal.vue';

const isModalOpen = ref(false);
const modalTitle = ref('title');
const modalContents = ref('contents');

const openModal = (title, contents) => {
  modalTitle.value = title;
  modalContents.value = contents;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>
