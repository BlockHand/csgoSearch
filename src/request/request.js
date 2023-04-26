/* qt中心请求组件 */
import axios from 'axios';
import qs from 'qs';
import { createApp,h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import juicer from './juicer';
import './request.less';


const { Raven, FormData, FileList } = window;
let reloginModal;
let dom = null;
var appLoading

/**
 * @description 主动提取错误到许俊部署的sentry服务上，依赖全局引入Raven.js ytian版本必须在3.1.11以及以上
 * @date 2018-11-20
 * @param {*} content
*/
const capture = (content) => {
  if (window.Raven) {
    let str;
    typeof content === 'object' ? str = JSON.stringify(content) : str = content;
    Raven.captureException(new Error(str), { tags: { component: 'request in c3' } });// component为request in c3
  }
};

const showLoading = (loading) => {
  if (loading && !dom) {
    dom = document.createElement('div');
    dom.setAttribute('class', 'cao-loading-wrap');
    dom.setAttribute('id','caoLoading');
    document.body.appendChild(dom);
    appLoading = createApp({
      template:`
        <my-loading>
            <div />
            <div />
            <div />
            <div />
        </my-loading>
      `
    })
    appLoading.component('my-loading',{
      template:`
      <div className="cao-loading">
        <slot />
      </div>`
    })
    appLoading.mount("#caoLoading")
  }
};

// 卸载遮罩
const hideLoading = () => {
  if (dom) {
    appLoading.unmount()
    document.body.removeChild(dom);
    dom = null;
  }
};


/**
 * json 转FormData
 *
 * @param    {object}  data     被转数据 如果是FormData 直接返回
 * @returns  FormData
 * @author   gaohaifeng
 */
const jsonToFormData = (data) => {
  if (data instanceof FormData) {
    return data;
  }
  if (typeof data === 'object') {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof FileList) {
        Array.from(data[key]).forEach((file) => {
          formData.append(key, file);
        });
      } else if (data[key] instanceof Array) {
        data[key].forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }
  return new FormData();
};

/**
 * 根据dataType 设置 request headers
 *
 * @param    {string}  dataType
 */
const getDataType = (dataType) => {
  switch (dataType.toLowerCase()) {
    case 'json':
      return {
        'Content-Type': 'application/json',
      }; // 数据格式为json格式,用的多
    case 'text':
      return {
        'Content-Type': 'text/plain',
      }; // 纯文本传输，用得少
    case 'form':
      return {
        'Content-Type': 'application/x-www-form-urlencoded',
      }; // 数据格式为"key1=value1&key2=value2"
    case 'formdata':
      return {
        'Content-Type': 'multipart/form-data',
      }; // 用户传输文件
    default:
      return {};
  }
};


/**
 * 构建一个 同步提交的 form
 *
 * @param {Object} options，拥有{method,data}等属性,
 * @param {String} method 同步form表单提交方式
 * @param {Object} data 一维数据
 * @param {String} url 请求地址
 */
const createForm = (options) => {
  // 创建一个 form
  const form1 = document.createElement('form');
  const { data, method, url } = options;
  form1.name = `form${new Date().getTime()}`;
  // 添加到 body 中
  document.body.appendChild(form1);
  Object.keys(data).forEach((i) => {
    // 创建一个输入
    const input = document.createElement('input');
    // 设置相应参数
    input.type = 'text';
    input.name = i;
    input.value = data[i];

    // 将该输入框插入到 form 中
    form1.appendChild(input);
  });
  // form 的提交方式
  form1.method = method.toUpperCase();
  // form 提交路径
  form1.action = url;
  // 对该 form 执行提交
  form1.submit();
  // 删除该 form
  document.body.removeChild(form1);
};

// 创建请求实例
const INSTANCE = axios.create();

/**
 * qt中心请求组件 输出方法
 *
 * @param {Object} options，拥有{method,dataType,headers,rules,loading}等属性,
 * options 是在axios的原始api中扩展了qt中心的业务入参，接下去将只描述扩展的字段，axios的api请查看：https://www.npmjs.com/package/axios.
 * @param {Object} rules 请求数据预处理，删除空格，删除undefined 属性；
 * @param {String} loading 展示全局请求遮罩;
 */
const request = (options) => {
  const defaultOption = {
    method: 'get',
    dataType: 'json',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    withCredentials: false,
    timeout: 10000,
    code: 200, // 数据返回code默认为200
    rules: {
      noEmoji: true, // 默认过滤表情
      noEmptyString: false,
    },
    loading: true,
    errorToast: true, // 异常业务code时，弹出错误提示，默认弹出
    intactData: false, // 完整数据，默认false，默认只返回业务数据的data部分
    ignoreCode: false, // 忽略业务code判断，所有情况都进入then逻辑
    messageRedefine: 'message', // 有些服务端为了兼容新老系统，不会采用message弹出错误，增加message重定义入口
    ...options,
  };

  const {
    dataType, data, method,
  } = defaultOption;
  defaultOption.headers = { ...defaultOption.headers, ...getDataType(dataType) };
  if (dataType.toLowerCase() === 'formsync') { // 如果是同步表单提交，则直接进行表单元素创建+发送,同步后续行为交给服务端，前端不再分析返回值
    return createForm(defaultOption);
  }
  if (method.toLowerCase() === 'get') { // 如果是get请求，一维键值对需要放到params中
    defaultOption.params = data;
  }
  showLoading(defaultOption.loading);
  return INSTANCE.request({
    ...defaultOption,
    validateStatus(status) {
      return ((status >= 550 && status <= 560) // 556的时候是未认证的，需要唤起iframe的父级进行跳转登录.
            || status === 200 || status === 400); //400放行，提示友好信息.
    },
  });
};

// 请求数据拦截器
INSTANCE.interceptors.request.use((config) => {
  const {
    data, rules, dataType, params,
  } = config;
  const dataTypeLowerCase = dataType.toLowerCase();
  config.params = juicer(params, rules);
  let cData = juicer(data, rules);
  if (dataTypeLowerCase === 'formdata') {
    cData = jsonToFormData(cData);// 如果是上传文件，则进行FormData转换.
  } else if (dataTypeLowerCase === 'form') {
    cData = qs.stringify(cData);// 如果是form类型，则进行qs序列化.
  }
  config.data = cData;
  return config;
}, error =>
  Promise.reject(error));

// 返回数据拦截器
INSTANCE.interceptors.response.use((response) => {
  hideLoading();
  const {
    status, data, config,
  } = response;
  // 如果ignoreCode，直接进入then
  if (config.ignoreCode) {
    return Promise.resolve(data);
  }
  if (status === 400) {
    config.errorToast && ElMessage.error('输入内容不合法!'); //可配置是否弹出消息
    return Promise.reject(); //直接进入catch回调
  }
  else if (status >= 550 && status <= 560) {
    if (status === 556) {
      if (!reloginModal) {
        reloginModal = ElMessageBox.confirm(`data.authFilterErrorMessage,`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          })
            .then(() => {
              if (window.parent.length > 0) {
                window.parent.location.href = data.authFilterSeverLoginUrl;
              } else {
                window.location.href = data.authFilterSeverLoginUrl;
              }
            })
            .catch(() => {})
        }
    } else if (status === 555) {
      ElMessage.error('请求的资源不存在，请联系管理员！');
    } else {
      ElMessage.error(data.authFilterErrorMessage);
      capture(data);
    }
  }
  let bizSuccess = true;
  if (Array.isArray(config.code)) {
    if (config.code.indexOf(data.code) === -1) {
      bizSuccess = false;
    }
  } else if (data.code !== config.code) {
    bizSuccess = false;
  }
  if (!bizSuccess) { // 业务code不匹配，直接返回错误
    config.errorToast && ElMessage.error(data[config.messageRedefine] || '返回数据异常');
    return Promise.reject(new Error(`${JSON.stringify({
      success: false,
      ...data, // 展开完整的data出来
    })}`));
  }
  if (!config.intactData) {
    return Promise.resolve(data.data);
  }

  return Promise.resolve({
    ...data,
    httpCode: status,
  });
}, (error) => {
  hideLoading();
  const {
    response,
  } = error;
  let msg;
  if (response && response instanceof Object) {
    const {
      data, statusText,
    } = response;
    msg = data.message || statusText;
    ElMessage.error(msg);
  } else {
    msg = error.message || '网络繁忙，请稍后再试！';
    if (msg.indexOf('timeout') > -1) {
      ElMessage.error('请求接口超时！');
    } else if (msg.indexOf('Network') > -1) {
      ElMessage.error('网络错误，请稍后再试！');
    } else {
      ElMessage.error(msg);
    }
    capture(error);
  }
  return Promise.reject(new Error(`${JSON.stringify({
    success: false,
    message: msg,
    response,
  })}`));
});

//返回原版本的axios
request.axios = axios;

export default request;
