import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Video, Youtube, X, Copy, History, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [roomType, setRoomType] = useState<'video' | 'youtube'>('video');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [shareLink, setShareLink] = useState('');

  const mockRoomHistory = [
    { id: '1', name: 'Movie Night', type: 'youtube', date: '2024-03-10', participants: 5 },
    { id: '2', name: 'Series Marathon', type: 'video', date: '2024-03-09', participants: 3 },
    { id: '3', name: 'Anime Watch', type: 'youtube', date: '2024-03-08', participants: 4 }
  ];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate room creation
    const roomId = Math.random().toString(36).substring(7);
    setShareLink(`https://streammates.com/room/${roomId}`);
    setShowCreateModal(false);
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    // Could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A0944] to-[#3B0B5F] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.username}!</h1>
            <p className="text-purple-300">Ready to start streaming?</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-6 bg-white/10 rounded-xl border border-purple-500/30 hover:bg-white/20
                     transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Create Room</h3>
                <p className="text-purple-300">Start a new watch party</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white/10 rounded-xl border border-purple-500/30 hover:bg-white/20
                          transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Join Room</h3>
                <p className="text-purple-300">Enter a room code</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white/10 rounded-xl border border-purple-500/30 hover:bg-white/20
                          transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                <History className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">History</h3>
                <p className="text-purple-300">View past rooms</p>
              </div>
            </div>
          </button>
        </div>

        {/* Room History */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRoomHistory.map(room => (
              <div
                key={room.id}
                className="p-6 bg-white/10 rounded-xl border border-purple-500/30
                         hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{room.name}</h3>
                  {room.type === 'youtube' ? (
                    <Youtube className="w-5 h-5 text-purple-300" />
                  ) : (
                    <Video className="w-5 h-5 text-purple-300" />
                  )}
                </div>
                <div className="text-purple-300 text-sm">
                  <p>Date: {room.date}</p>
                  <p>Participants: {room.participants}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#2A0944] rounded-xl p-6 w-full max-w-md border border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create Room</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Room Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRoomType('video')}
                    className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors
                             ${roomType === 'video'
                               ? 'bg-purple-600 text-white'
                               : 'bg-white/10 text-purple-300 hover:bg-white/20'}`}
                  >
                    <Video className="w-6 h-6" />
                    <span>Upload Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoomType('youtube')}
                    className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors
                             ${roomType === 'youtube'
                               ? 'bg-purple-600 text-white'
                               : 'bg-white/10 text-purple-300 hover:bg-white/20'}`}
                  >
                    <Youtube className="w-6 h-6" />
                    <span>YouTube URL</span>
                  </button>
                </div>
              </div>

              {roomType === 'video' ? (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Upload Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg py-2 px-4 text-white
                             file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                             file:text-sm file:font-semibold file:bg-purple-600 file:text-white
                             hover:file:bg-purple-700"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">YouTube URL</label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg py-2 px-4 text-white
                             placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://youtube.com/watch?v=..."
                    required={roomType === 'youtube'}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 font-medium
                         transform transition-all duration-300 hover:bg-purple-700
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#2A0944] rounded-xl p-6 w-full max-w-md border border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Share Room</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-purple-200">Share this link with your friends to invite them to your room:</p>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-purple-500/30 text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;