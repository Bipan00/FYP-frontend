/**
 * API Service Module
 * 
 * Purpose: Centralized service for making HTTP requests to the backend API
 * This module uses the Fetch API to communicate with the Express backend.
 * 
 * Academic Note: Separating API calls into a service layer makes the code
 * more maintainable and allows easy modification of API endpoints.
 */

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * API Service Object
 * Contains methods for different API endpoints
 */
const apiService = {
    /**
     * Test API Connection
     * 
     * @returns {Promise<Object>} API response data
     * @throws {Error} If the request fails
     */
    testConnection: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/test`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse and return JSON data
            const data = await response.json();
            return data;

        } catch (error) {
            console.error('API Connection Error:', error);
            throw error;
        }
    },

    /**
     * Upload Multiple Images
     * 
     * @param {File[]} files - Array of image files
     * @returns {Promise<Object>} API response with image URLs
     */
    uploadImages: async (files: File[]) => {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            const response = await fetch(`${API_BASE_URL}/api/upload/images`, {
                method: 'POST',
                headers: {
                    // Content-Type is set automatically by the browser for FormData
                    ...(localStorage.getItem('token') && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload images');
            }

            return data;

        } catch (error: any) {
            console.error('Upload Images Error:', error);
            throw error;
        }
    },

    /**
     * Generic GET Request
     * 
     * @param {string} endpoint - API endpoint path
     * @returns {Promise<Object>} API response data
     */
    get: async (endpoint: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error(`GET ${endpoint} Error:`, error);
            throw error;
        }
    },

    /**
     * Generic POST Request
     * 
     * @param {string} endpoint - API endpoint path
     * @param {Object} data - Request body data
     * @returns {Promise<Object>} API response data
     */
    post: async (endpoint: string, data: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error(`POST ${endpoint} Error:`, error);
            throw error;
        }
    },

    /**
     * Get Authorization Headers
     * Helper function to include JWT token in requests
     */
    getAuthHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    /**
     * Create Listing
     * 
     * @param {Object} listingData - Listing data
     * @returns {Promise<Object>} API response
     */
    createListing: async (listingData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings`, {
                method: 'POST',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify(listingData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create listing');
            }

            return data;

        } catch (error: any) {
            console.error('Create Listing Error:', error);
            throw error;
        }
    },

    /**
     * Get Owner's Listings
     * 
     * @returns {Promise<Object>} API response with listings
     */
    getOwnerListings: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/my-listings`, {
                method: 'GET',
                headers: apiService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch listings');
            }

            return data;

        } catch (error: any) {
            console.error('Get Owner Listings Error:', error);
            throw error;
        }
    },

    /**
     * Update Listing
     * 
     * @param {string} id - Listing ID
     * @param {Object} listingData - Updated listing data
     * @returns {Promise<Object>} API response
     */
    updateListing: async (id: string, listingData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
                method: 'PUT',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify(listingData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update listing');
            }

            return data;

        } catch (error: any) {
            console.error('Update Listing Error:', error);
            throw error;
        }
    },

    /**
     * Delete Listing
     * 
     * @param {string} id - Listing ID
     * @returns {Promise<Object>} API response
     */
    deleteListing: async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
                method: 'DELETE',
                headers: apiService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete listing');
            }

            return data;

        } catch (error: any) {
            console.error('Delete Listing Error:', error);
            throw error;
        }
    },

    /**
     * Get All Listings
     * 
     * @returns {Promise<Object>} API response with all approved listings
     */
    getAllListings: async (filters?: { type?: string; minPrice?: string; maxPrice?: string; search?: string }) => {
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);
                if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
                if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
                if (filters.search) queryParams.append('search', filters.search);
            }

            const queryString = queryParams.toString();
            const url = `${API_BASE_URL}/api/listings${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch listings');
            }

            return data;

        } catch (error: any) {
            console.error('Get All Listings Error:', error);
            throw error;
        }
    },

    /**
     * Get Single Listing by ID
     * 
     * @param {string} id - Listing ID
     * @returns {Promise<Object>} API response with listing details
     */
    getListingById: async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch listing details');
            }

            return data;

        } catch (error: any) {
            console.error('Get Listing By ID Error:', error);
            throw error;
        }
    },

    /**
     * Get Admin Listings
     * 
     * @returns {Promise<Object>} API response with all listings (admin view)
     */
    getAdminListings: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/admin/all`, {
                method: 'GET',
                headers: apiService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch admin listings');
            }

            return data;
        } catch (error: any) {
            console.error('Get Admin Listings Error:', error);
            throw error;
        }
    },

    /**
     * Update Listing Status
     * 
     * @param {string} id - Listing ID
     * @param {boolean} isApproved - New approval status
     * @returns {Promise<Object>} API response
     */
    updateListingStatus: async (id: string, isApproved: boolean) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/${id}/status`, {
                method: 'PATCH',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ isApproved }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update listing status');
            }

            return data;
        } catch (error: any) {
            console.error('Update Status Error:', error);
            throw error;
        }
    },

    /**
     * Create Booking Request
     */
    createBooking: async (listingId: string, message?: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ listingId, message }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send booking request');
            }

            return data;
        } catch (error: any) {
            console.error('Create Booking Error:', error);
            throw error;
        }
    },

    /**
     * Get Owner Bookings
     */
    getOwnerBookings: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/owner`, {
                method: 'GET',
                headers: apiService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

            return data;
        } catch (error: any) {
            console.error('Get Bookings Error:', error);
            throw error;
        }
    },

    /**
     * Update Booking Status
     */
    updateBookingStatus: async (id: string, status: 'Accepted' | 'Rejected') => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
                method: 'PATCH',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update booking status');
            }

            return data;
        } catch (error: any) {
            console.error('Update Booking Status Error:', error);
            throw error;
        }
    },
};

export default apiService;
