<template>
  <div>
    <h2>공지사항 작성</h2>
    <form class="notice-form">
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" id="title" v-model="notice.noticeTtl" maxlength="100" />
      </div>

      <div class="form-group">
        <label for="content">내용</label>
        <textarea id="content" v-model="notice.noticeCtt" maxlength="1500"></textarea>
      </div>

      <div class="button-group">
        <button type="submit" @click.prevent="saveNotice" class="btn">
          {{ isEdit ? '수정' : '저장' }}
        </button>
        <button type="button" @click="cancel" class="btn cancel">취소</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { get, post } from '@/api/api';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const noticeSn = route.params.noticeSn; // URL에서 noticeSn 가져오기
const isEdit = ref(!!noticeSn);

// 공지사항 입력 데이터
const notice = ref({
  noticeTtl: '',
  noticeCtt: '',
});

const getNoticeDetail = async () => {
  if (!isEdit.value) return;

  const response = await get(`/comm/notice/${noticeSn}`);
  if (response?.code === 200) {
    notice.value = response.data.notice;
  }
};

onMounted(getNoticeDetail);

/**
 * 공지사항 등록/수정정
 */
const saveNotice = async () => {
  if (notice.value.noticeTtl === '') {
    alert('제목을 입력하세요.');
    return;
  } else if (notice.value.noticeCtt === '') {
    alert('내용을 입력하세요.');
    return;
  }

  // todo: confirmSave 나중에 confirm 창 공통으로 만들기
  if (!confirm(isEdit.value ? '공지사항을 수정하시겠습니까?' : '공지사항을 저장하시겠습니까?')) return;

  // await post('/comm/notice/save', {
  //   data: notice.value,
  //   onSuccess: saveNoticeSuccess,
  //   onError: saveNoticeError,
  // });

  await post(`/comm/notice/${isEdit.value ? 'update' : 'save'}`, {
    data: notice.value,
    onSuccess: () => {
      alert(isEdit.value ? '공지사항이 수정되었습니다.' : '공지사항이 저장되었습니다.');
      router.push('/notice');
    },
    onError: () => {
      alert(isEdit.value ? '공지사항 수정에 실패했습니다.' : '공지사항 저장에 실패했습니다.');
    },
  });
};

const cancel = () => {
  router.push('/notice');
};
</script>

<style scoped>
.notice-form {
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

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 120px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
}

.cancel {
  background: #888;
}

.btn:hover {
  background: #0056b3;
}

.cancel:hover {
  background: #666;
}
</style>
