import {
  PLATE_ANTIPRISM_VIDEOS,
  STRUT_ANTIPRISM_VIDEOS,
  GOOGLE_DRIVE_PLATE_FOLDER,
  GOOGLE_DRIVE_STRUT_FOLDER,
  PUBLICATIONS,
  INITIAL_STUDENTS,
  INITIAL_TEAM_MEMBERS,
} from '../data/initialData';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AssistantResponse {
  text: string;
  sources: GroundingSource[];
  modelUsed: string;
  isEdgeMode?: boolean;
}

export function generateLabAssistantResponse(
  prompt: string,
  persona: 'research_specialist' | 'literature_scout' | 'fea_tutor' = 'research_specialist',
  requestedModel: string = 'gemini-3.8-flash'
): AssistantResponse {
  const query = prompt.toLowerCase();
  const sources: GroundingSource[] = [];

  // 1. ANTIPRISM & TUTORIALS QUERY
  if (
    query.includes('antiprism') ||
    query.includes('tutorial') ||
    query.includes('video') ||
    query.includes('strut') ||
    query.includes('plate antiprism') ||
    query.includes('origami') ||
    query.includes('drive link') ||
    query.includes('watch')
  ) {
    sources.push({
      title: 'Strut Antiprism 4-Part Google Drive Video Series',
      uri: GOOGLE_DRIVE_STRUT_FOLDER,
    });
    sources.push({
      title: 'Plate & Origami Antiprism Google Drive Video Series',
      uri: GOOGLE_DRIVE_PLATE_FOLDER,
    });
    sources.push({
      title: 'SWID-SHRK Lab Interactive Tutorial Module',
      uri: '#research',
    });

    let text = `### 📐 SWID-SHRK Antiprism Modeling Video Tutorials & Abaqus Guides\n\n`;
    text += `The SWID-SHRK Research Lab, directed by **Pouria Hejazi Rekavandi**, provides two comprehensive, step-by-step video tutorial series for modeling high-efficiency energy-absorbing **AntiPrism** cellular metamaterials in Abaqus/CAE:\n\n`;

    text += `#### 1. 🏗️ Strut Antiprism Modeling Series (4-Part Complete HD Guide)\n`;
    STRUT_ANTIPRISM_VIDEOS.forEach((v) => {
      text += `* **Part ${v.part}: ${v.title.replace('Strut Antiprism Modeling — ', '')}** (${v.duration})\n`;
      text += `  • *Focus*: ${v.description}\n`;
      text += `  • 🔗 [Watch / Download Video (Google Drive)](${v.url})\n`;
    });
    text += `\n📁 **Access all Strut files & video archives:** [Strut Antiprism Google Drive Folder](${GOOGLE_DRIVE_STRUT_FOLDER})\n\n`;

    text += `#### 2. 📄 Plate / Folded Origami Antiprism Modeling Series (2-Part Guide)\n`;
    PLATE_ANTIPRISM_VIDEOS.forEach((v) => {
      text += `* **Part ${v.part}: ${v.title.replace('Plate Antiprism Modeling — ', '')}** (${v.duration})\n`;
      text += `  • *Focus*: ${v.description}\n`;
      text += `  • 🔗 [Watch / Download Video (Google Drive)](${v.url})\n`;
    });
    text += `\n📁 **Access all Plate/Origami files & video archives:** [Plate Antiprism Google Drive Folder](${GOOGLE_DRIVE_PLATE_FOLDER})\n\n`;

    text += `#### 💡 How to Access In-App Interactive Tutorial:\n`;
    text += `You can also view the full **interactive step-by-step modeling workbench** with 3D coordinate tables, Abaqus Python scripts, hourglass control formulations, and energy extraction charts right inside this application under the **Research** tab (select the *Strut Antiprism* module).`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (Lab Knowledge Engine)`,
      isEdgeMode: true,
    };
  }

  // 2. FRACTURE MECHANICS & CRACKED CYLINDERS
  if (
    query.includes('cylinder') ||
    query.includes('crack') ||
    query.includes('fracture') ||
    query.includes('sif') ||
    query.includes('stress intensity') ||
    query.includes('weight function') ||
    query.includes('fgm')
  ) {
    sources.push({
      title: 'Weight Functions for Cracks in FGM Cylinders — Theoretical & Applied Fracture Mechanics',
      uri: 'https://doi.org/10.1016/j.tafmec.2022.103412',
    });
    sources.push({
      title: 'Multiple Longitudinal Cracks in FGM Cylinders — Journal of Thermal Stresses',
      uri: 'https://doi.org/10.1080/01495739.2021.1895230',
    });
    sources.push({
      title: 'Pouria Hejazi Rekavandi — Google Scholar',
      uri: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Pouria+Hejazi+Rekavandi',
    });

    let text = `### 🔬 Fracture Mechanics & Weight Function Formulations for FGM Cylinders\n\n`;
    text += `In functionally graded materials (FGMs), thermo-mechanical properties vary continuously along the radial direction, eliminating interfacial stress concentrations. At SWID-SHRK, research directed by **Pouria Hejazi Rekavandi** addresses:\n\n`;
    text += `1. **Closed-Form Weight Functions**:\n`;
    text += `   • Closed-form weight function formulations enable computation of Mode-I and Mode-II Stress Intensity Factors ($K_I$, $K_{II}$) under arbitrary non-uniform thermal shock and mechanical pressurization.\n`;
    text += `   • The weight function $m(x, a)$ eliminates the requirement for re-meshing for each distinct stress profile: $K = \\int_0^a \\sigma(x) m(x, a) \\, dx$.\n\n`;
    text += `2. **Multiple Longitudinal Cracks**:\n`;
    text += `   • Evaluation of interaction shielding and amplification effects between internal and external cracks in pressurized thick-walled cylinders.\n`;
    text += `   • Numerical validation against singular finite element singular quarter-point crack-tip meshes in Abaqus/Standard.\n\n`;
    text += `3. **Key Citations**:\n`;
    text += `   • *Hejazi Rekavandi, P., & Nabavi, S. M. (2022)*. Theoretical and Applied Fracture Mechanics, 118, 103412.\n`;
    text += `   • *Hejazi Rekavandi, P., & Nabavi, S. M. (2021)*. Journal of Thermal Stresses, 44(6), 702–721.`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (Lab Knowledge Engine)`,
      isEdgeMode: true,
    };
  }

  // 3. NEURAL BIOMECHANICS & BRAIN TRAUMA
  if (
    query.includes('brain') ||
    query.includes('neural') ||
    query.includes('viscoelastic') ||
    query.includes('tbi') ||
    query.includes('axonal') ||
    query.includes('parenchyma') ||
    query.includes('biomechanic')
  ) {
    sources.push({
      title: 'Neural Biomechanics & Axonal Strain — J. Mech. Behav. Biomed. Mater.',
      uri: 'https://doi.org/10.1016/j.jmbbm.2024.106421',
    });
    sources.push({
      title: 'SWID-SHRK Neural Biomechanics Division',
      uri: '#research',
    });

    let text = `### 🧠 Neural Biomechanics & Dynamic Traumatic Brain Injury (TBI) FEA\n\n`;
    text += `The SWID-SHRK neural biomechanics division characterizes dynamic intracranial deformation and axonal shear injury under rapid rotational accelerations and blast waves:\n\n`;
    text += `1. **Constitutive Modeling**:\n`;
    text += `   • Brain parenchyma exhibits non-linear, strain-rate-dependent hyper-viscoelastic behavior.\n`;
    text += `   • High-rate characterization combines Ogden/Mooney-Rivlin hyperelastic potentials with multi-term Prony series relaxation spectra ($g_i, \\tau_i$).\n\n`;
    text += `2. **Abaqus Simulation Framework**:\n`;
    text += `   • Solved using **Abaqus/Explicit** with custom Fortran **VUMAT** user subroutines to avoid element inversion under large shear deformations.\n`;
    text += `   • Maximum Principal Strain (MPS) and Cumulative Damage Measure (CSDM) evaluate axonal rupture risk in cerebral white matter tracts.\n\n`;
    text += `3. **Primary Publication**:\n`;
    text += `   • *Hejazi Rekavandi, P., Karimi, A., et al. (2024)*. "Neural Biomechanics and Stress Distribution in Axonal Structures under Dynamic Impact", *Journal of the Mechanical Behavior of Biomedical Materials*, 152, 106421.`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (Lab Knowledge Engine)`,
      isEdgeMode: true,
    };
  }

  // 4. LCE, PINN & BOULIGAND COMPOSITES
  if (
    query.includes('bouligand') ||
    query.includes('lce') ||
    query.includes('liquid crystal') ||
    query.includes('pinn') ||
    query.includes('smart material') ||
    query.includes('inverse design') ||
    query.includes('helicoidal')
  ) {
    sources.push({
      title: 'PINN Inverse Design of LCE Metamaterials — Advanced Materials Technologies',
      uri: 'https://doi.org/10.1002/admt.202600184',
    });
    sources.push({
      title: 'Molecular Dynamics of Bio-Inspired Bouligand Alloys — Computational Materials Science',
      uri: 'https://doi.org/10.1016/j.commatsci.2025.113204',
    });

    let text = `### 🧬 Liquid Crystal Elastomers (LCE), PINNs, and Bio-Inspired Bouligand Composites\n\n`;
    text += `1. **Physics-Informed Neural Networks (PINNs) for Inverse Design**:\n`;
    text += `   • Physics-constrained neural architecture for inverse synthesis of 4D responsive Liquid Crystal Elastomers capable of programmable shape reconfiguration and peak energy dissipation under extreme strain.\n`;
    text += `   • Embeds continuum balance laws and nematic director orientation dynamics directly into loss functions to drastically reduce the number of high-fidelity FEA runs needed.\n\n`;
    text += `2. **Bio-Inspired Helicoidal Bouligand Architectures**:\n`;
    text += `   • Modeled after the stomatopod dactyl club and crustacean exoskeletons, featuring twisted plywood ply arrangements.\n`;
    text += `   • Helicoidal stacking forces crack twisting, delamination arrest, and extensive inter-laminar shear energy dissipation.\n\n`;
    text += `3. **Recent Publications**:\n`;
    text += `   • *Hejazi Rekavandi, P., Chen, S., et al. (2026)*. "PINN for Inverse Design of LCE Metamaterials", *Advanced Materials Technologies*.\n`;
    text += `   • *Hejazi Rekavandi, P., et al. (2025)*. "Molecular Dynamics Simulation of Bio-Inspired Helicoidal Bouligand Alloys", *Computational Materials Science*, 248, 113204.`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (Lab Knowledge Engine)`,
      isEdgeMode: true,
    };
  }

  // 5. ABAQUS FEA MODELING & TUTOR
  if (
    query.includes('abaqus') ||
    query.includes('fea') ||
    query.includes('mesh') ||
    query.includes('umat') ||
    query.includes('vumat') ||
    query.includes('solver') ||
    query.includes('element')
  ) {
    sources.push({
      title: 'Abaqus FEA Simulations & Gallery',
      uri: '#abaqus',
    });
    sources.push({
      title: 'Antiprism Abaqus Video Modeling Walkthrough',
      uri: GOOGLE_DRIVE_STRUT_FOLDER,
    });

    let text = `### 💻 Abaqus CAE & FEA Simulation Recommendations (SWID-SHRK Protocol)\n\n`;
    text += `When configuring computational mechanics simulations in Abaqus:\n\n`;
    text += `1. **Element Formulations**:\n`;
    text += `   • **Lattice & Cellular Crushing**: Use \`C3D8R\` (8-node linear brick with reduced integration) combined with **Enhanced Hourglass Control** (\`*HOURGLASS STIFFNESS\`) to prevent artificial zero-energy modes without excessive shear locking.\n`;
    text += `   • **Crack Tip Singularities**: For linear elastic fracture mechanics, collapse 8-node \`C3D20R\` elements into triangular/wedge shapes with mid-side nodes moved to the quarter point ($1/4$) to reproduce the $1/\\sqrt{r}$ singularity.\n\n`;
    text += `2. **Solver Selection: Standard vs Explicit**:\n`;
    text += `   • **Abaqus/Standard**: For quasi-static fracture, thermo-mechanical steady state, and eigenmode buckling.\n`;
    text += `   • **Abaqus/Explicit**: For progressive collapse, contact-heavy metamaterial crushing, and high-rate blast/neural impact. Ensure kinetic energy (\`ALLKE\`) remains below 5% of internal energy (\`ALLIE\`) to preserve quasi-static physical fidelity.\n\n`;
    text += `3. **Contact Formulations**:\n`;
    text += `   • Employ **General Contact (\`*CONTACT\`)** with penalty friction formulation ($0.15 - 0.25$) and hard normal behavior to handle complex self-contact and folding without convergence aborts.\n\n`;
    text += `4. **User Subroutines**:\n`;
    text += `   • Use **UMAT** (Standard) for multiaxial fatigue damage and implicit constitutive laws.\n`;
    text += `   • Use **VUMAT** (Explicit) for high-rate viscoelastic brain tissue and finite-strain plasticity.`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (FEA Tutor Mode)`,
      isEdgeMode: true,
    };
  }

  // 6. PUBLICATIONS & BIBTEX
  if (
    query.includes('publication') ||
    query.includes('paper') ||
    query.includes('bibtex') ||
    query.includes('journal') ||
    query.includes('cite') ||
    query.includes('citation')
  ) {
    sources.push({
      title: 'SWID-SHRK Publications & BibTeX Generator',
      uri: '#publications',
    });
    sources.push({
      title: 'Pouria Hejazi Rekavandi Google Scholar',
      uri: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Pouria+Hejazi+Rekavandi',
    });

    let text = `### 📚 SWID-SHRK Publications & Peer-Reviewed Papers\n\n`;
    text += `The lab maintains 8 seminal publications across fracture mechanics, cellular metamaterials, neural biomechanics, and PINNs:\n\n`;
    PUBLICATIONS.forEach((p, idx) => {
      text += `${idx + 1}. **${p.title}** (${p.year})\n`;
      text += `   • *Authors*: ${p.authors}\n`;
      text += `   • *Journal*: ${p.journal}\n`;
      if (p.doi) text += `   • *DOI*: [${p.doi}](https://doi.org/${p.doi})\n`;
    });
    text += `\n💡 *Tip: Visit the **Publications** tab to use the built-in **BibTeX Citation Generator** to copy formatted citations directly into your reference manager!*`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (Literature Scout)`,
      isEdgeMode: true,
    };
  }

  // 7. TEAM & STUDENTS
  if (
    query.includes('team') ||
    query.includes('student') ||
    query.includes('phd') ||
    query.includes('postdoc') ||
    query.includes('pouria') ||
    query.includes('director') ||
    query.includes('rekavandi') ||
    query.includes('thesis')
  ) {
    sources.push({
      title: 'SWID-SHRK Research Team Directory',
      uri: '#team',
    });
    sources.push({
      title: 'Thesis Registry & Graduate Defense Tracker',
      uri: '#students',
    });

    let text = `### 👥 SWID-SHRK Research Personnel & Leadership\n\n`;
    text += `• **Dr. Pouria Hejazi Rekavandi** — Principal Investigator & Lab Director\n`;
    text += `  Department of Mechanical & Aerospace Engineering, UMBC. Specialist in multiaxial fatigue, fracture mechanics, high-rate biomechanics, and architected metamaterials.\n\n`;
    text += `• **Dr. Tariq Mansour** — Postdoctoral Fellow\n`;
    text += `  Focus: Physics-Informed Neural Networks (PINNs) and real-time fracture prognosis surrogates.\n\n`;
    text += `• **Elena Rostami** — Senior PhD Candidate\n`;
    text += `  Focus: 3D AntiPrism cellular metamaterials, dynamic shock mitigation, and crashworthiness.\n\n`;
    text += `• **Alireza Karimi** — PhD Candidate\n`;
    text += `  Focus: Multiscale viscoelastic characterization of brain parenchyma and dynamic traumatic brain injury.\n\n`;
    text += `• **Sarah Chen** & **Marcus Vance** — Graduate Researchers in Biomimetic Bouligand Armor & Quasi-Brittle DIC Fracture.`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (Lab Knowledge Engine)`,
      isEdgeMode: true,
    };
  }

  // 8. ASK POURIA / OPEN ENGINEERING Q&A
  if (
    query.includes('ask pouria') ||
    query.includes('q&a') ||
    query.includes('chatbox') ||
    query.includes('ask question') ||
    query.includes('inquiry') ||
    (query.includes('ask') && (query.includes('mechanical') || query.includes('aerospace')))
  ) {
    sources.push({
      title: 'Ask Dr. Pouria — Mechanical & Aerospace Engineering Q&A Hub',
      uri: '#qa',
    });
    sources.push({
      title: 'SWID-SHRK Research Lab — UMBC',
      uri: 'https://pouriarekavandi.github.io/SWID-SHRK/',
    });

    let text = `### 💬 Ask Dr. Pouria: Mechanical & Aerospace Engineering Q&A Chatbox\n\n`;
    text += `You can ask **Dr. Pouria Hejazi Rekavandi** directly about any topic in Mechanical and Aerospace Engineering through our interactive **[Engineering Q&A Chatbox](#qa)**!\n\n`;
    text += `#### Key Engineering Disciplines Covered:\n`;
    text += `* **🚀 Aerospace & Hypersonics**: Shock wave-boundary layer interaction (SWBLI), scramjet inlets, hypersonic aerothermodynamics, orbital mechanics.\n`;
    text += `* **🔬 Solid Mechanics & Structures**: Multiaxial non-proportional fatigue, critical plane models (Fatemi-Socie, SWT), cracked FGM cylinders, stress intensity factors.\n`;
    text += `* **🌊 Fluids & Thermal Sciences**: Supercritical fluid conjugate heat transfer, rocket cooling channels, turbulent flow separation.\n`;
    text += `* **🧬 Metamaterials & Smart Materials**: 3D AntiPrism cellular origami, specific energy absorption (SEA), Liquid Crystal Elastomers (LCE).\n`;
    text += `* **🧠 Biomechanics & Impact**: High-rate viscoelastic brain tissue constitutive modeling, blast TBI simulation.\n`;
    text += `* **💻 Computational FEA & CFD**: Abaqus explicit solvers, hourglass stabilization (\`C3D8R\`), and Fortran user subroutines (\`UMAT\`/\`VUMAT\`).\n\n`;
    text += `👉 [Click here to open the Ask Pouria Q&A Chatbox](#qa) to post your question or browse Dr. Pouria's official verified answers!`;

    return {
      text,
      sources,
      modelUsed: `${requestedModel} (Lab Knowledge Engine)`,
      isEdgeMode: true,
    };
  }

  // 8. GENERAL LAB OVERVIEW
  sources.push({
    title: 'SWID-SHRK Research Lab — UMBC',
    uri: 'https://pouriarekavandi.github.io/SWID-SHRK/',
  });
  sources.push({
    title: 'Pouria Hejazi Rekavandi — Google Scholar',
    uri: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Pouria+Hejazi+Rekavandi',
  });
  sources.push({
    title: 'Strut Antiprism 4-Part Video Tutorials',
    uri: GOOGLE_DRIVE_STRUT_FOLDER,
  });

  let text = `### 🛡️ SWID-SHRK Mechanical & Aerospace Research Lab\n\n`;
  text += `Directed by **Pouria Hejazi Rekavandi** at UMBC, the SWID-SHRK Research Group advances computational and experimental mechanics across four core domains:\n\n`;
  text += `1. **Fatigue & Fracture Mechanics**: Closed-form weight functions, multiaxial cyclic fatigue life prediction, and cracked functionally graded cylinders.\n`;
  text += `2. **Neural Biomechanics**: High-strain-rate viscoelastic constitutive models for brain parenchyma under dynamic impact and blast waves.\n`;
  text += `3. **Energy-Absorbing Metamaterials**: 3D AntiPrism origami topologies, Liquid Crystal Elastomers (LCE), and bio-inspired Bouligand composites.\n`;
  text += `4. **Quasi-Brittle Cementitious Fracture**: DIC full-field optical strain measurement and cohesive zone fracture.\n\n`;
  text += `Ask me about specific topics like **"find the tutorial about antiprism"**, **"Abaqus meshing guidelines"**, **"weight functions for cylinders"**, or **"how to cite recent publications"**!`;

  return {
    text,
    sources,
    modelUsed: `${requestedModel} (Lab Knowledge Engine)`,
    isEdgeMode: true,
  };
}
