import { get, post } from '../utils/request.js'

export const getLawyerList = (filters = {}, page = 1, pageSize = 10) => {
  return get('/lawyer/list', { ...filters, page, pageSize })
}

export const getLawyerDetail = (id) => {
  return get(`/lawyer/${id}`)
}

export const getLawyerCases = (id, page = 1, pageSize = 10) => {
  return get(`/lawyer/${id}/cases`, { page, pageSize })
}

export const createConsultation = (lawyerId, type, duration) => {
  return post('/consultation/create', { lawyerId, type, duration })
}

export const getConsultationList = (status, page = 1, pageSize = 10) => {
  return get('/consultation/list', { status, page, pageSize })
}

export const payConsultation = (consultationId) => {
  return post('/consultation/pay', { consultationId })
}

export default {
  getLawyerList,
  getLawyerDetail,
  getLawyerCases,
  createConsultation,
  getConsultationList,
  payConsultation
}