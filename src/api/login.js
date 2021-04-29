import request from '@/utils/request'

const BASE_API_PATH = '/api/admin'

export function login(username, password) {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: BASE_API_PATH + '/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: BASE_API_PATH + '/info',
    method: 'get'
  })
}

export function fetchList(params) {
  return request({
    url: BASE_API_PATH + '/list',
    method: 'get',
    params: params
  })
}

export function createAdmin(data) {
  return request({
    url: BASE_API_PATH + '/register',
    method: 'post',
    data: data
  })
}

export function updateAdmin(id, data) {
  return request({
    url: BASE_API_PATH + '/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: BASE_API_PATH + '/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(id) {
  return request({
    url: BASE_API_PATH + '/delete/' + id,
    method: 'post'
  })
}

export function getRoleByAdmin(id) {
  return request({
    url: BASE_API_PATH + '/role/' + id,
    method: 'get'
  })
}

export function allocRole(data) {
  return request({
    url: BASE_API_PATH + '/role/update',
    method: 'post',
    data: data
  })
}
