import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ArrowLeft, Send } from 'lucide-react';

const CreatePostPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (user === null) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !content.trim()) {
            setError('Please fill in both the title and content.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await apiService.createForumPost(title.trim(), content.trim());
            // Navigate to the newly created post
            navigate(`/forum/${res.data._id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to create post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                {/*  Header  */}
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        to="/forum"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Back to forum"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Create New Post</h1>
                        <p className="text-xs text-gray-500">Share your question or experience with the community.</p>
                    </div>
                </div>

                {/*  Form  */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
                >
                    {/* Error banner */}
                    {error && (
                        <div className="border border-red-200 bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label
                            htmlFor="post-title"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="post-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Tips for finding a room in Thamel under Rs. 8000"
                            maxLength={150}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                            disabled={submitting}
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/150</p>
                    </div>

                    {/* Content */}
                    <div>
                        <label
                            htmlFor="post-content"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="post-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your experience, question, or advice in detail..."
                            rows={8}
                            maxLength={5000}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-vertical"
                            disabled={submitting}
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{content.length}/5000</p>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-1">
                        <Link
                            to="/forum"
                            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting || !title.trim() || !content.trim()}
                            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            {submitting ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;
