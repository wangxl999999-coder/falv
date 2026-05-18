import { get, post } from '../utils/request.js'

export const searchCases = (params) => {
  return post('/case/search', params)
}

export const getCaseDetail = (id) => {
  return get(`/case/${id}`)
}

export const getCaseCategories = () => {
  return get('/case/categories')
}

export const getSimilarCases = (caseId) => {
  return get(`/case/${caseId}/similar`)
}

export default {
  searchCases,
  getCaseDetail,
  getCaseCategories,
  getSimilarCases
}