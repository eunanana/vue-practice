<template>
  <div class="notice-detail">
    <h2>공지사항 상세조회</h2>
    <div v-if="notice">
      <p><strong>제목:</strong> {{ notice.noticeTtl }}</p>
      <p class="content">{{ notice.noticeCtt }}</p>
    </div>
    <div v-else>
      <p>data 조회중...</p>
    </div>
    <div class="button-group">
      <button @click="goList">목록</button>
      <button class="delete" @click="noticeDelete">삭제</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { get, post } from '@/api/api';

const route = useRoute();
const router = useRouter();
const noticeSn = route.params.noticeSn;
const notice = ref(null);

/**
 * 공지사항 상세 조회
 */
const getNoticeDetail = async () => {
  const response = await get(`/comm/notice/${noticeSn}`);
  if (response?.code === 200) {
    // console.log(response);
    notice.value = response.data.notice;
  }
};

onMounted(getNoticeDetail);

const goList = () => {
  router.push('/notice');
};

/**
 * 공지사항 삭제 성공 콜백
 */
const noticeDeleteSuccess = (response) => {
  if (response?.code === 200) {
    alert('공지사항이 삭제되었습니다.');
    router.push('/notice');
  } else {
    noticeDeleteError();
  }
};

/**
 * 공지사항 삭제 실패 콜백
 */
const noticeDeleteError = () => {
  alert('공지사항 삭제에 실패했습니다.');
};

/**
 * 공지사항 삭제
 */
const noticeDelete = async () => {
  if (!confirm('공지사항을 삭제하시겠습니까?')) return;

  await post(`/comm/notice/delete/${noticeSn}`, {
    onSuccess: noticeDeleteSuccess,
    onError: noticeDeleteError,
  });
};
</script>

<style lang="scss" scoped>
.notice-detail {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

h2 {
  text-align: center;
}

p {
  font-size: 16px;
  margin: 10px 0;
}

.content {
  white-space: pre-wrap;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

button {
  display: block;
  margin: 20px auto;
  padding: 10px 15px;
  border: none;
  background: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background: #0056b3;
}

.delete {
  background: #dc3545;
}

.delete:hover {
  background: #a71d2a;
}
</style>
