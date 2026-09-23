const getApiBaseUrl = () => {
  let rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stock-management-2x8r.onrender.com/api';
  rawUrl = rawUrl.trim().replace(/\/$/, '');
  return rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Custom API Client with automatic Authorization Bearer Header injection
 */
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data?: T; pagination?: any; errors?: any[] }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok && !data.success) {
    const errorMsg = data.message || `API Request Failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.status = response.status;
    err.errors = data.errors || [];
    throw err;
  }

  return data;
}

// Auth API Calls
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => apiFetch<{ user: any }>('/auth/me'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Product API Calls
export const productApi = {
  getProducts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<any[]>(`/products${queryString}`);
  },

  getProductById: (id: string) => apiFetch<{ product: any }>(`/products/${id}`),

  createProduct: (productData: {
    reference: string;
    name: string;
    description?: string;
    price: number;
    initialQuantity?: number;
    defaultOrigin?: string;
    category?: string;
    minimumStock?: number;
    barcode?: string;
    image?: string;
  }) =>
    apiFetch<{ product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id: string, productData: Record<string, any>) =>
    apiFetch<{ product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id: string) =>
    apiFetch<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  deactivateProduct: (id: string) =>
    apiFetch<{ product: any }>(`/products/${id}/deactivate`, {
      method: 'PATCH',
    }),

  activateProduct: (id: string) =>
    apiFetch<{ product: any }>(`/products/${id}/activate`, {
      method: 'PATCH',
    }),

  getByBarcode: (barcode: string) => apiFetch<{ product: any }>(`/products/barcode/${barcode}`),

  getMovements: (id: string, params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    const queryString = query ? `?${query}` : '';
    return apiFetch<{ product: any; movements: any[] }>(`/products/${id}/movements${queryString}`);
  },
};

// Stock API Calls
export const stockApi = {
  recordEntry: (entryData: {
    productId: string;
    quantity: number;
    origin?: string;
    unitPrice?: number;
    note?: string;
  }) =>
    apiFetch<{ movement: any; product: any }>('/stock/entry', {
      method: 'POST',
      body: JSON.stringify(entryData),
    }),

  recordExit: (exitData: {
    productId: string;
    quantity: number;
    unitPrice?: number;
    note?: string;
  }) =>
    apiFetch<{ movement: any; product: any }>('/stock/exit', {
      method: 'POST',
      body: JSON.stringify(exitData),
    }),

  getAllMovements: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<any[]>(`/stock${queryString}`);
  },

  getMovementById: (id: string) => apiFetch<{ movement: any }>(`/stock/${id}`),
};

// Dashboard API Calls
export const dashboardApi = {
  getStats: () => apiFetch<{
    totalProducts: number;
    activeProducts: number;
    totalQuantity: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalStockValue: number;
    todayEntries: number;
    todayExits: number;
  }>('/dashboard'),
};

// Upload API Calls (Cloudinary Support)
export const uploadApi = {
  uploadImage: (imageData: string) =>
    apiFetch<{ url: string; isCloudinary: boolean }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    }),
};
