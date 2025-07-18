import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const apiImg = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Envoi de la requête:', config.url);
  }
  return config;
});

// Intercepteur pour les réponses
api.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Réponse reçue:', response.config.url, response.data);
    }
    return response;
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur API:', error.config?.url, error.response?.data);
    }
    return Promise.reject(error);
  }
);

const apitoken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export { api, apitoken, apiImg };