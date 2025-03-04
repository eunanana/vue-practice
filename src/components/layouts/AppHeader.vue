<template>
  <header class="header">
    <nav>
      <!-- 동적으로 메뉴 렌더링 -->
      <ul class="menu-list">
        <li v-for="menu in authStore.menuList" :key="menu.menuCd">
          <!-- menuUrl이 있을 경우 router-link 사용 -->
          <router-link v-if="menu.menuUrl" :to="menu.menuUrl" class="menu-item">{{ menu.menuNm }}</router-link>
          <!-- menuUrl이 없을 경우 일반 텍스트(span) 사용 -->
          <span v-else class="menu-item">{{ menu.menuNm }}</span>

          <!-- 자식 메뉴가 있는 경우 재귀적으로 서브메뉴 렌더링 -->
          <ul v-if="menu.children && menu.children.length" class="submenu">
            <li v-for="sub in menu.children" :key="sub.menuCd">
              <router-link :to="sub.menuUrl">{{ sub.menuNm }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
      <button @click="logout">로그아웃</button>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
// import { useMenuStore } from '@/stores/menu';

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  background-color: #3498db;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: 30px;
}

nav {
  display: flex;
  align-items: center;
}

.menu-list {
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 0;
  margin: 0;
}

.menu-list li {
  position: relative;
}

.submenu {
  list-style: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2980b9;
  padding: 10px;
  min-width: 150px;
  white-space: nowrap;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: none;
}

.menu-list li:hover .submenu {
  display: block;
}

button {
  padding: 8px 16px;
  background-color: white;
  color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* router-link와 span을 동일한 스타일로 맞춤 */
.menu-item {
  text-decoration: none;
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  display: inline-block;
  cursor: pointer;
}
</style>
