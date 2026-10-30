import { VttCue, VttTrack } from '../types';

export const formatVttTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  const mmm = String(millis).padStart(3, '0');

  if (hrs > 0) {
    const hh = String(hrs).padStart(2, '0');
    return `${hh}:${mm}:${ss}.${mmm}`;
  }
  return `00:${mm}:${ss}.${mmm}`;
};

export const buildVttContent = (title: string, cues: VttCue[]): string => {
  let output = `WEBVTT - SWID-SHRK Aerospace & Mechanics Laboratory\n`;
  output += `Title: ${title}\n`;
  output += `Kind: captions\n`;
  output += `Language: en\n\n`;

  cues.forEach((cue, index) => {
    output += `${index + 1}\n`;
    output += `${cue.startFormatted} --> ${cue.endFormatted}\n`;
    if (cue.speaker) {
      output += `<v ${cue.speaker}>${cue.text}\n\n`;
    } else {
      output += `${cue.text}\n\n`;
    }
  });

  return output;
};

// -----------------------------------------------------------------------------
// Strut Antiprism Modeling — Part 1 Subtitle Track
// -----------------------------------------------------------------------------
const STRUT_PART_1_CUES: VttCue[] = [
  {
    startTime: 0,
    endTime: 8,
    startFormatted: '00:00.000',
    endFormatted: '00:08.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Welcome to the SWID-SHRK Aerospace and Mechanics Laboratory. In Part 1 of this masterclass, we explore 3D parametric geometric wireframing of the antiprism unit cell in Abaqus/CAE.'
  },
  {
    startTime: 8,
    endTime: 18,
    startFormatted: '00:08.000',
    endFormatted: '00:18.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'To begin, open Abaqus/CAE and create a 3D Deformable Wire Part named "Strut-AntiPrism-Cell". We will define coordinate vertices using parametric trigonometric relationships.'
  },
  {
    startTime: 18,
    endTime: 30,
    startFormatted: '00:18.000',
    endFormatted: '00:30.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'The geometric parameters are circumradius R_BOT = 15.0 mm for the lower polygonal ring, R_TOP = 15.0 mm for the upper ring, and a total unit cell height H = 30.0 mm.'
  },
  {
    startTime: 30,
    endTime: 42,
    startFormatted: '00:30.000',
    endFormatted: '00:42.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Notice the relative rotation angle theta_twist = 45 degrees between upper and lower planes. This relative twist induces tetragonal antiprism symmetry, which governs the multi-mode crush response.'
  },
  {
    startTime: 42,
    endTime: 56,
    startFormatted: '00:42.000',
    endFormatted: '00:56.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'We now generate reference datum points for each vertex: four on the z = 0 plane and four on the z = 30 plane, shifted by 45 degrees.'
  },
  {
    startTime: 56,
    endTime: 70,
    startFormatted: '00:56.000',
    endFormatted: '01:10.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Next, use the Wire PolyLine tool to connect the adjacent base nodes, the top ring nodes, and the inclined diagonal struts spanning between bottom and top rings.'
  },
  {
    startTime: 70,
    endTime: 85,
    startFormatted: '01:10.000',
    endFormatted: '01:25.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Always enable Merge Type = MERGE. This ensures nodal continuity at every junction so forces and bending moments transmit smoothly without artificial disconnections.'
  },
  {
    startTime: 85,
    endTime: 100,
    startFormatted: '01:25.000',
    endFormatted: '01:40.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Save the model database. We now have 8 vertices and 16 connecting struts fully indexed and ready for material calibration in Part 2.'
  }
];

