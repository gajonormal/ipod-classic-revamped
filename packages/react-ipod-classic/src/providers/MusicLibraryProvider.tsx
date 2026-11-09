import type { MediaApi } from "@/types/Media.API";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { IpodSong, IpodPlaylist, IpodAlbum } from "@/types/custom";
import {
  mockSongs,
  mockAlbums,
  mockPlaylists,
  mockArtists,
} from "@/utils/mockData";
import { extractYouTubeId, isDirectAudioUrl, isYouTubeId } from "@/utils/youtube";

export interface MusicLibraryContextType {
  songs: MediaApi.Song[];
  albums: MediaApi.Album[];
  artists: MediaApi.Artist[];
  playlists: MediaApi.Playlist[];
  isLoading: boolean;
  hasCustomMusic: boolean;
}

const defaultLibrary: MusicLibraryContextType = {
  songs: mockSongs,
  albums: mockAlbums,
  artists: mockArtists,
  playlists: mockPlaylists,
  isLoading: false,
  hasCustomMusic: false,
};

export const MusicLibraryContext = createContext(defaultLibrary);

export const useMusicLibrary = () => useContext(MusicLibraryContext);

function isRemoteSong(value: unknown): value is IpodSong {
  if (!value || typeof value !== "object") return false;
  const song = value as Record<string, unknown>;
  const optionalStrings = [song.id, song.artistName, song.albumName];
  const optionalNumbers = [song.duration, song.trackNumber];
  return (
    typeof song.name === "string" &&
    Boolean(song.name.trim()) &&
    typeof song.url === "string" &&
    (isYouTubeId(extractYouTubeId(song.url)) || isDirectAudioUrl(song.url)) &&
    optionalStrings.every(
      (field) => field === undefined || typeof field === "string"
    ) &&
    optionalNumbers.every(
      (field) =>
        field === undefined ||
        (typeof field === "number" && Number.isFinite(field) && field >= 0)
    ) &&
    (song.artwork === undefined ||
      (song.artwork !== null &&
        typeof song.artwork === "object" &&
        "url" in song.artwork &&
        typeof song.artwork.url === "string"))
  );
}

function normalizeSong(song: IpodSong, index: number): MediaApi.Song {
  const url = extractYouTubeId(song.url);
  return {
    id: song.id || url || `song-${index}`,
    name: song.name,
    artistName: song.artistName || "Unknown Artist",
    albumName: song.albumName || "Unknown Album",
    duration: song.duration ?? 0,
    trackNumber: song.trackNumber ?? index + 1,
    url,
    artwork:
      song.artwork ??
      (isYouTubeId(url)
        ? { url: `https://i.ytimg.com/vi/${url}/hqdefault.jpg` }
        : undefined),
  };
}

interface MusicLibraryProviderProps {
  children: React.ReactNode;
  songs?: IpodSong[];
  songsUrl?: string;
  playlists?: IpodPlaylist[];
  albums?: IpodAlbum[];
}

