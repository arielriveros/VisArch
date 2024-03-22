// In production the client will proxy requests to the server, so the API_BASE_URL will be the same as the client's URL
export const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';