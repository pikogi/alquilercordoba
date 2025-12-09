const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth methods
export const auth = {
  async me() {
    try {
      return await apiCall('/auth/me');
    } catch (error) {
      return null;
    }
  },

  async login(email, password) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  async register(email, password, first_name, last_name) {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name, last_name }),
    });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  async logout() {
    localStorage.removeItem('auth_token');
  },

  redirectToLogin(returnUrl) {
    // For now, just redirect to home. You can create a login page later
    window.location.href = `/`;
  },
};

// Properties methods
export const Property = {
  async list() {
    return await apiCall('/properties');
  },

  async filter(params) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/properties/filter?${queryString}`);
  },

  async get(id) {
    return await apiCall(`/properties/${id}`);
  },

  async create(data) {
    return await apiCall('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return await apiCall(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id) {
    return await apiCall(`/properties/${id}`, {
      method: 'DELETE',
    });
  },
};

// Availability methods
export const Availability = {
  async list(sort, limit) {
    const params = new URLSearchParams();
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit);
    const queryString = params.toString();
    return await apiCall(`/availability${queryString ? '?' + queryString : ''}`);
  },

  async filter(params) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/availability/filter?${queryString}`);
  },

  async create(data) {
    return await apiCall('/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async delete(id) {
    return await apiCall(`/availability/${id}`, {
      method: 'DELETE',
    });
  },
};

// Upload methods
export const UploadFile = async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('auth_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Don't set Content-Type for FormData, browser will set it with boundary

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
};

// Main client export (similar to base44 structure for compatibility)
export const client = {
  auth,
  entities: {
    Property,
    Availability,
  },
  integrations: {
    Core: {
      UploadFile,
    },
  },
};

// Default export for compatibility
export default client;

