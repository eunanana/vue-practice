<template>
  <div class="search-container">
    <select v-model="searchTypeModel" class="search-select">
      <option value="title">{{ $t('common.search.combo_title') }}</option>
      <option value="writer">{{ $t('common.search.combo_writer') }}</option>
    </select>
    <input
      type="text"
      class="search-input"
      v-model="searchKeywordModel"
      placeholder="$t('common.search.placeholder')"
      @keyup.enter="onSearch"
    />
    <button class="search-btn" @click="onSearch">{{ $t('common.search.button') }}</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  searchType: String, // 검색 유형
  searchKeyword: String, // 검색어
});

const emit = defineEmits(['update:searchType', 'update:searchKeyword', 'search']);

// v-model을 위한 computed 속성
const searchTypeModel = computed({
  get: () => props.searchType,
  set: (value) => emit('update:searchType', value), // 부모의 searchType 업데이트
});

const searchKeywordModel = computed({
  get: () => props.searchKeyword,
  set: (value) => emit('update:searchKeyword', value), // 부모의 searchKeyword 업데이트
});

// 검색 버튼 클릭 시 실행
const onSearch = () => {
  emit('search'); // 부모 컴포넌트에서 검색 실행
};
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  justify-content: right;
  margin-bottom: 15px;
}

.search-select {
  width: 75px;
  padding: 10px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 5px;
}

.search-input {
  width: 19%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.search-btn {
  padding: 10px 15px;
  margin-left: 10px;
  border: none;
  background: #007bff;
  color: white;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
}

.search-btn:hover {
  background: #0056b3;
}
</style>
