const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const millisecond = date.getMilliseconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const genarateCode = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const millisecond = date.getMilliseconds()
  return [year, month, day, hour, minute, second].map(formatNumber).join('') + [millisecond].map(formatMillsecond)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatMillsecond = n => {
  n = n.toString()
  return `00${n}`.slice(-3)
}

module.exports = {
  formatTime: formatTime,
  genarateCode: genarateCode
}