// 属性管理验证规则 长度范围的表单校验规则
export function validatorAttributeLength (rule, value, callback) {
  if(value){
    const num = parseInt(value, 10);
    if (num !== 0 && !num) {
      callback('请输入数字');
    } else if (num < 0) {
      callback('输入值不能小于0');
    } else if (num > 200) {
      callback('输入值不能超过200');
    } else if (`${num}` !== `${value}`) {
      callback('请输入正整数');
    } else {
      callback();
    }
  } else {
    callback();
  }
}

export function validatorMultipleNumber (rule, value, callback) {
  const reg = /^(\d*,?)+?\d$/;
  if (value && !reg.test(value)) {
    callback('请输入正确格式');
  } else {
    callback();
  }
}