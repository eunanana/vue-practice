import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 환경 변수에서 API 주소 가져오기
  timeout: 5000, // 요청 타임아웃 설정 (5초)
  withCredentials: true, // 쿠키 자동 포함
  headers: { 'Content-Type': 'application/json' }
});

// 공통 API 요청
const request = async (method, url, { params = {}, data = {}, onSuccess, onError } = {}) => {
  try {
    const response = await api({ method, url, params, data });

    // 200 상태 코드만 성공 처리
    if (response.status === 200) {
      if (onSuccess) onSuccess(response.data); // 성공 시 실행할 콜백 함수
      return response.data; // 데이터 반환
    } else {
      throw new Error(response.data?.message || `Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(`[API ERROR] ${url}`, error);

    // 서버에서 에러 메시지를 내려줄 경우, 포함하여 던짐
    const errorMessage = error.response;

    if (onError) {
      onError(error.response); // 에러 시 실행할 콜백 함수 (서버 메시지 포함)
    } else {
      throw new Error(errorMessage); // 원하는 에러 메시지를 포함하여 던짐
    }
  }
};

// GET 요청 함수
export const get = (url, options = {}) => request('get', url, options);

// POST 요청 함수
export const post = (url, options = {}) => request('post', url, options);


export default api;
