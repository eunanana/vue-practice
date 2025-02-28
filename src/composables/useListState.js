import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useListState(defaults = { searchType: "title", pageSize: 5 }) {
  const route = useRoute();
  const router = useRouter();

  // 검색 상태
  const search = {
    type: ref(route.query.searchType || defaults.searchType),
    keyword: ref(route.query.searchKeyword || ""),
  };

  // 페이지네이션 상태
  const page = {
    size: ref(defaults.pageSize),
    current: ref(route.query.page ? parseInt(route.query.page) : 1),
    totalItems: ref(0),
    totalPages: ref(1),
  };

  // URL 업데이트 함수
  const updateRoute = () => {
    router.push({
      query: {
        page: page.current.value,
        searchType: search.type.value,
        searchKeyword: search.keyword.value,
      },
    });
  };

  // URL 변경 감지 & 데이터 로딩 콜백 설정
  let onQueryChange = () => { };
  const setOnQueryChange = (callback) => {
    onQueryChange = callback;
  };

  watch(
    () => route.query,
    () => {
      page.current.value = route.query.page ? parseInt(route.query.page) : 1;
      search.type.value = route.query.searchType || defaults.searchType;
      search.keyword.value = route.query.searchKeyword || "";
      onQueryChange();
    }
  );

  return {
    search,
    page,
    updateRoute,
    setOnQueryChange,
  };
}
