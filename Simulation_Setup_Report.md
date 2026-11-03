# Simulation Setup & Methodology Report
**Skin-Wound Biomechanical FEA with Bioinspired Adhesive (d-SMG)**

## 1. Introduction
This report outlines the methodology and setup parameters for the finite element analysis (FEA) of a skin-wound biomechanical interaction using a bioinspired adhesive. The model is built using a Python script designed for Abaqus/CAE 2017.

## 2. Unit System
A strictly consistent unit system is employed throughout the simulation:
- **Length:** mm
- **Force:** N
- **Stress / Modulus:** MPa (1 kPa = 0.001 MPa)
- **Density:** tonne/mm³
- **Fracture Energy:** mJ/mm² (1 J/m² = 0.001 mJ/mm²)
- **Time:** s

## 3. Geometry & Modeling Setup
The model consists of two primary components, assembled concentrically:

### 3.1 Skin Tissue
- **Geometry:** 3D rectangular block (40.0 mm x 40.0 mm x 2.0 mm).
- **Wound Defect:** A full-thickness central circular cavity.
  - **Diameter:** 10.0 mm (Radius = 5.0 mm).
  - **Depth:** 1.5 mm (From Z=2.0 mm down to Z=0.5 mm), leaving a 0.5 mm intact wound bed.

### 3.2 Bioadhesive Plug (d-SMG)
- **Geometry:** Circular hydrogel patch.
  - **Diameter:** 10.0 mm.
  - **Thickness:** 1.5 mm (Providing conformal contact with the wound bed and lateral margins).

## 4. Material Constitutive Models

### 4.1 Skin Tissue (Mooney-Rivlin Hyperelasticity)
The skin is modeled as a near-incompressible hyperelastic material calibrated to existing literature (e.g., Deng et al., Nat. Commun. 2023).
- **C10:** 0.08 MPa
- **C01:** 0.02 MPa
- **D1:** 0.01 MPa⁻¹ (Penalty parameter for near-incompressibility)
- **Density:** $1.05 \times 10^{-9}$ tonne/mm³

### 4.2 Snail Mucus Gel Adhesive (Linear Elastic)
The adhesive is approximated as a Hookean solid based on rheological properties at working hydration.
- **Young's Modulus ($E$):** 0.0435 MPa
- **Poisson's Ratio ($\nu$):** 0.45
- **Density:** $1.0 \times 10^{-9}$ tonne/mm³

## 5. Interaction Modeling
The interaction between the skin wound margins and the adhesive plug is governed by a **Cohesive Surface Interaction** using traction-separation behavior (with a standard *TIE constraint fallback).

- **Cohesive Elastic Stiffness:**
  - Normal ($K_{nn}$): 50.0 MPa/mm
  - Shear ($K_{ss}, K_{tt}$): 25.0 MPa/mm
- **Damage Initiation (Maximum Nominal Stress - MAXS):**
  - Peak Tensile Strength ($t_n^0$): 0.05138 MPa
  - Peak Shear Strength ($t_s^0, t_t^0$): 0.02364 MPa
- **Damage Evolution (Energy-based):**
  - Critical Fracture Energy ($G_c$): 0.02427 mJ/mm²
  - Mixed-Mode Behavior: BK Law (Exponent $\eta = 1.0$)
  *(Note: The script utilizes progressive fallbacks to ensure compatibility with Abaqus 2017 constraints on damage variables).*

## 6. Initial Conditions & Pre-Stress
- **In Vivo Tension (Langer's Lines):** An initial pre-stress is applied to the skin tissue.
  - Longitudinal Tension ($\sigma_{xx}$): 0.020 MPa
  - Transverse Tension ($\sigma_{yy}$): 0.010 MPa
- **Hydration Tracking:** An initial field variable (`FIELD1 = 1.0`) is assigned to the adhesive to represent full hydration.

## 7. Analysis Steps & Loading Protocols
Non-linear geometric effects (`nlgeom=ON`) are enabled for all steps.

### 7.1 Step 1: Equilibrium (`Step-Equil`)
- **Type:** Static General (Time = 0.1 s).
- **Purpose:** To balance the initial pre-stress under pinned boundary conditions before external loads are applied.

### 7.2 Step 2: Loading (`Step-Load`)
- **Type:** Static General (Time = 1.0 s).
- **Load Cases (Selectable via script):**
  - **UNIAXIAL:** The X=-20 mm edge is fixed; the X=+20 mm edge undergoes a displacement of +4.0 mm (10% tensile stretch).
  - **BIAXIAL:** Simultaneous stretching of $\pm$2.0 mm along both X and Y boundaries.
  - **COMPRESSION:** The base is fixed (Z=0 mm), and a uniform out-of-plane surface pressure of 0.010 MPa is applied to the exposed top surface of the adhesive.

## 8. Mesh and Element Formulation
- **Skin Tissue:** Modeled using 8-node linear brick elements with reduced integration and hybrid formulation (`C3D8RH`) to prevent volumetric locking due to near-incompressibility. Global seed size is 2.0 mm.
- **Adhesive Plug:** Modeled using standard 8-node linear brick elements with reduced integration (`C3D8R`). Global seed size is 0.5 mm.
- **Interface refinement:** Edges along the cohesive contact interface are refined with a 0.25 mm seed size.

## 9. Output Requests
The script utilizes a progressive variable request system to bypass Abaqus 2017 limitations. It attempts to request:
- **Field Outputs:** `S` (Stress), `LE` (Log Strain), `U` (Displacement), `CPRESS` (Contact Pressure), `CSHEAR` (Contact Shear), `CSDMG` (Cohesive Damage), `CSTATUS` (Contact Status).
- **History Outputs:** Whole model energies (`ALLIE`, `ALLKE`, `ALLSE`, `ALLWK`, `ALLPD`, `ETOTAL`).
