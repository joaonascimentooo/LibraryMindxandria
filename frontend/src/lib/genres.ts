export type GenreType =
  | 'LITERARY_FICTION'
  | 'CONTEMPORARY_FICTION'
  | 'HISTORICAL_FICTION'
  | 'SCIENCE_FICTION'
  | 'FANTASY'
  | 'MAGICAL_REALISM'
  | 'MYSTERY'
  | 'THRILLER'
  | 'HORROR'
  | 'ROMANCE'
  | 'ADVENTURE'
  | 'ACTION'
  | 'DYSTOPIAN'
  | 'UTOPIAN'
  | 'POST_APOCALYPTIC'
  | 'STEAMPUNK'
  | 'CYBERPUNK'
  | 'CRIME_FICTION'
  | 'NOIR'
  | 'COMEDY'
  | 'SATIRE'
  | 'FABLE'
  | 'PARABLE'
  | 'MYTHOLOGY'
  | 'WESTERN'
  | 'BIOGRAPHY'
  | 'AUTOBIOGRAPHY'
  | 'MEMOIR'
  | 'HISTORY'
  | 'SCIENCE'
  | 'POPULAR_SCIENCE'
  | 'PHILOSOPHY'
  | 'POLITICS'
  | 'ECONOMICS'
  | 'SOCIOLOGY'
  | 'PSYCHOLOGY'
  | 'SPIRITUALITY'
  | 'RELIGION'
  | 'TRAVEL'
  | 'FOOD'
  | 'ESSAY'
  | 'TECHNICAL'
  | 'ART'
  | 'POETRY'
  | 'DRAMA'
  | 'TRAGEDY'
  | 'NOVELLA'
  | 'MANWHA';

export const GENRE_TRANSLATIONS: Record<GenreType, string> = {
  LITERARY_FICTION: 'Ficção Literária',
  CONTEMPORARY_FICTION: 'Ficção Contemporânea',
  HISTORICAL_FICTION: 'Ficção Histórica',
  SCIENCE_FICTION: 'Ficção Científica',
  FANTASY: 'Fantasia',
  MAGICAL_REALISM: 'Realismo Mágico',
  MYSTERY: 'Mistério',
  THRILLER: 'Suspense',
  HORROR: 'Terror',
  ROMANCE: 'Romance',
  ADVENTURE: 'Aventura',
  ACTION: 'Ação',
  DYSTOPIAN: 'Distópico',
  UTOPIAN: 'Utópico',
  POST_APOCALYPTIC: 'Pós-Apocalíptico',
  STEAMPUNK: 'Steampunk',
  CYBERPUNK: 'Cyberpunk',
  CRIME_FICTION: 'Ficção Criminal',
  NOIR: 'Noir',
  COMEDY: 'Comédia',
  SATIRE: 'Sátira',
  FABLE: 'Fábula',
  PARABLE: 'Parábola',
  MYTHOLOGY: 'Mitologia',
  WESTERN: 'Faroeste',
  BIOGRAPHY: 'Biografia',
  AUTOBIOGRAPHY: 'Autobiografia',
  MEMOIR: 'Memórias',
  HISTORY: 'História',
  SCIENCE: 'Ciência',
  POPULAR_SCIENCE: 'Divulgação Científica',
  PHILOSOPHY: 'Filosofia',
  POLITICS: 'Política',
  ECONOMICS: 'Economia',
  SOCIOLOGY: 'Sociologia',
  PSYCHOLOGY: 'Psicologia',
  SPIRITUALITY: 'Espiritualidade',
  RELIGION: 'Religião',
  TRAVEL: 'Viagem',
  FOOD: 'Gastronomia',
  ESSAY: 'Ensaio',
  TECHNICAL: 'Técnico',
  ART: 'Arte',
  POETRY: 'Poesia',
  DRAMA: 'Drama',
  TRAGEDY: 'Tragédia',
  NOVELLA: 'Novela',
  MANWHA: 'Manhwa',
};

export const ALL_GENRES: GenreType[] = Object.keys(GENRE_TRANSLATIONS) as GenreType[];

export function translateGenre(genre: GenreType): string {
  return GENRE_TRANSLATIONS[genre] || genre;
}

export function translateGenres(genres?: GenreType[]): string {
  if (!genres || genres.length === 0) return 'Sem gênero';
  return genres.map(translateGenre).join(', ');
}
