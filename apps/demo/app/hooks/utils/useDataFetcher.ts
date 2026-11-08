import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hooks";
import { mockAlbums, mockPlaylists, mockArtists, mockSongs } from "@/utils/mockData";
import { getYouTubeFetcher } from "./useYouTubeDataFetcher";

interface UserLibraryProps {
  inLibrary?: boolean;
  userId?: string;
}

interface CommonFetcherProps {
  lazy?: boolean;
}

interface PlaylistFetcherProps extends UserLibraryProps {
  id: string;
}

interface AlbumFetcherProps extends UserLibraryProps {
  id: string;
}

interface AlbumsFetcherProps {
  artworkSize?: number;
}

interface ArtistFetcherProps extends UserLibraryProps {
  id: string;
  artworkSize?: number;
}

interface SearchFetcherProps extends UserLibraryProps {
  query: string;
}

const STALE_TIME = {
  library: 5 * 60 * 1000,
  detail: 10 * 60 * 1000,
  search: 60 * 1000,
} as const;

export interface DataFetcher {
  fetchAlbums: (
    params: MediaApi.PaginationParams
  ) => Promise<MediaApi.PaginatedResponse<MediaApi.Album[]> | undefined>;
  fetchAlbum: (
    id: string,
    inLibrary?: boolean
  ) => Promise<MediaApi.Album | undefined>;
  fetchArtists: (
    params: MediaApi.PaginationParams
  ) => Promise<MediaApi.PaginatedResponse<MediaApi.Artist[]> | undefined>;
  fetchArtistAlbums: (
    id: string,
    inLibrary?: boolean
  ) => Promise<MediaApi.Album[] | undefined>;
  fetchPlaylists: (
    params: MediaApi.PaginationParams
  ) => Promise<MediaApi.PaginatedResponse<MediaApi.Playlist[]> | undefined>;
  fetchPlaylist: (
    id: string,
    inLibrary?: boolean
  ) => Promise<MediaApi.Playlist | undefined>;
  fetchSearchResults: (
    query: string
  ) => Promise<MediaApi.SearchResults | undefined>;
}

const mockFetcher: DataFetcher = {
  fetchAlbums: async ({ pageParam, limit }) => {
    return { data: mockAlbums, nextPageParam: undefined };
  },
  fetchAlbum: async (id: string) => {
    return mockAlbums.find((a) => a.id === id);
  },
  fetchArtists: async ({ pageParam, limit }) => {
    return { data: mockArtists, nextPageParam: undefined };
  },
  fetchArtistAlbums: async (id: string) => {
    return mockArtists.find((a) => a.id === id)?.albums;
  },
  fetchPlaylists: async ({ pageParam, limit }) => {
    return { data: mockPlaylists, nextPageParam: undefined };
  },
  fetchPlaylist: async (id: string) => {
    return mockPlaylists.find((p) => p.id === id);
  },
  fetchSearchResults: async (query: string) => {
    const q = query.toLowerCase();
    return {
      artists: mockArtists.filter((a) => a.name.toLowerCase().includes(q)),
      songs: mockSongs.filter((s) => s.name.toLowerCase().includes(q)),
      albums: mockAlbums.filter((a) => a.name.toLowerCase().includes(q)),
      playlists: mockPlaylists.filter((p) => p.name.toLowerCase().includes(q)),
    };
  },
};

const useResolvedFetcher = () => {
  const { isYoutubeAuthorized, youtubeToken } = useSettings();
  const enabled = true;
  
  const fetcher = isYoutubeAuthorized && youtubeToken 
    ? getYouTubeFetcher(youtubeToken) 
    : mockFetcher;

  return { fetcher, enabled, isYoutubeAuthorized };
};

export const useFetchAlbum = (
  options: CommonFetcherProps & AlbumFetcherProps
) => {
  const { fetcher, enabled, isYoutubeAuthorized } = useResolvedFetcher();

  return useQuery({
    queryKey: ["album", isYoutubeAuthorized, { id: options.id }],
    queryFn: () => fetcher.fetchAlbum(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchAlbums = (
  options: CommonFetcherProps & AlbumsFetcherProps
) => {
  const { fetcher, enabled, isYoutubeAuthorized } = useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["albums", isYoutubeAuthorized],
    queryFn: ({ pageParam }) =>
      fetcher.fetchAlbums({ pageParam, limit: 50 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchArtists = (options: CommonFetcherProps) => {
  const { fetcher, enabled, isYoutubeAuthorized } = useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["artists", isYoutubeAuthorized],
    queryFn: ({ pageParam }) =>
      fetcher.fetchArtists({ pageParam, limit: 20 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchArtistAlbums = (
  options: CommonFetcherProps & ArtistFetcherProps
) => {
  const { fetcher, enabled, isYoutubeAuthorized } = useResolvedFetcher();

  return useQuery({
    queryKey: ["artistAlbums", isYoutubeAuthorized, { id: options.id }],
    queryFn: () => fetcher.fetchArtistAlbums(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchPlaylists = (options: CommonFetcherProps) => {
  const { fetcher, enabled, isYoutubeAuthorized } = useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["playlists", isYoutubeAuthorized],
    queryFn: ({ pageParam }) =>
      fetcher.fetchPlaylists({ pageParam, limit: 20 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchPlaylist = (
  options: CommonFetcherProps & PlaylistFetcherProps
) => {
  const { fetcher, enabled, isYoutubeAuthorized } = useResolvedFetcher();

  return useQuery({
    queryKey: ["playlist", isYoutubeAuthorized, { id: options.id }],
    queryFn: () => fetcher.fetchPlaylist(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchSearchResults = (
  options: CommonFetcherProps & SearchFetcherProps
) => {
  const { fetcher, enabled, isYoutubeAuthorized } = useResolvedFetcher();

  return useQuery({
    queryKey: ["search", isYoutubeAuthorized, { query: options.query }],
    queryFn: () => fetcher.fetchSearchResults(options.query),
    staleTime: STALE_TIME.search,
    enabled: enabled && !options.lazy,
  });
};
