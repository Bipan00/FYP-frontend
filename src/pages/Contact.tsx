import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SectionTitle from '../components/SectionTitle';
import apiService from '../services/api';
import { Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        try {
            await apiService.submitContact(formData);
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="max-w-2xl mx-auto md:mx-0">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
                        <p className="text-base text-gray-500 mt-2">
                            Have a question or feedback? Fill in the form below.
                        </p>
                    </div>

                    <SectionTitle title="Send a Message" />

                    {success ? (
                        <div className="border border-green-200 rounded-md p-4 bg-green-50 text-sm text-green-700">
                             Your message has been sent! We'll get back to you as soon as possible.
                            <button
                                onClick={() => setSuccess(false)}
                                className="block mt-2 text-xs text-green-600 hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {error && (
                                <div className="border border-red-200 rounded-md p-2.5 text-xs text-red-600 bg-red-50">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label
                                    htmlFor="contact-name"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Your Name
                                </label>
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g. Ram Bahadur"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="contact-email"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="you@example.com"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    We'll only use this to reply to your query.
                                </p>
                            </div>
                            <div>
                                <label
                                    htmlFor="contact-message"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-input resize-none"
                                    placeholder="Write your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center justify-center gap-2 py-3 w-full sm:w-auto px-8"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
