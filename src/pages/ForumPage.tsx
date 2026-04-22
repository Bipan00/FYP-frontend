import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, MessageSquare, PenSquare, Calendar, User, AlertCircle } from 'lucide-react';

interface ForumPost {
    _id: string;
    title: string;
    content: string;
    author: { _id: string; name: string };
    commentCount: number;
    createdAt: string;
    likes: number;
}

const ForumPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await apiService.getForumPosts();
                setPosts(res.data || []);
            } catch {
                setError('Failed to load forum posts. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Friendly relative time (e.g. "2 days ago")
    const formatDate = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Share rental experiences, housing tips, and property advice.
                        </p>
                    </div>

                    {user ? (
                        <button
                            onClick={() => navigate('/forum/new')}
                            className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition-colors shrink-0"
                        >
                            <PenSquare className="w-4 h-4" />
                            New Post
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 border border-primary text-primary text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                        >
                            Login to Post
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 border border-red-200 bg-red-50 rounded-lg p-4 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No posts yet. Be the first to start a discussion!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <Link
                                key={post._id}
                                to={`/forum/${post._id}`}
                                className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-sm transition-all"
                            >

                                <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {post.content}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" />
                                        {post.author?.name || 'Unknown'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(post.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1 ml-auto">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {post.commentCount}{' '}
                                        {post.commentCount === 1 ? 'comment' : 'comments'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumPage;
