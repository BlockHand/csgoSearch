import request  from '../request/index';
import qs from 'qs';
const ENV = import.meta.env.VITE_API_ENV

const jwtToken =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJxdHMiLCJpYXQiOjE2MTU4NjU2NzEsInN1YiI6IntcIm1hdGVJZFwiOjE2NDcsXCJvcmdJZFwiOjEsXCJuYW1lXCI6XCLmnY7lo6vovalcIixcIm5pY2tuYW1lXCI6XCLljYHkuIlcIixcImF2YXRhclwiOlwiaHR0cHM6Ly9xaW5pdS1pbWFnZS5xdHNoZS5jb20vaHR0cHM6Ly9zdGF0aWMtbGVnYWN5LmRpbmd0YWxrLmNvbS9tZWRpYS9sQURQRDNsR3BVMGVlTV9OQWlqTkFpZ181NTJfNTUyLmpwZ1wiLFwiZW1haWxcIjpcImxpc2hpeHVhbkBxdHNoZS5jb21cIixcIm1vYmlsZVwiOlwiMTc2KioqKjM1MDJcIn0iLCJleHAiOjI0Mjk3OTg0MDB9.I2_AyO4hqF5sNfHs2xWT6XHDerXiqDrIHvH_eLeAIdY';

export const jwtHeader = {
  Authorization: jwtToken,
};

export const tableOptions = {
  headers: jwtHeader,
  dataType: 'form',
  code: 4000,
};

export function qtsAjax (url, data, options) {
  if(url.indexOf('https') === -1){
    if(ENV == 'dev'){
      url = '/api' + url
    }
  }
  const commonParams = {
    appKey: 'Night_God',
    orgId: 1,
  };
  const { isJson = false } = options || {};
  const headers = {
    Authorization: jwtToken,
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (!isJson) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  return request
    .axios({
      url,
      method: 'POST',
      headers,
      //   withCredentials: true,
      data: isJson ? data : qs.stringify(Object.assign({}, commonParams, data)),
    })
    .then(res => res.data);
}

export function qtsAjaxGet (url, data, options) {
  if(url.indexOf('https') === -1){
    if(ENV == 'dev'){
      url = '/api' + url
    }
  }
  const commonParams = {
    appKey: 'Night_God',
    orgId: 1,
  };
  const { isJson = false } = options || {};
  const headers = {
    Authorization: jwtToken,
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (!isJson) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  return request
    .axios({
      url,
      method: 'GET',
      headers,
      //   withCredentials: true,
      params: Object.assign({}, commonParams, data),
    })
    .then(res => res.data);
}



