import axios from 'axios'

const API_KEY = '7902cbef76b269e176' // Your main API key, you can also pass it dynamically

/**
 * Generic GET request wrapper with API key and error handling
 * @param {string} url - Full URL of API endpoint
 * @param {object} params - Query parameters (optional)
 * @returns {Promise<object>} - API response data
 */
export async function getRequest(url, params = {}) {
  try {
    const response = await axios.get(url, {
      params: { apikey: API_KEY, ...params },
      timeout: 10000
    })
    if (response.data.error) {
      throw new Error(response.data.error.message || 'API returned an error')
    }
    return response.data
  } catch (error) {
    // You can add retry logic here if needed
    throw new Error(`API request failed: ${error.message}`)
  }
}

/**
 * Generic POST request wrapper with API key and error handling
 * @param {string} url - API endpoint
 * @param {object} data - POST body data
 * @returns {Promise<object>} - API response data
 */
export async function postRequest(url, data = {}) {
  try {
    const response = await axios.post(url, data, {
      params: { apikey: API_KEY },
      timeout: 10000
    })
    if (response.data.error) {
      throw new Error(response.data.error.message || 'API returned an error')
    }
    return response.data
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`)
  }
}
