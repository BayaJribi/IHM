import axios from 'axios';

const API = 'http://localhost:3000'; // adapte si tu utilises un autre port ou un proxy

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(`${API}/notifications/${id}/read`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};
