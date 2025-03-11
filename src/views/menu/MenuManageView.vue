<template>
  <div class="menu-manage">
    <h2>메뉴 관리 (현재 대메뉴, 중메뉴 까지만 관리합니다.)</h2>
    <p>메뉴 권한 관리 페이지 만들어야 추가한 메뉴 사용 가능</p>
    <table class="menu-table">
      <thead>
        <tr>
          <th>메뉴명</th>
          <th>메뉴 URL</th>
          <!-- <th>상태</th> -->
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <MenuItem
          v-for="menu in rootMenus"
          :key="menu.menuCd"
          :menu="menu"
          :depth="0"
          :menuList="menuList"
          @edit="editMenu"
          @delete="deleteMenu"
        />
      </tbody>
    </table>
    <h3>{{ editingMenu ? '메뉴 수정' : '메뉴 추가' }}</h3>
    <form @submit.prevent="updateMenu">
      <input v-model="menu.menuNm" placeholder="메뉴명" />
      <input v-model="menu.menuUrl" placeholder="메뉴 URL (선택)" />
      <select v-model="menu.parntMenuCd">
        <option value="null">상위 메뉴 없음</option>
        <option v-for="menu in rootMenus" :key="menu.menuCd" :value="menu.menuCd">
          {{ menu.menuNm }}
        </option>
      </select>
      <button type="submit">{{ editingMenu ? '수정 완료' : '추가' }}</button>
      <button v-if="editingMenu" type="button" @click="resetForm">취소</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { get, post } from '@/api/api';
import { useAuthStore } from '@/stores/auth';
import MenuItem from '@/components/MenuItem.vue';

const authStore = useAuthStore();
const menuList = ref([]);
const editingMenu = ref(false); // 수정 모드
const menu = ref({
  menuCd: '',
  menuNm: '',
  menuUrl: '',
  parntMenuCd: null,
});

const getMenu = async () => {
  await get('comm', '/menu/list', {
    onSuccess: (response) => {
      menuList.value = response.data;
    },
    onError: () => alert('메뉴 조회 도중 오류가 발생했습니다.'),
  });
};

onMounted(getMenu);

// 대메뉴
const rootMenus = computed(() => {
  return menuList.value.filter((menu) => !menu.parntMenuCd);
});

const editMenu = (selectedMenu) => {
  editingMenu.value = true;
  menu.value = { ...selectedMenu };
};

const resetForm = () => {
  menu.value = {
    menuCd: '',
    menuNm: '',
    menuUrl: '',
    parntMenuCd: null,
  };
  editingMenu.value = false;
};

/**
 * 메뉴 등록/수정/삭제 성공 콜백
 */
const menuProcSuccess = (response) => {
  menuList.value = response.data.menuList;
  authStore.menuSuccess(response.data.menuStateList);
  resetForm();
};

/**
 * 메뉴 등록/수정
 */
const updateMenu = async () => {
  // validation check
  if (menu.value.menuNm === '') {
    alert('메뉴명을 입력하세요.');
    return;
  }
  if (!confirm('정말 저장하시겠습니까?')) return;

  if (editingMenu.value) {
    // 편집 모드일 경우 수정
    await post('comm', `/menu/update`, {
      data: { ...menu.value },
      onSuccess: menuProcSuccess,
      onError: () => alert('메뉴 수정에 실패했습니다.'),
    });
  } else {
    // 편집 모드가 아니면 등록
    await post('comm', '/menu/add', {
      data: { ...menu.value },
      onSuccess: menuProcSuccess,
      onError: () => alert('메뉴 저장에 실패했습니다.'),
    });
  }
};

/**
 * 메뉴 삭제
 */
const deleteMenu = async (menuCd) => {
  await get('comm', `/menu/delete/${menuCd}`, {
    onSuccess: menuProcSuccess,
    onError: () => alert('메뉴 삭제에 실패했습니다.'),
  });
};
</script>

<style lang="scss" scoped>
.menu-manage {
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

.menu-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #3498db;
  color: white;
}

button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

input,
select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 32px;
}

button[type='submit'] {
  background-color: #3498db;
  color: white;
  border: none;
}
</style>
