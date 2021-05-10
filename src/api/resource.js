import request from '@/utils/request'

const BASE_API_PATH = '/api/resources'

export function fetchList(params) {
  return request({
    url: BASE_API_PATH + '/list',
    method: 'get',
    params: params
  })
}

export function createResource(data) {
  return request({
    url: BASE_API_PATH + '/create',
    method: 'post',
    data: data
  })
}

export function updateResource(id, data) {
  return request({
    url: BASE_API_PATH + '/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteResource(id) {
  return request({
    url: BASE_API_PATH + '/delete/' + id,
    method: 'post'
  })
}

export function fetchAllResourceList() {
  return request({
    url: BASE_API_PATH + '/listall',
    method: 'get'
  })
}
