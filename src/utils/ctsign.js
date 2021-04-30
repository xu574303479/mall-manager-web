import md5 from 'js-md5'

export function createSign(jsonParams) {
  //signJson  参数json
  let keys=[]
  for (let k in jsonParams){
    keys.push(k)
  }
  // 排序
  keys.sort()
  // 转换为字符串参数
  let kv=[]
  for(let k in keys){
    kv.push(keys[k] + '=' + jsonParams[keys[k]]) 
  }
  // 拼接secret,必须与后端对应
  let paramStr = kv.join('&') + '*SHOP*'
  // 加密生成签名
  let sign = md5(paramStr)
  return sign
}
