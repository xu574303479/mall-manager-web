import md5 from 'js-md5'

export function cs(jsonParams) {
  let keys = []
  for (let k in jsonParams) {
    if (k !== 'sign') {
      keys.push(k)
    }
  }
  keys.sort()
  let kv = []
  for (let k in keys) {
    kv.push(keys[k] + '=' + jsonParams[keys[k]])
  }
  let paramStr = kv.join('&') + '*SHOP*'
  // console.log(paramStr)
  let c = md5(paramStr)
  return c
}
