<template>
  <keep-alive>
    <div class="board">
      <h2>게 시 판</h2>
      <SearchBar
        v-model:searchType="search.type.value"
        v-model:searchKeyword="search.keyword.value"
        @search="onSearch"
      />
      <button class="btn write-btn" @click="goWrite">{{ $t('common.button.write') }}</button>
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
              <td>{{ page.totalItems.value - ((page.current.value - 1) * page.size.value + index) }}</td>
              <td @click="goDetail(notice.noticeSn)" class="clickable">
                {{ notice.noticeTtl }}
              </td>
              <td>{{ notice.rgtrName }}</td>
              <td>{{ formatDateTime(notice.rgtrDt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        v-model="page.current.value"
        :pages="page.totalPages.value"
        :range-size="2"
        @update:modelValue="updateRoute"
      />
    </div>
  </keep-alive>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatDateTime } from '@/common/util.js';
import { get } from '@/api/api';
import { useRouter, useRoute } from 'vue-router';
import { useListState } from '@/composables/useListState';
import Pagination from '@hennge/vue3-pagination'; // vue3-pagination 적용
import SearchBar from '@/components/SearchBar.vue'; // 검색창
import '@hennge/vue3-pagination/dist/vue3-pagination.css';

const router = useRouter();
const route = useRoute();
const noticeList = ref([]);

// useListState 사용하여 검색 & 페이지네이션 상태 관리
const { search, page, updateRoute, setOnQueryChange } = useListState();

onMounted(() => {
  getNoticeList();
});

/**
 * 공지사항 목록 조회
 */
const getNoticeList = async () => {
  // 검색 조건을 URL에 반영하여 브라우저 히스토리에 남기기
  await get('/comm/notice/list', {
    // 파라미터
    params: {
      page: page.current.value - 1, // Spring Boot 에 맞춰 0부터 시작하도록 조정
      size: page.size.value,
      searchType: search.type.value,
      searchKeyword: search.keyword.value,
    },

    // 성공 콜백
    onSuccess: (response) => {
      if (response?.code === 200) {
        noticeList.value = response.data.list;
        page.totalItems.value = response.data.totalItems;
        page.totalPages.value = response.data.totalPages;
      } else {
        alert('공지사항 조회에 실패했습니다.');
      }
    },

    // 에러 콜백
    onError: () => {
      alert('공지사항 조회에 실패했습니다.');
    },

    // isLoading: true, // 데이터 조회 오래 걸릴 때 로딩바 사용
  });
};
setOnQueryChange(getNoticeList);

const onSearch = () => {
  page.current.value = 1;

  // 같은 검색어로 검색해도 재조회가 되도록 강제 실행
  search.keyword.value === route.query.searchKeyword ? getNoticeList() : updateRoute();
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
