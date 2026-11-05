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

export interface VttCue {
  id?: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  startFormatted: string; // e.g. "00:05.000"
  endFormatted: string; // e.g. "00:15.000"
  text: string;
  speaker?: string;
}

export interface VttTrack {
  id: string;
  label: string;
  language: string;
  kind: 'subtitles' | 'captions';
  default?: boolean;
  vttUrl?: string;
  vttContent: string;
  cues: VttCue[];
}

export interface VideoTutorial {
  id: string;
  title: string;
  part: number;
  url: string;
  embedUrl?: string;
  driveId?: string;
  downloadUrl?: string;
  description: string;
  duration?: string;
  seriesId?: 'plate' | 'strut' | 'origami';
  seriesName?: string;
  folderUrl?: string;
  vttTrack?: VttTrack;
  vttTracks?: VttTrack[];
}

export interface TutorialSeries {
  id: 'plate' | 'strut' | 'origami';
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  folderUrl: string;
  videos: VideoTutorial[];
}

export type TeamRoleCategory = 'all' | 'pi' | 'postdoc' | 'phd' | 'msc' | 'alumni';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'pi' | 'postdoc' | 'phd' | 'msc' | 'alumni';
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

export type TabKey = 'home' | 'team' | 'research' | 'publications' | 'analyzer' | 'students' | 'gear' | 'abaqus' | 'chat' | 'qa' | 'contact';

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

export interface ReferenceGapItem {
  reference: string;
  priorFindingOrAssumption: string;
  extractedGapOrVoid: string;
}

export interface MaterialPropertyItem {
  name: string;
  symbol: string;
  value: string;
  unit: string;
  description?: string;
}

export interface GeometricPropertyItem {
  feature: string;
  dimension: string;
  tolerance?: string;
  notes?: string;
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
  paperList?: { title: string; authors: string; year?: string }[];
  citationTag?: string;
  executiveSummary: string;
  criticalTakeaway: string;
  keywords: string[];

  // 6 Core Academic Sections specified by user:
  // 1. Name of the chosen papers
  paperNameSection: {
    title: string;
    authors: string;
    journalOrConference?: string;
    publicationYear?: string;
    citation: string;
    paperList?: { title: string; authors: string; year?: string }[];
  };

  // 2. Purpose of the papers
  purposeSection: {
    summary: string;
    hypotheses: string[];
    targetSystems: string[];
    engineeringScope: string;
    bulletPoints: string[];
  };

  // 3. Research gap and how the gap extracted from the references
  researchGapSection: {
    summary: string;
    extractedFromReferences: ReferenceGapItem[];
    theoreticalVoids: string[];
    bulletPoints: string[];
  };

  // 4. How to achieve the results (Methods, instruments, facilities and so on.. )
  methodsAndFacilitiesSection: {
    summary: string;
    facilitiesAndInstruments: string[];
    testingStandards: string[];
    computationalSolvers: string[];
    specimensAndMaterials: string[];
    bulletPoints: string[];
  };

  // 5. Results
  resultsSection: {
    summary: string;
    quantitativeMetrics: string[];
    mechanismsAndDiscoveries: string[];
    bulletPoints: string[];
  };

  // 6. Propose Future directions
  futureDirectionsSection: {
    summary: string;
    highPriorityRoadmap: string[];
    unresolvedQuestions: string[];
    bulletPoints: string[];
  };

  // Backward compatibility alias for legacy dimension access
  dimensions: {
    objective: PaperDimensionSection;
    researchGap: PaperDimensionSection;
    methodology: PaperDimensionSection;
    findings: PaperDimensionSection;
    futureGaps: PaperDimensionSection;
  };

  // Benchmark Validation & Replication Package placed at the end:
  validationPackage: ValidationPackage;

  analyzedAt: string;
  modelUsed: string;
  sourceType: 'pdf' | 'text' | 'multi';
  fileName?: string;
  apiKeyStatus?: 'valid' | 'invalid_key' | 'offline_mode';
  apiKeyMessage?: string;
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
  authorRole: string;
  authorEmail?: string;
  isDirector: boolean;
  isAI?: boolean;
  content: string;
  createdAt: string;
  likes: number;
  dislikes?: number;
}

export interface EngineeringQuestion {
  id: string;
  title: string;
  discipline: EngineeringDiscipline;
  authorName: string;
  authorAffiliation?: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  status: 'Answered by Dr. Pouria' | 'Open for Discussion' | 'Pending Review';
  upvotes: number;
  tags: string[];
  replies: QuestionReply[];
}

