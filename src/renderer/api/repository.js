import request from '@/utils/request'

export function getRepos(userId) {
  return request({
    url: '/api/getRepos',
    method: 'get',
    params: { userId }
  })
}

export function emptyCategory(id, userId) {
  return request({
    url: '/api/emptyCategory',
    method: 'get',
    params: {
      id, userId
    }
  })
}

export function addRepos(repos, userId) {
  return request({
    url: '/api/addRepos',
    method: 'post',
    data: {
      repos, userId
    }
  })
}

export function updateCategory(category, id, userId) {
  return request({
    url: '/api/updateCategory',
    method: 'post',
    data: {
      category,
      id,
      userId
    }
  })
}

export function getRepoDetail(fullName) {
  return request({
    url: '/api/getRepoDetail',
    method: 'get',
    params: { fullName }
  })
}

export function getNewestRepos(starredCount) {
  return request({
    url: '/api/getNewestRepos',
    method: 'get',
    params: { starredCount }
  })
}

export function starRepo(fullName) {
  return request({
    url: '/api/starRepo',
    method: 'post',
    data: {
      fullName
    }
  })
}

export function unstarRepo(fullName) {
  return request({
    url: '/api/unstarRepo',
    method: 'post',
    data: {
      fullName
    }
  })
}

export function getFuzzySearchResults(userId, keyWord) {
  return request({
    url: '/api/getFuzzySearchResults',
    method: 'get',
    params: {
      userId,
      keyWord
    }
  })
}
