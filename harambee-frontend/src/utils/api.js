const API_BASE = 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {

  const url = API_BASE + endpoint.replace(/^\/+/, '/').replace(/\/\/+/g, '/');

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const getCampaigns = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/campaigns/?${query}`);
};

export const getCampaign = (slug) => apiFetch(`/campaigns/${slug}`);

export const createCampaign = (data) => apiFetch('/campaigns/', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const donate = (campaignId, data) => apiFetch(`/donations`, {
  method: 'POST',
  body: JSON.stringify(data),
});
