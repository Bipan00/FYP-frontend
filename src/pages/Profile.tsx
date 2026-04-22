import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SectionTitle from '../components/SectionTitle';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { User, Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, isAuthenticated, isLoading, updateUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // KYC State
    const [kycFile, setKycFile] = useState<File | null>(null);
    const [kycPreview, setKycPreview] = useState<string>('');
    const [kycSubmitting, setKycSubmitting] = useState(false);
    const [kycSuccess, setKycSuccess] = useState('');
    const [kycError, setKycError] = useState('');

    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name cannot be empty.');
            return;
        }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            let profileImageUrl = '';
            // Upload image to Cloudinary if a new file is selected
            if (imageFile) {
                const uploadRes = await apiService.uploadImages([imageFile]);
                profileImageUrl = uploadRes.data?.[0] || '';
            }
            const updated = await apiService.updateProfile({ name, profileImage: profileImageUrl });
            updateUser(updated.data);
            setSuccess('Profile updated successfully.');
            setImageFile(null);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setKycFile(file);
            setKycPreview(URL.createObjectURL(file));
        }
    };

    const handleKycSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!kycFile) {
            setKycError('Please select a valid image/document file.');
            return;
        }
        setKycSubmitting(true);
        setKycError('');
        setKycSuccess('');
        
        try {
            const uploadRes = await apiService.uploadImages([kycFile]);
            const docUrl = uploadRes.data?.[0];
            if (!docUrl) throw new Error('Image upload failed');

            const res = await apiService.submitKyc(docUrl);
            updateUser({ kycStatus: res.data.kycStatus, kycDocument: res.data.kycDocument });
            setKycSuccess('KYC document submitted successfully.');
            setKycFile(null);
            setKycPreview('');
        } catch (err: any) {
            setKycError(err.message || 'Failed to submit KYC.');
        } finally {
            setKycSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="max-w-md">
                    <div className="mb-5">
                        <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View and update your account details
                        </p>
                    </div>

                    <SectionTitle title="Account Information" />

                    {/* Profile Card */}
                    <div className="card rounded-md p-5 mb-5">
                        {/* Avatar */}
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                                    {user?.kycStatus === 'verified' && (
                                        <span title="Verified User"><CheckCircle className="w-4 h-4 text-green-500" /></span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Email (cannot be changed)
                            </label>
                            <div className="form-input bg-gray-50 text-gray-500 cursor-not-allowed">
                                {user?.email}
                            </div>
                        </div>
                        <div className="mb-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Role (assigned at registration)
                            </label>
                            <div className="form-input bg-gray-50 text-gray-500 cursor-not-allowed">
                                {user?.role}
                            </div>
                        </div>
                    </div>
                    <SectionTitle title="Edit Profile" />
                    <form onSubmit={handleSave} className="space-y-4">
                        {success && (
                            <div className="border border-green-200 rounded-md p-2.5 text-xs text-green-700 bg-green-50">
                                 {success}
                            </div>
                        )}
                        {error && (
                            <div className="border border-red-200 rounded-md p-2.5 text-xs text-red-600 bg-red-50">
                                {error}
                            </div>
                        )}
                        <div>
                            <label
                                htmlFor="profile-name"
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Full Name
                            </label>
                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="profile-image"
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Profile Image (optional)
                            </label>
                            <input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="text-xs text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-gray-300 file:text-xs file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Image will be uploaded to Cloudinary.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex items-center gap-2"
                        >
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                    <div className="mt-10 mb-5">
                        <SectionTitle title="Identity Verification (KYC)" />
                        <div className="card rounded-md p-5">
                            {user?.kycStatus === 'verified' ? (
                                <div className="flex flex-col items-center justify-center py-4 bg-green-50 rounded text-green-700 border border-green-200">
                                    <CheckCircle className="w-8 h-8 mb-2" />
                                    <p className="text-sm font-medium">You are a Verified User</p>
                                    <p className="text-xs mt-1 text-center max-w-xs opacity-80">
                                        Your identity has been confirmed by our team.
                                    </p>
                                </div>
                            ) : user?.kycStatus === 'pending' ? (
                                <div className="flex flex-col items-center justify-center py-4 bg-yellow-50 rounded text-yellow-700 border border-yellow-200">
                                    <Clock className="w-8 h-8 mb-2" />
                                    <p className="text-sm font-medium">Verification in progress</p>
                                    <p className="text-xs mt-1 text-center max-w-xs opacity-80">
                                        Your document is currently being reviewed by our team.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleKycSubmit} className="space-y-4">
                                    {user?.kycStatus === 'rejected' && (
                                        <div className="flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded text-xs border border-red-200 mb-4">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <p>
                                                <b>Verification Rejected:</b> Your previous submission was rejected. Please upload a clear, valid identity document (Citizenship, Passport, or License).
                                            </p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-600 mb-4">
                                        To build trust in the GharSathi community, please submit a valid identity document (Citizenship ID, Passport, or Driving License).
                                    </p>

                                    {kycSuccess && (
                                        <div className="border border-green-200 rounded-md p-2.5 text-xs text-green-700 bg-green-50">
                                             {kycSuccess}
                                        </div>
                                    )}
                                    {kycError && (
                                        <div className="border border-red-200 rounded-md p-2.5 text-xs text-red-600 bg-red-50">
                                            {kycError}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="kyc-document" className="block text-xs font-medium text-gray-700 mb-1">
                                            Upload ID Document Image
                                        </label>
                                        <input
                                            id="kyc-document"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleKycFileChange}
                                            className="form-input file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-gray-300 file:text-xs file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                                        />
                                        {kycPreview && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-500 mb-1">Document Preview:</p>
                                                <img src={kycPreview} alt="KYC Preview" className="max-h-40 object-contain border border-gray-200 rounded" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={kycSubmitting}
                                        className="btn-primary flex items-center justify-center gap-2 w-full mt-2"
                                    >
                                        {kycSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {kycSubmitting ? 'Uploading...' : 'Submit ID Verification'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
