// ─────────────────────────────────────────────────────────
// Streamify API Service
// All backend calls go through this file
// Base URL reads from .env: VITE_API_URL (default: localhost:8000)
// ─────────────────────────────────────────────────────────

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';

const request = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...((options.headers as any) ?? {}) },
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? 'Request failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────
export const loginUser = (email: string, password: string) =>
  request('/users/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const registerUser = (formData: FormData) =>
  fetch(`${BASE_URL}/users/register`, { method: 'POST', body: formData, credentials: 'include' }).then(r => r.json());

export const logoutUser = () =>
  request('/users/logout', { method: 'POST' });

export const getCurrentUser = () =>
  request('/users/getCurrentUser');

export const updateAccountDetails = (data: { fullName?: string; username?: string }) =>
  request('/users/updateAccountDetails', { method: 'PATCH', body: JSON.stringify(data) });

export const getChannelProfile = (username: string) =>
  request(`/users/getUserChannelProfile/c/${username}`);

export const getWatchHistory = () =>
  request('/users/getWatchHistory');

export const clearWatchHistory = () =>
  request('/users/clearWatchHistory', { method: 'DELETE' });

// ── Videos ───────────────────────────────────────────────
export const getVideos = (params: { query?: string; page?: number; limit?: number; sortBy?: string; sortType?: string; userId?: string; category?: string } = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
  ).toString();
  return request(`/videos${qs ? `?${qs}` : ''}`);
};

export const getVideoById = (videoId: string) =>
  request(`/videos/${videoId}`);

export const uploadVideo = (formData: FormData) =>
  fetch(`${BASE_URL}/videos`, { method: 'POST', body: formData, credentials: 'include' }).then(r => r.json());

export const updateVideo = (videoId: string, formData: FormData) =>
  fetch(`${BASE_URL}/videos/${videoId}`, { method: 'PUT', body: formData, credentials: 'include' }).then(r => r.json());

export const deleteVideo = (videoId: string) =>
  request(`/videos/${videoId}`, { method: 'DELETE' });

export const togglePublishVideo = (videoId: string) =>
  request(`/videos/${videoId}/toggle-publish`, { method: 'POST' });

// ── Comments ─────────────────────────────────────────────
export const getComments = (videoId: string, page = 1, limit = 20) =>
  request(`/comments/${videoId}?page=${page}&limit=${limit}`);

export const addComment = (videoId: string, content: string) =>
  request(`/comments/${videoId}`, { method: 'POST', body: JSON.stringify({ content }) });

export const deleteComment = (commentId: string) =>
  request(`/comments/c/${commentId}`, { method: 'DELETE' });

// ── Likes ─────────────────────────────────────────────────
export const toggleVideoLike = (videoId: string) =>
  request(`/likes/video/${videoId}`, { method: 'POST' });

export const toggleCommentLike = (commentId: string) =>
  request(`/likes/comment/${commentId}`, { method: 'POST' });

export const getVideoLikes = (videoId: string) =>
  request(`/likes/video/${videoId}`);

export const getLikedVideos = () =>
  request('/likes/my-videos');

// ── Subscriptions ─────────────────────────────────────────
export const toggleSubscription = (channelId: string) =>
  request(`/subscriptions/toggle/${channelId}`, { method: 'POST' });

export const getSubscriptionStatus = (channelId: string) =>
  request(`/subscriptions/${channelId}/status`);

export const getChannelSubscribers = (channelId: string) =>
  request(`/subscriptions/channel/${channelId}`);

export const getSubscribedChannels = (subscriberId: string) =>
  request(`/subscriptions/u/${subscriberId}`);

// ── Playlists ─────────────────────────────────────────────
export const getUserPlaylists = () =>
  request('/playlists');

export const createPlaylist = (name: string, description: string) =>
  request('/playlists', { method: 'POST', body: JSON.stringify({ name, description }) });

export const addVideoToPlaylist = (playListId: string, videoId: string) =>
  request(`/playlists/${playListId}/videos`, { method: 'POST', body: JSON.stringify({ videoId }) });

export const removeVideoFromPlaylist = (playListId: string, videoId: string) =>
  request(`/playlists/${playListId}/videos/${videoId}`, { method: 'DELETE' });

export const deletePlaylist = (playListId: string) =>
  request(`/playlists/${playListId}`, { method: 'DELETE' });

// ── Dashboard ─────────────────────────────────────────────
export const getDashboardStats = () =>
  request('/dashboard/stats');

export const getDashboardVideos = () =>
  request('/dashboard/videos');

// ── Tweets ────────────────────────────────────────────────
export const getUserTweets = (userId: string) =>
  request(`/tweets/user/${userId}`);

export const createTweet = (content: string) =>
  request('/tweets', { method: 'POST', body: JSON.stringify({ content }) });
