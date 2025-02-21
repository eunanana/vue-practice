import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from "@/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 환경 변수에서 API 주소 가져오기
  timeout: 5000, // 요청 타임아웃 설정 (5초)
  withCredentials: true, // 쿠키 자동 포함
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

// 응답 인터셉터 (토큰 만료 시 자동 갱신)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (response?.status === 401 && !config._retry) {
      config._retry = true; // 무한 루프 방지
      try {
        const newAccessToken = await useAuthStore().refreshAccessToken();

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(config); // 갱신된 토큰으로 재요청
        }
      } catch (refreshError) {
        refreshError
        useAuthStore().logout();
        router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

// 공통 API 요청
const request = async (method, url, { params = {}, data = {}, onSuccess, onError } = {}) => {
  try {
    const response = await api({ method, url, params, data });
    if (response.status === 200) {
      // 토큰 만료(1401) 시 로그아웃
      if (response.data.code === 1401) {
        console.log("Expired Token...");
        useAuthStore().logout();

        // 서버에서 쿠키 삭제
        await axios.post("/comm/auth/logout", {}, {
          baseURL: import.meta.env.VITE_API_BASE_URL,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        router.push("/login");
        return;

      } else if (response.data.code === 1402) {
        useAuthStore().logout();
        router.push("/login");
        return;
      }
      if (onSuccess) onSuccess(response.data);
      return response.data;
    }
  } catch (error) {
    // api 서버에서 의도(정의)하지 않은 에러 발생
    if (onError) {
      onError(error.response); // 에러 시 실행할 콜백 함수 (서버 메시지 포함)
    } else {
      alert("관리자에게 문의하세요.");
    }
  }
};

// GET 요청 함수
export const get = (url, options = {}) => {
  // Tree Shaking 방지
  const safeOptions = {
    ...options,
    onSuccess: options.onSuccess || (() => { })
  };

  return request('get', url, safeOptions);
};

// POST 요청 함수
export const post = (url, options = {}) => {
  // Tree Shaking 방지
  const safeOptions = {
    ...options,
    onSuccess: options.onSuccess || (() => { })
  };

  return request('post', url, safeOptions);
};


export default api;
