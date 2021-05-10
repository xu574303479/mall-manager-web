import request from '@/utils/request'

const BASE_API_PATH = '/api/resources/category'

export function listAllCate() {
  return request({
    url: BASE_API_PATH + '/listall',
    method: 'get'
  })
}

export function createResourceCategory(data) {
  return request({
    url: BASE_API_PATH + '/create',
    method: 'post',
    data: data
  })
}

export function updateResourceCategory(id, data) {
  return request({
    url: BASE_API_PATH + '/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteResourceCategory(id) {
  return request({
    url: BASE_API_PATH + '/delete/' + id,
    method: 'post'
  })
}
