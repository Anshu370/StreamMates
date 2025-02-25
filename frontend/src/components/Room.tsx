import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { wsService } from '../services/websocket';
import { 
  MessageSquare, Send, Play, Pause, Users, Link as LinkIcon,
  Mic, MicOff, Video as VideoIcon, VideoOff, Copy, X
} from 'lucide-react';
import Peer from 'simple-peer';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface Member {
  id: string;
  username: string;
  hasVideo: boolean;
  hasAudio: boolean;
}

const Room = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showMembers, setShowMembers] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const isSeekingRef = useRef(false);
  const peersRef = useRef<{ [key: string]: Peer.Instance }>({});
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Get video URL from localStorage
    const storedUrl = localStorage.getItem(`room_${roomId}`);
    if (storedUrl) {
      setVideoUrl(storedUrl);
    }

    // Connect to WebSocket
    ws.current = wsService.connect(roomId);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'chat-message':
          setMessages(prev => [...prev, data.message]);
          break;
        case 'room-info':
          setVideoUrl(data.videoUrl);
          localStorage.setItem(`room_${roomId}`, data.videoUrl);
          break;
        case 'video-sync':
          handleVideoSync(data);
          break;
        case 'members-update':
          setMembers(data.members);
          break;
      }
    };

    return () => {
      stopMediaStream();
      wsService.disconnect();
    };
  }, [roomId]);

  const startMediaStream = async (type: 'audio' | 'video') => {
    try {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: type === 'audio' ? true : isMicOn,
        video: type === 'video' ? true : isCameraOn
      });

      if (type === 'audio') setIsMicOn(true);
      if (type === 'video') setIsCameraOn(true);

      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Connect to all peers with new stream
      Object.values(peersRef.current).forEach(peer => {
        stream.getTracks().forEach(track => {
          peer.addTrack(track, stream);
        });
      });

    } catch (error) {
      console.error(`Failed to get ${type} stream:`, error);
    }
  };

  const stopMediaStream = (type?: 'audio' | 'video') => {
    if (!streamRef.current) return;

    if (type) {
      const tracks = streamRef.current.getTracks().filter(track => 
        type === 'audio' ? track.kind === 'audio' : track.kind === 'video'
      );
      tracks.forEach(track => track.stop());
      if (type === 'audio') setIsMicOn(false);
      if (type === 'video') setIsCameraOn(false);
    } else {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsMicOn(false);
      setIsCameraOn(false);
    }
  };

  const handleVideoSync = (data: { currentTime: number; isPlaying: boolean }) => {
    if (!videoRef.current || isSeekingRef.current) return;

    const timeDiff = Math.abs(videoRef.current.currentTime - data.currentTime);
    if (timeDiff > 0.5) {
      videoRef.current.currentTime = data.currentTime;
    }

    if (data.isPlaying && videoRef.current.paused) {
      videoRef.current.play();
    } else if (!data.isPlaying && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || isSeekingRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    wsService.syncVideo({
      currentTime: videoRef.current.currentTime,
      isPlaying: !videoRef.current.paused
    });
  };

  const handleVideoSeek = () => {
    if (!videoRef.current) return;
    isSeekingRef.current = true;
    setTimeout(() => {
      isSeekingRef.current = false;
      wsService.syncVideo({
        currentTime: videoRef.current!.currentTime,
        isPlaying: !videoRef.current!.paused
      });
    }, 200);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!videoRef.current.paused);
    wsService.syncVideo({
      currentTime: videoRef.current.currentTime,
      isPlaying: !videoRef.current.paused
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    wsService.sendMessage(newMessage);
    setNewMessage('');
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A0944] to-[#3B0B5F] p-6">
      {/* Room Controls */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Members ({members.length})</span>
          </button>
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            <span>Invite</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => isMicOn ? stopMediaStream('audio') : startMediaStream('audio')}
            className={`p-2 rounded-lg transition-colors ${
              isMicOn ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-900 hover:bg-purple-800'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => isCameraOn ? stopMediaStream('video') : startMediaStream('video')}
            className={`p-2 rounded-lg transition-colors ${
              isCameraOn ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-900 hover:bg-purple-800'
            }`}
          >
            {isCameraOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Members Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2A0944] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Room Members</h3>
              <button onClick={() => setShowMembers(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                  <span>{member.username}</span>
                  <div className="flex items-center gap-2">
                    {member.hasAudio && <Mic className="w-4 h-4 text-purple-300" />}
                    {member.hasVideo && <VideoIcon className="w-4 h-4 text-purple-300" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2A0944] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Invite Friends</h3>
              <button onClick={() => setShowInvite(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-900/30 rounded-lg">
              <input
                type="text"
                value={`${window.location.origin}/room/${roomId}`}
                readOnly
                className="flex-1 bg-transparent border-none outline-none"
              />
              <button
                onClick={copyInviteLink}
                className="p-2 hover:bg-purple-800 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Participants */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10">
        {isCameraOn && (
          <div className="w-48 h-36 bg-purple-900/30 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Peer videos will be added here dynamically */}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Section */}
        <div className="lg:col-span-2 bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm border border-purple-500/30">
          <div className="relative">
            {videoUrl && (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onSeeking={handleVideoSeek}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max={videoRef.current?.duration || 100}
                      value={currentTime}
                      onChange={(e) => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = Number(e.target.value);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-black/30 rounded-xl backdrop-blur-sm border border-purple-500/30 flex flex-col h-[600px]">
          <div className="p-4 border-b border-purple-500/30">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Live Chat
            </h2>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div key={message.id} className="bg-purple-900/30 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-purple-300">
                    {message.username}
                  </span>
                  <span className="text-xs text-purple-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-white">{message.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-500/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-purple-900/30 border border-purple-500/30 rounded-lg px-4 py-2
                         text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700
                         transition-colors duration-300 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Room;