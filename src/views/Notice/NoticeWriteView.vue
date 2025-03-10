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
import { onMounted, ref } from 'vue';
import { get, multipartPost } from '@/api/api';
import { ALLOWED_FILE_TYPES } from '@/common/const';
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

const getNoticeDetail = async () => {
  if (!isEdit.value) return;

  const response = await get(`/comm/notice/${noticeSn}`);
  if (response?.code === 200) {
    notice.value = response.data.notice;
    existingFileList.value = response.data.fileList;
  }
};

onMounted(getNoticeDetail);

/**
 * 파일 추가 버튼 클릭 이벤트
 */
const triggerFileInput = () => {
  // vue에서는 id 사용 지양하고 ref 사용(vue 반응형 시스템과 연동, 동적인 요소에 접근)
  if (fileInput.value) {
    fileInput.value.click();
  }
};

/**
 * 파일 업로드 핸들러 (파일 유효성 검사)
 */
const handleFileUpload = (event) => {
  fileInput.value = null;
  const files = Array.from(event.target.files);
  const maxFileSize = 20 * 1024 * 1024; // 최대 파일 크기 20MB
  let totalSize =
    existingFileList.value.reduce((acc, file) => acc + file.size, 0) +
    fileList.value.reduce((acc, file) => acc + file.size, 0); // 기존 파일 크기 합산

  for (let i = 0; i < files.length; i++) {
    // 1. 파일 형식 확인
    const fileExtension = files[i].name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      alert(`${files[i].name}는 허용되지 않는 파일 형식입니다.`);
      continue;
    }

    // 2. 중복 파일 확인 (기존파일, 새파일 모두 검사)
    if (
      fileList.value.some((f) => f.name === files[i].name && f.size === files[i].size) ||
      existingFileList.value.some((f) => f.orgnlFileNm === files[i].name && f.fileSz === files[i].size)
    ) {
      alert(`"${files[i].name}"은(는) 이미 추가된 파일입니다.`);
      continue;
    }

    // 3. 파일 추가 후 총합 크기 계산
    if (totalSize + files[i].size > maxFileSize) {
      alert('총 파일 크기는 20MB를 초과할 수 없습니다.');
      return;
    }

    // 4. 파일 갯수 제한
    if (existingFileList.value.length + fileList.value.length >= 3) {
      alert('최대 3개 파일까지만 첨부할 수 있습니다.');
      break;
    }

    // 5. 유효한 파일 추가
    fileList.value.push(files[i]);
    totalSize += files[i].size;
  }
  console.log(fileList.value);
  console.log(existingFileList.value);
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
const removeExistingFile = (fileSn, index) => {
  if (!confirm('해당 파일을 삭제하시겠습니까?')) return;
  console.log(fileSn);
  deleteFileSnList.value.push(fileSn);
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
