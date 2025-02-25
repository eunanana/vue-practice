<template>
  <div class="board">
    <h2>게 시 판</h2>
    <button class="btn write-btn" @click="goWrite">작성하기</button>
    <div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notice, index) in noticeList" :key="notice.id">
            <td>{{ noticeList.length - index }}</td>
            <td @click="goDetail(notice.noticeSn)" class="clickable">
              {{ notice.noticeTtl }}
            </td>
            <td>{{ notice.rgtrName }}</td>
            <td>{{ formatDateTime(notice.rgtrDt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { usePagination } from '@/composables/usePagination';
import { formatDateTime } from '@/common/util.js';
import { get } from '@/api/api';
import { useRouter } from 'vue-router';

// const { page, total, totalPage, prevPage, nextPage, filteredPageNumbers } =
//   usePagination(10);
const router = useRouter();
const noticeList = ref([]);

onMounted(() => {
  getNoticeList();
});

/**
 * 공지사항 목록 조회 성공 콜백
 */
const getNoticeListSuccess = (response) => {
  if (response?.code === 200) {
    noticeList.value = response.data.noticeList;
  } else {
    getNoticeListError();
  }
};

/**
 * 공지사항 목록 조회 실패 콜백
 */
const getNoticeListError = () => {
  // console.error('공지사항 조회 오류:', error);
  alert('공지사항 조회에 실패했습니다.');
};

/**
 * 공지사항 목록 조회
 */
const getNoticeList = async () => {
  await get('/comm/notice/list', {
    onSuccess: getNoticeListSuccess,
    onError: getNoticeListError,
  });
};

/**
 * 상세 페이지 이동
 */
const goDetail = (noticeSn) => {
  router.push({ name: 'NoticeDetail', params: { noticeSn: String(noticeSn) } });
};

/**
 * 작성 페이지 이동
 */
const goWrite = () => {
  router.push('/notice/write');
};
</script>

<style lang="scss" scoped>
.board {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.board h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f4f4f4;
  font-weight: bold;
}

tr:hover {
  background: #f9f9f9;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: #0056b3;
}

.write-btn {
  display: block;
  // margin: 20px auto;
  padding: 10px 15px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
  background: #28a745;
}
</style>
