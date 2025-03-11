<template>
  <div class="notice-detail">
    <h2>공지사항 상세조회</h2>

    <div v-if="notice" class="notice-content">
      <p class="title"><strong>제목:</strong> {{ notice.noticeTtl }}</p>
      <p class="content">{{ notice.noticeCtt }}</p>

      <div v-if="fileList.length" class="file-section">
        <ul class="file-list">
          <li v-for="file in fileList" :key="file.fileSn" class="file-item">
            <a class="file-link" @click="fileDownload(file.fileSn, file.srvrFileNm, file.orgnlFileNm)">
              <i class="fas fa-file-alt"></i>{{ file.orgnlFileNm }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="button-group">
      <button @click="goList">{{ $t('common.button.list') }}</button>
      <button v-if="isOwner" class="edit" @click="goEdit">{{ $t('common.button.update') }}</button>
      <button v-if="isOwner" class="delete" @click="noticeDelete">{{ $t('common.button.delete') }}</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { get, post } from '@/api/api';
import { useAuthStore } from '@/stores/auth';
import { fileDownload } from '@/common/util';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const noticeSn = route.params.noticeSn;
const notice = ref(null);
const fileList = ref([]);

/**
 * 공지사항 상세 조회
 */
const getNoticeDetail = async () => {
  const response = await get('comm', `/notice/${noticeSn}`);
  if (response?.code === 200) {
    notice.value = response.data.notice;
    fileList.value = response.data.fileList;
  } else {
    alert(response.msg);
  }
};

onMounted(getNoticeDetail);

/**
 * 현재 로그인한 사용자가 공지사항 작성자인지 확인
 */
const isOwner = computed(() => {
  return notice.value?.rgtrSn === authStore.user;
});

const goList = () => {
  router.push('/notice');
};

const goEdit = () => {
  router.push(`/notice/edit/${noticeSn}`);
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

  await post('comm', `/notice/delete/${noticeSn}`, {
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
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.notice-content {
  text-align: left;
  padding: 15px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.content {
  font-size: 16px;
  color: #555;
  white-space: pre-wrap;
  margin-top: 10px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  display: inline-block;
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

.edit {
  background: #ffc107;
}

.edit:hover {
  background: #e0a800;
}

.delete {
  background: #dc3545;
}

.delete:hover {
  background: #a71d2a;
}

.file-section {
  margin-top: 20px;
  text-align: left;
}

.file-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.file-item {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.file-link {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s ease;
}

.file-link:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>
