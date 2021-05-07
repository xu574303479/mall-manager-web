import request from '@/utils/request'

const BASE_API_PATH = '/api/role'

export function fetchList(params) {
  return request({
    url: BASE_API_PATH + '/list',
    method: 'get',
    params: params
  })
}

export function fetchAllRoleList() {
  return request({
    url: BASE_API_PATH + '/listall',
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: BASE_API_PATH + '/create',
    method: 'post',
    data: data
  })
}

export function updateRole(id, data) {
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

export function deleteRole(data) {
  return request({
    url: BASE_API_PATH + '/delete',
    method: 'post',
    data: data
  })
}

export function listMenuByRole(roleId) {
  return request({
    url: BASE_API_PATH + '/listMenu/'+roleId,
    method: 'get'
  })
}

export function listResourceByRole(roleId) {
  return request({
    url: BASE_API_PATH + '/listResource/'+roleId,
    method: 'get'
  })
}

export function allocMenu(data) {
  return request({
    url: BASE_API_PATH + '/allocMenu',
    method: 'post',
    data:data
  })
}

export function allocResource(data) {
  return request({
    url: BASE_API_PATH + '/allocResource',
    method: 'post',
    data:data
  })
}
