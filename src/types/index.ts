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
  embedUrl?: string;
  driveId?: string;
  downloadUrl?: string;
  description: string;
  duration?: string;
  seriesId?: 'plate' | 'strut' | 'origami';
  seriesName?: string;
  folderUrl?: string;
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

export type TabKey = 'home' | 'team' | 'research' | 'publications' | 'students' | 'gear' | 'abaqus' | 'chat' | 'qa' | 'contact';

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
  content: string;
  createdAt: string;
  likes: number;
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