export const MusicLibraryProvider: React.FC<MusicLibraryProviderProps> = ({
  children,
  songs: initialSongs,
  songsUrl,
  playlists: initialPlaylists,
  albums: initialAlbums,
}) => {
  const remoteUrl = initialSongs === undefined ? songsUrl : undefined;
  const [remoteLibrary, setRemoteLibrary] = useState<{
    url: string;
    songs?: IpodSong[];
  }>();

  useEffect(() => {
    if (!remoteUrl) return;

    const controller = new AbortController();
    async function loadSongs(url: string) {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const songs: unknown = Array.isArray(data) ? data : data?.songs;
        if (!Array.isArray(songs) || !songs.every(isRemoteSong)) {
          throw new Error(
            "Expected a playlist of songs with a name and an audio URL or YouTube ID"
          );
        }
        if (!controller.signal.aborted) setRemoteLibrary({ url, songs });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load songs:", error);
        setRemoteLibrary({ url });
      }
    }
    void loadSongs(remoteUrl);
    return () => controller.abort();
  }, [remoteUrl]);

  const remoteSongs =
    remoteUrl && remoteLibrary?.url === remoteUrl
      ? remoteLibrary.songs
      : undefined;
  const rawSongs = initialSongs ?? remoteSongs;
  const isLoading = Boolean(remoteUrl && remoteLibrary?.url !== remoteUrl);

  const library = useMemo<MusicLibraryContextType>(() => {
    if (
      rawSongs === undefined &&
      !initialAlbums?.length &&
      !initialPlaylists?.length
    ) {
      return { ...defaultLibrary, isLoading };
    }

    const songsById = new Map<string, MediaApi.Song>();
    const songsByUrl = new Map<string, MediaApi.Song>();
    const addSong = (song: MediaApi.Song) => {
      if (!songsById.has(song.id)) songsById.set(song.id, song);
      if (!songsByUrl.has(song.url)) songsByUrl.set(song.url, song);
      return song;
    };
    rawSongs?.forEach((song, index) => addSong(normalizeSong(song, index)));

    const resolveTrack = (track: IpodSong | string, index: number) => {
      if (typeof track !== "string")
        return addSong(normalizeSong(track, index));

      const url = extractYouTubeId(track);
      return (
        songsById.get(track) ??
        songsByUrl.get(url) ??
        addSong(normalizeSong({ id: track, name: track, url }, index))
      );
    };

    const albums: MediaApi.Album[] = (initialAlbums ?? []).map(
      (album, index) => {
        const songs = (album.songs ?? []).map((track, trackIndex) =>
          resolveTrack(
            typeof track === "string"
              ? track
              : {
                  ...track,
                  albumName: track.albumName ?? album.name,
                  artistName: track.artistName ?? album.artistName,
                },
            trackIndex
          )
        );
        return {
          id: album.id || `custom-album-${index}`,
          name: album.name,
          artistName: album.artistName ?? songs[0]?.artistName,
          artwork: album.artwork ?? songs[0]?.artwork,
          url: songs[0]?.url ?? "",
          songs,
        };
      }
    );
    const assignedTracks = new Set(
      albums.flatMap((album) => album.songs.map((song) => song.id))
    );

    const playlists: MediaApi.Playlist[] = (initialPlaylists ?? []).map(
      (playlist, index) => {
        const songs = playlist.songs.map(resolveTrack);
        return {
          id: playlist.id || `custom-playlist-${index}`,
          name: playlist.name,
          curatorName: playlist.curatorName ?? "User",
          description: playlist.description,
          artwork: playlist.artwork ?? songs[0]?.artwork,
          url: songs[0]?.url ?? "",
          songs,
        };
      }
    );

    const songs = Array.from(songsById.values());
    const albumsById = new Map(albums.map((album) => [album.id, album]));
    for (const song of songs) {
      if (assignedTracks.has(song.id)) continue;
      const id = `${song.albumName}___${song.artistName}`;
      let album = albumsById.get(id);
      if (!album) {
        album = {
          id,
          name: song.albumName || "Unknown Album",
          artistName: song.artistName,
          artwork: song.artwork,
          url: song.url,
          songs: [],
        };
        albumsById.set(id, album);
      }
      album.songs.push(song);
    }

    const artistsById = new Map<string, MediaApi.Artist>();
    for (const album of albumsById.values()) {
      const name = album.artistName || "Unknown Artist";
      let artist = artistsById.get(name);
      if (!artist) {
        artist = {
          id: name,
          name,
          url: album.url,
          artwork: album.artwork,
          albums: [],
        };
        artistsById.set(name, artist);
      }
      artist.albums?.push(album);
    }

    return {
      songs,
      albums: Array.from(albumsById.values()),
      artists: Array.from(artistsById.values()),
      playlists: [
        {
          id: "playlist-all-songs",
          name: "All Songs",
          curatorName: "Library",
          url: songs[0]?.url ?? "",
          artwork: songs[0]?.artwork,
          songs,
        },
        ...playlists,
      ],
      isLoading,
      hasCustomMusic: true,
    };
  }, [rawSongs, initialAlbums, initialPlaylists, isLoading]);

  return (
    <MusicLibraryContext.Provider value={library}>
      {children}
    </MusicLibraryContext.Provider>
  );
};
