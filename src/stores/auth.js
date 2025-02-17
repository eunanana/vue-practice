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
        onSuccess: async (response) => {
          // 로그인 성공 후 사용자 정보 셋팅
          this.userInfo = response;
        },
        onError: (errorResponse) => {
          console.error(errorResponse);
          if (errorResponse.status === 401) {
            alert("아이디 또는 비밀번호를 정확히 입력해 주세요.");
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
          alert("토큰 갱신 실패했습니다다.");
          this.logout();
        }
      });
    },

    async getUser() {
      await get("/comm/user", {
        onSuccess: (data) => {
          this.userInfo = data; // 성공 시 사용자 정보 저장
        },
        onError: (errorResponse) => {
          console.error("사용자 정보를 가져오지 못했습니다:", errorResponse.data.msg);
          alert("사용자 정보를 가져오지 못했습니다");
          this.logout(); // 에러 발생 시 로그아웃 처리
        }
      });
    },

    async logout() {
      // 서버에서 쿠키 삭제
      await post("/comm/auth/logout", {
        onSuccess: () => {
          this.userInfo = null; // 상태 초기화
        },
        onError: (errorResponse) => {
          console.error("로그아웃 실패:", errorResponse.data.msg);
          this.userInfo = null;
          // alert("로그아웃 실패");
        }
      });
    }
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
