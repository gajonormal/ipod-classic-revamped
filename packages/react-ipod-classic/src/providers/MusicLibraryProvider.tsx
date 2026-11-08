import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { IpodSong, IpodPlaylist, IpodAlbum } from "@/types/custom";
import { mockSongs, mockAlbums, mockPlaylists, mockArtists } from "@/utils/mockData";
import { extractYouTubeId } from "@/utils/youtube";

export interface MusicLibraryContextType {
  songs: MediaApi.Song[];
  albums: MediaApi.Album[];
  artists: MediaApi.Artist[];
  playlists: MediaApi.Playlist[];
  isLoading: boolean;
  hasCustomMusic: boolean;
}

export const MusicLibraryContext = createContext<MusicLibraryContextType>({
  songs: mockSongs,
  albums: mockAlbums,
  artists: mockArtists,
  playlists: mockPlaylists,
  isLoading: false,
  hasCustomMusic: false,
});

export const useMusicLibrary = () => useContext(MusicLibraryContext);

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
  const [remoteSongs, setRemoteSongs] = useState<IpodSong[] | null>(null);
  const [isLoading, setIsLoading] = useState(!!songsUrl);

  useEffect(() => {
    if (!songsUrl) return;

    let isMounted = true;
    setIsLoading(true);

    fetch(songsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setRemoteSongs(data);
        } else if (data && Array.isArray(data.songs)) {
          setRemoteSongs(data.songs);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch songs from songsUrl:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [songsUrl]);

  const rawSongs = initialSongs || remoteSongs;
  const hasCustomMusic = !!(rawSongs && rawSongs.length > 0);

  const library = useMemo<MusicLibraryContextType>(() => {
    if (!rawSongs || rawSongs.length === 0) {
      return {
        songs: mockSongs,
        albums: mockAlbums,
        artists: mockArtists,
        playlists: mockPlaylists,
        isLoading,
        hasCustomMusic: false,
      };
    }

    // Convert raw songs to MediaApi.Song format
    const formattedSongs: MediaApi.Song[] = rawSongs.map((song, index) => {
      const ytId = extractYouTubeId(song.url);
      const songId = song.id || ytId || `song-${index}`;
      const artworkUrl =
        song.artwork?.url || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "");

      return {
        id: songId,
        name: song.name,
        artistName: song.artistName || "Unknown Artist",
        albumName: song.albumName || "Unknown Album",
        duration: song.duration || 0,
        trackNumber: song.trackNumber || index + 1,
        url: ytId,
        artwork: artworkUrl ? { url: artworkUrl } : undefined,
      };
    });

    // Group songs into albums
    const albumsMap = new Map<string, MediaApi.Album>();
    formattedSongs.forEach((song) => {
      const albumKey = `${song.albumName}___${song.artistName}`;
      if (!albumsMap.has(albumKey)) {
        albumsMap.set(albumKey, {
          id: albumKey,
          name: song.albumName || "Unknown Album",
          artistName: song.artistName,
          artwork: song.artwork,
          url: song.url,
          songs: [],
        });
      }
      albumsMap.get(albumKey)!.songs.push(song);
    });
    const parsedAlbums = Array.from(albumsMap.values());

    // Group songs into artists
    const artistsMap = new Map<string, MediaApi.Artist>();
    formattedSongs.forEach((song) => {
      const artistName = song.artistName || "Unknown Artist";
      if (!artistsMap.has(artistName)) {
        artistsMap.set(artistName, {
          id: artistName,
          name: artistName,
          url: song.url,
          artwork: song.artwork,
          albums: [],
        });
      }
    });

    // Link artist albums
    parsedAlbums.forEach((album) => {
      const artist = artistsMap.get(album.artistName || "Unknown Artist");
      if (artist) {
        artist.albums = artist.albums || [];
        artist.albums.push(album);
      }
    });
    const parsedArtists = Array.from(artistsMap.values());

    // Playlists
    const parsedPlaylists: MediaApi.Playlist[] = [];

    // Default "All Songs" playlist
    parsedPlaylists.push({
      id: "playlist-all-songs",
      name: "All Songs",
      curatorName: "Library",
      url: formattedSongs[0]?.url || "",
      artwork: formattedSongs[0]?.artwork,
      songs: formattedSongs,
    });

    // Custom user playlists
    if (initialPlaylists && initialPlaylists.length > 0) {
      initialPlaylists.forEach((pl, idx) => {
        const plSongs: MediaApi.Song[] = pl.songs.map((s, sIdx) => {
          if (typeof s === "string") {
            const found = formattedSongs.find((f) => f.id === s || f.url === s);
            return (
              found || {
                id: s,
                name: s,
                duration: 0,
                trackNumber: sIdx + 1,
                url: extractYouTubeId(s),
              }
            );
          }
          const ytId = extractYouTubeId(s.url);
          return {
            id: s.id || ytId || `pl-song-${idx}-${sIdx}`,
            name: s.name,
            artistName: s.artistName || "Unknown Artist",
            albumName: s.albumName || "Unknown Album",
            duration: s.duration || 0,
            trackNumber: s.trackNumber || sIdx + 1,
            url: ytId,
            artwork: s.artwork,
          };
        });

        parsedPlaylists.push({
          id: pl.id || `custom-playlist-${idx}`,
          name: pl.name,
          description: pl.description,
          curatorName: pl.curatorName || "User",
          url: plSongs[0]?.url || "",
          artwork: pl.artwork || plSongs[0]?.artwork,
          songs: plSongs,
        });
      });
    }

    return {
      songs: formattedSongs,
      albums: parsedAlbums,
      artists: parsedArtists,
      playlists: parsedPlaylists,
      isLoading,
      hasCustomMusic: true,
    };
  }, [rawSongs, initialPlaylists, isLoading]);

  return (
    <MusicLibraryContext.Provider value={library}>
      {children}
    </MusicLibraryContext.Provider>
  );
};

