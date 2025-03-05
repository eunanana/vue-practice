import { defineStore } from "pinia";
import { post, get } from '@/api/api';

// 메뉴 트리구조 변환
function buildMenuTree(menus) {
  const map = {};
  const roots = [];

  menus.forEach(menu => {
    menu.children = [];
    map[menu.menuCd] = menu;
  });

  menus.forEach(menu => {
    if (menu.parntMenuCd && map[menu.parntMenuCd]) {
      map[menu.parntMenuCd].children.push(menu);
    } else {
      roots.push(menu);
    }
  });

  return roots;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // 사용자 정보가 persist 저장됨
    menuList: [],
  }),

  actions: {
    /** 로그인 */
    async login(userId, userPswd) {
      await post("/comm/login", {
        data: { userId, userPswd },
        onSuccess: (response) => {
          if (response?.code === 200) {
            // 로그인 성공 후 사용자 정보 셋팅
            localStorage.setItem("accessToken", response.data.accessToken);
            this.user = response.data.userSn;   // 로그인 후 사용자 정보 셋팅팅
            this.fetchMenu(response.data.authCode); // 로그인 후 메뉴 가져오기
          } else if (response.code === 1403) {
            alert(response.msg);
          } else {
            alert("로그인에 실패했습니다.");
          }
        }
      });
    },

    /** 로그아웃 */
    async logout() {
      // client 로그아웃만 처리
      this.user = null;
      localStorage.removeItem("accessToken"); // access token 초기화화
      sessionStorage.removeItem('menuList');  // 메뉴 초기화
    },


    menuSuccess(menuList) {
      this.menuList = buildMenuTree(menuList);
      sessionStorage.setItem('menuList', JSON.stringify(this.menuList));   // 캐싱
    },

    /** 권한별 메뉴 조회 */
    async fetchMenu(mbrAuth) {
      await get('/comm/menu/list', {
        params: { mbrAuth },
        onSuccess: (response) => this.menuSuccess(response.data),
        onError: () => alert('메뉴 조회 도중 오류가 발생했습니다.'),
      })
    },
  },

  getters: {
    isLogin: (state) => !!state.user, // user 존재 여부로 로그인 상태 판단
  },

  // persist 설정
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'info',
        storage: localStorage, // localStorage 사용
        paths: ['user'], // user 저장
      }
    ]
  }
});
