import { EngineeringQuestion } from '../types';

export const INITIAL_ENGINEERING_QUESTIONS: EngineeringQuestion[] = [
  {
    id: 'q-1',
    title: 'Shock Wave-Boundary Layer Interaction (SWBLI) & Separation in Hypersonic Scramjet Inlets',
    discipline: 'Aerospace & Hypersonics',
    authorName: 'Alex Mercer',
    authorAffiliation: 'Aerospace Propulsion Lab, Johns Hopkins APL',
    authorEmail: 'alex.mercer@jhuapl.edu',
    content:
      'In hypersonic air-breathing propulsion (Mach 5–7), incident oblique shock waves reflecting from the cowl lip impinge onto the inlet boundary layer, inducing severe adverse pressure gradients and localized separation bubbles. What are the current state-of-the-art computational methods to accurately predict inlet unstart, and how can boundary layer bleeding or micro-vortex generators mitigate this phenomenon without inducing excessive stagnation pressure loss?',
    createdAt: '2026-10-25T14:32:00Z',
    status: 'Answered by Dr. Pouria',
    upvotes: 28,
    tags: ['Hypersonics', 'SWBLI', 'Scramjet Inlets', 'Boundary Layer', 'Shock Waves'],
    replies: [
      {
        id: 'rep-1-1',
        authorName: 'Dr. Pouria Hejazi Rekavandi',
        authorRole: 'Lab Director & PI · SWID-SHRK Lab',
        authorEmail: 's.s.hejazirekavandi@gmail.com',
        isDirector: true,
        content: `### Aerothermodynamic & Boundary Layer Dynamics Analysis

Shock Wave-Boundary Layer Interaction (SWBLI) is the primary driver of inlet unstart in high-Mach cruise vehicles. When the incident shock imposes a pressure ratio $P_2 / P_1 > (P_2/P_1)_{crit}$, the subsonic portion of the boundary layer cannot overcome the adverse gradient, resulting in flow separation and an upstream-propagating separation shock train.

#### 1. Predictive Computational Methodologies
* **RANS vs. Hybrid RANS-LES (DDES/IDDES)**: Standard linear eddy-viscosity models ($k-\\epsilon$, $k-\\omega$ SST) chronically overpredict the turbulent kinetic energy in the shear layer above the separation bubble, resulting in delayed separation onset and underprediction of separation length by $25\\% - 40\\%$.
* **Recommended Turbulence Closure**: Use the **Menter SST model with compressibility corrections (Sarkar or Zeman dilatation dissipation)** or preferably **Delayed Detached Eddy Simulation (DDES)** with a fine prism layer maintaining $y^+ \\le 0.5$ and streamwise aspect ratio $\\Delta x / \\delta < 0.1$.
* **Unstart Sensor Placement**: Monitor wall static pressure fluctuations $\\sigma_p / \\bar{p}$ upstream of the throat. High-frequency Kulite transducers detect the low-frequency unsteadiness ($100 - 500$ Hz) of the separation bubble prior to catastrophic unstart.

#### 2. Passive & Active Shock Mitigation
* **Micro-Ramp Vortex Generators (MVGs)**: Sub-boundary layer micro-ramps (height $h \\approx 0.3 - 0.5 \\delta$) introduce streamwise counter-rotating vortex pairs that pump high-momentum freestream fluid down toward the wall, energizing the near-wall profile and reducing separation bubble volume by up to $60\\%$ with less than $1.8\\%$ total pressure loss.
* **Perforated Wall Bleed with Cavity Recirculation**: If utilizing boundary layer bleed, locate bleed slots directly across the impingement footprint with sonic orifices ($M_{bleed} \\approx 1$). However, for hypersonic cruise efficiency, passive aerodynamic tailoring (curved compression ramps) is strongly preferred over mass bleed.`,
        createdAt: '2026-10-25T16:15:00Z',
        likes: 19,
        dislikes: 0,
      },
    ],
  },
  {
    id: 'q-2',
    title: 'Multiaxial Non-Proportional Cyclic Fatigue: Critical Plane Formulations vs Standard S-N Curves',
    discipline: 'Solid Mechanics & Structures',
    authorName: 'Camila Rodriguez',
    authorAffiliation: 'Structural Integrity Group, NAVAIR',
    authorEmail: 'c.rodriguez@navair.navy.mil',
    content:
      'We are testing helicopter rotor drive shafts subjected to combined cyclic bending and out-of-phase torsional flutter. Uniaxial S-N fatigue curves and even von Mises equivalent stress yield highly non-conservative life estimates (specimens fail at 15% of predicted cycles). Why does non-proportional loading induce this severe fatigue knockdown, and which critical plane criterion (Fatemi-Socie, Findley, or Smith-Watson-Topper) should we implement in Abaqus?',
    createdAt: '2026-10-26T09:18:00Z',
    status: 'Answered by Dr. Pouria',
    upvotes: 34,
    tags: ['Multiaxial Fatigue', 'Non-Proportional Hardening', 'Critical Plane', 'Fatemi-Socie', 'Abaqus UMAT'],
    replies: [
      {
        id: 'rep-2-1',
        authorName: 'Dr. Pouria Hejazi Rekavandi',
        authorRole: 'Lab Director & PI · SWID-SHRK Lab',
        authorEmail: 's.s.hejazirekavandi@gmail.com',
        isDirector: true,
        content: `### Microstructural Mechanics & Critical Plane Selection

The drastic reduction in fatigue life under out-of-phase (non-proportional) loading is one of the foundational research pillars of our laboratory at UMBC.

#### Why von Mises & Uniaxial Methods Fail
1. **Continuous Rotation of Principal Stress Directions**: Under out-of-phase bending and torsion ($\phi = 90^\\circ$), the principal stress axes rotate continuously through the material during each cycle.
2. **Additional Cyclic Hardening via Multi-Slip Activation**: In uniaxial or proportional loading, dislocation glide is restricted to single or planar slip systems. In non-proportional loading, rotating shear stresses activate multiple intersecting slip systems, producing heavy dislocation tangles, cross-slip, and persistent slip band interactions. This produces up to **$50\\% - 100\\%$ additional cyclic hardening**, generating high localized stress concentrations that accelerate microcrack nucleation.

#### Criterion Recommendation: Fatemi-Socie vs. Findley vs. SWT
* **For Ductile Metals / Shear-Driven Failure (e.g. 4340 Steel, Ti-6Al-4V rotor shafts)**:
  Use the **Fatemi-Socie parameter**:
  $$\\frac{\\Delta \\gamma_{max}}{2} \\left(1 + k \\frac{\\sigma_{n,max}}{\\sigma_y}\\right) = \\frac{\\tau_f'}{G}(2N_f)^{b_0} + \\gamma_f'(2N_f)^{c_0}$$
  *Here, $\\Delta \\gamma_{max}/2$ governs shear crack nucleation, while the maximum normal stress $\\sigma_{n,max}$ across the maximum shear plane acts to pull crack faces apart, eliminating crack closure and accelerating Stage-I to Stage-II crack transition.*
* **For Quasi-Brittle Materials (High-strength cast alloys)**: Use **Smith-Watson-Topper (SWT)**, which is normal-strain driven.
* **Abaqus Implementation**: You can compute this via an Abaqus Python post-processing script or an embedded UMAT by sweeping candidate planes at $1^\\circ$ increments through Euler angles to locate the plane where the damage parameter maximizes. We have validated subroutine templates in our lab archive if you need reference files.`,
        createdAt: '2026-10-26T11:40:00Z',
        likes: 24,
        dislikes: 0,
      },
    ],
  },
  {
    id: 'q-3',
    title: 'AntiPrism Cellular Metamaterials vs Traditional Honeycomb Cores for Ballistic Shock Absorption',
    discipline: 'Metamaterials & Advanced Composites',
    authorName: 'Lt. Jordan Hayes',
    authorAffiliation: 'Office of Naval Research / Dynamic Structures',
    authorEmail: 'jordan.hayes@navy.mil',
    content:
      'We are evaluating lightweight core topologies for blast and projectile mitigation panels. Hexagonal honeycombs show high initial peak crush force followed by a sharp drop and unstable folding. How do 3D AntiPrism lattice architectures compare in Specific Energy Absorption (SEA) and Crush Force Efficiency (CFE)?',
    createdAt: '2026-10-27T10:04:00Z',
    status: 'Answered by Dr. Pouria',
    upvotes: 41,
    tags: ['AntiPrism', 'Metamaterials', 'Specific Energy Absorption', 'CFE', 'Abaqus Explicit'],
    replies: [
      {
        id: 'rep-3-1',
        authorName: 'Dr. Pouria Hejazi Rekavandi',
        authorRole: 'Lab Director & PI · SWID-SHRK Lab',
        authorEmail: 's.s.hejazirekavandi@gmail.com',
        isDirector: true,
        content: `### Metamaterial Topologies & Crashworthiness Metrics

In crashworthiness and ballistic attenuation, the ideal absorber maximizes **Specific Energy Absorption** ($SEA = \\int F dx / m$) while maintaining a **Crush Force Efficiency** ($CFE = F_{mean} / F_{peak}$) close to $1.0$ to prevent severe deceleration spikes on the protected payload.

#### Why Honeycombs Suffer Under Blast & Oblique Shocks
* **High Initial Peak ($CFE < 0.55$)**: Standard hexagonal honeycombs exhibit an abrupt elastic buckling peak followed by catastrophic plastic hinge collapse.
* **Zero Oblique Resistance**: Honeycombs possess near-zero shear stiffness under multi-axis or blast shock waves arriving off-axis ($15^\\circ - 45^\\circ$).

#### The 3D AntiPrism Advantage
1. **Multi-Stage Progressive Origami Folding**:
   * The anti-symmetric angled strut/facet configuration of AntiPrism unit cells creates a controlled kinematic hinge network.
   * Instead of sudden snap-through buckling, the cell undergoes progressive, continuous plastic deformation with a sustained, broad stress plateau.
2. **Elevated CFE**: AntiPrism architectures typically achieve **$CFE \\ge 0.82 - 0.91$**, significantly attenuating initial shock transmission.
3. **Multi-Directional Energy Dissipation**: Due to 3D spatial chirality, AntiPrism metamaterials absorb energy across simultaneous compression, shear, and torsion.
4. **Tutorials & Abaqus Models**: We have published a **4-part HD video modeling series** and an interactive tutorial on this website demonstrating exactly how to build, mesh, and evaluate AntiPrism unit cells in Abaqus/Explicit!`,
        createdAt: '2026-10-27T12:20:00Z',
        likes: 31,
        dislikes: 0,
      },
      {
        id: 'rep-3-ai',
        authorName: 'SWID-SHRK Engineering AI',
        authorRole: 'Aerospace & Mechanical AI Engine (Gemini 3.8 Flash)',
        isDirector: false,
        isAI: true,
        content: `### Comparative Topology & Energy Absorption Metric Breakdown (AI Synthesis)

To supplement Dr. Pouria's formulation, here is the computational parametric comparison between **Hexagonal Honeycomb**, **Strut-based AntiPrism**, and **Plate-based AntiPrism** lattice configurations under identical relative densities ($\\bar{\\rho} = 0.12$):

| Architecture Metric | Hexagonal Core | Strut AntiPrism | Plate AntiPrism |
| :--- | :--- | :--- | :--- |
| **Dominant Deformation Mode** | Plastic Buckling / Folding | Stretch-Dominated Compression | Membrane Shear / In-plane Biaxial |
| **Peak-to-Mean Force Ratio ($P_{max}/P_{mean}$)** | $1.92$ (Harmful blast spike) | $1.28$ (Smooth yield) | **$1.14$ (Near-ideal plateau)** |
| **Crush Force Efficiency (CFE)** | $52.1\\%$ | $78.4\\%$ | **$87.6\\%$** |
| **Specific Energy Absorption (SEA)** | $14.2\\text{ kJ/kg}$ | $22.7\\text{ kJ/kg}$ | **$34.8\\text{ kJ/kg}$** |
| **Multi-Axial Off-Axis Capacity** | Poor ($<15^\\circ$ tolerance) | Moderate ($45^\\circ$ stable) | **Superior ($60^\\circ$ omnidirectional)** |

#### Key Computational Findings:
1. **Kinematic Rotational Invariance**: Because AntiPrism unit cells possess antiprismatic nodal symmetry, their triangular faces trigger progressive rotational snap-through rather than catastrophic localized shear banding.
2. **Post-Yield Progressive Densification**: Strain at onset of densification is prolonged up to $\\epsilon_D \\approx 0.68$, delivering a wide plastic plateau ideal for hypersonic vehicle leading-edge impact and aerospace projectile shielding.`,
        createdAt: '2026-10-27T14:40:00Z',
        likes: 28,
        dislikes: 1,
      },
    ],
  },
  {
    id: 'q-4',
    title: 'Abaqus/Explicit Dynamic Crush: Preventing Hourglass Modes in C3D8R Elements Without Artificial Stiffening',
    discipline: 'Computational FEA & CFD',
    authorName: 'David Zhang',
    authorAffiliation: 'Crash Safety CAE Department, Rivian Automotive',
    authorEmail: 'dzhang@rivian.com',
    content:
      'We run high-velocity dynamic crush simulations of architected lattice structures in Abaqus/Explicit. Linear reduced-integration brick elements (C3D8R) suffer severe zero-energy hourglass modes during strut post-yield buckling. However, when we switch to fully integrated C3D8 elements or over-scale hourglass stiffness, we get severe shear locking and overpredicted peak forces. What is the optimal Abaqus configuration?',
    createdAt: '2026-10-27T16:45:00Z',
    status: 'Answered by Dr. Pouria',
    upvotes: 29,
    tags: ['Abaqus CAE', 'Hourglass Control', 'C3D8R Elements', 'Dynamic Explicit', 'Mesh Convergence'],
    replies: [
      {
        id: 'rep-4-1',
        authorName: 'Dr. Pouria Hejazi Rekavandi',
        authorRole: 'Lab Director & PI · SWID-SHRK Lab',
        authorEmail: 's.s.hejazirekavandi@gmail.com',
        isDirector: true,
        content: `### Finite Element Formulation & Hourglass Formulation Guide

This is an essential question when simulating cellular crushing and thin-walled bending in Abaqus/Explicit.

#### The Problem with C3D8 vs Standard C3D8R
* **Fully Integrated C3D8**: Suffers from **shear locking** and **volumetric locking** (especially under incompressible plastic flow, $\\nu_p \\approx 0.5$). The model will overestimate peak loads by $30\\% - 60\\%$.
* **Standard C3D8R with Relax Stiffness**: Suffers from zigzag, zero-energy kinematic modes because only 1 Gauss point exists at the element center.

#### The Recommended SWID-SHRK Abaqus Configuration:
1. **Hourglass Formulation Selection**:
   * Navigate to: **Mesh Module → Mesh Controls → Element Type → Hourglass Control**.
   * Change from *Default* or *Relax Stiffness* to **"Enhanced"** (based on Flanagan-Belytschko physical stabilization with assumed strain fields).
   * Enhanced hourglassing introduces resistance to distortion without adding artificial elastic stiffness to bending deformation.
2. **Hourglass Stiffness Scaling**:
   * Set \`*SECTION CONTROLS, HOURGLASS=ENHANCED, WEIGHT FACTOR=0.5\`.
3. **Energy Ratio Verification (Crucial Quality Check)**:
   * Request \`*ENERGY OUTPUT\` for history output.
   * Verify that **Artificial Energy (\`ALLAE\`)** remains below **$5\\%$ of Internal Energy (\`ALLIE\`)** throughout the entire crush stroke:
     $$\\frac{\\text{ALLAE}}{\\text{ALLIE}} < 0.05$$
   * Also ensure **Kinetic Energy (\`ALLKE\`)** is under $5\\%$ of internal energy if treating dynamic crush as quasi-static.
4. **Alternative Element Choice**: If the struts are predominantly slender beams ($L/D > 10$), consider Timoshenko beam elements (\`B31\`) or quadratic tetrahedral elements (\`C3D10M\` - Modified 10-node tet with internal contact pressure degrees of freedom).`,
        createdAt: '2026-10-27T18:02:00Z',
        likes: 22,
        dislikes: 0,
      },
    ],
  },
  {
    id: 'q-5',
    title: 'Viscoelastic Constitutive Modeling of Brain Parenchyma under High-Rate Traumatic Brain Injury (TBI)',
    discipline: 'Biomechanics & Biomaterials',
    authorName: 'Dr. Maya Lin',
    authorAffiliation: 'Biomedical Engineering, Johns Hopkins Medicine',
    authorEmail: 'mlin@jhmi.edu',
    content:
      'We are modeling brain deformation under rotational blast shock. Brain tissue exhibits pronounced strain-rate dependence and hysteresis. Should we formulate the constitutive law as a quasi-linear viscoelastic (QLV) model, or an Ogden hyperelastic model with a multi-term Prony series relaxation spectrum? How do we calibrate short-time shear relaxation parameters in Abaqus?',
    createdAt: '2026-10-28T11:12:00Z',
    status: 'Answered by Dr. Pouria',
    upvotes: 38,
    tags: ['Neural Biomechanics', 'Brain Parenchyma', 'Viscoelasticity', 'Prony Series', 'VUMAT'],
    replies: [
      {
        id: 'rep-5-1',
        authorName: 'Dr. Pouria Hejazi Rekavandi',
        authorRole: 'Lab Director & PI · SWID-SHRK Lab',
        authorEmail: 's.s.hejazirekavandi@gmail.com',
        isDirector: true,
        content: `### Soft Tissue Viscoelasticity & High-Rate Constitutive Modeling

In neural biomechanics, brain tissue behavior under impact ($10 - 200\\text{ s}^{-1}$ strain rates) requires separating the instantaneous non-linear elastic response from the time-dependent relaxation kernel.

#### 1. Why Quasi-Linear Viscoelasticity (QLV) Falls Short for Blast/Impact
* Fung's QLV assumes the relaxation spectrum is completely independent of strain magnitude.
* Under large dynamic shear deformations (shear strains $\\gamma > 0.15$), brain tissue displays strong strain-softening and nonlinear rate dependence that QLV cannot capture.

#### 2. The Recommended Hyper-Viscoelastic Framework
We utilize a **one- or two-term Ogden strain energy potential** coupled with a **finite-strain multi-term Prony series**:
* **Instantaneous Hyperelastic Potential**:
  $$W_0(\\lambda_1, \\lambda_2, \\lambda_3) = \\sum_{i=1}^N \\frac{2\\mu_i}{\\alpha_i^2} \\left( \\lambda_1^{\\alpha_i} + \\lambda_2^{\\alpha_i} + \\lambda_3^{\\alpha_i} - 3 \\right) + \\frac{1}{D} (J - 1)^2$$
  *(For brain parenchyma, typical initial shear modulus $\\mu_0 \\approx 1.2 - 2.5\\text{ kPa}$ and $\\alpha_1 \\approx 2.0 - 4.5$)*.
* **Time-Dependent Shear Relaxation Modulus**:
  $$G(t) = G_\\infty + \\sum_{k=1}^K g_k e^{-t / \\tau_k}$$
  *For high-rate rotational impact ($t < 50\\text{ ms}$), calibrate at least 3 relaxation times covering the microsecond to millisecond decade: $\\tau_1 = 10^{-4}\\text{ s}$, $\\tau_2 = 10^{-3}\\text{ s}$, $\\tau_3 = 10^{-2}\\text{ s}$.*

#### 3. Abaqus VUMAT vs Built-in Materials
While Abaqus has built-in hyperviscoelasticity, large shear deformations often lead to mesh tangling. We implement this through a customized **VUMAT subroutine** with Jaumann objective stress rate formulation and explicit element deletion or adaptive remeshing based on Maximum Principal Strain criteria ($MPS > 0.28$). Check our 2024 paper in *J. Mech. Behav. Biomed. Mater.* for our full experimental calibration data.`,
        createdAt: '2026-10-28T13:30:00Z',
        likes: 27,
        dislikes: 0,
      },
    ],
  },
  {
    id: 'q-6',
    title: 'Supercritical Methane Conjugate Heat Transfer in 3D Additively Manufactured Rocket Cooling Channels',
    discipline: 'Fluids & Thermal Sciences',
    authorName: 'Marcus Cole',
    authorAffiliation: 'Liquid Engine Development, Relativity Space',
    authorEmail: 'mcole@relativityspace.com',
    content:
      'We are designing additively manufactured copper-alloy combustion chamber cooling channels running supercritical LNG/methane at 15 MPa. The fluid undergoes strong thermal stratification and near-wall property spikes near the pseudo-critical temperature. What CFD turbulence closure and heat transfer correlations are most reliable for avoiding hot-gas-wall thermal runaways?',
    createdAt: '2026-10-29T08:20:00Z',
    status: 'Answered by Dr. Pouria',
    upvotes: 25,
    tags: ['Regenerative Cooling', 'Supercritical Methane', 'Conjugate Heat Transfer', 'Rocket Engines', 'CFD'],
    replies: [
      {
        id: 'rep-6-1',
        authorName: 'Dr. Pouria Hejazi Rekavandi',
        authorRole: 'Lab Director & PI · SWID-SHRK Lab',
        authorEmail: 's.s.hejazirekavandi@gmail.com',
        isDirector: true,
        content: `### Cryogenic Supercritical Conjugate Heat Transfer Analysis

Supercritical fluids near their pseudo-critical line ($T_{pc} \\approx 190.5\\text{ K}$ for methane at $15\\text{ MPa}$) exhibit massive variations in specific heat $C_p$, density $\\rho$, and viscosity $\\mu$, which can cause either heat transfer enhancement or severe heat transfer deterioration (HTD).

#### 1. CFD Turbulence Modeling Guidelines
* **Standard Wall Functions are Strictly Forbidden**: Conventional log-law wall functions assume constant fluid properties across the viscous sublayer. With supercritical methane, thermal gradients across the boundary layer cause density to drop by $300\\%$, invalidating the classical logarithmic profile.
* **Near-Wall Resolution**: You MUST resolve the viscous sublayer directly using a **two-equation $k-\\omega$ SST model** with low-Reynolds damping, ensuring the first cell height gives $y^+ \\le 0.5$ across all walls.
* **Conjugate Heat Transfer (CHT)**: Couple the fluid mesh directly with the 3D GRCop-42 / CuCrZr solid conduction mesh via conformal interface nodes to capture the 3D "fin effect" of channel ribs.

#### 2. Modified Correlations for Fast 1D/quasi-2D Sizing
* Standard Dittus-Boelter ($Nu = 0.023 Re^{0.8} Pr^{0.4}$) severely underpredicts wall temperatures when $T_{wall} > T_{pc} > T_{bulk}$.
* Use the **Jackson or Petukhov-Krasnoshchekov modified supercritical correlation**:
  $$Nu = Nu_0 \\left( \\frac{\\rho_w}{\\rho_b} \\right)^{0.3} \\left( \\frac{\\bar{C}_p}{C_{p,b}} \\right)^n$$
  where $\\bar{C}_p = \\frac{h_w - h_b}{T_w - T_b}$ represents the integrated mean specific heat.
* **Surface Roughness from Additive Manufacturing**: Laser powder bed fusion (LPBF) channels typically have an as-built roughness $Ra \\approx 8 - 15\\ \\mu\\text{m}$. While this enhances turbulence and boosts Nusselt number by up to $35\\%$, it increases Darcy friction factor by $70\\% - 100\\%$, so calibrate the pressure budget accordingly.`,
        createdAt: '2026-10-29T10:15:00Z',
        likes: 18,
        dislikes: 0,
      },
    ],
  },
];
