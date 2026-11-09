export interface IpodSong {
  id?: string;
  name: string;
  artistName?: string;
  albumName?: string;
  url: string; // Direct audio URL, YouTube video ID or YouTube URL
  duration?: number;
  trackNumber?: number;
  artwork?: {
    url: string;
  };
}

export interface IpodPlaylist {
  id?: string;
  name: string;
  description?: string;
  curatorName?: string;
  songs: (IpodSong | string)[]; // can be song objects or IDs
  artwork?: {
    url: string;
  };
}

export interface IpodAlbum {
  id?: string;
  name: string;
  artistName?: string;
  songs?: (IpodSong | string)[];
  artwork?: {
    url: string;
  };
}

