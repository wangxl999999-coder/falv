import { post } from './request.js'

export const chatWithAI = (messages, sessionId = '') => {
  return post('/ai/chat', {
    messages,
    sessionId
  })
}

export const speechToText = (filePath) => {
  return post('/ai/speech-to-text', {
    filePath
  })
}

export const textToSpeech = (text) => {
  return post('/ai/text-to-speech', {
    text
  })
}

export const generateDocument = (type, data) => {
  return post('/ai/generate-document', {
    type,
    data
  })
}

export const reviewContract = (fileId) => {
  return post('/ai/review-contract', {
    fileId
  })
}

export const searchCases = (description, filters = {}) => {
  return post('/ai/search-cases', {
    description,
    filters
  })
}

export default {
  chatWithAI,
  speechToText,
  textToSpeech,
  generateDocument,
  reviewContract,
  searchCases
}