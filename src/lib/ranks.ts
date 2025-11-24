// Ship crew ranks and positions with job descriptions

export interface RankInfo {
  code: string
  title: string
  department: 'DECK_OFFICER' | 'ENGINE_OFFICER' | 'RATING_DECK' | 'RATING_ENGINE' | 'RATING_CATERING'
  description: string
  hierarchy: number // Lower number = higher rank
}

export const RANKS: RankInfo[] = [
  // DECK OFFICERS
  {
    code: 'MASTER',
    title: 'Master / Captain',
    department: 'DECK_OFFICER',
    description: 'Master Captain - Highest authority on vessel',
    hierarchy: 1,
  },
  {
    code: 'CO',
    title: 'Chief Officer',
    department: 'DECK_OFFICER',
    description: 'Chief Officer shall supervise and manage the deck and catering department as departmental head, manage the duties of the deck officer and have the duties of cargo handling and care.',
    hierarchy: 2,
  },
  {
    code: '2/O',
    title: 'Second Officer',
    department: 'DECK_OFFICER',
    description: 'Second Officer shall perform the duties of navigation and manage his work related to navigation',
    hierarchy: 3,
  },
  {
    code: '3/O',
    title: 'Third Officer',
    department: 'DECK_OFFICER',
    description: 'Third Officer shall assist the Master and perform the duties of navigation officer, and also was appointed to perform the duties of medical officer as well.',
    hierarchy: 4,
  },

  // ENGINE OFFICERS
  {
    code: 'CE',
    title: 'Chief Engineer',
    department: 'ENGINE_OFFICER',
    description: 'Chief Engineer shall lead and direct and direct the department as head of the Engine Department and supervise the general maintenance of main machinery and facilities and maintain, repair, inspect the main machinery of facilities such as propeller, generator, boiler, aux. engine, steering gear, etc.',
    hierarchy: 5,
  },
  {
    code: '2/E',
    title: 'Second Engineer',
    department: 'ENGINE_OFFICER',
    description: 'Second Engineer shall operate and maintain the diesel generator or main boiler and perform the duties of bunker supply and transfer as the Engineering Officer.',
    hierarchy: 6,
  },
  {
    code: '3/E',
    title: 'Third Engineer',
    department: 'ENGINE_OFFICER',
    description: 'Third Engineer shall operate and maintain the aux. boiler and perform the duties commanded by the Chief Engineer Officer.',
    hierarchy: 7,
  },

  // RATING - DECK
  {
    code: 'BOSUN',
    title: 'Boatswain (Bosun)',
    department: 'RATING_DECK',
    description: 'Boatswain is the man responsible on the spot for assisting the chief officer to perform the duties of maintaining and repairing deck machinery and equipment, ship operation, and work related to loading/unloading and supervising the deck crew.',
    hierarchy: 8,
  },
  {
    code: 'AB',
    title: 'Able Body Seaman',
    department: 'RATING_DECK',
    description: 'A/B is the man responsible for watch keeping on the bridge and steering during navigation at sea, assisting Boatswain for maintaining and repairing deck machinery and equipment, ship operation, and work related to loading/unloading.',
    hierarchy: 9,
  },
  {
    code: 'OS',
    title: 'Ordinary Seaman',
    department: 'RATING_DECK',
    description: 'Ordinary Sailor assist Bosun follow Chief Officer Order',
    hierarchy: 10,
  },

  // RATING - ENGINE
  {
    code: 'OLR.1',
    title: 'Oiler No.1',
    department: 'RATING_ENGINE',
    description: 'No.1 Oiler is the man responsible on site for assisting the first engineer to perform the duties of maintaining and repairing machinery and equipment of the ship engine and to supervise the engineering crew.',
    hierarchy: 11,
  },
  {
    code: 'OLR',
    title: 'Oiler',
    department: 'RATING_ENGINE',
    description: 'Oiler is the man responsible for watch keeping in engine room, assisting No.1 Oiler for maintaining and repairing machinery and equipment of the ship engine and maintaining cleanliness in engine room.',
    hierarchy: 12,
  },
  {
    code: 'WPR',
    title: 'Wiper',
    department: 'RATING_ENGINE',
    description: 'Wiper Assist No.1 Oiler and maintain engine room clean',
    hierarchy: 13,
  },

  // RATING - CATERING
  {
    code: 'CCK',
    title: 'Chief Cook / Chief Steward',
    department: 'RATING_CATERING',
    description: 'Chief Steward shall discuss the preparation of the menu with the chief officer and request, receive and stock the staple and additional foods as the man responsible on the spot for supervising the cooking crew.',
    hierarchy: 14,
  },
  {
    code: 'PM',
    title: 'Pumpman',
    department: 'RATING_CATERING',
    description: 'Pumpman - Specialized rating for cargo pump operations',
    hierarchy: 15,
  },
  {
    code: 'GB',
    title: 'Messman / Green Boy',
    department: 'RATING_CATERING',
    description: 'Messman cleaning Galley, Pantry also assist Chief Steward',
    hierarchy: 16,
  },
]

// Department labels
export const DEPARTMENTS = {
  DECK_OFFICER: 'Officer Deck',
  ENGINE_OFFICER: 'Officer Engine',
  RATING_DECK: 'Rating - Deck',
  RATING_ENGINE: 'Rating - Engine',
  RATING_CATERING: 'Rating - Catering',
}

// Helper functions
export function getRankByCode(code: string): RankInfo | undefined {
  return RANKS.find(r => r.code === code)
}

export function getRanksByDepartment(department: RankInfo['department']): RankInfo[] {
  return RANKS.filter(r => r.department === department)
}

export function getAllRankCodes(): string[] {
  return RANKS.map(r => r.code)
}

export function getAllRankTitles(): string[] {
  return RANKS.map(r => r.title)
}

// Group ranks by department for dropdown
export function getRanksGrouped(): Record<string, RankInfo[]> {
  return {
    'Officer Deck': getRanksByDepartment('DECK_OFFICER'),
    'Officer Engine': getRanksByDepartment('ENGINE_OFFICER'),
    'Rating - Deck': getRanksByDepartment('RATING_DECK'),
    'Rating - Engine': getRanksByDepartment('RATING_ENGINE'),
    'Rating - Catering': getRanksByDepartment('RATING_CATERING'),
  }
}
