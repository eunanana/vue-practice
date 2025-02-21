import { defineStore } from "pinia";
import { post, get } from '@/api/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: null, // 사용자 정보가 persist 저장됨
  }),

  actions: {
    async login(userId, userPswd) {
      await post("/comm/login", {
        data: { userId, userPswd },
        onSuccess: (response) => {
          if (response.code === 200) {
            // 로그인 성공 후 사용자 정보 셋팅
            localStorage.setItem("accessToken", response.data.accessToken);
            this.userInfo = response.data.userId;
          } else if (response.code === 1403) {
            alert(response.msg);
          } else {
            alert("로그인에 실패했습니다.");
          }
        }
      });
    },

    async refreshAccessToken() {
      await post("/comm/auth/refresh", { // 쿠키 기반이므로 추가 데이터 필요 없음
        onSuccess: async () => {
          await this.getUser(); // 새 토큰으로 사용자 정보 가져오기
        },
        onError: (errorResponse) => {
          console.error("토큰 갱신 실패:", errorResponse.data.msg);
          this.logout();
        }
      });
    },

    async getUser() {
      await get("/comm/user", {
        onSuccess: (response) => {
          if (response.code === 200) {
            this.userInfo = response.data; // 성공 시 사용자 정보 저장
          }
        },
        onError: (errorResponse) => {
          console.error("사용자 정보를 가져오지 못했습니다:", errorResponse.data.msg);
          alert("사용자 정보를 가져오지 못했습니다");
          this.logout(); // 에러 발생 시 로그아웃 처리
        }
      });
    },

    async logout() {
      // client 로그아웃만 처리
      this.userInfo = null;
      localStorage.removeItem("accessToken");
    },
  },


  getters: {
    isLogin: (state) => !!state.userInfo, // userInfo 존재 여부로 로그인 상태 판단
  },

  // persist 설정
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'info',
        storage: localStorage, // localStorage 사용
        paths: ['userInfo'], // userInfo만 저장
      }
    ]
  }
});
