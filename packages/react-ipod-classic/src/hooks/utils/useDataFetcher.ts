import type { MediaApi } from "@/types/Media.API";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hooks";
import {
  useMusicLibrary,
  type MusicLibraryContextType,
} from "@/providers/MusicLibraryProvider";
import { useMemo } from "react";
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

// Give each immutable library snapshot a small cache key, independent of its size.
const libraryKeys = new WeakMap<MusicLibraryContextType, number>();
let nextLibraryKey = 0;

function getLibraryKey(library: MusicLibraryContextType) {
  let key = libraryKeys.get(library);
  if (key === undefined) {
    key = nextLibraryKey++;
    libraryKeys.set(library, key);
  }
  return key;
}

const useResolvedFetcher = () => {
  const { isYoutubeAuthorized, youtubeToken } = useSettings();
  const library = useMusicLibrary();
  const enabled = !library.isLoading;

  const libraryFetcher: DataFetcher = useMemo(
    () => ({
      fetchAlbums: async () => {
        return { data: library.albums, nextPageParam: undefined };
      },
      fetchAlbum: async (id: string) => {
        return library.albums.find((a) => a.id === id);
      },
      fetchArtists: async () => {
        return { data: library.artists, nextPageParam: undefined };
      },
      fetchArtistAlbums: async (id: string) => {
        return library.artists.find((a) => a.id === id)?.albums;
      },
      fetchPlaylists: async () => {
        return { data: library.playlists, nextPageParam: undefined };
      },
      fetchPlaylist: async (id: string) => {
        return library.playlists.find((p) => p.id === id);
      },
      fetchSearchResults: async (query: string) => {
        const q = query.toLowerCase();
        return {
          artists: library.artists.filter((a) =>
            a.name.toLowerCase().includes(q)
          ),
          songs: library.songs.filter((s) => s.name.toLowerCase().includes(q)),
          albums: library.albums.filter((a) =>
            a.name.toLowerCase().includes(q)
          ),
          playlists: library.playlists.filter((p) =>
            p.name.toLowerCase().includes(q)
          ),
        };
      },
    }),
    [library]
  );

  const fetcher =
    isYoutubeAuthorized && youtubeToken
      ? getYouTubeFetcher(youtubeToken)
      : libraryFetcher;

  return {
    fetcher,
    enabled,
    libraryKey: getLibraryKey(library),
    isYoutubeAuthorized,
  };
};

export const useFetchAlbum = (
  options: CommonFetcherProps & AlbumFetcherProps
) => {
  const { fetcher, enabled, libraryKey, isYoutubeAuthorized } =
    useResolvedFetcher();

  return useQuery({
    queryKey: ["album", isYoutubeAuthorized, libraryKey, { id: options.id }],
    queryFn: () => fetcher.fetchAlbum(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchAlbums = (
  options: CommonFetcherProps & AlbumsFetcherProps
) => {
  const { fetcher, enabled, libraryKey, isYoutubeAuthorized } =
    useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["albums", isYoutubeAuthorized, libraryKey],
    queryFn: ({ pageParam }) => fetcher.fetchAlbums({ pageParam, limit: 50 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchArtists = (options: CommonFetcherProps) => {
  const { fetcher, enabled, libraryKey, isYoutubeAuthorized } =
    useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["artists", isYoutubeAuthorized, libraryKey],
    queryFn: ({ pageParam }) => fetcher.fetchArtists({ pageParam, limit: 20 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchArtistAlbums = (
  options: CommonFetcherProps & ArtistFetcherProps
) => {
  const { fetcher, enabled, libraryKey, isYoutubeAuthorized } =
    useResolvedFetcher();

  return useQuery({
    queryKey: [
      "artistAlbums",
      isYoutubeAuthorized,
      libraryKey,
      { id: options.id },
    ],
    queryFn: () => fetcher.fetchArtistAlbums(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchPlaylists = (options: CommonFetcherProps) => {
  const { fetcher, enabled, libraryKey, isYoutubeAuthorized } =
    useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["playlists", isYoutubeAuthorized, libraryKey],
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
  const { fetcher, enabled, libraryKey, isYoutubeAuthorized } =
    useResolvedFetcher();

  return useQuery({
    queryKey: ["playlist", isYoutubeAuthorized, libraryKey, { id: options.id }],
    queryFn: () => fetcher.fetchPlaylist(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchSearchResults = (
  options: CommonFetcherProps & SearchFetcherProps
) => {
  const { fetcher, enabled, libraryKey, isYoutubeAuthorized } =
    useResolvedFetcher();

  return useQuery({
    queryKey: [
      "search",
      isYoutubeAuthorized,
      libraryKey,
      { query: options.query },
    ],
    queryFn: () => fetcher.fetchSearchResults(options.query),
    staleTime: STALE_TIME.search,
    enabled: enabled && !options.lazy,
  });
};