// -----------------------------------------------------------------------------
// Strut Antiprism Modeling — Part 2 Subtitle Track
// -----------------------------------------------------------------------------
const STRUT_PART_2_CUES: VttCue[] = [
  {
    startTime: 0,
    endTime: 9,
    startFormatted: '00:00.000',
    endFormatted: '00:09.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Welcome back to Part 2 of Strut Antiprism Modeling. Here, we calibrate the constitutive elastoplastic material properties and beam cross-sectional orientations.'
  },
  {
    startTime: 9,
    endTime: 22,
    startFormatted: '00:09.000',
    endFormatted: '00:22.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Navigate to the Property Module. Create a new material named "Ti6Al4V". In consistent Abaqus units (tonne, mm, s, MPa), enter density rho = 4.43e-9 tonne/mm³.'
  },
  {
    startTime: 22,
    endTime: 36,
    startFormatted: '00:22.000',
    endFormatted: '00:36.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Under Mechanical > Elasticity, set Young Modulus E = 114,000 MPa and Poisson Ratio nu = 0.34. This captures the high initial stiffness of the titanium lattice struts.'
  },
  {
    startTime: 36,
    endTime: 50,
    startFormatted: '00:36.000',
    endFormatted: '00:50.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Now add Plasticity. We input true yield stress of 880 MPa at zero plastic strain, and plastic hardening up to 1050 MPa at 0.12 true plastic strain.'
  },
  {
    startTime: 50,
    endTime: 64,
    startFormatted: '00:50.000',
    endFormatted: '01:04.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Create a Profile: Select Circular Profile with radius r = 1.0 mm. Create a Beam Section assigned to this profile with integration performed before analysis.'
  },
  {
    startTime: 64,
    endTime: 80,
    startFormatted: '01:04.000',
    endFormatted: '01:20.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Crucial step: Assign Beam Section Orientation. Define local normal vector n1 for each wire so the bending moments of inertia align symmetrically across all diagonal struts.'
  },
  {
    startTime: 80,
    endTime: 95,
    startFormatted: '01:20.000',
    endFormatted: '01:35.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Verify the section assignment by checking the beam rendering in View > Part Display Options > Render Beam Profiles. Our geometry is now mechanically formulated.'
  }
];

// -----------------------------------------------------------------------------
// Strut Antiprism Modeling — Part 3 Subtitle Track
// -----------------------------------------------------------------------------
const STRUT_PART_3_CUES: VttCue[] = [
  {
    startTime: 0,
    endTime: 8,
    startFormatted: '00:00.000',
    endFormatted: '00:08.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Welcome to Part 3: Finite element mesh discretization, hourglass suppression, and explicit general self-contact formulation.'
  },
  {
    startTime: 8,
    endTime: 22,
    startFormatted: '00:08.000',
    endFormatted: '00:22.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'In the Mesh Module, seed the strut edges with an element size of 0.75 mm, giving approximately 40 elements per diagonal member to capture localized plastic hinge formation.'
  },
  {
    startTime: 22,
    endTime: 36,
    startFormatted: '00:22.000',
    endFormatted: '00:36.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'For solid representations, select C3D8R 8-node linear brick elements with reduced integration. For beam representations, use B31 Timoshenko beams.'
  },
  {
    startTime: 36,
    endTime: 52,
    startFormatted: '00:36.000',
    endFormatted: '00:52.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Under Element Type, enable Enhanced Hourglass Control. This is mandatory in Abaqus/Explicit to prevent unphysical zero-energy hourglass modes during severe strut plastic collapse.'
  },
  {
    startTime: 52,
    endTime: 68,
    startFormatted: '00:52.000',
    endFormatted: '01:08.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Move to the Interaction Module. Create an Abaqus/Explicit General Contact interaction spanning all exterior surfaces of the metamaterial.'
  },
  {
    startTime: 68,
    endTime: 85,
    startFormatted: '01:08.000',
    endFormatted: '01:25.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Assign Tangential Behavior with penalty friction coefficient mu = 0.20, and Normal Behavior with "Hard" contact pressure-overclosure. This models realistic strut-on-strut compaction.'
  },
  {
    startTime: 85,
    endTime: 98,
    startFormatted: '01:25.000',
    endFormatted: '01:38.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Check mesh verification: confirm zero aspect-ratio warnings and verify that all contact pairs are properly recognized for dynamic crushing.'
  }
];

