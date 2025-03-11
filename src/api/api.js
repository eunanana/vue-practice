import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import router from "@/router";
import { getApiUrl } from "@/common/config"; // 서비스별 API URL 가져오기

// axios 인스턴스 생성
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL, // 환경 변수에서 API 주소 가져오기
  timeout: 5000, // 요청 타임아웃 설정 (5초)
  withCredentials: true, // 쿠키 자동 포함
  // headers: { 'Content-Type': 'application/json' }
});

// api 요청 시 header에 access token 셋팅
api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

// 응답 인터셉터 (토큰 만료 시 자동 갱신)
api.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const { response, config } = error;

    // access token 만료
    if (response?.status === 401 && !config._retry) {
      config._retry = true; // 무한 루프 방지
      try {
        // refresh token으로 access token 갱신 요청
        const servicePath = getApiUrl("comm")
        const res = await axios.post(servicePath + "/auth/refresh", {}, {
          baseURL: import.meta.env.VITE_API_BASE_URL,
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        if (res?.data?.code === 200) {
          // 로그인 성공
          const accessToken = res?.data?.data.accessToken;
          localStorage.setItem("accessToken", accessToken);
          config.headers.Authorization = `Bearer ${accessToken}`;
          return api(config); // 갱신된 토큰으로 재요청

        } else if (response.data?.code === 1401) {
          // refresh token 만료
          useAuthStore().logout();

          // refresh token 만료되면
          // 서버에서 쿠키, redis 의 refresh token 삭제 후 로그아웃
          await axios.post(servicePath + "/auth/logout", {}, {
            baseURL: import.meta.env.VITE_API_BASE_URL,
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          });
          router.push("/login");
          return Promise.reject(error);

        }
        else {
          // 그 외 사용자 정의 에러
          useAuthStore().logout();
          router.push("/login");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // 서버 에러
        useAuthStore().logout();
        router.push("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 서비스별 API 요청 함수
 * @param {string} serviceName - 서비스명 ('comm', 'svc1')
 * @param {string} method - HTTP 메서드 ('GET', 'POST' 등)
 * @param {string} url - 요청할 API 경로
 * @param {Object} data - 요청 데이터 (POST, PUT 요청 시)
 */
const request = async (service, method, path, {
  isLoading = false,
  params = {},
  data = {},
  headers = {},
  responseType = 'json',
  onSuccess, onError
} = {}) => {
  const loadingStore = useLoadingStore(); // 로딩 상태 가져오기
  if (isLoading) loadingStore.startLoading();

  // 서비스별 path 가져오기
  const url = `${getApiUrl(service)}${path}`;
  console.log(url)

  // FormData 여부 확인 (multipart/form-data 자동 적용)
  const isFormData = data instanceof FormData;
  const finalHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }), // FormData일 경우 Content-Type 제거
    ...headers, // 추가적인 헤더 병합
  };

  try {
    const response = await api({ method, url, params, data, headers: finalHeaders, responseType });
    if (response?.status === 200) {
      if (onSuccess) onSuccess(response.data);
      return response.data;
    }
  } catch (error) { // api 서버에서 의도(정의)하지 않은 에러 발생
    // console.log(error);
    if (onError) {
      onError(error); // 에러 시 실행할 콜백 함수 (서버 메시지 포함)
    } else {
      alert("관리자에게 문의하세요.");  // 에러 콜백 함수 정의하지 않았을 경우 메시지
    }
  } finally {
    if (isLoading) loadingStore.stopLoading(); // API 응답 후 로딩 종료
  }
};

// GET 요청 함수
export const get = (service, url, options = {}) => {
  return request(service, 'get', url, { responseType: options.responseType || 'json', ...options });
};

// POST 요청 함수
export const post = (service, url, options = {}) => {
  return request(service, 'post', url, { responseType: options.responseType || 'json', ...options });
};

// multipart/form-data POST 요청 함수
export const multipartPost = (service, url, options = {}) => {
  return request(service, 'post', url, { ...options, headers: { ...options.headers } });
};

export default api;
