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
            console.log(response.data);
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

    /** 권한별 메뉴 조회 */
    async fetchMenu(mbrAuth) {
      await get('/comm/menu/list', {
        params: { mbrAuth },
        onSuccess: (response) => {
          if (response.code === 200) {
            this.menuList = buildMenuTree(response.data);
            sessionStorage.setItem('menuList', JSON.stringify(this.menuList));   // 캐싱
          } else {
            alert('메뉴 조회 도중 오류가 발생했습니다.');
          }
        },
        onError: () => {
          alert('메뉴 조회 도중 오류가 발생했습니다.');
        }
      })
    }

    // async getUser() {
    //   await get("/comm/auth/user", {
    //     onSuccess: (response) => {
    //       if (response?.code === 200) {
    //         this.user = response.data; // 성공 시 사용자 정보 저장
    //       }
    //     },
    //     onError: (errorResponse) => {
    //       console.error("사용자 정보를 가져오지 못했습니다:", errorResponse.data.msg);
    //       alert("사용자 정보를 가져오지 못했습니다");
    //       this.logout(); // 에러 발생 시 로그아웃 처리
    //     }
    //   });
    // },
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
