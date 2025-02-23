const WS_URL = import.meta.env.VITE_API_URL.replace('http', 'ws');

export class WebSocketService {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;

  connect(roomId: string) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    this.roomId = roomId;
    this.ws = new WebSocket(`${WS_URL}?token=${token}&roomId=${roomId}`);

    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
      this.joinRoom();
    };

    return this.ws;
  }

  private joinRoom() {
    if (!this.ws || !this.roomId) return;
    
    this.ws.send(JSON.stringify({
      type: 'join-room',
      roomId: this.roomId
    }));
  }

  syncVideo(data: { currentTime: number; isPlaying: boolean }) {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'sync-video',
      ...data
    }));
  }

  sendMessage(message: string) {
    if (!this.ws) return;
    
    this.ws.send(JSON.stringify({
      type: 'send-message',
      message
    }));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.roomId = null;
    }
  }
}

export const wsService = new WebSocketService(); 