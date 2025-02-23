const API_URL = import.meta.env.VITE_API_URL;

export const createRoom = async (roomData: { name: string; type: string; url?: string }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_URL}/api/rooms/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(roomData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create room');
  }

  return response.json();
};

export const getRooms = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_URL}/api/rooms`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch rooms');
  }

  return response.json();
}; 