function isEmpty(value) {
  return value == "None" || value == "undefined" || value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)
}

// 일시 포멧 (ex. 2025-01-01 13:25:01)
const formatDateTime = (date, format) => {
  if (!date) return ""
  const dateObject = new Date(date)

  // const dateTimeOptions = {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   hour12: false,
  // }

  if (format === "DATETIME") {
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hour = String(dateObject.getHours()).padStart(2, '0');
    const minute = String(dateObject.getMinutes()).padStart(2, '0');
    const second = String(dateObject.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  else {
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const formatter = new Intl.DateTimeFormat('ko-KR', dateOptions)
    return formatter.format(dateObject)
  }

}

export {
  isEmpty, formatDateTime
};
