<template>
  <tr>
    <td :style="{ paddingLeft: depth * 20 + 'px' }">{{ menu.menuNm }}</td>
    <td>{{ menu.menuUrl || '-' }}</td>
    <td>
      <button @click="emit('edit', menu)">수정</button>
      <button @click="confirmDelete(menu)">삭제</button>
    </td>
  </tr>
  <!-- 직접 하위 메뉴 필터링하여 렌더링 -->
  <template v-if="getChildren.length">
    <MenuItem
      v-for="child in getChildren"
      :key="child.menuCd"
      :menu="child"
      :menuList="menuList"
      :depth="depth + 1"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </template>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  menu: Object,
  menuList: Array,
  depth: Number,
});

const emit = defineEmits(['edit', 'delete']);

// menuList에서 parntMenuCd가 일치하는 하위 메뉴를 가져오기
const getChildren = computed(() => {
  return props.menuList.filter((item) => item.parntMenuCd === props.menu.menuCd);
});

const confirmDelete = (menu) => {
  const hasActiveChild = getChildren.value.some((child) => child.useYn === 'Y');

  if (hasActiveChild) {
    alert('하위 메뉴 중 사용 중인 메뉴가 있어 삭제할 수 없습니다.');
    return;
  }

  if (confirm(`'${menu.menuNm}' 메뉴를 삭제하시겠습니까?`)) {
    emit('delete', menu.menuCd);
  }
};
</script>

<style scoped>
td {
  padding: 10px;
  border: 1px solid #ddd;
}

button {
  margin-left: 5px;
}
</style>
