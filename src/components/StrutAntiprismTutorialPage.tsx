import React, { useState, useEffect } from 'react';
import {
  PLATE_ANTIPRISM_VIDEOS,
  STRUT_ANTIPRISM_VIDEOS,
  GOOGLE_DRIVE_PLATE_FOLDER,
  GOOGLE_DRIVE_STRUT_FOLDER,
} from '../data/initialData';
import { VideoTutorial } from '../types';
import { TutorialVideoPlayer } from './TutorialVideoPlayer';
import {
  ArrowLeft,
  Play,
  Download,
  ExternalLink,
  FolderOpen,
  CheckCircle2,
  Circle,
  Code2,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  Layers,
  Terminal,
  FileCode,
  Shield,
  Activity,
  Sparkles,
  ChevronRight,
  Maximize2,
  GraduationCap,
  ListChecks,
  Info,
  Share2,
  AlertTriangle,
  Boxes
} from 'lucide-react';

interface StrutAntiprismTutorialPageProps {
  initialCategory?: 'plate' | 'strut';
  onBack: () => void;
  onNotify?: (message: string) => void;
}

export const StrutAntiprismTutorialPage: React.FC<StrutAntiprismTutorialPageProps> = ({
  initialCategory = 'strut',
  onBack,
  onNotify
}) => {
  const [tutorialType, setTutorialType] = useState<'plate' | 'strut'>(initialCategory);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'manual' | 'python' | 'checklist' | 'faq'>('manual');

  // Sync when initialCategory changes
  useEffect(() => {
    setTutorialType(initialCategory);
    setSelectedPartIndex(0);
  }, [initialCategory]);

  const activeVideos: VideoTutorial[] = tutorialType === 'plate' ? PLATE_ANTIPRISM_VIDEOS : STRUT_ANTIPRISM_VIDEOS;
  const activeDriveFolder: string = tutorialType === 'plate' ? GOOGLE_DRIVE_PLATE_FOLDER : GOOGLE_DRIVE_STRUT_FOLDER;
  const currentVideo: VideoTutorial = activeVideos[selectedPartIndex] || activeVideos[0];

  const storagePrefix = tutorialType === 'plate' ? 'plate_tutorial' : 'strut_tutorial';

  const [completedParts, setCompletedParts] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`${storagePrefix}_completed`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`${storagePrefix}_checklist`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Reload progress when tutorialType changes
  useEffect(() => {
    try {
      const savedParts = localStorage.getItem(`${storagePrefix}_completed`);
      setCompletedParts(savedParts ? JSON.parse(savedParts) : {});
      const savedChecklist = localStorage.getItem(`${storagePrefix}_checklist`);
      setChecklistState(savedChecklist ? JSON.parse(savedChecklist) : {});
    } catch {
      // ignore
    }
  }, [tutorialType, storagePrefix]);

  const togglePartCompletion = (partNum: number) => {
    setCompletedParts((prev) => {
      const nextVal = !prev[partNum];
      const updated = { ...prev, [partNum]: nextVal };
      try {
        localStorage.setItem(`${storagePrefix}_completed`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (onNotify) {
        onNotify(nextVal ? `Part ${partNum} marked as complete!` : `Part ${partNum} marked as incomplete`);
      }
      return updated;
    });
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistState((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`${storagePrefix}_checklist`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const completedCount = Object.values(completedParts).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / activeVideos.length) * 100);

  const handleCopyLink = async () => {
    const hash = tutorialType === 'plate' ? '#plate-antiprism-modeling' : '#strut-antiprism-modeling';
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      if (onNotify) {
        onNotify(`Direct sublink for ${tutorialType === 'plate' ? 'Plate' : 'Strut'} Antiprism Modeling copied!`);
      }
    } catch {
      // ignore
    }
  };

  const strutPythonScript = `# ==============================================================================
# SWID-SHRK Aerospace & Mechanics Laboratory — UMBC
# Strut Antiprism Modeling: Automated Abaqus/CAE 4-Part Explicit Simulation Deck
# Author: Dr. Pouria Hejazi Rekavandi & Lab Research Team
# Google Drive Folder: 1MC6Nr6kH6i4mspvWFXUC22qdluSqrzln
# ==============================================================================

from abaqus import *
from abaqusConstants import *
import part, material, section, assembly, step, interaction, load, mesh, math

# 1. PARAMETRIC TOPOLOGY CONSTANTS
R_TOP = 15.0       # Radius of upper polygonal ring (mm)
R_BOT = 15.0       # Radius of lower polygonal ring (mm)
H_CELL = 30.0      # Unit cell total height (mm)
TWIST_DEG = 45.0   # Relative twist angle between top & bottom planes (deg)
STRUT_R = 1.0      # Strut circular beam radius (mm)
NUM_VERTS = 4      # 4-fold antiprism symmetry (tetragonal)

theta_twist = math.radians(TWIST_DEG)
model = mdb.models['Model-1']

# 2. CREATE DEFORMABLE WIRE / BEAM PART
cellPart = model.Part(name='Strut-AntiPrism-Cell', dimensionality=THREE_D, type=DEFORMABLE_BODY)

# Calculate polygonal vertex coordinates
bot_coords = []
top_coords = []
for i in range(NUM_VERTS):
    ang = 2.0 * math.pi * i / NUM_VERTS
    bot_coords.append((R_BOT * math.cos(ang), R_BOT * math.sin(ang), 0.0))
    top_coords.append((R_TOP * math.cos(ang + theta_twist), R_TOP * math.sin(ang + theta_twist), H_CELL))

# Generate connecting diagonal struts
for i in range(NUM_VERTS):
    p_bot1 = cellPart.DatumPointByCoordinate(coords=bot_coords[i])
    p_bot2 = cellPart.DatumPointByCoordinate(coords=bot_coords[(i+1)%NUM_VERTS])
    p_top1 = cellPart.DatumPointByCoordinate(coords=top_coords[i])
    p_top2 = cellPart.DatumPointByCoordinate(coords=top_coords[(i+1)%NUM_VERTS])
    
    # Base ring wire
    cellPart.WirePolyLine(points=((cellPart.datums[p_bot1.id], cellPart.datums[p_bot2.id]),), mergeType=MERGE)
    # Top ring wire
    cellPart.WirePolyLine(points=((cellPart.datums[p_top1.id], cellPart.datums[p_top2.id]),), mergeType=MERGE)
    # Diagonal inclined struts
    cellPart.WirePolyLine(points=((cellPart.datums[p_bot1.id], cellPart.datums[p_top1.id]),), mergeType=MERGE)
    cellPart.WirePolyLine(points=((cellPart.datums[p_bot1.id], cellPart.datums[p_top2.id]),), mergeType=MERGE)

# 3. DEFINE MATERIAL PROPERTIES (Ti-6Al-4V Bilinear Plasticity)
mat = model.Material(name='Ti6Al4V')
mat.Density(table=((4.43e-09, ), ))  # tonne/mm^3
mat.Elastic(table=((114000.0, 0.34), ))  # MPa, Poisson's ratio
mat.Plastic(table=(
    (880.0, 0.0),      # Initial yield stress
    (1050.0, 0.12),    # Plastic hardening
))

# 4. CIRCULAR BEAM PROFILE & SECTION
model.CircularProfile(name='StrutProfile', r=STRUT_R)
model.BeamSection(name='StrutSection', profile='StrutProfile', integration=BEFORE_ANALYSIS, material='Ti6Al4V')
cellPart.SectionAssignment(region=(cellPart.edges, ), sectionName='StrutSection')

# 5. DYNAMIC EXPLICIT STEP & OUTPUTS
model.ExplicitDynamicsStep(name='Crush-Step', previous='Initial', timePeriod=0.005,
    improvedDtMethod=ON, description='High-rate impact crush')

model.HistoryOutputRequest(name='Energy-History', createStepName='Crush-Step',
    variables=('ALLIE', 'ALLKE', 'ALLAE', 'ALLVD', 'ALLFD'))

print(">> SWID-SHRK Strut Antiprism model successfully generated!")`;

  const platePythonScript = `# ==============================================================================
# SWID-SHRK Aerospace & Mechanics Laboratory — UMBC
# Plate Antiprism Modeling: Automated Abaqus/CAE 2-Part Simulation Deck
# Author: Dr. Pouria Hejazi Rekavandi & Lab Research Team
# Google Drive Folder: 199sypG2Nt8LKnrE8BtUrJG_fl7FqeIe-
# ==============================================================================

from abaqus import *
from abaqusConstants import *
import part, material, section, assembly, step, interaction, load, mesh, math

# 1. PARAMETRIC PLATE GEOMETRY CONSTANTS
R_BASE = 20.0       # Polygon base circumradius (mm)
H_CELL = 25.0       # Cellular origami height (mm)
SHELL_T = 0.5       # Plate thickness (mm)
NUM_FACETS = 4      # 4-fold antiprism symmetry
TWIST_DEG = 45.0    # Fold dihedral rotation angle

model = mdb.models['Model-1']

# 2. CREATE 3D DEFORMABLE SHELL PART (Folded Facets)
platePart = model.Part(name='Plate-AntiPrism-Cell', dimensionality=THREE_D, type=DEFORMABLE_BODY)

# 3. DEFINE MATERIAL PROPERTIES (Al 6061-T6 Plasticity)
mat = model.Material(name='Al6061-T6')
mat.Density(table=((2.70e-09, ), ))  # tonne/mm^3
mat.Elastic(table=((70000.0, 0.33), ))  # MPa, Poisson's ratio
mat.Plastic(table=(
    (276.0, 0.0),      # Yield stress (MPa)
    (310.0, 0.12),     # Ultimate stress
))

# 4. SHELL HOMOGENEOUS SECTION (S4R Element Formulation)
model.HomogeneousShellSection(name='PlateSection', preIntegrate=OFF,
    material='Al6061-T6', thickness=SHELL_T, thicknessType=UNIFORM)

# 5. DYNAMIC EXPLICIT STEP & GENERAL SELF-CONTACT
model.ExplicitDynamicsStep(name='Crush-Step', previous='Initial', timePeriod=0.008)
model.ContactProperty('IntProp-1')
model.interactionProperties['IntProp-1'].TangentialBehavior(formulation=PENALTY, fraction=0.20)
model.interactionProperties['IntProp-1'].NormalBehavior(pressureOverclosure=HARD)
model.GeneralContactExplicit(name='SelfContact', createStepName='Crush-Step',
    contactProperty='IntProp-1')

print(">> SWID-SHRK Plate Antiprism model successfully generated!")`;

  const activePythonScript = tutorialType === 'plate' ? platePythonScript : strutPythonScript;

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(activePythonScript);
      }
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
      if (onNotify) {
        onNotify(`Python script for ${tutorialType === 'plate' ? 'Plate' : 'Strut'} Antiprism copied!`);
      }
    } catch {
      // ignore
    }
  };

  const strutChecklistItems = [
    {
      id: 'strut-1',
      title: 'Unit Cell Coordinate & Symmetry Verification',
      desc: 'Verify polygon base and top ring coordinate vertices. Confirm relative twist rotation θ = 45° across the 4-fold diagonal.',
      part: 1
    },
    {
      id: 'strut-2',
      title: 'Truss Alignment & Beam Normal Vectors',
      desc: 'Assign orientation vectors (n1, n2) to ensure consistent moment of inertia for beam bending stiffness calculations.',
      part: 2
    },
    {
      id: 'strut-3',
      title: 'Constitutive Plasticity & Rate Sensitivity Data',
      desc: 'Input true stress vs plastic strain in consistent units (tonne/mm³, MPa). Verify yield stress and hardening modulus.',
      part: 2
    },
    {
      id: 'strut-4',
      title: 'Enhanced Hourglass Control on Hex C3D8R Elements',
      desc: 'Activate Enhanced Hourglass Control to suppress spurious zero-energy deformation modes during strut plastic collapse.',
      part: 3
    },
    {
      id: 'strut-5',
      title: 'General Self-Contact Penalty Formulation',
      desc: 'Include all exterior strut surfaces in Abaqus Explicit general contact with penalty friction μ = 0.20 to prevent self-penetration.',
      part: 3
    },
    {
      id: 'strut-6',
      title: 'Quasi-Static Verification (ALLKE / ALLIE < 5%)',
      desc: 'Verify energy curves: Kinetic Energy (ALLKE) must stay below 5% of Internal Energy (ALLIE) to confirm quasi-static collapse.',
      part: 4
    },
    {
      id: 'strut-7',
      title: 'Hourglass Energy Verification (ALLAE / ALLIE < 5%)',
      desc: 'Ensure artificial strain energy (ALLAE) remains negligible compared to total strain energy.',
      part: 4
    },
    {
      id: 'strut-8',
      title: 'Specific Energy Absorption (SEA) Extraction',
      desc: 'Integrate the crushing reaction force vs. displacement curve: SEA = ∫ F dδ / mass. Compare against standard cylindrical tubes.',
      part: 4
    }
  ];

  const plateChecklistItems = [
    {
      id: 'plate-1',
      title: 'Parametric Fold Geometry & Dihedral Angles',
      desc: 'Verify triangular and trapezoidal facet vertex alignment and fold dihedral angles forming the antiprism cellular unit cell.',
      part: 1
    },
    {
      id: 'plate-2',
      title: 'Shell Thickness & S4R Element Formulation',
      desc: 'Assign uniform shell thickness (t = 0.5 mm) with S4R reduced-integration doubly curved shell elements.',
      part: 1
    },
    {
      id: 'plate-3',
      title: 'Fold Crease Plastic Hinge Calibration',
      desc: 'Model localized plastic hinge behavior along fold creases using elastoplastic constitutive relationships (Al 6061-T6).',
      part: 2
    },
    {
      id: 'plate-4',
      title: 'Facet-to-Facet Contact Interaction',
      desc: 'Configure Abaqus Explicit General Contact with penalty normal and tangential friction to model facet contact upon collapse.',
      part: 2
    },
    {
      id: 'plate-5',
      title: 'Rigid Impactor Prescribed Velocity Boundary Condition',
      desc: 'Assign smooth amplitude velocity to the top rigid plate and encastre constraints to the base support plate.',
      part: 2
    },
    {
      id: 'plate-6',
      title: 'Folded Cell Energy Absorption & CFE Metrics',
      desc: 'Compute Crush Force Efficiency (CFE = F_mean / F_peak) and total internal deformation energy (ALLIE).',
      part: 2
    }
  ];

  const activeChecklistItems = tutorialType === 'plate' ? plateChecklistItems : strutChecklistItems;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Breadcrumbs Bar */}
      <div className="p-4 sm:p-6 rounded-2xl dark:bg-[#070c14]/90 bg-white border dark:border-zinc-800 border-slate-200 shadow-xl space-y-4">
        {/* Navigation Breadcrumb and Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b dark:border-zinc-800 border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg dark:bg-zinc-900 bg-slate-100 hover:dark:bg-zinc-800 hover:bg-slate-200 border dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-700 transition-all cursor-pointer font-bold shadow-xs group"
              title="Return to Research Curriculum Modules"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-sky-400" />
              <span>Back to Research Overview</span>
            </button>
            <span className="dark:text-zinc-600 text-slate-300">/</span>
            <span className="dark:text-zinc-400 text-slate-500 hidden sm:inline">Module III: AntiPrism Metamaterials</span>
            <span className="dark:text-zinc-600 text-slate-300 hidden sm:inline">/</span>
            <span className="dark:text-[#00ff41] text-emerald-600 font-bold">
              {tutorialType === 'plate' ? 'Plate Antiprism Modeling' : 'Strut Antiprism Modeling'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono dark:bg-sky-950/40 bg-sky-50 dark:text-sky-300 text-sky-700 border dark:border-sky-500/40 border-sky-300 hover:border-sky-400 transition-all cursor-pointer shadow-xs"
              title={`Copy direct sublink to #${tutorialType === 'plate' ? 'plate-antiprism-modeling' : 'strut-antiprism-modeling'}`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Sublink Copied!' : `Sublink: #${tutorialType === 'plate' ? 'plate-antiprism-modeling' : 'strut-antiprism-modeling'}`}</span>
            </button>

            <a
              href={activeDriveFolder}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono dark:bg-amber-950/40 bg-amber-50 dark:text-amber-300 text-amber-800 border dark:border-amber-500/40 border-amber-300 hover:border-amber-400 transition-all shadow-xs"
              title="Open Google Drive folder containing all tutorial videos"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Google Drive</span>
              <span>Folder ({activeVideos.length} Videos)</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Dual-Track Selector: Plate Antiprism Modeling vs Strut Antiprism Modeling */}
        <div className="p-2 rounded-xl dark:bg-black/70 bg-slate-100 border dark:border-zinc-800 border-slate-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold dark:text-zinc-400 text-slate-500 uppercase tracking-wider px-2">
              Select Tutorial Track:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 flex-1 sm:max-w-md">
            {/* Plate Antiprism Modeling Button */}
            <button
              type="button"
              onClick={() => {
                setTutorialType('plate');
                setSelectedPartIndex(0);
                window.history.replaceState(null, '', '#plate-antiprism-modeling');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tutorialType === 'plate'
                  ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-[0_0_15px_rgba(0,255,65,0.35)] ring-1 ring-emerald-400'
                  : 'dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 hover:border-sky-500 border dark:border-zinc-800 border-slate-300'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Plate Antiprism</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                tutorialType === 'plate' ? 'bg-black/20 text-black font-semibold' : 'dark:bg-zinc-800 bg-slate-200 text-zinc-400'
              }`}>
                2 Parts
              </span>
            </button>

            {/* Strut Antiprism Modeling Button */}
            <button
              type="button"
              onClick={() => {
                setTutorialType('strut');
                setSelectedPartIndex(0);
                window.history.replaceState(null, '', '#strut-antiprism-modeling');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tutorialType === 'strut'
                  ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-[0_0_15px_rgba(0,255,65,0.35)] ring-1 ring-emerald-400'
                  : 'dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 hover:border-sky-500 border dark:border-zinc-800 border-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Strut Antiprism</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                tutorialType === 'strut' ? 'bg-black/20 text-black font-semibold' : 'dark:bg-zinc-800 bg-slate-200 text-zinc-400'
              }`}>
                4 Parts
              </span>
            </button>
          </div>
        </div>

        {/* Hero Title & Student Progress Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold dark:bg-emerald-950/60 bg-emerald-50 border dark:border-[#00ff41]/40 border-emerald-400 dark:text-[#00ff41] text-emerald-800 shadow-[0_0_15px_rgba(0,255,65,0.15)]">
              <GraduationCap className="w-4 h-4 text-[#00ff41]" />
              <span>Abaqus CAE Student Follow-Along Workshop &bull; {tutorialType === 'plate' ? 'Plate Antiprism Modeling' : 'Strut Antiprism Modeling'}</span>
            </div>
            <h1 className="font-section-title text-2xl sm:text-3xl md:text-4xl font-bold dark:text-white text-slate-900 tracking-wide uppercase">
              {tutorialType === 'plate' ? 'Plate Antiprism Modeling' : 'Strut Antiprism Modeling'}{' '}
              <span className="dark:text-[#00ff41] text-emerald-600">//</span>{' '}
              {activeVideos.length}-Part Series
            </h1>
            <p className="text-xs sm:text-sm dark:text-zinc-300 text-slate-600 font-mono leading-relaxed">
              {tutorialType === 'plate'
                ? 'Comprehensive laboratory guide on parametric folded facet geometry, shell section formulations, fold crease plasticity, and dynamic explicit crush simulations.'
                : 'Step-by-step masterclass covering unit cell geometric wireframing, elastoplastic material calibration, C3D8R solid strut meshing, and crashworthiness SEA evaluation.'}
            </p>
          </div>

          {/* Student Progress Milestone Widget */}
          <div className="p-4 rounded-xl dark:bg-black/60 bg-slate-50 border dark:border-zinc-800 border-slate-200 shrink-0 min-w-[260px] space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="dark:text-zinc-400 text-slate-600 font-semibold uppercase tracking-wider">
                Tutorial Progress
              </span>
              <span className="font-bold dark:text-[#00ff41] text-emerald-700">
                {completedCount} of {activeVideos.length} Parts ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full dark:bg-zinc-800 bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-[#00ff41] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#00ff41]" />
                {completedCount === activeVideos.length ? 'Series Completed!' : 'In Progress'}
              </span>
              <span>{activeVideos.length} HD Videos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part Selection Navigation Strip */}
      <div className={`grid grid-cols-1 ${activeVideos.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3.5`}>
        {activeVideos.map((video, idx) => {
          const isSelected = selectedPartIndex === idx;
          const isDone = completedParts[video.part] ?? false;

          return (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelectedPartIndex(idx)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'dark:bg-gradient-to-b dark:from-[#081522] dark:to-[#040c14] bg-sky-50/90 dark:border-[#00ff41] border-emerald-500 ring-2 ring-emerald-500/20 shadow-[0_8px_25px_rgba(0,0,0,0.35),0_0_15px_rgba(0,255,65,0.2)]'
                  : 'dark:bg-[#090e15] bg-white dark:border-zinc-800 border-slate-200 hover:border-sky-500/70 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-orbitron text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#00ff41] text-black shadow-[0_0_10px_rgba(0,255,65,0.6)]'
                        : 'dark:bg-zinc-800 bg-slate-100 dark:text-zinc-300 text-slate-700'
                    }`}
                  >
                    0{video.part}
                  </span>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm dark:text-white text-slate-900 group-hover:text-sky-500 transition-colors">
                      Part {video.part}
                    </h3>
                    <span className="text-[10px] font-mono text-amber-500 dark:text-amber-400">
                      {video.duration}
                    </span>
                  </div>
                </div>

                {/* Mark Complete Checkbox in Header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePartCompletion(video.part);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      togglePartCompletion(video.part);
                    }
                  }}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isDone
                      ? 'dark:bg-emerald-950/70 bg-emerald-100 border-emerald-500 text-[#00ff41]'
                      : 'dark:bg-zinc-900 bg-slate-100 dark:border-zinc-700 border-slate-300 text-zinc-400 hover:text-white'
                  }`}
                  title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
              </div>

              <p className="text-xs font-mono dark:text-zinc-300 text-slate-600 line-clamp-2 mt-1">
                {video.description}
              </p>

              <div className="mt-3 pt-2.5 border-t dark:border-zinc-800/80 border-slate-200 flex items-center justify-between text-[11px] font-mono">
                <span className="dark:text-zinc-400 text-slate-500 flex items-center gap-1">
                  <Play className={`w-3 h-3 ${isSelected ? 'text-[#00ff41]' : 'text-sky-400'}`} />
                  {isSelected ? 'Currently Viewing' : 'Click to Load'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isDone ? 'text-emerald-400 font-bold' : 'text-zinc-500'
                }`}>
                  {isDone ? 'Completed' : 'Pending'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Student Stage: Left Cinema Player, Right Action & Quick Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High-Resolution Video Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black border dark:border-zinc-800 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl">
            {/* Viewport Top HUD Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 text-[#00ff41] fill-[#00ff41]" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm sm:text-base text-white truncate flex items-center gap-2">
                    <span>{currentVideo.title}</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono">
                    <span className="text-amber-400 font-semibold">{currentVideo.duration}</span>
                    <span className="text-zinc-500">&bull;</span>
                    <span className="text-zinc-400">1080p High-Res Stream</span>
                  </div>
                </div>
              </div>

              {/* Video Quick Actions: Drive View & Direct Download */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={currentVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-200 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,184,255,0.2)]"
                  title="Open video in Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>Drive View</span>
                </a>
                <a
                  href={currentVideo.downloadUrl || currentVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,255,65,0.25)]"
                  title="Download MP4 video directly"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download MP4</span>
                </a>
              </div>
            </div>

            {/* Video Player Frame with 5-Second Fade-In Transition */}
            <TutorialVideoPlayer
              video={currentVideo}
              trackLabel={tutorialType === 'plate' ? 'Plate Antiprism' : 'Strut Antiprism'}
              onNotify={onNotify}
            />

            {/* Video Controls & Next/Prev Part Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartIndex((prev) => Math.max(0, prev - 1))}
                  disabled={selectedPartIndex === 0}
                  className="px-3 py-1.5 rounded-lg dark:bg-zinc-900 bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-sky-400 transition-all cursor-pointer"
                >
                  &larr; Previous Part
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPartIndex((prev) => Math.min(activeVideos.length - 1, prev + 1))}
                  disabled={selectedPartIndex === activeVideos.length - 1}
                  className="px-3 py-1.5 rounded-lg dark:bg-zinc-900 bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-sky-400 transition-all cursor-pointer"
                >
                  Next Part &rarr;
                </button>
              </div>

              <button
                type="button"
                onClick={() => togglePartCompletion(currentVideo.part)}
                className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  completedParts[currentVideo.part]
                    ? 'bg-emerald-500/20 border border-emerald-500 text-[#00ff41]'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-[#00ff41] hover:text-[#00ff41]'
                }`}
              >
                {completedParts[currentVideo.part] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
                    <span>Completed (Click to Undo)</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark Part {currentVideo.part} Completed</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Course Outline & Student Objectives */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl dark:bg-[#070c14] bg-white border dark:border-zinc-800 border-slate-200 shadow-xl space-y-4">
            <h4 className="font-section-title text-xs font-bold uppercase tracking-wider dark:text-[#00ff41] text-emerald-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Current Session Overview</span>
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl dark:bg-black/40 bg-slate-50 border dark:border-zinc-800/80 border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-bold text-sky-400">Active Part:</span>
                  <span className="font-bold text-white">Part {currentVideo.part} of {activeVideos.length}</span>
                </div>
                <div className="text-zinc-300 font-semibold">{currentVideo.title}</div>
                <p className="text-[11px] dark:text-zinc-400 text-slate-500 leading-relaxed">
                  {currentVideo.description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold dark:text-zinc-400 text-slate-500">
                  Student Learning Goals:
                </span>
                <ul className="space-y-1.5 text-[11px] dark:text-zinc-300 text-slate-600">
                  {tutorialType === 'plate' ? (
                    currentVideo.part === 1 ? (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Establish 3D coordinate geometry for folding triangular/trapezoidal antiprism facets.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Create homogeneous shell section definitions with thickness t = 0.5 mm.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Impose kinematic crease constraints across folding facet boundaries.</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Discretize plate facets with S4R doubly-curved shell elements with hourglass control.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Formulate general self-contact to accommodate progressive facet-on-facet compaction.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Extract reaction force history and verify specific energy absorption (SEA).</span>
                        </li>
                      </>
                    )
                  ) : (
                    currentVideo.part === 1 ? (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Calculate polygonal vertex coordinates with relative rotation angle &theta; = 45&deg;.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Construct 3D wireframe truss lines and reference datum points in Abaqus/CAE.</span>
                        </li>
                      </>
                    ) : currentVideo.part === 2 ? (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Assign titanium alloy Ti-6Al-4V elastoplastic material model (density, modulus, yield).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Define circular beam profiles and assign cross-sectional orientations.</span>
                        </li>
                      </>
                    ) : currentVideo.part === 3 ? (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Perform solid / beam mesh discretization with C3D8R hex elements.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Set up enhanced hourglass control and general self-contact interaction penalty.</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Execute Abaqus Explicit dynamic crush step with prescribed impact velocity (v = 10 m/s).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#00ff41] font-bold">&bull;</span>
                          <span>Extract ALLIE, ALLKE, ALLAE history output and compute Specific Energy Absorption (SEA).</span>
                        </li>
                      </>
                    )
                  )}
                </ul>
              </div>

              {/* Quick Drive Download & Resource Button */}
              <div className="pt-2">
                <a
                  href={currentVideo.downloadUrl || currentVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl dark:bg-emerald-950/40 bg-emerald-50 dark:hover:bg-emerald-950/70 hover:bg-emerald-100 border dark:border-emerald-500/50 border-emerald-400 text-emerald-700 dark:text-[#00ff41] flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Part {currentVideo.part} File</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Spec Card */}
          <div className="p-4 rounded-xl dark:bg-[#070c14] bg-white border dark:border-zinc-800 border-slate-200 text-xs font-mono space-y-2">
            <span className="font-bold uppercase tracking-wider text-sky-400 text-[10px]">
              Recommended Simulation Environment
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 text-[9px]">SOLVER</div>
                <div className="text-white font-semibold">Abaqus Explicit</div>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 text-[9px]">ELEMENT TYPE</div>
                <div className="text-white font-semibold">{tutorialType === 'plate' ? 'S4R Shell' : 'C3D8R Hex / B31'}</div>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 text-[9px]">TIME PERIOD</div>
                <div className="text-white font-semibold">{tutorialType === 'plate' ? '0.008 s' : '0.005 s'}</div>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 text-[9px]">CRUSH VELOCITY</div>
                <div className="text-white font-semibold">10.0 m/s</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Interactive Laboratory Resources: Manual, Python Scripts, QA Checklist, FAQ */}
      <div className="p-5 sm:p-6 rounded-2xl dark:bg-[#070c14]/90 bg-white border dark:border-zinc-800 border-slate-200 shadow-xl space-y-6">
        {/* Resource Tabs Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b dark:border-zinc-800 border-slate-200">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-[0_0_15px_rgba(0,255,65,0.35)]'
                  : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:border-sky-500 border dark:border-zinc-800 border-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Step-by-Step Lab Manual</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('python')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'python'
                  ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-[0_0_15px_rgba(0,255,65,0.35)]'
                  : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:border-sky-500 border dark:border-zinc-800 border-slate-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Python Automation Script</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'checklist'
                  ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-[0_0_15px_rgba(0,255,65,0.35)]'
                  : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:border-sky-500 border dark:border-zinc-800 border-slate-300'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>Self-Check Verification QA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'dark:bg-[#00ff41] bg-emerald-600 text-black shadow-[0_0_15px_rgba(0,255,65,0.35)]'
                  : 'dark:bg-zinc-900 bg-slate-100 dark:text-zinc-300 text-slate-700 hover:border-sky-500 border dark:border-zinc-800 border-slate-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Student FAQ &amp; Troubleshooting</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-400">
            SWID-SHRK FEA Toolkit &bull; {tutorialType === 'plate' ? 'Plate Antiprism' : 'Strut Antiprism'}
          </span>
        </div>

        {/* Tab 1: Step-by-Step Lab Manual */}
        {activeTab === 'manual' && (
          <div className="space-y-6 text-xs font-mono leading-relaxed">
            {tutorialType === 'plate' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plate Part 1 Walkthrough Card */}
                <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 text-sm">Phase 1: Origami Facet Geometry &amp; Shell Assignment</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800">Part 1</span>
                  </div>
                  <p className="text-zinc-300">
                    In the <strong>Part Module</strong>, synthesize folded facet surfaces. Define perimeter vertices on upper and lower polygon rings, calculating the crease dihedral angle &theta;.
                  </p>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-emerald-400 space-y-1">
                    <div>Shell Element: S4R (4-node doubly curved shell)</div>
                    <div>Thickness: t = 0.50 mm (Uniform)</div>
                    <div>Material: Al 6061-T6 (E = 70 GPa, &nu; = 0.33, &sigma;_y = 276 MPa)</div>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Ensure normal vectors point outwards consistently so contact thickness offsets are computed correctly in explicit solvers.
                  </p>
                </div>

                {/* Plate Part 2 Walkthrough Card */}
                <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm">Phase 2: Contact, Meshing &amp; Explicit Crushing</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">Part 2</span>
                  </div>
                  <p className="text-zinc-300">
                    In <strong>Interaction &amp; Step Modules</strong>, define General Contact with self-contact. Set up dynamic explicit step with time period T = 0.008 s.
                  </p>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-amber-400 space-y-1">
                    <div>Contact: Hard Normal + Penalty Friction (&mu; = 0.20)</div>
                    <div>Crushing Velocity: v_y = -10,000 mm/s</div>
                    <div>Outputs: ALLIE (Internal), ALLKE (Kinetic), RF2 (Force)</div>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Plot force vs. stroke in Abaqus/Viewer to determine Specific Energy Absorption (SEA) and plateau crush force efficiency (CFE).
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Strut Part 1 Walkthrough Card */}
                <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 text-sm">Phase 1: Wireframing</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800">Part 1</span>
                  </div>
                  <p className="text-zinc-300">
                    Define 3D Deformable Wire features. Place datum points at polygon vertices using:
                  </p>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-emerald-400 space-y-1">
                    <div>x_bot = R * cos(2&pi;*i/N)</div>
                    <div>y_bot = R * sin(2&pi;*i/N)</div>
                    <div>x_top = R * cos(2&pi;*i/N + &theta;)</div>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Connect diagonal edges between bottom polygon node (i) and top polygon nodes (i, i+1).
                  </p>
                </div>

                {/* Strut Part 2 Walkthrough Card */}
                <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm">Phase 2: Plasticity</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">Part 2</span>
                  </div>
                  <p className="text-zinc-300">
                    Input Ti-6Al-4V elastoplastic constitutive properties and beam profile sections:
                  </p>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-amber-400 space-y-1">
                    <div>&rho; = 4.43e-9 tonne/mm&sup3;</div>
                    <div>E = 114 GPa, &nu; = 0.34</div>
                    <div>&sigma;_y = 880 MPa, &sigma;_u = 1050 MPa</div>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Assign circular profile radius r = 1.0 mm and evaluate cross-sectional moment of inertia.
                  </p>
                </div>

                {/* Strut Part 3 Walkthrough Card */}
                <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">Phase 3: Meshing</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800">Part 3</span>
                  </div>
                  <p className="text-zinc-300">
                    Discretize solid struts with C3D8R hex elements or B31 linear beam elements:
                  </p>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-emerald-400 space-y-1">
                    <div>Element: C3D8R (Reduced Integration)</div>
                    <div>Hourglass: Enhanced Formulation</div>
                    <div>Contact: General Self-Contact (&mu;=0.2)</div>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Verify zero element interpenetrations and confirm hourglass stiffness factor.
                  </p>
                </div>

                {/* Strut Part 4 Walkthrough Card */}
                <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-400 text-sm">Phase 4: Crushing &amp; SEA</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800">Part 4</span>
                  </div>
                  <p className="text-zinc-300">
                    Apply explicit dynamic impact and calculate Specific Energy Absorption:
                  </p>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-purple-400 space-y-1">
                    <div>Step: Explicit Dynamics (T = 0.005 s)</div>
                    <div>Velocity: v_y = -10 m/s</div>
                    <div>SEA = &int; F d&delta; / mass</div>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Verify ALLKE &lt; 5% ALLIE to confirm purely quasi-static progressive crush.
                  </p>
                </div>
              </div>
            )}

            {/* Engineering Formulae & Material Parameters Table */}
            <div className="p-4 rounded-xl dark:bg-black/40 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Reference Crashworthiness Equations for AntiPrism Topologies</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-sky-400 font-bold">Specific Energy Absorption (SEA)</div>
                  <div className="text-zinc-300">SEA = E_absorbed / m = [ &int; F(&delta;) d&delta; ] / (&rho; &bull; V)</div>
                  <p className="text-zinc-400 text-[10px]">Higher SEA indicates superior mass efficiency in aerospace impact attenuation.</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-emerald-400 font-bold">Crush Force Efficiency (CFE)</div>
                  <div className="text-zinc-300">CFE = F_mean / F_peak &times; 100%</div>
                  <p className="text-zinc-400 text-[10px]">AntiPrism topologies achieve CFE &gt; 80%, avoiding harmful deceleration force spikes.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Python Automation Script */}
        {activeTab === 'python' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00ff41]" />
                  <span>Abaqus Python Script Generator ({tutorialType === 'plate' ? 'plate_antiprism_generator.py' : 'strut_antiprism_generator.py'})</span>
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Execute directly in Abaqus/CAE via File &rarr; Run Script or CLI: <code>abaqus cae script={tutorialType === 'plate' ? 'plate_antiprism_generator.py' : 'strut_antiprism_generator.py'}</code>
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41] text-[#00ff41] transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,65,0.2)]"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Python Script'}</span>
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-[#05090e]">
              <div className="p-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Python 3.10 &bull; Abaqus Scripting Interface (ASI) &bull; {tutorialType.toUpperCase()} MODELING</span>
                <span className="text-emerald-400 font-semibold">Ready for Abaqus 2024 / 2023 / 2022</span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-[460px] scrollbar-thin">
                <code>{activePythonScript}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Self-Check Verification QA */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b dark:border-zinc-800 border-slate-200">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-[#00ff41]" />
                  <span>Interactive Student Model Verification Checklist</span>
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Verify these {activeChecklistItems.length} criteria before running long explicit crash simulations or submitting laboratory homework.
                </p>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[#00ff41] font-bold">
                {Object.values(checklistState).filter(Boolean).length} of {activeChecklistItems.length} Checked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeChecklistItems.map((item) => {
                const isChecked = checklistState[item.id] ?? false;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs font-mono flex items-start gap-3 select-none ${
                      isChecked
                        ? 'dark:bg-emerald-950/30 bg-emerald-50/80 dark:border-emerald-500/60 border-emerald-400 text-white'
                        : 'dark:bg-zinc-900/50 bg-white dark:border-zinc-800 border-slate-200 text-zinc-300 hover:border-sky-500/60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border mt-0.5 transition-all ${
                        isChecked
                          ? 'bg-[#00ff41] border-[#00ff41] text-black font-bold'
                          : 'border-zinc-700 bg-zinc-800/80 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold ${isChecked ? 'text-emerald-400 dark:text-[#00ff41]' : 'text-white'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 shrink-0">
                          Part {item.part}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Student FAQ & Troubleshooting */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Frequently Encountered Student Simulation Issues ({tutorialType === 'plate' ? 'Plate' : 'Strut'} Antiprism)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Error: &ldquo;Time increment required is less than minimum specified&rdquo;</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  <strong>Cause:</strong> Severe local element distortion decreases the critical stability limit &Delta;t = L_min / c_d below the threshold.
                </p>
                <p className="text-zinc-400 text-[11px]">
                  <strong>Fix:</strong> Apply element distortion control (Mesh &rarr; Element Type &rarr; Distortion Control) and verify mass scaling factor is appropriate.
                </p>
              </div>

              <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hourglassing distortion in reduced integration elements</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  <strong>Cause:</strong> Single integration point elements (C3D8R, S4R) can undergo zero-strain deformation modes.
                </p>
                <p className="text-zinc-400 text-[11px]">
                  <strong>Fix:</strong> Switch hourglass control from &ldquo;Standard&rdquo; to &ldquo;Enhanced&rdquo; in Element Type settings.
                </p>
              </div>

              <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-2">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>How to verify quasi-static equilibrium in Abaqus Explicit?</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  Plot Kinetic Energy (ALLKE) alongside Total Internal Energy (ALLIE). If ALLKE &lt; 5% of ALLIE throughout the crushing displacement, inertial wave effects are negligible and the simulation is strictly quasi-static.
                </p>
              </div>

              <div className="p-4 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-2">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Facets or struts penetrating each other upon collapse?</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  Under large plastic buckling, contact occurs across multiple cell faces. Ensure you select <strong>&ldquo;Include all surfaces in general contact&rdquo;</strong> (self-contact) with a penalty friction coefficient of &mu; = 0.20 and hard normal contact.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions & Next Steps */}
      <div className="p-4 sm:p-5 rounded-2xl dark:bg-[#070c14] bg-white border dark:border-zinc-800 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl dark:bg-zinc-900 bg-slate-100 hover:dark:bg-zinc-800 hover:bg-slate-200 border dark:border-zinc-700 border-slate-300 dark:text-zinc-200 text-slate-700 font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Research Curriculum</span>
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={activeDriveFolder}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-white font-bold transition-all"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>Open {tutorialType === 'plate' ? 'Plate' : 'Strut'} Antiprism Google Drive Folder</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
