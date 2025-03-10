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

      <div class="file-section">
        <label>파일 업로드 (최대 3개)</label>
        <input type="file" ref="fileInput" @change="handleFileUpload" multiple style="display: none" />
        <button type="button" @click="triggerFileInput">파일 추가</button>
        <!-- 기존 파일 목록 -->
        <ul v-if="existingFileList.length">
          <li v-for="(file, index) in existingFileList" :key="index">
            <span>{{ file.orgnlFileNm }}</span>
            <button type="button" @click="removeExistingFile(file.fileSn)">삭제</button>
          </li>
        </ul>

        <!-- 새 파일 목록 -->
        <ul v-if="fileList.length">
          <li v-for="(file, index) in fileList" :key="index">
            <span>{{ file.name }}</span>
            <button type="button" @click="removeFile(index)">삭제</button>
          </li>
        </ul>
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
import { onMounted, ref, computed } from 'vue';
import { get, multipartPost } from '@/api/api';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const noticeSn = route.params.noticeSn; // URL에서 noticeSn 가져오기
const isEdit = ref(!!noticeSn);
const fileInput = ref(null);

// 공지사항 입력 데이터
const notice = ref({
  noticeTtl: '',
  noticeCtt: '',
});

// 파일 리스트
const fileList = ref([]); // 등록할 file
const existingFileList = ref([]); // 기존에 등록된 file
const deleteFileSnList = ref([]);

// 전체 파일 개수 계산 (기존 파일 + 새 파일)
const totalFiles = computed(() => fileList.value.length + existingFileList.value.length);

const getNoticeDetail = async () => {
  if (!isEdit.value) return;

  const response = await get(`/comm/notice/${noticeSn}`);
  if (response?.code === 200) {
    console.log(response.data);
    notice.value = response.data.notice;
    existingFileList.value = response.data.fileList;
  }
};

onMounted(getNoticeDetail);

/**
 * 파일 추가 버튼 클릭 이벤트
 */
const triggerFileInput = () => {
  fileInput.value.click();
};

/**
 * 파일 추가
 */
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  if (totalFiles.value + files.length > 3) {
    alert('최대 3개의 파일만 첨부할 수 있습니다.');
    return;
  }
  fileList.value.push(...files);
};

/**
 * 등록할 파일 삭제
 */
const removeFile = (index) => {
  fileList.value.splice(index, 1);
};

/**
 * 기존 파일 삭제
 */
const removeExistingFile = (fileId, index) => {
  if (!confirm('해당 파일을 삭제하시겠습니까?')) return;
  deleteFileSnList.value.push(fileId);
  existingFileList.value.splice(index, 1);
};

/**
 * 공지사항 등록/수정
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

  // 파일 업로드를 포함(multipart)하여 데이터를 전송할 때는 FormData를 사용해야 됨
  // FormData.append()는 문자열, Blob, File 등의 객체만 받을 수 있음
  const formData = new FormData();
  formData.append('noticeDTO', new Blob([JSON.stringify(notice.value)], { type: 'application/json' }));
  formData.append('deleteFileSnList', new Blob([JSON.stringify(deleteFileSnList.value)], { type: 'application/json' }));
  fileList.value.forEach((file) => formData.append('files', file));

  await multipartPost(`/comm/notice/${isEdit.value ? 'update' : 'save'}`, {
    data: formData,
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
