export const API_URLS = {
  comm: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_SERVICE_COMM}`,
  svc1: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_SERVICE_SVC1}`,
};

/**
 * 서비스별 API URL을 가져오는 함수
 * @param {string} serviceName - 서비스명 ('comm', 'svc1')
 */
export const getApiUrl = (serviceName) => {
  return API_URLS[serviceName] || API_URLS["comm"]; // 기본값 comm
};