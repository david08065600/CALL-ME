import { WebSocketServer, WebSocket } from 'ws';
import { query } from '../db/init.js';

interface WebSocketMessage {
  type: string;
  room_id?: string;
  user_id?: string;
  data?: any;
}

const rooms = new Map<string, Set<WebSocket>>();
const userConnections = new Map<string, WebSocket>();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', (data: Buffer) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        handleMessage(ws, message, wss);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      // Clean up user connection
      for (const [userId, connection] of userConnections.entries()) {
        if (connection === ws) {
          userConnections.delete(userId);
          break;
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}

function handleMessage(ws: WebSocket, message: WebSocketMessage, wss: WebSocketServer) {
  const { type, room_id, user_id, data } = message;

  switch (type) {
    case 'join-room':
      if (room_id && user_id) {
        if (!rooms.has(room_id)) {
          rooms.set(room_id, new Set());
        }
        rooms.get(room_id)!.add(ws);
        userConnections.set(user_id, ws);
        broadcastToRoom(room_id, { type: 'peer-joined', user_id }, ws);
      }
      break;

    case 'offer':
      if (room_id) {
        broadcastToRoom(room_id, { type: 'offer', offer: data.offer, from: user_id }, ws);
      }
      break;

    case 'answer':
      if (room_id) {
        broadcastToRoom(room_id, { type: 'answer', answer: data.answer, from: user_id }, ws);
      }
      break;

    case 'ice-candidate':
      if (room_id) {
        broadcastToRoom(room_id, { type: 'ice-candidate', candidate: data.candidate, from: user_id }, ws);
      }
      break;

    case 'leave-room':
      if (room_id) {
        const roomClients = rooms.get(room_id);
        if (roomClients) {
          roomClients.delete(ws);
          if (roomClients.size === 0) {
            rooms.delete(room_id);
          }
        }
        broadcastToRoom(room_id, { type: 'peer-left', user_id });
      }
      break;
  }
}

function broadcastToRoom(room_id: string, message: any, exclude?: WebSocket) {
  const roomClients = rooms.get(room_id);
  if (roomClients) {
    roomClients.forEach((client) => {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
