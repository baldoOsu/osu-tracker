export interface Beatmap {
  beatmapset_id: number,
  difficulty_rating: number,
  id: number,
  mode: Gamemode,
  status: BeatmapStatus,
  total_length: number,
  user_id: number,
  version: number,
  accuracy: number,
  ar: number,
  bpm: number,
  convert: boolean,
  count_circles: number,
  count_sliders: number,
  count_spinners: number,
  cs: number,
  deleted_at: Date | null,
  drain: number,
  hit_length: number,
  is_scoreable: boolean,
  last_updated: Date | null,
  mode_int: number,
  passcount: number,
  playcount: number,
  ranked: number,
  url: string,
  checksum: string
  beatmapset: BeatmapSet,
  max_combo: number
}

export interface BeatmapSet {
  artist: string,
  artist_unicode: string,
  covers: {
    cover: string,
    "cover@2x": string,
    card: string,
    "card@2x": string,
    list: string,
    "list@2x": string,
    slimcover: string,
    "slimcover@2x": string
  },
  creator: string,
  favourite_count: number,
  hype: null,
  id: number,
  nsfw: false,
  offset: number,
  play_count: number,
  preview_url: string,
  source: "",
  spotlight: false,
  status: BeatmapStatus,
  title: string,
  title_unicode: string,
  track_id: null,
  user_id: number,
  video: false
}

export interface RecentResponse {
  beatmap: Beatmap,
  beatmapset: BeatmapSet,
}

export interface BetmapResponse {
  BeatmapSet: BeatmapSet
}

export type Gamemode = "osu" | "taiko" | "fruits" | "mania";
export type BeatmapStatus = "graveyard" | "wip" | "pending" | "ranked" | "approved" | "qualified" | "loved";

