import request from '@/utils/request'

export function addRemark(repoId, userId, remark) {
  return request({
    url: '/api/addRemark',
    method: 'post',
    data: {
      repoId,
      userId,
      remark
    }
  })
}

export function getRemarks(userId) {
  return request({
    url: '/api/getRemarks',
    method: 'get',
    params: {
      userId
    }
  })
}