<template>
  <div class="board">
    <h2>게 시 판</h2>
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
            <td>{{ notice.noticeTtl }}</td>
            <td>{{ notice.rgtrSn }}</td>
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

// const { page, total, totalPage, prevPage, nextPage, filteredPageNumbers } =
//   usePagination(10);
const noticeList = ref([]);

onMounted(() => {
  getNoticeList();
});

const getNoticeList = async () => {
  const response = await get('/comm/notice/list');
  if (response?.code === 200) {
    noticeList.value = response.data.noticeList;
  }
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
</style>
