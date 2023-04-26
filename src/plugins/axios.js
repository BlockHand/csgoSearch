import {qtsAjax,qtsAjaxGet} from '../api/index'
/** *
 * ajax请求函数
 * @param url
 * @param json
 * @param timeout
 * @returns {*}
 */
const $axios = {
  post:(url,data,options)=>{
    return qtsAjax(url,data,options)
  },
  get:(url,data,options)=>{
    return qtsAjaxGet(url,data,options)
  }
}

export default $axios
