import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import chatApi from '../services/chatApi';
import { Loader2, MessageSquare, Clock, MapPin } from 'lucide-react';

export interface InboxConversation {
    listing: {
        _id: string;
        title: string;
        location?: string;
    } | null;
    otherUser: {
        _id: string;
        name: string;
        email: string;
    } | null;
    lastMessage: string;
    lastMessageTime: string;
}

const Inbox: React.FC = () => {
    const [conversations, setConversations] = useState<InboxConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await chatApi.getConversations();
                setConversations(res.data);
            } catch (err: any) {
                console.error('Failed to load inbox:', err);
                setError('Could not load your conversations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-gray-900">Your Inbox</h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                        <p className="text-gray-500">Loading your conversations...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
                        {error}
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm text-center px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No messages yet</h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            When you contact property owners or tenants contact you, your conversations will appear here.
                        </p>
                        <button
                            onClick={() => navigate('/explore')}
                            className="btn-primary"
                        >
                            Explore Listings
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {conversations.map((conv, index) => {
                                
                                const listingTitle = conv.listing?.title || 'Unknown Property';
                                const listingLocation = conv.listing?.location || '';
                                const userName = conv.otherUser?.name || 'Unknown User';
                                const listingId = conv.listing?._id;
                                const otherUserId = conv.otherUser?._id;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (listingId && otherUserId) {
                                                navigate(`/chat/${listingId}/${otherUserId}`);
                                            }
                                        }}
                                        className={`p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors ${listingId && otherUserId ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
                                    >
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-lg font-bold text-primary">
                                                {userName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {userName}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1 shrink-0 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTime(conv.lastMessageTime)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mb-1 truncate">
                                                <MapPin className="w-3 h-3 text-primary/70" />
                                                <span className="truncate">{listingTitle} {listingLocation && `- ${listingLocation}`}</span>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 truncate">
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Inbox;
