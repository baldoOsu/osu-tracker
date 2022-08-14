
// fulls docs: https://osu.ppy.sh/docs/index.html#user

// not full response
export interface APIUser extends APIUserSocials {
  avatar_url: string,
  country_code: string,
  id: number,
  is_active: boolean,
  is_bot: boolean,
  is_online: boolean,
  is_supporter: boolean,
  username: string,
  join_date: Date,
  last_visit: Date,
  country: Country,
  cover: {
    custom_url: string,
    url: string,
  },
  is_restricted: boolean,
  badges: unknown[], // cba to type this, not important
  follower_count: number,
  statistics: APIUserStatistics,
}

interface APIUserSocials {
  discord: string,
  twitter: string,

  website: string,
}

interface Country {
  code: string,
  name: string,
}

interface APIUserStatistics {
  level: {
    current: number,
    progress: number
  },
  pp: number,
  global_rank: number,
  ranked_score: number,
  hit_accuracy: number,
  play_count: number,
  play_time: number,
  total_score: number,
  total_hits: number,
  maximum_combo: number,
  replays_watched_by_others: number,
  is_ranked: boolean,
  grade_counts: {
    ss: number,
    ssh: number,
    s: number,
    sh: number,
    a: number
  },
  rank: {
    global: number,
    country: number
  }
}