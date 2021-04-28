import Cookies from 'js-cookie'

const DeviceKey = 'deviceKey'

export function getDevice() {
  return Cookies.get(DeviceKey)
}

export function setDevice(device) {
  console.log("setDevice=========" + device);
  return Cookies.set(DeviceKey, device)
}

export function removeDevice() {
  return Cookies.remove(DeviceKey)
}
