export const mockSongs: MediaApi.Song[] = [
  {
    id: "jfKfPfyJRdk",
    name: "lofi hip hop radio - beats to relax/study to",
    artistName: "Lofi Girl",
    albumName: "Lofi Radio",
    duration: 3600, // Approximate duration
    trackNumber: 1,
    url: "jfKfPfyJRdk", // We use URL as the YouTube Video ID
    artwork: {
      url: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
    },
  },
  {
    id: "dQw4w9WgXcQ",
    name: "Never Gonna Give You Up",
    artistName: "Rick Astley",
    albumName: "Whenever You Need Somebody",
    duration: 212,
    trackNumber: 1,
    url: "dQw4w9WgXcQ",
    artwork: {
      url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
    },
  },
  {
    id: "y6120QOlsfU",
    name: "Sandstorm",
    artistName: "Darude",
    albumName: "Before the Storm",
    duration: 232,
    trackNumber: 1,
    url: "y6120QOlsfU",
    artwork: {
      url: "https://i.ytimg.com/vi/y6120QOlsfU/hq720.jpg",
    },
  },
  {
    id: "djV11Xbc914",
    name: "Take On Me",
    artistName: "a-ha",
    albumName: "Hunting High and Low",
    duration: 243,
    trackNumber: 1,
    url: "djV11Xbc914",
    artwork: {
      url: "https://i.ytimg.com/vi/djV11Xbc914/hq720.jpg",
    },
  },
];

export const mockAlbums: MediaApi.Album[] = [
  {
    id: "album-1",
    name: "Lofi Radio",
    artistName: "Lofi Girl",
    url: "album-1",
    songs: [mockSongs[0]],
    artwork: {
      url: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
    },
  },
  {
    id: "album-2",
    name: "80s Classics",
    artistName: "Various Artists",
    url: "album-2",
    songs: [mockSongs[1], mockSongs[3]],
    artwork: {
      url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
    },
  },
  {
    id: "album-3",
    name: "Electronic Anthems",
    artistName: "Various Artists",
    url: "album-3",
    songs: [mockSongs[2]],
    artwork: {
      url: "https://i.ytimg.com/vi/y6120QOlsfU/hq720.jpg",
    },
  },
];

export const mockPlaylists: MediaApi.Playlist[] = [
  {
    id: "playlist-1",
    name: "All Guest Tracks",
    curatorName: "Guest Mode",
    url: "playlist-1",
    description: "A collection of YouTube videos for testing.",
    songs: mockSongs,
    artwork: {
      url: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
    },
  },
  {
    id: "playlist-2",
    name: "Meme Collection",
    curatorName: "Internet",
    url: "playlist-2",
    description: "Classic memes.",
    songs: [mockSongs[1], mockSongs[2]],
    artwork: {
      url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
    },
  },
];

export const mockArtists: MediaApi.Artist[] = [
  {
    id: "artist-1",
    name: "Lofi Girl",
    url: "artist-1",
    albums: [mockAlbums[0]],
    artwork: {
      url: "https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
    },
  },
  {
    id: "artist-2",
    name: "Rick Astley",
    url: "artist-2",
    albums: [mockAlbums[1]],
    artwork: {
      url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
    },
  },
];
