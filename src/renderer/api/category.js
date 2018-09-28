import request from '@/utils/request'

export function getCategories(userId) {
  return request({
    url: '/api/getCategories',
    method: 'get',
    params: {
      userId
    }
  })
}

export function addCategory(newCategoryName, userId) {
  return request({
    url: '/api/addCategory',
    method: 'post',
    data: {
      newCategoryName,
      userId
    }
  })
}

export function delCategory(id, userId) {
  return request({
    url: '/api/delCategory',
    method: 'post',
    data: {
      id,
      userId
    }
  })
}