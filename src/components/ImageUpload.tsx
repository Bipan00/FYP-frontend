import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (urls: string[]) => void;
    maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    images,
    onImagesChange,
    maxImages = 10
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        setError('');

        // Validation
        if (images.length + files.length > maxImages) {
            setError(`You can only upload up to ${maxImages} images`);
            return;
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                setError('Please upload only image files');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Each image must be less than 5MB');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

setIsUploading(true);
        try {
            const response = await apiService.uploadImages(validFiles);
            if (response.success) {
                onImagesChange([...images, ...response.data]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload images');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        onImagesChange(images.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                    ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                    }
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                    {isUploading ? (
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    ) : (
                        <Upload className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                    )}
                    <div className="text-sm font-medium text-gray-700">
                        {isUploading ? 'Uploading...' : 'Click or drag images to upload'}
                    </div>
                    <div className="text-xs text-gray-500">
                        JPG, PNG, WebP up to 5MB (Max {maxImages} images)
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                                src={url}
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-red-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
