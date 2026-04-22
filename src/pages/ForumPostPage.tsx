import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
    Loader2, ArrowLeft, MessageSquare,
    Calendar, User, Trash2, Send, AlertCircle, CheckCircle
} from 'lucide-react';

interface Author {
    _id: string;
    name: string;
    kycStatus?: string;
}

interface Comment {
    _id: string;
    author: Author;
    content: string;
    createdAt: string;
}

interface Post {
    _id: string;
    title: string;
    content: string;
    author: Author;
    likes: number;
    createdAt: string;
}

const ForumPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Comment form state
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState('');

    // Delete state
    const [deleting, setDeleting] = useState(false);

    // Load post + comments on mount
    useEffect(() => {
        if (!id) return;
        const fetchPost = async () => {
            try {
                const res = await apiService.getForumPost(id);
                setPost(res.data.post);
                setComments(res.data.comments);
            } catch (err: any) {
                setError(err.message || 'Failed to load post.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // Format date helper
    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setCommentError('');
        setSubmittingComment(true);
        try {
            const res = await apiService.addForumComment(id!, commentText.trim());
            // Append new comment immediately to the list
            setComments((prev) => [...prev, res.data]);
            setCommentText('');
        } catch (err: any) {
            setCommentError(err.message || 'Failed to add comment.');
        } finally {
            setSubmittingComment(false);
        }
    };

    // Admin delete post
    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post? All comments will also be removed.')) return;
        setDeleting(true);
        try {
            await apiService.deleteForumPost(id!);
            navigate('/forum', { replace: true });
        } catch (err: any) {
            alert(err.message || 'Failed to delete post.');
            setDeleting(false);
        }
    };

if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center py-20">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <div className="flex items-center gap-2 border border-red-200 bg-red-50 rounded-lg p-4 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error || 'Post not found.'}
                    </div>
                    <Link to="/forum" className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Forum
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

                <Link
                    to="/forum"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Forum
                </Link>

                <div className="bg-white border border-gray-200 rounded-xl p-6">

                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-xl font-bold text-gray-900 leading-snug">
                            {post.title}
                        </h1>

                        {user?.role === 'Admin' && (
                            <button
                                onClick={handleDeletePost}
                                disabled={deleting}
                                className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
                                title="Delete this post"
                            >
                                {deleting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                )}
                                Delete Post
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 flex-wrap">
                        <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {post.author?.name}
                            {post.author?.kycStatus === 'verified' && (
                                <span aria-label="Verified user">
                                    <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                                </span>
                            )}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                        </span>
                    </div>

                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-5">
                        {post.content}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Comments ({comments.length})
                    </h2>

                    {comments.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            No comments yet. Be the first to reply!
                        </p>
                    ) : (
                        <div className="space-y-4 mb-6">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                                >

                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                                        {comment.author?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-gray-800">
                                                {comment.author?.name}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {user ? (
                        <form onSubmit={handleAddComment} className="border-t border-gray-100 pt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add a comment
                            </label>

                            {commentError && (
                                <div className="mb-3 border border-red-200 bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2">
                                    {commentError}
                                </div>
                            )}

                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your comment here..."
                                rows={3}
                                maxLength={1000}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
                                disabled={submittingComment}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">{commentText.length}/1000</span>
                                <button
                                    type="submit"
                                    disabled={submittingComment || !commentText.trim()}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submittingComment ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {submittingComment ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="border-t border-gray-100 pt-5 text-center">
                            <p className="text-sm text-gray-500">
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Log in
                                </Link>{' '}
                                to leave a comment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumPostPage;