// -----------------------------------------------------------------------------
// Strut Antiprism Modeling — Part 4 Subtitle Track
// -----------------------------------------------------------------------------
const STRUT_PART_4_CUES: VttCue[] = [
  {
    startTime: 0,
    endTime: 9,
    startFormatted: '00:00.000',
    endFormatted: '00:09.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Welcome to Part 4: Dynamic Explicit Crush Execution, Energy Balance Verification, and Specific Energy Absorption (SEA) Extraction.'
  },
  {
    startTime: 9,
    endTime: 24,
    startFormatted: '00:09.000',
    endFormatted: '00:24.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Create a Dynamic Explicit Step named "Crush-Step" with a time period of 0.005 seconds. Enable Improved dt Method to optimize the stable time increment.'
  },
  {
    startTime: 24,
    endTime: 38,
    startFormatted: '00:24.000',
    endFormatted: '00:38.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'We apply kinematic boundary conditions: fix all degrees of freedom at the bottom polygonal ring, and prescribe a downward crushing velocity v = 10.0 m/s at the top reference point.'
  },
  {
    startTime: 38,
    endTime: 54,
    startFormatted: '00:38.000',
    endFormatted: '00:54.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Request History Outputs for whole-model energy components: ALLIE (total internal energy), ALLKE (kinetic energy), ALLAE (artificial strain energy), and reaction force RF2.'
  },
  {
    startTime: 54,
    endTime: 70,
    startFormatted: '00:54.000',
    endFormatted: '01:10.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Post-processing verification: Plot ALLKE versus ALLIE. In a valid quasi-static crash analysis, kinetic energy must stay strictly below 5% of internal energy throughout the entire stroke.'
  },
  {
    startTime: 70,
    endTime: 88,
    startFormatted: '01:10.000',
    endFormatted: '01:28.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Finally, extract reaction force vs displacement. Integrate the curve using the trapezoidal rule to calculate Specific Energy Absorption: SEA = integral(F d_delta) divided by total mass.'
  },
  {
    startTime: 88,
    endTime: 102,
    startFormatted: '01:28.000',
    endFormatted: '01:42.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'This concludes the 4-part Strut Antiprism masterclass. Review the automated Python script in the laboratory repository to reproduce and optimize your multi-cell designs.'
  }
];

// -----------------------------------------------------------------------------
// Plate Antiprism Modeling — Part 1 Subtitle Track
// -----------------------------------------------------------------------------
const PLATE_PART_1_CUES: VttCue[] = [
  {
    startTime: 0,
    endTime: 8,
    startFormatted: '00:00.000',
    endFormatted: '00:08.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Welcome to the SWID-SHRK Plate Antiprism Modeling workshop. In Part 1, we establish parametric origami folded facet geometry and shell formulations in Abaqus/CAE.'
  },
  {
    startTime: 8,
    endTime: 20,
    startFormatted: '00:08.000',
    endFormatted: '00:20.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Create a 3D Deformable Shell Part named "Plate-AntiPrism-Cell". The geometry consists of triangular and trapezoidal facets connected along inclined fold creases.'
  },
  {
    startTime: 20,
    endTime: 34,
    startFormatted: '00:20.000',
    endFormatted: '00:34.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Set circumradius R = 20.0 mm, total height H = 25.0 mm, and fold rotation angle theta = 45 degrees. The fold dihedral angle dictates the initial bending mode upon impact.'
  },
  {
    startTime: 34,
    endTime: 48,
    startFormatted: '00:34.000',
    endFormatted: '00:48.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'In the Property Module, define aluminum alloy Al 6061-T6: density 2.70e-9 tonne/mm³, modulus E = 70,000 MPa, Poisson ratio nu = 0.33, and yield stress 276 MPa.'
  },
  {
    startTime: 48,
    endTime: 62,
    startFormatted: '00:48.000',
    endFormatted: '01:02.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Create a Homogeneous Shell Section with uniform plate thickness t = 0.5 mm. Assign this section to all facet surfaces with 5 integration points through the thickness.'
  },
  {
    startTime: 62,
    endTime: 78,
    startFormatted: '01:02.000',
    endFormatted: '01:18.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Apply kinematic crease constraints across fold hinge edges to simulate realistic localized plastic bending hinges during cell collapse.'
  }
];

