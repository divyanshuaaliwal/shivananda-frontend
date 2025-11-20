// api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
  // Connection pooling and retry configuration
  maxContentLength: 100 * 1024 * 1024, // 100MB
  maxBodyLength: 100 * 1024 * 1024, // 100MB
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Request interceptor with retry counter
api.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date().getTime() };
  return config;
});

// Handle token expiration and network errors with retry logic
api.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    if (response.config.metadata) {
      const duration = new Date().getTime() - response.config.metadata.startTime;
      // console.log(`API Call: ${response.config.url} - ${duration}ms`);
    }
    return response;
  },
  async (error) => {
    const config = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * 2;
      console.warn(`Rate limited. Retrying after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return api.request(config);
    }

    // Retry logic for network errors and 5xx errors
    if (!config || !config.retry) {
      config.retry = 0;
    }

    const shouldRetry = 
      config.retry < MAX_RETRIES && 
      (
        !error.response || // Network error
        error.code === 'ECONNABORTED' || // Timeout
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED' ||
        error.response?.status >= 500 // Server error
      );

    if (shouldRetry) {
      config.retry += 1;
      const delay = RETRY_DELAY * Math.pow(2, config.retry - 1); // Exponential backoff
      console.warn(`Request failed. Retry ${config.retry}/${MAX_RETRIES} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return api.request(config);
    }

    // Enhance error message
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to server. Please check if the backend is running.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const login = (data) => api.post("/api/auth/login", data);
export const getMe = () => api.get("/api/auth/me");
export const changePassword = (data) => api.put("/api/auth/change-password", data);
export const logout = () => api.post("/api/auth/logout");

// Dashboard API
export const getDashboardStats = () => api.get("/api/admin/dashboard");

// Blogs API
export const getBlogs = (params) => api.get("/api/admin/blogs", { params });
export const getBlog = (id) => api.get(`/api/admin/blogs/${id}`);
export const createBlog = (data) => api.post("/api/admin/blogs", data);
export const updateBlog = (id, data) => api.put(`/api/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/api/admin/blogs/${id}`);

// Products API
export const getProducts = (params) => api.get("/api/products", { params });
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createProduct = (data) => api.post("/api/products", data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
export const findProductBySlug = async (slug) => {
  try {
    // Use admin endpoint to find product by slug (includes inactive products)
    const response = await api.get(`/api/admin/products/slug/${encodeURIComponent(slug)}`);
    if (response.data && response.data.data && response.data.data.product) {
      return { data: { product: response.data.data.product } };
    }
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error finding product by slug:', error);
    throw new Error('Product not found');
  }
};

// Contacts API
export const getContacts = (params) => api.get("/api/admin/contacts", { params });
export const getContact = (id) => api.get(`/api/admin/contacts/${id}`);
export const updateContactStatus = (id, data) => api.put(`/api/admin/contacts/${id}/status`, data);
export const assignContact = (id, data) => api.put(`/api/admin/contacts/${id}/assign`, data);
export const deleteContact = (id) => api.delete(`/api/admin/contacts/${id}`);

// Content API (protected)
export const getContentBySectionPage = (section, page) => api.get(`/api/content/${section}/${page}`);
export const upsertContent = (data) => api.post("/api/content", data);
export const deleteContent = (id) => api.delete(`/api/content/${id}`);

// Content API via Next proxy (avoids cross-origin issues). Use inside client components.
export const upsertContentNext = async (data, attempt = 1) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const res = await fetch('/api/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  // Handle rate limit with simple retry/backoff
  if (res.status === 429 && attempt < 3) {
    const retryAfterHeader = res.headers.get('Retry-After');
    const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : Math.pow(2, attempt); // 2s, 4s
    await new Promise((resolve) => setTimeout(resolve, (isNaN(retryAfterSeconds) ? 2 : retryAfterSeconds) * 1000));
    return upsertContentNext(data, attempt + 1);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }
  return res.json();
};

// Projects (Admin) API
export const getAdminProjects = (params) => api.get('/api/admin/projects', { params });
export const createProjectAdmin = (data) => api.post('/api/admin/projects', data);
export const updateProjectAdmin = (id, data) => api.put(`/api/admin/projects/${id}`, data);
export const deleteProjectAdmin = (id) => api.delete(`/api/admin/projects/${id}`);

export default api;
