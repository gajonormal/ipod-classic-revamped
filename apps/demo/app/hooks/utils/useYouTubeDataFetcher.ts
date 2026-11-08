import { DataFetcher } from "./useDataFetcher";
import { mockAlbums, mockArtists, mockSongs } from "@/utils/mockData";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export const getYouTubeFetcher = (accessToken: string): DataFetcher => {
  const fetchWithToken = async (endpoint: string) => {
    const response = await fetch(`${YOUTUBE_API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.statusText}`);
    }
    return response.json();
  };

  return {
    fetchPlaylists: async ({ pageParam = "", limit = 20 }: any) => {
      const pageQuery = pageParam && pageParam !== 0 ? `&pageToken=${pageParam}` : "";
      const data = await fetchWithToken(
        `/playlists?mine=true&maxResults=${limit}&part=snippet,contentDetails${pageQuery}`
      );

      const playlists: MediaApi.Playlist[] = data.items.map((item: any) => ({
        id: item.id,
        name: item.snippet.title,
        description: item.snippet.description,
        curatorName: item.snippet.channelTitle,
        artwork: {
          url: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        },
      }));

      return {
        data: playlists,
        nextPageParam: data.nextPageToken,
      };
    },

    fetchPlaylist: async (id: string) => {
      const data = await fetchWithToken(
        `/playlistItems?playlistId=${id}&maxResults=50&part=snippet,contentDetails`
      );

      const playlistDetails = await fetchWithToken(
        `/playlists?id=${id}&part=snippet`
      );

      const snippet = playlistDetails.items?.[0]?.snippet;

      const songs: MediaApi.Song[] = data.items
        // Filter out private/deleted videos which might not have a videoId or title
        .filter((item: any) => item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
        .map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          name: item.snippet.title,
          artistName: item.snippet.videoOwnerChannelTitle || "Unknown Artist",
          albumName: snippet?.title || "YouTube Playlist",
          artwork: {
            url: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          },
          url: item.snippet.resourceId.videoId, // We use the videoId as the URL for the YT player
          durationInMillis: 0, // YouTube API requires a separate call to videos endpoint to get duration, keep 0 for now
        }));

      return {
        id,
        name: snippet?.title || "Playlist",
        description: snippet?.description,
        curatorName: snippet?.channelTitle,
        artwork: {
          url: snippet?.thumbnails?.maxres?.url || snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url,
        },
        url: `https://youtube.com/playlist?list=${id}`,
        songs,
      };
    },

    fetchAlbums: async ({ pageParam = "", limit = 20 }: any) => {
      const pageQuery = pageParam && pageParam !== 0 ? `&pageToken=${pageParam}` : "";
      const data = await fetchWithToken(
        `/playlists?mine=true&maxResults=${limit}&part=snippet,contentDetails${pageQuery}`
      );

      const albums: MediaApi.Album[] = data.items.map((item: any) => ({
        id: item.id,
        name: item.snippet.title,
        artistName: item.snippet.channelTitle,
        artwork: {
          url: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        },
      }));

      return {
        data: albums,
        nextPageParam: data.nextPageToken,
      };
    },
    fetchAlbum: async (id: string) => {
      // Re-use fetchPlaylist logic for fetchAlbum to get songs for CoverFlow
      const data = await fetchWithToken(
        `/playlistItems?playlistId=${id}&maxResults=50&part=snippet,contentDetails`
      );

      const playlistDetails = await fetchWithToken(
        `/playlists?id=${id}&part=snippet`
      );

      const snippet = playlistDetails.items?.[0]?.snippet;

      const songs: MediaApi.Song[] = data.items
        .filter((item: any) => item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
        .map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          name: item.snippet.title,
          artistName: item.snippet.videoOwnerChannelTitle || "Unknown Artist",
          albumName: snippet?.title || "YouTube Playlist",
          artwork: {
            url: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          },
          url: item.snippet.resourceId.videoId,
          durationInMillis: 0,
        }));

      return {
        id,
        name: snippet?.title || "Album",
        artistName: snippet?.channelTitle,
        artwork: {
          url: snippet?.thumbnails?.maxres?.url || snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url,
        },
        url: `https://youtube.com/playlist?list=${id}`,
        songs,
      };
    },
    fetchArtists: async ({ pageParam, limit }: any) => {
      return { data: mockArtists, nextPageParam: undefined };
    },
    fetchArtistAlbums: async (id: string, inLibrary?: boolean) => {
      return mockArtists.find((a) => a.id === id)?.albums;
    },
    fetchSearchResults: async (query: string) => {
      if (!query) return { albums: [], artists: [], playlists: [], songs: [] };
      const data = await fetchWithToken(
        `/search?q=${encodeURIComponent(query)}&type=video&maxResults=20&part=snippet`
      );
      
      const songs: MediaApi.Song[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        name: item.snippet.title,
        artistName: item.snippet.channelTitle,
        artwork: {
          url: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        },
        url: item.id.videoId,
      }));

      return {
        albums: [],
        artists: [],
        playlists: [],
        songs,
      };
    },
  };
};
