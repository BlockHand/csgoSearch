export function dateFormat(d, fmt) {
  // 时间格式化
  let date = ''
  if (!d) {
    return
  }
  try {
    if (Number.isInteger(d)) {
      date = new Date(d)
    } else if (typeof d === 'string') {
      // safari使用yyyy-MM-dd hh:mm格式会出错
      const ua = window.navigator.userAgent.toLowerCase()

      if (ua.match(/.*version\/([\w.]+).*(safari).*/)) {
        d = d.replace(/-/g, '/')
        date = new Date(d)
      }
    } else if (typeof d === 'object') {
      date = d
    } else {
      throw new Error('日期转化错误')
    }
  } catch (e) {
    console.warn(e)
    return
  }
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

/**
 * @desc 获取链接参数的值
 * @param  {string} name 参数名字
 * @param  {string} [url] 链接url，为空的时候取location.href
 * @return {string} 参数
 */
export function getQueryString(name, url) {
  url = url == null ? window.location.href : url
  url = url.split('#')[0]

  const reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i')
  return reg.test(url) ? RegExp.$2.replace(/\+/g, ' ') : ''
}

/**
 * 将目标对象中的空值用覆盖对象中对应的值覆盖
 * @param {Object} source 来源对象
 * @param {Function} coverData 覆盖对象
 * @param {Array} arr 此数组中的选项不会被覆盖
 */
export function coverEmptyData(source, coverData, arr = []) {
  for (var i in source) {
    if (arr.indexOf(i) > -1) {
      continue
    }
    if (typeof source[i] === 'object') {
      coverEmptyData(source[i], coverData[i], arr)
    }
    if (isEmpty(source[i])) {
      source[i] = coverData[i]
    }
  }
}

/**
 * 去除对象中所有符合条件的对象
 * @param {Object} obj 来源对象
 * @param {Function} fn 函数验证每个字段
 */
export function compactObj(obj) {
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      compactObj(obj[i])
    }
    if (isEmpty(obj[i])) {
      delete obj[i]
    }
  }
}

// 删除空对象 删除'', null, undefined
export function isEmpty(foo) {
  if (typeof foo === 'object') {
    for (var i in foo) {
      return false
    }
    return true
  } else {
    return foo === '' || foo === null || foo === undefined
  }
}
