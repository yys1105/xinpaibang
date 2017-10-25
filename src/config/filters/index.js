function encode(val) {
  let hideStr = '****'
    , remainLength = val.slice(4).length;
  if (remainLength < 4) {
    hideStr = '';
    for (let i = 0; i <= remainLength; i++) { hideStr += '*' }
  }
  return val.slice(0, 3) + hideStr + val.slice(7)
}

function dateFormat(val) {
  let now         = +new Date()                   // 当前时间
    , space       = now - val                     // 目标日期距今的跨度
    , valDateObj  = new Date(val)                 // 目标日期
    , valYear     = valDateObj.getFullYear()      // 目标日期的 年
    , valMonth    = valDateObj.getMonth() + 1     // 目标日期的 月
    , valDate     = valDateObj.getDate()          // 目标日期的 天
    , nowYear     = new Date(now).getFullYear()   // 当前时间的 年

  if (space >= 3*24*60*60*1000 && space < 4*24*60*60*1000) { return '三天前' }
  if (space >= 2*24*60*60*1000 && space < 3*24*60*60*1000) { return '两天前' }
  if (space >= 24*60*60*1000 && space < 2*24*60*60*1000) { return '一天前' }
  if (space >= 12*60*60*1000 && space < 24*60*60*1000) { return '半天前' }
  if (space >= 60*1000 && space < 12*60*60*1000) { return Math.floor(space/(60*1000)) + '分钟前' }
  if (space < 60*1000) { return '刚刚' }
  if (valYear === nowYear) { // 今年
      let fullDate = valDateObj.toLocaleString()
        , fullTime = fullDate.split(' ')[1];
      return valMonth+'月'+valDate+'日 '+fullTime
  }
  if (valYear > nowYear) { return valYear+'年'+valMonth+'月'+valDate+'日' } // 今年之前
}

function sourceFilter(val) {
  let tempVal = val
    , value = tempVal
  if (tempVal.slice(0,3) === '转自：') {
    value = tempVal.slice(3)
  }
  return value
}

export default {
  'encode': encode,
  'dateFormat': dateFormat,
  'sourceFilter': sourceFilter
}
