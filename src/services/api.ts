const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiService = {

testConnection: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/test`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

const data = await response.json();
            return data;

        } catch (error) {
            console.error('API Connection Error:', error);
            throw error;
        }
    },

uploadImages: async (files: File[]) => {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            const response = await fetch(`${API_BASE_URL}/api/upload/images`, {
                method: 'POST',
                headers: {
                    
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

get: async (endpoint: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const resData = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(resData.message || resData.error || `HTTP error! status: ${response.status}`);
            }

            return resData;

        } catch (error) {
            console.error(`GET ${endpoint} Error:`, error);
            throw error;
        }
    },

post: async (endpoint: string, data: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const resData = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(resData.message || resData.error || `HTTP error! status: ${response.status}`);
            }

            return resData;

        } catch (error) {
            console.error(`POST ${endpoint} Error:`, error);
            throw error;
        }
    },

getAuthHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

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

getAllListings: async (filters?: { type?: string; minPrice?: string; maxPrice?: string; search?: string; bedrooms?: string }) => {
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);
                if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
                if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
                if (filters.search) queryParams.append('search', filters.search);
                if (filters.bedrooms && filters.bedrooms !== 'Any') queryParams.append('bedrooms', filters.bedrooms);
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

getRecommendations: async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/recommend/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch recommendations');
            }

            return data;

        } catch (error: any) {
            console.error('Get Recommendations Error:', error);
            throw error;
        }
    },

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

getMyBookings: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/my`, {
                method: 'GET',
                headers: apiService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

            return data;
        } catch (error: any) {
            console.error('Get My Bookings Error:', error);
            throw error;
        }
    },

submitContact: async (payload: { name: string; email: string; message: string }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit contact message');
            }

            return data;
        } catch (error: any) {
            console.error('Submit Contact Error:', error);
            throw error;
        }
    },

updateProfile: async (payload: { name: string; profileImage?: string }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: 'PATCH',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            return data;
        } catch (error: any) {
            console.error('Update Profile Error:', error);
            throw error;
        }
    },

submitKyc: async (kycDocument: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/kyc-submit`, {
                method: 'POST',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ kycDocument }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit KYC');
            return data;
        } catch (error: any) {
            console.error('Submit KYC Error:', error);
            throw error;
        }
    },

getKycUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users/kyc`, {
                method: 'GET',
                headers: apiService.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch KYC users');
            return data;
        } catch (error: any) {
            console.error('Get KYC Users Error:', error);
            throw error;
        }
    },

approveKyc: async (userId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/kyc/approve/${userId}`, {
                method: 'PUT',
                headers: apiService.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to approve KYC');
            return data;
        } catch (error: any) {
            console.error('Approve KYC Error:', error);
            throw error;
        }
    },

rejectKyc: async (userId: string, reason?: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/kyc/reject/${userId}`, {
                method: 'PUT',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ reason: reason || '' }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to reject KYC');
            return data;
        } catch (error: any) {
            console.error('Reject KYC Error:', error);
            throw error;
        }
    },

getPendingKycCount: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/kyc/pending-count`, {
                method: 'GET',
                headers: apiService.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch pending count');
            return data;
        } catch (error: any) {
            console.error('Get Pending KYC Count Error:', error);
            throw error;
        }
    },

getNearbyListings: async (lat: number, lng: number, radius: number = 5) => {
        try {
            const url = `${API_BASE_URL}/api/listings/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch nearby listings');
            }

            return data;
        } catch (error: any) {
            console.error('Get Nearby Listings Error:', error);
            throw error;
        }
    },

initiateKhaltiPayment: async (bookingId: string, amount: number, description?: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/khalti/initiate`, {
                method: 'POST',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ bookingId, amount, description }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to initiate payment');
            return data;
        } catch (error: any) {
            console.error('Initiate Khalti Error:', error);
            throw error;
        }
    },

verifyKhaltiPayment: async (pidx: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/khalti/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pidx }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to verify payment');
            return data;
        } catch (error: any) {
            console.error('Verify Khalti Error:', error);
            throw error;
        }
    },

generateAgreement: async (bookingId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/agreements/generate/${bookingId}`, {
                method: 'POST',
                headers: apiService.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to generate agreement');
            return data;
        } catch (error: any) {
            console.error('Generate Agreement Error:', error);
            throw error;
        }
    },

getAgreement: async (bookingId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/agreements/${bookingId}`, {
                method: 'GET',
                headers: apiService.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'No agreement found');
            return data;
        } catch (error: any) {
            console.error('Get Agreement Error:', error);
            throw error;
        }
    },

getNeighbourhoodInsights: async (listingId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/${listingId}/neighbourhood`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch neighbourhood data');
            return data;
        } catch (error: any) {
            console.error('Get Neighbourhood Error:', error);
            throw error;
        }
    },

getForumPosts: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/posts`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch forum posts');
            return data;
        } catch (error: any) {
            console.error('Get Forum Posts Error:', error);
            throw error;
        }
    },

getForumPost: async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/posts/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch forum post');
            return data;
        } catch (error: any) {
            console.error('Get Forum Post Error:', error);
            throw error;
        }
    },

createForumPost: async (title: string, content: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/posts`, {
                method: 'POST',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ title, content }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create forum post');
            return data;
        } catch (error: any) {
            console.error('Create Forum Post Error:', error);
            throw error;
        }
    },

addForumComment: async (postId: string, content: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/posts/${postId}/comment`, {
                method: 'POST',
                headers: apiService.getAuthHeaders(),
                body: JSON.stringify({ content }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to add comment');
            return data;
        } catch (error: any) {
            console.error('Add Forum Comment Error:', error);
            throw error;
        }
    },

deleteForumPost: async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forum/posts/${id}`, {
                method: 'DELETE',
                headers: apiService.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete forum post');
            return data;
        } catch (error: any) {
            console.error('Delete Forum Post Error:', error);
            throw error;
        }
    },
};

export default apiService;

