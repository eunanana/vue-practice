import { ref, computed } from "vue";

export function usePagination(pageSize = 10) {
  const total = ref(0);
  const page = ref(1);
  const totalPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

  const prevPage = () => {
    if (page.value > 1) page.value--;
  };

  const nextPage = () => {
    if (page.value < totalPage.value) page.value++;
  };

  const filteredPageNumbers = computed(() => {
    const start = Math.max(1, page.value - 2);
    const end = Math.min(totalPage.value, start + pageSize - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  return { page, total, totalPage, prevPage, nextPage, filteredPageNumbers };
}