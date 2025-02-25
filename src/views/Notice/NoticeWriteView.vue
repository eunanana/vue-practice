<template>
  <div>
    <h2>공지사항 작성</h2>
    <form class="notice-form">
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" id="title" v-model="notice.noticeTtl" required />
      </div>

      <div class="form-group">
        <label for="content">내용</label>
        <textarea id="content" v-model="notice.noticeCtt" required></textarea>
      </div>

      <button type="submit" @click.prevent="confirmSave" class="btn">
        저장
      </button>
      <button type="button" @click="cancel" class="btn cancel">취소</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { post } from '@/api/api';
import { useRouter } from 'vue-router';

const router = useRouter();

// 공지사항 입력 데이터
const notice = ref({
  noticeTtl: '',
  noticeCtt: '',
});

// todo: confirmSave 나중에 confirm 창 공통으로 만들기
const confirmSave = () => {
  if (notice.value.noticeTtl === '') {
    alert('제목을 입력하세요.');
    return;
  } else if (notice.value.noticeCtt === '') {
    alert('내용을 입력하세요.');
    return;
  }

  if (confirm('공지사항을 저장하시겠습니까?')) {
    saveNotice();
  }
};

/**
 * 공지사항 목록 조회 성공 콜백
 */
const saveNoticeSuccess = (response) => {
  console.log(response);
  if (response?.code === 200) {
    router.push('/notice');
  } else {
    saveNoticeError();
  }
};

/**
 * 공지사항 목록 조회 실패 콜백
 */
const saveNoticeError = (error) => {
  console.error(error);
  alert('공지사항 저장에 실패했습니다.');
};

const saveNotice = async () => {
  await post('/comm/notice/save', {
    data: notice.value,
    onSuccess: saveNoticeSuccess,
    onError: saveNoticeError,
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