// -----------------------------------------------------------------------------
// Plate Antiprism Modeling — Part 2 Subtitle Track
// -----------------------------------------------------------------------------
const PLATE_PART_2_CUES: VttCue[] = [
  {
    startTime: 0,
    endTime: 8,
    startFormatted: '00:00.000',
    endFormatted: '00:08.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Welcome to Part 2 of Plate Antiprism Modeling: S4R shell meshing, self-contact interaction penalty, and energy absorption evaluation.'
  },
  {
    startTime: 8,
    endTime: 22,
    startFormatted: '00:08.000',
    endFormatted: '00:22.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Discretize the folded facets using S4R 4-node doubly curved shell elements with reduced integration and finite membrane strain formulation.'
  },
  {
    startTime: 22,
    endTime: 38,
    startFormatted: '00:22.000',
    endFormatted: '00:38.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Configure Abaqus/Explicit General Contact with penalty tangential friction mu = 0.20 to model facet-on-facet contact as the cellular origami folds and compacts.'
  },
  {
    startTime: 38,
    endTime: 54,
    startFormatted: '00:38.000',
    endFormatted: '00:54.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Set up dynamic explicit crush loading with a prescribed rigid plate velocity of 10.0 m/s and extract reaction force and internal energy dissipation (ALLIE).'
  },
  {
    startTime: 54,
    endTime: 70,
    startFormatted: '00:54.000',
    endFormatted: '01:10.000',
    speaker: 'Dr. Pouria Hejazi',
    text: 'Analyze the crushing curve to compute the Crush Force Efficiency (CFE = F_mean / F_peak). The origami fold design provides an exceptionally stable plateau without force spikes.'
  }
];

// -----------------------------------------------------------------------------
// Track Registry
// -----------------------------------------------------------------------------
export const TUTORIAL_VTT_TRACKS: Record<string, VttTrack> = {
  'vid-strut-1': {
    id: 'track-strut-1-en',
    label: 'English (FEA Technical)',
    language: 'en',
    kind: 'subtitles',
    default: true,
    vttUrl: '/subtitles/strut-antiprism-part-1.vtt',
    vttContent: buildVttContent('Strut Antiprism Modeling — Part 1', STRUT_PART_1_CUES),
    cues: STRUT_PART_1_CUES
  },
  'vid-strut-2': {
    id: 'track-strut-2-en',
    label: 'English (FEA Technical)',
    language: 'en',
    kind: 'subtitles',
    default: true,
    vttUrl: '/subtitles/strut-antiprism-part-2.vtt',
    vttContent: buildVttContent('Strut Antiprism Modeling — Part 2', STRUT_PART_2_CUES),
    cues: STRUT_PART_2_CUES
  },
  'vid-strut-3': {
    id: 'track-strut-3-en',
    label: 'English (FEA Technical)',
    language: 'en',
    kind: 'subtitles',
    default: true,
    vttUrl: '/subtitles/strut-antiprism-part-3.vtt',
    vttContent: buildVttContent('Strut Antiprism Modeling — Part 3', STRUT_PART_3_CUES),
    cues: STRUT_PART_3_CUES
  },
  'vid-strut-4': {
    id: 'track-strut-4-en',
    label: 'English (FEA Technical)',
    language: 'en',
    kind: 'subtitles',
    default: true,
    vttUrl: '/subtitles/strut-antiprism-part-4.vtt',
    vttContent: buildVttContent('Strut Antiprism Modeling — Part 4', STRUT_PART_4_CUES),
    cues: STRUT_PART_4_CUES
  },
  'vid-plate-1': {
    id: 'track-plate-1-en',
    label: 'English (FEA Technical)',
    language: 'en',
    kind: 'subtitles',
    default: true,
    vttUrl: '/subtitles/plate-antiprism-part-1.vtt',
    vttContent: buildVttContent('Plate Antiprism Modeling — Part 1', PLATE_PART_1_CUES),
    cues: PLATE_PART_1_CUES
  },
  'vid-plate-2': {
    id: 'track-plate-2-en',
    label: 'English (FEA Technical)',
    language: 'en',
    kind: 'subtitles',
    default: true,
    vttUrl: '/subtitles/plate-antiprism-part-2.vtt',
    vttContent: buildVttContent('Plate Antiprism Modeling — Part 2', PLATE_PART_2_CUES),
    cues: PLATE_PART_2_CUES
  }
};

export const getVttTrackForVideo = (videoId: string): VttTrack | undefined => {
  return TUTORIAL_VTT_TRACKS[videoId];
};

export const downloadVttTrackFile = (track: VttTrack, filename?: string): void => {
  try {
    const blob = new Blob([track.vttContent], { type: 'text/vtt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${track.id}.vtt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download VTT track:', err);
  }
};
