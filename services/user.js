import { post, get } from '../utils/request.js'

export const loginByCode = (code) => {
  return post('/user/login', { code })
}

export const loginByPhone = (phoneCode) => {
  return post('/user/login-phone', { phoneCode })
}

export const getUserInfo = () => {
  return get('/user/info')
}

export const updateUserInfo = (data) => {
  return post('/user/update', data)
}

export const getRecords = (type, page = 1, pageSize = 10) => {
  return get('/user/records', { type, page, pageSize })
}

export const getRecordDetail = (id) => {
  return get(`/user/record/${id}`)
}

export const deleteRecord = (id) => {
  return post(`/user/record/${id}/delete`)
}

export default {
  loginByCode,
  loginByPhone,
  getUserInfo,
  updateUserInfo,
  getRecords,
  getRecordDetail,
  deleteRecord
}