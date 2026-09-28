export interface VideoItem {
  id: string;
  name: string;
  artistName: string;
  url: string; // YouTube Video ID
}

export const mockVideos: VideoItem[] = [
  {
    id: "dQw4w9WgXcQ",
    name: "Never Gonna Give You Up",
    artistName: "Rick Astley",
    url: "dQw4w9WgXcQ",
  },
  {
    id: "M7lc1UVf-VE",
    name: "YouTube Developers Live",
    artistName: "YouTube",
    url: "M7lc1UVf-VE",
  },
  {
    id: "jNQXAC9IVRw",
    name: "Me at the zoo",
    artistName: "jawed",
    url: "jNQXAC9IVRw",
  },
  {
    id: "9bZkp7q19f0",
    name: "PSY - GANGNAM STYLE",
    artistName: "officialpsy",
    url: "9bZkp7q19f0",
  },
];
