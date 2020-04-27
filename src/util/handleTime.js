// export const getToday= (() => {
//   return formatTime(new Date()).split(" ")[0]
// })

export const formatTime = (date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  // [].map() 循环每一个数组元素执行括号里的方法
  return [year, month, day].map(formatNumber).join("-") + " " + [hour, min, sec].map(formatNumber).join(":")
})

export const formatNumber = (n => {
  n = n.toString()
  return n[1] ? n : '0' + n // 月、日期、时分秒上的十位为空时，补个0
})

export const calcTime = (time => {
  if (!time) {
    return;
  }
  const day = new Date(time);
  const now = new Date();
  const result = now.getTime() - day.getTime();
  if (now.getFullYear() !== day.getFullYear()) {
    return time.split(' ')[0];
  }
  // 一分钟前评论
  if (result < 60000) {
    return '刚刚';
  }
  // 一小时内,向下取整
  if (60000 <= result && result < 3600000) {
    return `${Math.floor(result / 60000)}分钟前`
  }
  // 大于一小时,小于24小时,向下取整
  if (3600000 <= result && result < 86400000) {
    return `${Math.floor(result / 3600000)}小时前`
  }
  // 七天内,向下取整
  if (86400000 <= result && result < 604800000) {
    return `${Math.floor(result / 86400000)}天前`
  }
  return `${formatNumber(day.getMonth() + 1)}-${formatNumber(day.getDate())}`
})

export const calcDay = (dateStr => {
  let day = new Date(dateStr).getDay();
  switch (day) {
    case 0:
      return 'Sun.';
      break;
    case 1:
      return 'Mon.';
      break;
    case 2:
      return 'Tue.';
      break;
    case 3:
      return 'Wed.';
      break;
    case 4:
      return 'Thur.';
      break;
    case 5:
      return 'Fri.';
      break;
    case 6:
      return 'Sat.';
      break;
    default:
      break;
  }
})
