export type StudentDegree = 'BSc' | 'MSc' | 'PhD' | 'Postdoctoral' | 'Other';
export type StudentStatus = 'In Progress' | 'Submitted' | 'Completed' | 'On Hold';

export interface StudentRecord {
  id: string;
  name: string;
  degree: StudentDegree;
  studentId?: string;
  title: string;
  startDate?: string;
  expectedDate?: string;
  status: StudentStatus;
  email?: string;
  notes?: string;
  updatedAt?: string;
  milestoneStage?: string;
  progressPercent?: number;
  researchFocus?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  doi?: string;
  bibtex?: string;
  category: string;
  keywords?: string[];
  abstract?: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  part: number;
  url: string;
  description: string;
  duration?: string;
  driveId?: string;
  embedUrl?: string;
  downloadUrl?: string;
  vttTrack?: VttTrack;
}

export type TabKey =
  | 'home'
  | 'team'
  | 'research'
  | 'publications'
  | 'analyzer'
  | 'students'
  | 'gear'
  | 'abaqus'
  | 'chat'
  | 'qa'
  | 'contact';

export type TeamRoleCategory = 'all' | 'pi' | 'postdoc' | 'phd' | 'msc' | 'alumni';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: TeamRoleCategory;
  affiliation: string;
  email: string;
  researchFocus: string[];
  bio: string;
  avatarUrl?: string;
  googleScholar?: string;
  researchGate?: string;
  orcid?: string;
  github?: string;
  linkedin?: string;
  academicProfile?: string;
  currentProjects?: string[];
  joinedYear?: string;
  highlight?: string;
  status: 'Active' | 'Alumni' | 'Visiting';
}

export type CelestialBodyKey =
  | 'blackhole'
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface CelestialBodyInfo {
  key: CelestialBodyKey;
  name: string;
  astronomicalSymbol: string;
  orderIndex: number;
  classification: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  surfaceTemp: string;
  diameter: string;
  labDomain: string;
  capability: {
    title: string;
    description: string;
    buttonText: string;
    targetTab?: TabKey;
    isExternalOrNewTab?: boolean;
    badge: string;
  };
}

export interface GeometricPropertyItem {
  feature: string;
  dimension: string;
  tolerance?: string;
  notes?: string;
}

export interface MaterialPropertyItem {
  name: string;
  symbol: string;
  value: string;
  unit: string;
  description?: string;
}

export interface BoundaryConditionItem {
  region: string;
  type: string;
  formulation: string;
  degreesOfFreedom: string;
}

export interface ValidationPackage {
  summary: string;
  geometricalDimensions: GeometricPropertyItem[];
  materialProperties: MaterialPropertyItem[];
  boundaryConditions: BoundaryConditionItem[];
  meshAndDiscretization: {
    elementType: string;
    characteristicMeshSize: string;
    formulation: string;
    hourGlassControl?: string;
    contactFriction?: string;
    stepTime?: string;
  };
  validationBenchmarks: {
    targetMetric: string;
    expectedBenchmarkValue: string;
    experimentalErrorTolerance: string;
    acceptanceCriterion: string;
  }[];
  executableVerificationScript: {
    language: 'python' | 'abaqus_inp' | 'matlab';
    title: string;
    code: string;
  };
}

export interface ReferenceGapItem {
  reference: string;
  priorFindingOrAssumption: string;
  extractedGapOrVoid: string;
}

export interface PaperDimensionSection {
  title: string;
  summary: string;
  bulletPoints: string[];
  subsections?: { subtitle: string; content: string[] }[];
}

export interface PaperAnalysisResult {
  id: string;
  paperTitle: string;
  authors: string;
  journalOrConference?: string;
  publicationYear?: string;
  isMultiPaper?: boolean;
  executiveSummary: string;
  criticalTakeaway: string;
  keywords: string[];
  paperNameSection?: {
    title: string;
    authors: string;
    journalOrConference?: string;
    publicationYear?: string;
    citation: string;
    paperList?: { title: string; authors: string; year?: string }[];
  };
  purposeSection?: {
    summary: string;
    hypotheses: string[];
    targetSystems: string[];
    engineeringScope: string;
    bulletPoints: string[];
  };
  researchGapSection?: {
    summary: string;
    extractedFromReferences: ReferenceGapItem[];
    theoreticalVoids: string[];
    bulletPoints: string[];
  };
  methodsAndFacilitiesSection?: {
    summary: string;
    facilitiesAndInstruments: string[];
    testingStandards: string[];
    computationalSolvers: string[];
    specimensAndMaterials: string[];
    bulletPoints: string[];
  };
  resultsSection?: {
    summary: string;
    quantitativeMetrics: string[];
    mechanismsAndDiscoveries: string[];
    bulletPoints: string[];
  };
  futureDirectionsSection?: {
    summary: string;
    highPriorityRoadmap: string[];
    unresolvedQuestions: string[];
    scalingRoadblocks?: string[];
    bulletPoints: string[];
  };
  validationPackage: ValidationPackage;
  dimensions: {
    objective: PaperDimensionSection;
    researchGap: PaperDimensionSection;
    methodology: PaperDimensionSection;
    findings: PaperDimensionSection;
    futureGaps: PaperDimensionSection;
  };
  analyzedAt: string;
  modelUsed: string;
  apiKeyStatus?: 'valid' | 'missing' | 'fallback';
  apiKeyMessage?: string;
  sourceType?: 'pdf' | 'text';
  fileName?: string;
}

export type EngineeringDiscipline =
  | 'All'
  | 'Aerospace & Hypersonics'
  | 'Solid Mechanics & Structures'
  | 'Fluids & Thermal Sciences'
  | 'Metamaterials & Advanced Composites'
  | 'Biomechanics & Biomaterials'
  | 'Robotics & Control Systems'
  | 'Computational FEA & CFD';

export interface QuestionReply {
  id: string;
  authorName: string;
  authorRole?: string;
  authorAffiliation?: string;
  authorEmail?: string;
  isDirector?: boolean;
  likes?: number;
  dislikes?: number;
  isAI?: boolean;
  createdAt: string;
  content: string;
  endorsedByPI?: boolean;
}

export interface EngineeringQuestion {
  id: string;
  title: string;
  discipline: string;
  authorName: string;
  authorAffiliation?: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  status: string;
  upvotes: number;
  tags: string[];
  replies: QuestionReply[];
}

export interface VttCue {
  startTime: number;
  endTime: number;
  startFormatted: string;
  endFormatted: string;
  speaker?: string;
  text: string;
}

export interface VttTrack {
  id: string;
  language: string;
  label: string;
  kind: 'subtitles' | 'captions';
  src?: string;
  vttUrl?: string;
  vttContent?: string;
  default?: boolean;
  cues?: VttCue[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
  modelUsed?: string;
  isError?: boolean;
}
