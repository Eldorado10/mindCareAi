/**
 * API client helper for frontend to communicate with backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchPsychiatrists() {
  try {
    const response = await fetch(`${API_BASE}/psychiatrists`);
    if (!response.ok) throw new Error('Failed to fetch psychiatrists');
    return await response.json();
  } catch (error) {
    console.error('Error fetching psychiatrists:', error);
    return [];
  }
}

export async function fetchPsychiatristById(id) {
  try {
    const response = await fetch(`${API_BASE}/psychiatrists?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch psychiatrist');
    return await response.json();
  } catch (error) {
    console.error('Error fetching psychiatrist:', error);
    return null;
  }
}

export async function createPsychiatrist(data) {
  try {
    const response = await fetch(`${API_BASE}/psychiatrists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create psychiatrist');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating psychiatrist:', error);
    throw error;
  }
}

export async function updatePsychiatrist(id, data) {
  try {
    const response = await fetch(`${API_BASE}/psychiatrists?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update psychiatrist');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating psychiatrist:', error);
    throw error;
  }
}

export async function deletePsychiatrist(id) {
  try {
    const response = await fetch(`${API_BASE}/psychiatrists?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete psychiatrist');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting psychiatrist:', error);
    throw error;
  }
}

// Resources
export async function fetchResources() {
  try {
    const response = await fetch(`${API_BASE}/resources`);
    if (!response.ok) throw new Error('Failed to fetch resources');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

export async function createResource(data) {
  try {
    const response = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create resource');
    return await response.json();
  } catch (error) {
    console.error('Error creating resource:', error);
    return null;
  }
}

// Bookings
export async function createBooking(data) {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage = 'Failed to create booking';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (parseError) {
        const text = await response.text();
        if (text) errorMessage = text;
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function fetchBookings(userEmail = null) {
  try {
    const url = userEmail 
      ? `${API_BASE}/bookings?userEmail=${encodeURIComponent(userEmail)}`
      : `${API_BASE}/bookings`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// User profile
export async function fetchUserProfile({ id = null, email = null } = {}) {
  try {
    const query = id
      ? `id=${encodeURIComponent(id)}`
      : email
      ? `email=${encodeURIComponent(email)}`
      : '';

    if (!query) return null;

    const response = await fetch(`${API_BASE}/users?${query}`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  } catch (error) {
    console.error('[API] Error fetching user profile:', error);
    return null;
  }
}

export async function updateBooking(id, data) {
  try {
    const response = await fetch(`${API_BASE}/bookings?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return await response.json();
  } catch (error) {
    console.error('Error updating booking:', error);
    return null;
  }
}

// Authentication
export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    return await response.json();
  } catch (error) {
    console.error('[API] Register error:', error);
    throw error;
  }
}

export async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    return await response.json();
  } catch (error) {
    console.error('[API] Login error:', error);
    throw error;
  }
}

// Admin Functions - User Management
export async function fetchAllUsers(role = null) {
  try {
    const url = role ? `${API_BASE}/admin/users?role=${role}` : `${API_BASE}/admin/users`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('[API] Error fetching users:', error);
    return [];
  }
}

export async function fetchUserById(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/users?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('[API] Error fetching user:', error);
    return null;
  }
}

export async function createUser(userData) {
  try {
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user');
    }
    return await response.json();
  } catch (error) {
    console.error('[API] Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id, userData) {
  try {
    const response = await fetch(`${API_BASE}/admin/users?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user');
    }
    return await response.json();
  } catch (error) {
    console.error('[API] Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/users?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete user');
    }
    return await response.json();
  } catch (error) {
    console.error('[API] Error deleting user:', error);
    throw error;
  }
}

// Mood Entries
export async function fetchMoodEntries(userId, limit = 30) {
  try {
    const response = await fetch(`${API_BASE}/mood?userId=${userId}&limit=${limit}`, {
      headers: { 'x-user-id': userId.toString() },
    });
    if (!response.ok) throw new Error('Failed to fetch mood entries');
    return await response.json();
  } catch (error) {
    console.error('[API] Error fetching mood entries:', error);
    return [];
  }
}

export async function createMoodEntry(data) {
  try {
    const response = await fetch(`${API_BASE}/mood`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': data.userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create mood entry');
    return await response.json();
  } catch (error) {
    console.error('[API] Error creating mood entry:', error);
    return null;
  }
}

export async function updateMoodEntry(id, data) {
  try {
    const userId = data.userId || localStorage.getItem('userId');
    const response = await fetch(`${API_BASE}/mood?id=${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update mood entry');
    return await response.json();
  } catch (error) {
    console.error('[API] Error updating mood entry:', error);
    return null;
  }
}

export async function deleteMoodEntry(id) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    const response = await fetch(`${API_BASE}/mood?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId.toString() },
    });
    if (!response.ok) throw new Error('Failed to delete mood entry');
    return await response.json();
  } catch (error) {
    console.error('[API] Error deleting mood entry:', error);
    return null;
  }
}

// Health Data
export async function fetchHealthData(userId) {
  try {
    const response = await fetch(`${API_BASE}/health?userId=${userId}`, {
      headers: { 'x-user-id': userId.toString() },
    });
    if (!response.ok) throw new Error('Failed to fetch health data');
    return await response.json();
  } catch (error) {
    console.error('[API] Error fetching health data:', error);
    return [];
  }
}

export async function createHealthData(data) {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': data.userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create health data');
    return await response.json();
  } catch (error) {
    console.error('[API] Error creating health data:', error);
    return null;
  }
}

export async function updateHealthData(id, data) {
  try {
    const userId = data.userId || localStorage.getItem('userId');
    const response = await fetch(`${API_BASE}/health?id=${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update health data');
    return await response.json();
  } catch (error) {
    console.error('[API] Error updating health data:', error);
    return null;
  }
}

export async function deleteHealthData(id) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    const response = await fetch(`${API_BASE}/health?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId.toString() },
    });
    if (!response.ok) throw new Error('Failed to delete health data');
    return await response.json();
  } catch (error) {
    console.error('[API] Error deleting health data:', error);
    return null;
  }
}

// Risk Data
export async function fetchRiskData(userId, limit = 10) {
  try {
    const response = await fetch(`${API_BASE}/risk?userId=${userId}&limit=${limit}`, {
      headers: { 'x-user-id': userId.toString() },
    });
    if (!response.ok) throw new Error('Failed to fetch risk data');
    return await response.json();
  } catch (error) {
    console.error('[API] Error fetching risk data:', error);
    return [];
  }
}

export async function createRiskEntry(data) {
  try {
    const response = await fetch(`${API_BASE}/risk`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': data.userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create risk entry');
    return await response.json();
  } catch (error) {
    console.error('[API] Error creating risk entry:', error);
    return null;
  }
}
