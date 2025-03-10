import { get } from '@/api/api';

/**
 * 빈 값 확인
 */
const isEmpty = (value) => value == null || value === "" || value === "undefined" || value === "None" || (Array.isArray(value) && value.length === 0) || (typeof value === "object" && Object.keys(value).length === 0);

/**
 * 날짜/시간 포맷 변환 (formatDateTime)
 * @param {Date | string | number} date - 날짜 객체 또는 문자열 (timestamp 가능)
 * @param {string} format - 포맷 문자열 (예: "YYYY-MM-DD HH:mm:ss" 또는 "YYYY-MM-DD")
 * @returns {string} 포맷된 날짜 문자열
 */
const formatDateTime = (date, format = "YYYY-MM-DD") => {
  if (!date) return "";

  const dateObject = new Date(date);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hour = String(dateObject.getHours()).padStart(2, "0");
  const minute = String(dateObject.getMinutes()).padStart(2, "0");
  const second = String(dateObject.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hour)
    .replace("mm", minute)
    .replace("ss", second);
};

/**
 * 파일 다운로드
 * @param {number} fileSn 파일 일련번호
 * @param {string} srvrFileNm 서버에 저장되는 파일명
 * @param {string} orgnlFileNm 파일 원본명
 */
const fileDownload = async (fileSn, srvrFileNm, orgnlFileNm) => {
  await get(`/comm/file/${fileSn}/${srvrFileNm}`, {
    responseType: 'blob',
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', orgnlFileNm);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  })
}

export {
  isEmpty, formatDateTime, fileDownload
};
