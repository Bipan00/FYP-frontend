import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import { Home as HomeIcon, Loader2, AlertCircle } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import MapPicker from '../components/MapPicker';
import { useAuth } from '../contexts/AuthContext';
import KYCVerificationBanner from '../components/KYCVerificationBanner';

const AddListing: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        latitude: '',
        longitude: '',
        type: 'Room',
        images: [] as string[]
    });

const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleImagesChange = (urls: string[]) => {
        setFormData({ ...formData, images: urls });
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.title || !formData.description || !formData.price || !formData.location) {
            setError('Please fill in all required fields (Title, Description, Price, and Address)');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (formData.title.length < 5 || formData.title.length > 100) {
            setError('Title must be between 5 and 100 characters');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (formData.description.length < 20 || formData.description.length > 2000) {
            setError('Description must be between 20 and 2000 characters');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (formData.images.length === 0) {
            setError('Please upload at least one property image');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) {
            setError('Price must be a positive number');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsLoading(true);

        try {
            
            const listingData: any = {
                title: formData.title,
                description: formData.description,
                price: price,
                location: formData.location,
                type: formData.type,
                images: formData.images
            };

if (formData.latitude && !isNaN(parseFloat(formData.latitude))) {
                listingData.latitude = parseFloat(formData.latitude);
            }
            if (formData.longitude && !isNaN(parseFloat(formData.longitude))) {
                listingData.longitude = parseFloat(formData.longitude);
            }

            await apiService.createListing(listingData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create listing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <HomeIcon className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl text-primary">GharSathi</span>
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Add New Listing</h1>
                    <p className="mt-2 text-gray-600">
                        Share your property with potential tenants
                    </p>
                </div>
                {user?.kycStatus !== 'verified' ? (
                    <KYCVerificationBanner 
                        kycStatus={user?.kycStatus || 'not_submitted'} 
                        onVerifyClick={() => navigate('/profile')} 
                    />
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Listing Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                                        placeholder="e.g., Sunny Room in Baneshwor"
                                    />
                                    <p className="mt-1.5 text-xs text-gray-500">Catchy title, 5-100 characters</p>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 resize-none"
                                        placeholder="Describe the amenities, nearby landmarks, and rules..."
                                    />
                                    <p className="mt-1.5 text-xs text-gray-500">Detailed description, 20-2000 characters</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Property Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Monthly Rent (NPR) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-500">Rs.</span>
                                            </div>
                                            <input
                                                id="price"
                                                name="price"
                                                type="number"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="15000"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Property Type <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-4">
                                            <label className={`
                                                flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                                                ${formData.type === 'Room'
                                                    ? 'border-primary bg-primary/5 text-primary font-medium'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                                            `}>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Room"
                                                    checked={formData.type === 'Room'}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                Room
                                            </label>
                                            <label className={`
                                                flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                                                ${formData.type === 'Hostel'
                                                    ? 'border-primary bg-primary/5 text-primary font-medium'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                                            `}>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Hostel"
                                                    checked={formData.type === 'Hostel'}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                Hostel
                                            </label>
                                            <label className={`
                                                flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                                                ${formData.type === 'Apartment'
                                                    ? 'border-primary bg-primary/5 text-primary font-medium'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                                            `}>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Apartment"
                                                    checked={formData.type === 'Apartment'}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                Apartment
                                            </label>
                                            <label className={`
                                                flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                                                ${formData.type === 'Flat'
                                                    ? 'border-primary bg-primary/5 text-primary font-medium'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                                            `}>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Flat"
                                                    checked={formData.type === 'Flat'}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                Flat
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location</h3>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g., Baneshwor, Kathmandu"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                            Latitude (Optional)
                                        </label>
                                        <input
                                            id="latitude"
                                            name="latitude"
                                            type="number"
                                            step="any"
                                            value={formData.latitude}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="27.7172"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                            Longitude (Optional)
                                        </label>
                                        <input
                                            id="longitude"
                                            name="longitude"
                                            type="number"
                                            step="any"
                                            value={formData.longitude}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="85.3240"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pin Location on Map
                                    </label>
                                    <MapPicker
                                        lat={formData.latitude ? parseFloat(formData.latitude) : null}
                                        lng={formData.longitude ? parseFloat(formData.longitude) : null}
                                        onChange={handleLocationChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Photos</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Upload Property Images
                                    </label>
                                    <ImageUpload
                                        images={formData.images}
                                        onImagesChange={handleImagesChange}
                                        maxImages={5}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Upload at least 1 image. First image will be the cover.</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                                <Link
                                    to="/dashboard"
                                    className="px-6 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Listing'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default AddListing;
