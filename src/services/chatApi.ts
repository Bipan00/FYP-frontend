const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export interface MessageData {
    _id: string;
    sender: { _id: string; name: string; email: string; kycStatus?: string } | string;
    receiver: { _id: string; name: string; email: string; kycStatus?: string } | string;
    listing: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

const chatApi = {

getMessages: async (listingId: string, receiverId: string) => {
        const response = await fetch(`${API_URL}/messages/${listingId}/${receiverId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
        
        return await response.json();
    },

sendMessage: async (listingId: string, receiverId: string, message: string) => {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ listingId, receiverId, message })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }
        
        return await response.json();
    },

getConversations: async () => {
        const response = await fetch(`${API_URL}/messages/conversations`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch conversations: ${response.statusText}`);
        }
        
        return await response.json();
    }
};

export default chatApi;
