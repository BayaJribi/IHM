// ✅ client/src/axios.js

import axios from 'axios';

// 🔧 Création d'une instance Axios avec baseURL (redirigée via le proxy React)
const instance = axios.create({
  baseURL: '/', // correspond au proxy défini dans package.json (ex. vers http://localhost:4001)
});

// 🔐 Intercepteur pour ajouter le token automatiquement dans chaque requête
instance.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Clé à adapter si différente (ex: "auth")
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
  } catch (err) {
    console.warn("🔑 Aucun token valide trouvé dans le localStorage.");
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
