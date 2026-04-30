// Mock data for Streamify UI

export const mockVideos = [
  {
    id: '1',
    title: 'Building a Full-Stack App with React & Node.js in 2025',
    thumbnail: 'https://picsum.photos/seed/vid1/640/360',
    duration: '45:22',
    views: '2.4M',
    uploadedAt: '3 days ago',
    channel: { name: 'CodeWithAlex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', verified: true },
    category: 'Tech',
  },
  {
    id: '2',
    title: 'Cinematic Travel Vlog — Tokyo Streets at Night 4K',
    thumbnail: 'https://picsum.photos/seed/vid2/640/360',
    duration: '18:04',
    views: '890K',
    uploadedAt: '1 week ago',
    channel: { name: 'NomadLens', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nomad', verified: true },
    category: 'Travel',
  },
  {
    id: '3',
    title: 'Lo-Fi Beats to Code / Study to 🎧 — 24/7 Stream',
    thumbnail: 'https://picsum.photos/seed/vid3/640/360',
    duration: 'LIVE',
    views: '12.1K watching',
    uploadedAt: 'Live now',
    channel: { name: 'ChillWaves', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chill', verified: false },
    category: 'Music',
  },
  {
    id: '4',
    title: 'I Tried Every AI Image Generator in 2025 — Honest Review',
    thumbnail: 'https://picsum.photos/seed/vid4/640/360',
    duration: '22:18',
    views: '4.7M',
    uploadedAt: '2 days ago',
    channel: { name: 'TechReviewPro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techpro', verified: true },
    category: 'Tech',
  },
  {
    id: '5',
    title: 'Mastering UI/UX Design — From Figma to Code',
    thumbnail: 'https://picsum.photos/seed/vid5/640/360',
    duration: '1:12:45',
    views: '1.2M',
    uploadedAt: '5 days ago',
    channel: { name: 'DesignStudio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design', verified: true },
    category: 'Design',
  },
  {
    id: '6',
    title: 'Gordon Ramsay Teaches Me How to Cook Steak',
    thumbnail: 'https://picsum.photos/seed/vid6/640/360',
    duration: '34:51',
    views: '8.9M',
    uploadedAt: '1 month ago',
    channel: { name: 'FoodieWorld', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=food', verified: true },
    category: 'Food',
  },
  {
    id: '7',
    title: 'Rust Programming — Zero to Hero Crash Course 2025',
    thumbnail: 'https://picsum.photos/seed/vid7/640/360',
    duration: '3:04:22',
    views: '654K',
    uploadedAt: '2 weeks ago',
    channel: { name: 'RustAcademy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rust', verified: false },
    category: 'Tech',
  },
  {
    id: '8',
    title: 'Epic Guitar Solo Cover — Bohemian Rhapsody 🎸',
    thumbnail: 'https://picsum.photos/seed/vid8/640/360',
    duration: '6:02',
    views: '3.3M',
    uploadedAt: '4 days ago',
    channel: { name: 'MusicMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music', verified: true },
    category: 'Music',
  },
];

export const mockCreators = [
  { id: '1', name: 'CodeWithAlex', handle: '@codewith_alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', subscribers: '2.4M', videos: 312, verified: true, category: 'Tech' },
  { id: '2', name: 'NomadLens', handle: '@nomadlens', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nomad', subscribers: '890K', videos: 158, verified: true, category: 'Travel' },
  { id: '3', name: 'DesignStudio', handle: '@designstudio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design', subscribers: '1.2M', videos: 204, verified: true, category: 'Design' },
  { id: '4', name: 'TechReviewPro', handle: '@techreviewpro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techpro', subscribers: '4.7M', videos: 521, verified: true, category: 'Tech' },
  { id: '5', name: 'ChillWaves', handle: '@chillwaves', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chill', subscribers: '456K', videos: 78, verified: false, category: 'Music' },
];

export const mockTweets = [
  {
    id: '1',
    user: { name: 'CodeWithAlex', handle: '@codewith_alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', verified: true },
    content: '🔥 Just dropped my biggest tutorial yet — Full-Stack React + Node.js in 2025. Over 3 hours of pure value. Link in bio! #WebDev #React #NodeJS',
    time: '2h',
    likes: 2847,
    comments: 312,
    retweets: 891,
    liked: false,
  },
  {
    id: '2',
    user: { name: 'NomadLens', handle: '@nomadlens', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nomad', verified: true },
    content: 'Tokyo at 3am is something else entirely. Shot 4K footage in Shinjuku. New vlog drops tomorrow 🎥🇯🇵 #Travel #Tokyo #Vlog',
    time: '5h',
    likes: 1243,
    comments: 87,
    retweets: 334,
    liked: true,
  },
  {
    id: '3',
    user: { name: 'DesignStudio', handle: '@designstudio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design', verified: true },
    content: 'Hot take: Most developers don\'t think enough about design. UX is not a feature, it\'s the foundation. Thread below 👇 #Design #UX #Frontend',
    time: '8h',
    likes: 5621,
    comments: 789,
    retweets: 2341,
    liked: false,
  },
];

export const mockComments = [
  {
    id: '1',
    user: { name: 'JohnDeveloper', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', verified: false },
    content: 'This is hands down the best tutorial I\'ve found on this topic. The way you explain complex concepts makes it so much easier to grasp. Subbed!',
    time: '2 hours ago',
    likes: 342,
    liked: false,
    replies: [
      {
        id: '1-1',
        user: { name: 'CodeWithAlex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', verified: true },
        content: 'Thank you so much! Comments like yours keep me motivated to keep creating 🙏',
        time: '1 hour ago',
        likes: 89,
        liked: false,
      }
    ]
  },
  {
    id: '2',
    user: { name: 'SarahCodes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', verified: false },
    content: 'I\'ve been struggling with this for weeks. Watched 20 min and already got my API working. Incredible content.',
    time: '4 hours ago',
    likes: 187,
    liked: true,
    replies: []
  },
  {
    id: '3',
    user: { name: 'DevMike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', verified: false },
    content: 'Timestamp 23:45 is gold. The deployment part is exactly what I needed. Appreciate the depth here!',
    time: '6 hours ago',
    likes: 94,
    liked: false,
    replies: []
  },
];

export const mockNotifications = [
  { id: '1', type: 'upload', user: 'CodeWithAlex', message: 'uploaded a new video', title: 'Building a Full-Stack App...', time: '2h ago', read: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { id: '2', type: 'like', user: 'NomadLens', message: 'liked your comment on', title: 'Tokyo Vlog 4K', time: '5h ago', read: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nomad' },
  { id: '3', type: 'comment', user: 'SarahCodes', message: 'replied to your comment', title: '', time: '1d ago', read: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  { id: '4', type: 'sub', user: 'DesignStudio', message: 'started streaming live:', title: 'Figma Masterclass Live', time: '2d ago', read: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design' },
];

export const mockCategories = [
  'All', 'Tech', 'Music', 'Gaming', 'Travel', 'Food', 'Design', 'Sports', 'News', 'Comedy', 'Science', 'Finance'
];

export const mockPlaylists = [
  { id: '1', name: 'Web Dev Masterclass', videos: 24, thumbnail: 'https://picsum.photos/seed/pl1/320/180', updatedAt: '2 days ago' },
  { id: '2', name: 'Travel Inspo 2025', videos: 18, thumbnail: 'https://picsum.photos/seed/pl2/320/180', updatedAt: '1 week ago' },
  { id: '3', name: 'Chill Study Vibes', videos: 45, thumbnail: 'https://picsum.photos/seed/pl3/320/180', updatedAt: '3 days ago' },
  { id: '4', name: 'Design Resources', videos: 12, thumbnail: 'https://picsum.photos/seed/pl4/320/180', updatedAt: '2 weeks ago' },
];

export const mockRevenueData = [
  { month: 'Jan', revenue: 4200, views: 120000 },
  { month: 'Feb', revenue: 5800, views: 145000 },
  { month: 'Mar', revenue: 7200, views: 190000 },
  { month: 'Apr', revenue: 6100, views: 170000 },
  { month: 'May', revenue: 9400, views: 240000 },
  { month: 'Jun', revenue: 11200, views: 310000 },
  { month: 'Jul', revenue: 13800, views: 380000 },
  { month: 'Aug', revenue: 12400, views: 345000 },
  { month: 'Sep', revenue: 15600, views: 420000 },
  { month: 'Oct', revenue: 14200, views: 390000 },
  { month: 'Nov', revenue: 18900, views: 510000 },
  { month: 'Dec', revenue: 22400, views: 620000 },
];

export const mockUserGrowthData = [
  { month: 'Jan', users: 12000 },
  { month: 'Feb', users: 15400 },
  { month: 'Mar', users: 19200 },
  { month: 'Apr', users: 17800 },
  { month: 'May', users: 24100 },
  { month: 'Jun', users: 29800 },
  { month: 'Jul', users: 35200 },
  { month: 'Aug', users: 32100 },
  { month: 'Sep', users: 41500 },
  { month: 'Oct', users: 39800 },
  { month: 'Nov', users: 48200 },
  { month: 'Dec', users: 58900 },
];

export const mockFlaggedContent = [
  { id: '1', title: 'Controversial Political Video #123', channel: 'PoliticalPundit', reports: 47, severity: 'high', status: 'pending', time: '2h ago' },
  { id: '2', title: 'Fake News: AI Apocalypse 2025', channel: 'ConspiracyTV', reports: 89, severity: 'critical', status: 'pending', time: '4h ago' },
  { id: '3', title: 'Spam promotional content', channel: 'ScamChannel99', reports: 23, severity: 'medium', status: 'reviewed', time: '1d ago' },
  { id: '4', title: 'Misleading health claims video', channel: 'QuackDoctor', reports: 156, severity: 'critical', status: 'removed', time: '2d ago' },
  { id: '5', title: 'Copyright violation - music', channel: 'MusicPirate', reports: 12, severity: 'low', status: 'pending', time: '3d ago' },
];

export const currentUser = {
  name: 'Bhavya Jain',
  handle: '@bhavya5jain',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bhavya',
  banner: 'https://picsum.photos/seed/banner/1600/400',
  bio: 'Full-stack developer & content creator. Building cool stuff on the internet. 🚀',
  subscribers: '12.4K',
  totalVideos: 48,
  totalViews: '2.1M',
  joinedDate: 'Jan 2022',
  verified: true,
  location: 'Jaipur, India',
  website: 'https://bhavyajain.dev',
  social: {
    twitter: '@bhavya5jain',
    github: 'Bhavya5jain',
  }
};
