import { get, post, uploadFile } from '../utils/request.js'

export const getDocumentTypes = () => {
  return get('/document/types')
}

export const getDocumentQuestions = (type) => {
  return get(`/document/${type}/questions`)
}

export const generateDocument = (type, answers) => {
  return post('/document/generate', { type, answers })
}

export const getDocumentList = (page = 1, pageSize = 10) => {
  return get('/document/list', { page, pageSize })
}

export const getDocumentDetail = (id) => {
  return get(`/document/${id}`)
}

export const downloadDocument = (id) => {
  return post(`/document/${id}/download`)
}

export const uploadContract = (filePath) => {
  return uploadFile('/contract/upload', filePath)
}

export const reviewContract = (fileId) => {
  return post('/contract/review', { fileId })
}

export const getContractList = (page = 1, pageSize = 10) => {
  return get('/contract/list', { page, pageSize })
}

export const getContractDetail = (id) => {
  return get(`/contract/${id}`)
}

export default {
  getDocumentTypes,
  getDocumentQuestions,
  generateDocument,
  getDocumentList,
  getDocumentDetail,
  downloadDocument,
  uploadContract,
  reviewContract,
  getContractList,
  getContractDetail
}