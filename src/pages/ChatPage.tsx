import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import Navbar from '../components/Navbar';
import chatApi, { MessageData } from '../services/chatApi';
import apiService from '../services/api';
import { Loader2, Send, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const ChatPage: React.FC = () => {
    
    const { listingId, receiverId } = useParams<{ listingId: string; receiverId: string }>();
    const navigate = useNavigate();

const { user } = useAuth();
    const { socket, isConnected } = useSocket();

const [messages, setMessages] = useState<MessageData[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [listingName, setListingName] = useState('Loading...');
    const [receiverName, setReceiverName] = useState('User');
    const [receiverKycStatus, setReceiverKycStatus] = useState<string | undefined>();

const messagesEndRef = useRef<HTMLDivElement>(null);

const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

useEffect(() => {
        if (!listingId || !receiverId) return;

        const loadChatRoom = async () => {
            try {

try {
                    const listingRes = await apiService.getListingById(listingId);
                    setListingName(listingRes.data.title);
                    if (listingRes.data.ownerId && listingRes.data.ownerId._id === receiverId) {
                        setReceiverName(listingRes.data.ownerId.name);
                        setReceiverKycStatus(listingRes.data.ownerId.kycStatus);
                    }
                } catch {
                    setListingName('Unknown Listing');
                }

const historyRes = await chatApi.getMessages(listingId, receiverId);
                const msgs = historyRes.data;
                setMessages(msgs);

if (msgs.length > 0 && receiverName === 'User') {
                    const msgWithReceiver = msgs.find((m: MessageData) => 
                        (typeof m.sender !== 'string' && m.sender._id === receiverId) ||
                        (typeof m.receiver !== 'string' && m.receiver._id === receiverId)
                    );
                    
                    if (msgWithReceiver) {
                        if (typeof msgWithReceiver.sender !== 'string' && msgWithReceiver.sender._id === receiverId) {
                            setReceiverName(msgWithReceiver.sender.name);
                            setReceiverKycStatus(msgWithReceiver.sender.kycStatus);
                        } else if (typeof msgWithReceiver.receiver !== 'string' && msgWithReceiver.receiver._id === receiverId) {
                            setReceiverName(msgWithReceiver.receiver.name);
                            setReceiverKycStatus(msgWithReceiver.receiver.kycStatus);
                        }
                    }
                }
            } catch (err: any) {
                console.error('Failed to load chat history:', err);
                setError('Could not load chat history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadChatRoom();
    }, [listingId, receiverId]);

useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message: MessageData) => {

const senderId = typeof message.sender === 'string' ? message.sender : message.sender._id;

            if (message.listing === listingId && senderId === receiverId) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [socket, listingId, receiverId]);

const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !socket || !user || !listingId || !receiverId) return;

        const messageText = newMessage.trim();
        setNewMessage(''); // optimistic clear

        // Setup optimistic UI update
        const tempId = Date.now().toString();
        const optimisticMessage: MessageData = {
            _id: tempId,
            sender: { _id: user.id || user._id || '', name: user.name, email: user.email },
            receiver: receiverId as string,
            listing: listingId as string,
            message: messageText,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to UI immediately
        setMessages((prev) => [...prev, optimisticMessage]);

        // Emit via Socket (Socket server will also persist it to MongoDB)
        socket.emit('sendMessage', {
            receiverId,
            listingId,
            message: messageText
        }, (response: any) => {
            if (!response.success) {
                
                setMessages((prev) => prev.filter(m => m._id !== tempId));
                setError('Failed to send message via socket');
            } else {
                
                setMessages((prev) => prev.map(m => m._id === tempId ? response.data : m));
            }
        });
    };

const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 h-[calc(100vh-64px)] overflow-hidden">

                <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 p-4 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/listings/${listingId}`)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Back to listing"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="font-semibold text-gray-800">
                                    Chat with {receiverName}
                                </h1>
                                {receiverKycStatus === 'verified' && (
                                    <span title="Verified User">
                                        <CheckCircle className="w-4 h-4 text-blue-500" />
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500">
                                    {listingName}
                                </span>
                                <span className="text-gray-300"></span>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-xs text-gray-500">
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white border-x border-gray-200 overflow-y-auto p-4 flex flex-col gap-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-red-500 gap-2 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No messages yet. Say hello!
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
                            const isMe = senderId === (user?.id || user?._id);

return (
                                <div key={msg._id || index} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${isMe
                                                ? 'bg-primary text-white rounded-tr-sm'
                                                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                    </div>
                                    <span className={`text-[10px] text-gray-400 mt-1 mx-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {formatTime(msg.createdAt)}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 p-3 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            disabled={!isConnected || loading}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || !isConnected || loading}
                            className={`p-2 rounded-full flex items-center justify-center transition-colors shrink-0 ${newMessage.trim() && isConnected
                                    ? 'bg-primary text-white hover:bg-primary-dark'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
