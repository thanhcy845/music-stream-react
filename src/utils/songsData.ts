import { Song } from '../types';

export const songsData: Song[] = [
  {
    id: "song1",
    title: "Chịu cách mình nói thua",
    artist: "RHYDER ft. BAN, COOLKID",
    coverPath: "/assets/images/chiucachminhnoithua.jpg",
    audioPath: "/assets/audio/chiucachminhnoithua.mp3",
    duration: "4:46",
    genre: "Pop",
    year: 2023
  },
  {
    id: "song2",
    title: "Tò Tí Te Remix",
    artist: "Wren Evans",
    coverPath: "/assets/images/0.jpg",
    audioPath: "/assets/audio/toteti.mp3",
    duration: "3:52",
    genre: "Electronic",
    year: 2023
  },
  {
    id: "song3",
    title: "Đâu Còn Đây",
    artist: "LEE KEN x NAL",
    coverPath: "/assets/images/1.jpg",
    audioPath: "/assets/audio/dauconday.mp3",
    duration: "2:56",
    genre: "Pop",
    year: 2023
  },
  {
    id: "song4",
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    coverPath: "/assets/images/2.jpg",
    audioPath: "/assets/audio/Despacito.mp3",
    duration: "3:47",
    genre: "Latin",
    year: 2017
  },
  {
    id: "song5",
    title: "Alo Alo",
    artist: "Various Artists",
    coverPath: "/assets/images/aloalo.jpg",
    audioPath: "/assets/audio/AloAlo.mp3",
    duration: "3:30",
    genre: "Pop",
    year: 2023
  },
  {
    id: "song6",
    title: "Em Về Đi Em",
    artist: "Various Artists",
    coverPath: "/assets/images/evde.jpg",
    audioPath: "/assets/audio/EmVeDiEm.mp3",
    duration: "4:15",
    genre: "Ballad",
    year: 2023
  },
  {
    id: "song7",
    title: "Gửi Tình Yêu Nhỏ",
    artist: "Various Artists",
    coverPath: "/assets/images/gtyn.jpg",
    audioPath: "/assets/audio/GuiTinhYeuNho.mp3",
    duration: "3:45",
    genre: "Ballad",
    year: 2023
  },
  {
    id: "song8",
    title: "Hết Nhạc Con Về",
    artist: "Various Artists",
    coverPath: "/assets/images/hncv.jpg",
    audioPath: "/assets/audio/HetNhacConVe.mp3",
    duration: "4:20",
    genre: "Folk",
    year: 2023
  },
  {
    id: "song9",
    title: "His Story",
    artist: "Various Artists",
    coverPath: "/assets/images/hisstory.jpg",
    audioPath: "/assets/audio/HisStory.mp3",
    duration: "3:58",
    genre: "R&B",
    year: 2023
  },
  {
    id: "song10",
    title: "Tình Ta Hai Ngã",
    artist: "Various Artists",
    coverPath: "/assets/images/tt2n.jpg",
    audioPath: "/assets/audio/TinhTaHaiNga.mp3",
    duration: "4:12",
    genre: "Ballad",
    year: 2023
  },
  {
    id: "song11",
    title: "Yêu 1 Người Có Lẽ",
    artist: "Various Artists",
    coverPath: "/assets/images/y1ncl.jpg",
    audioPath: "/assets/audio/Yeu1NguoiCoLe.mp3",
    duration: "3:33",
    genre: "Pop",
    year: 2023
  }
];

export const getRandomSongs = (count: number): Song[] => {
  const shuffled = [...songsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getSongById = (id: string): Song | undefined => {
  return songsData.find(song => song.id === id);
};

export const searchSongs = (query: string): Song[] => {
  const lowercaseQuery = query.toLowerCase();
  return songsData.filter(song => 
    song.title.toLowerCase().includes(lowercaseQuery) ||
    song.artist.toLowerCase().includes(lowercaseQuery) ||
    song.genre?.toLowerCase().includes(lowercaseQuery)
  );
};

export const getSongsByGenre = (genre: string): Song[] => {
  return songsData.filter(song => song.genre === genre);
};

export const getGenres = (): string[] => {
  const genres = songsData.map(song => song.genre).filter(Boolean) as string[];
  return Array.from(new Set(genres));
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
