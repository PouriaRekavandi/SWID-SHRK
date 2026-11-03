# -*- coding: utf-8 -*-
"""
Skin-Wound Biomechanical FEA with Bioinspired Adhesive (d-SMG)
Compatibility: Abaqus/CAE 2017 (Python 2.7)
Unit System: [mm, N, MPa, tonne, s]
"""

from abaqus import *
from abaqusConstants import *
from caeModules import *
import regionToolset
import mesh

# ============================================================
# PARAMETERS
# ============================================================

USE_COHESIVE = True          # True=cohesive zone; False=*TIE
LOAD_CASE    = 'UNIAXIAL'   # 'UNIAXIAL' | 'BIAXIAL' | 'COMPRESSION'

# Geometry [mm]
SKIN_LX  = 40.0
SKIN_LY  = 40.0
SKIN_LZ  = 2.0
WOUND_R  = 5.0
WOUND_D  = 1.5
WOUND_Z_TOP    = SKIN_LZ
WOUND_Z_BOTTOM = SKIN_LZ - WOUND_D
ADH_R = WOUND_R
ADH_T = WOUND_D

# Material: Skin (Mooney-Rivlin) [MPa, tonne/mm^3]
C10_SKIN = 0.08
C01_SKIN = 0.02
D1_SKIN  = 0.01
RHO_SKIN = 1.05e-9

# Material: Adhesive d-SMG [MPa, tonne/mm^3]
E_ADH   = 0.0435
NU_ADH  = 0.45
RHO_ADH = 1.0e-9

# Cohesive interface [MPa/mm, MPa, mJ/mm^2]
K_NN = 50.0
K_SS = 25.0
K_TT = 25.0
T_N0 = 0.05138
T_S0 = 0.02364
T_T0 = 0.02364
G_C  = 0.02427
ETA_BK = 1.0

# Initial pre-stress [MPa]
SIG_XX_0 = 0.020
SIG_YY_0 = 0.010

# Steps
T_EQUIL = 0.1
T_LOAD  = 1.0

# Load magnitudes
UX_UNIAXIAL   = 4.0
UX_BIAXIAL    = 2.0
UY_BIAXIAL    = 2.0
P_COMPRESSION = 0.010

# Mesh seeds [mm]
GLOBAL_SEED_SKIN = 2.0
GLOBAL_SEED_ADH  = 0.5
INTERFACE_SEED   = 0.25

N_INTERVALS = 20
JOB_NAME    = 'Job-SkinWoundSimulation'

# ============================================================
# CREATE MODEL
# ============================================================
mdb.Model(name='Model-SkinWound', modelType=STANDARD_EXPLICIT)
mdl = mdb.models['Model-SkinWound']
if 'Model-1' in mdb.models:
    del mdb.models['Model-1']

# ============================================================
# PART-SKIN
# ============================================================
s = mdl.ConstrainedSketch(name='__skin_rect__', sheetSize=100.0)
s.rectangle(point1=(-SKIN_LX/2.0, -SKIN_LY/2.0), point2=(SKIN_LX/2.0, SKIN_LY/2.0))
p_skin = mdl.Part(name='Part-Skin', dimensionality=THREE_D, type=DEFORMABLE_BODY)
p_skin.BaseSolidExtrude(sketch=s, depth=SKIN_LZ)
del mdl.sketches['__skin_rect__']

# Wound Cut
top_face_pt = (SKIN_LX / 4.0, SKIN_LY / 4.0, SKIN_LZ)
top_face = p_skin.faces.findAt((top_face_pt,))[0]

up_edge_pt = (0.0, SKIN_LY / 2.0, SKIN_LZ)
up_edge = p_skin.edges.findAt((up_edge_pt,))[0]

t_wound = p_skin.MakeSketchTransform(
    sketchPlane=top_face, sketchUpEdge=up_edge,
    sketchPlaneSide=SIDE1, sketchOrientation=RIGHT,
    origin=(0.0, 0.0, SKIN_LZ)
)

s_wound = mdl.ConstrainedSketch(name='__wound_circle__', sheetSize=50.0, transform=t_wound)
p_skin.projectReferencesOntoSketch(sketch=s_wound, filter=COPLANAR_EDGES)
s_wound.CircleByCenterPerimeter(center=(0.0, 0.0), point1=(WOUND_R, 0.0))

p_skin.CutExtrude(
    sketchPlane=top_face, sketchUpEdge=up_edge,
    sketchPlaneSide=SIDE1, sketchOrientation=RIGHT,
    sketch=s_wound, depth=WOUND_D, flipExtrudeDirection=OFF
)
del mdl.sketches['__wound_circle__']

# ============================================================
# PART-ADHESIVE
# ============================================================
s_adh = mdl.ConstrainedSketch(name='__adh_circle__', sheetSize=50.0)
s_adh.CircleByCenterPerimeter(center=(0.0, 0.0), point1=(ADH_R, 0.0))
p_adh = mdl.Part(name='Part-Adhesive', dimensionality=THREE_D, type=DEFORMABLE_BODY)
p_adh.BaseSolidExtrude(sketch=s_adh, depth=ADH_T)
del mdl.sketches['__adh_circle__']

# ============================================================
# MATERIALS & SECTIONS
# ============================================================
mat_skin = mdl.Material(name='Mat-Skin')
mat_skin.Density(table=((RHO_SKIN,),))
mat_skin.Hyperelastic(
    materialType=ISOTROPIC, testData=OFF, type=MOONEY_RIVLIN,
    volumetricResponse=VOLUMETRIC_DATA, table=((C10_SKIN, C01_SKIN, D1_SKIN),)
)

mat_adh = mdl.Material(name='Mat-Adhesive')
mat_adh.Density(table=((RHO_ADH,),))
mat_adh.Elastic(table=((E_ADH, NU_ADH),))

mdl.HomogeneousSolidSection(name='Sec-Skin', material='Mat-Skin', thickness=None)
mdl.HomogeneousSolidSection(name='Sec-Adhesive', material='Mat-Adhesive', thickness=None)

p_skin.SectionAssignment(
    region=regionToolset.Region(cells=p_skin.cells[:]),
    sectionName='Sec-Skin', offset=0.0,
    offsetType=MIDDLE_SURFACE, offsetField='', thicknessAssignment=FROM_SECTION
)
p_adh.SectionAssignment(
    region=regionToolset.Region(cells=p_adh.cells[:]),
    sectionName='Sec-Adhesive', offset=0.0,
    offsetType=MIDDLE_SURFACE, offsetField='', thicknessAssignment=FROM_SECTION
)

# ============================================================
# ASSEMBLY
# ============================================================
a = mdl.rootAssembly
a.DatumCsysByDefault(CARTESIAN)
inst_skin = a.Instance(name='Part-Skin-1', part=p_skin, dependent=ON)
inst_adh  = a.Instance(name='Part-Adhesive-1', part=p_adh, dependent=ON)

a.translate(instanceList=('Part-Adhesive-1',), vector=(0.0, 0.0, WOUND_Z_BOTTOM))

# ============================================================
# MESH & ELEMENTS
# ============================================================
et_skin_hex = mesh.ElemType(elemCode=C3D8RH, elemLibrary=STANDARD, hourglassControl=ENHANCED)
et_skin_wed = mesh.ElemType(elemCode=C3D6H, elemLibrary=STANDARD)
et_skin_tet = mesh.ElemType(elemCode=C3D4H, elemLibrary=STANDARD)
p_skin.setElementType(
    regions=regionToolset.Region(cells=p_skin.cells[:]),
    elemTypes=(et_skin_hex, et_skin_wed, et_skin_tet)
)

et_adh_hex = mesh.ElemType(elemCode=C3D8R, elemLibrary=STANDARD, hourglassControl=ENHANCED)
et_adh_wed = mesh.ElemType(elemCode=C3D6, elemLibrary=STANDARD)
et_adh_tet = mesh.ElemType(elemCode=C3D4, elemLibrary=STANDARD)
p_adh.setElementType(
    regions=regionToolset.Region(cells=p_adh.cells[:]),
    elemTypes=(et_adh_hex, et_adh_wed, et_adh_tet)
)

p_skin.seedPart(size=GLOBAL_SEED_SKIN, deviationFactor=0.1, minSizeFactor=0.1)
p_adh.seedPart(size=GLOBAL_SEED_ADH, deviationFactor=0.1, minSizeFactor=0.1)

skin_iface_edges = p_skin.edges.getByBoundingBox(
    xMin=-WOUND_R-0.1, xMax=WOUND_R+0.1, yMin=-WOUND_R-0.1, yMax=WOUND_R+0.1,
    zMin=WOUND_Z_BOTTOM-0.1, zMax=WOUND_Z_TOP+0.1
)
if skin_iface_edges:
    p_skin.seedEdgeBySize(edges=skin_iface_edges, size=INTERFACE_SEED, constraint=FINER)

adh_all_edges = p_adh.edges.getByBoundingBox(
    xMin=-ADH_R-0.1, xMax=ADH_R+0.1, yMin=-ADH_R-0.1, yMax=ADH_R+0.1,
    zMin=-0.1, zMax=ADH_T+0.1
)
if adh_all_edges:
    p_adh.seedEdgeBySize(edges=adh_all_edges, size=INTERFACE_SEED, constraint=FINER)

p_skin.generateMesh()
p_adh.generateMesh()
a.regenerate()

# ============================================================
# SETS & SURFACES
# ============================================================
fsb = inst_skin.faces.findAt(((0.0, 0.0, 0.0),))
a.Set(faces=fsb, name='Set-SkinBottom')

fXm = inst_skin.faces.findAt(((-SKIN_LX/2.0, 0.0, SKIN_LZ/2.0),))
a.Set(faces=fXm, name='Set-SkinXminus')
fXp = inst_skin.faces.findAt(((SKIN_LX/2.0, 0.0, SKIN_LZ/2.0),))
a.Set(faces=fXp, name='Set-SkinXplus')

fYm = inst_skin.faces.findAt(((0.0, -SKIN_LY/2.0, SKIN_LZ/2.0),))
a.Set(faces=fYm, name='Set-SkinYminus')
fYp = inst_skin.faces.findAt(((0.0, SKIN_LY/2.0, SKIN_LZ/2.0),))
a.Set(faces=fYp, name='Set-SkinYplus')

fWB = inst_skin.faces.findAt(((1.0, 0.0, WOUND_Z_BOTTOM),))
a.Set(faces=fWB, name='Set-WoundBed')
a.Surface(side1Faces=fWB, name='Surf-WoundBed')

fWW = inst_skin.faces.findAt(((WOUND_R, 0.0, WOUND_Z_BOTTOM + WOUND_D/2.0),))
a.Set(faces=fWW, name='Set-WoundWall')
a.Surface(side1Faces=fWW, name='Surf-WoundWall')

fAL = inst_adh.faces.findAt(((ADH_R, 0.0, WOUND_Z_BOTTOM + ADH_T/2.0),))
a.Surface(side1Faces=fAL, name='Surf-AdhLateral')

fABot = inst_adh.faces.findAt(((1.0, 0.0, WOUND_Z_BOTTOM),))
a.Surface(side1Faces=fABot, name='Surf-AdhBottom')

fATop = inst_adh.faces.findAt(((0.0, 0.0, WOUND_Z_TOP),))
a.Set(faces=fATop, name='Set-AdhTop')
a.Surface(side1Faces=fATop, name='Surf-AdhTop')

a.Set(cells=inst_skin.cells[:], name='Set-AllSkinCells')
a.Set(cells=inst_adh.cells[:],  name='Set-AllAdhCells')

# ============================================================
# INTERACTIONS
# ============================================================
if USE_COHESIVE:
    mdl.ContactProperty('IntProp-Cohesive')
    prop = mdl.interactionProperties['IntProp-Cohesive']
    prop.CohesiveBehavior(
        defaultPenalties=OFF, coupling=UNCOUPLED, table=((K_NN, K_SS, K_TT),)
    )

    # 2017 damage fallbacks
    _dmg_args = [
        dict(criterion=MAX_STRESS, initTable=((T_N0, T_S0, T_T0),),
             useEvolution=ON, evolutionType=ENERGY, softening=LINEAR,
             useMixedMode=ON, mixedModeBehavior=BK,
             evolTable=((G_C, G_C, G_C, ETA_BK),)),
        dict(criterion=MAX_STRESS, initTable=((T_N0, T_S0, T_T0),),
             useEvolution=ON, evolutionType=ENERGY, softening=LINEAR,
             useMixedMode=ON, mixedModeBehavior=POWER_LAW,
             evolTable=((G_C, G_C, G_C, ETA_BK),)),
        dict(criterion=MAX_STRESS, initTable=((T_N0, T_S0, T_T0),),
             useEvolution=ON, evolutionType=ENERGY, evolTable=((G_C,),)),
        dict(criterion=MAX_STRESS, initTable=((T_N0, T_S0, T_T0),),
             useEvolution=ON, evolutionType=ENERGY),
        dict(criterion=MAX_STRESS, initTable=((T_N0, T_S0, T_T0),))
    ]
    for _kw in _dmg_args:
        try:
            prop.Damage(**_kw)
            break
        except Exception:
            pass

    mdl.SurfaceToSurfaceContactStd(
        name='Int-LateralCohesive', createStepName='Initial',
        master=a.surfaces['Surf-WoundWall'], slave=a.surfaces['Surf-AdhLateral'],
        sliding=SMALL, thickness=ON, interactionProperty='IntProp-Cohesive', adjustMethod=NONE
    )
    mdl.SurfaceToSurfaceContactStd(
        name='Int-BottomCohesive', createStepName='Initial',
        master=a.surfaces['Surf-WoundBed'], slave=a.surfaces['Surf-AdhBottom'],
        sliding=SMALL, thickness=ON, interactionProperty='IntProp-Cohesive', adjustMethod=NONE
    )
else:
    mdl.Tie(name='Tie-Lateral', master=a.surfaces['Surf-WoundWall'], slave=a.surfaces['Surf-AdhLateral'], positionToleranceMethod=COMPUTED, adjust=ON, tieRotations=ON, thickness=ON)
    mdl.Tie(name='Tie-Bed', master=a.surfaces['Surf-WoundBed'], slave=a.surfaces['Surf-AdhBottom'], positionToleranceMethod=COMPUTED, adjust=ON, tieRotations=ON, thickness=ON)

# ============================================================
# STEPS
# ============================================================
mdl.StaticStep(
    name='Step-Equil', previous='Initial', timePeriod=T_EQUIL, nlgeom=ON,
    initialInc=0.01, minInc=1.0e-5, maxInc=0.01, maxNumInc=1000
)
mdl.StaticStep(
    name='Step-Load', previous='Step-Equil', timePeriod=T_LOAD, nlgeom=ON,
    initialInc=0.01, minInc=1.0e-6, maxInc=0.05, maxNumInc=2000
)

# ============================================================
# INITIAL CONDITIONS
# ============================================================
_stress_set = False
for _fn_name in ('StressField', 'Stress', 'InitialStress', 'PredefinedStress'):
    if hasattr(mdl, _fn_name):
        try:
            getattr(mdl, _fn_name)(
                name='IC-Prestress', createStepName='Initial',
                region=a.sets['Set-AllSkinCells'], distributionType=UNIFORM,
                sigma11=SIG_XX_0, sigma22=SIG_YY_0, sigma33=0.0,
                sigma12=0.0, sigma13=0.0, sigma23=0.0
            )
            _stress_set = True
            break
        except Exception:
            pass

_field_set = False
for _fn_name in ('Field', 'FieldState', 'PredefinedField'):
    if hasattr(mdl, _fn_name):
        try:
            getattr(mdl, _fn_name)(
                name='IC-HydrationField', createStepName='Initial',
                region=a.sets['Set-AllAdhCells'], distributionType=UNIFORM,
                fieldVariableNum=1, magnitudes=(1.0,)
            )
            _field_set = True
            break
        except Exception:
            pass

# ============================================================
# BOUNDARY CONDITIONS
# ============================================================
# Base gets u3=0 only to avoid overconstraining the edges shared with Xm/Ym faces
mdl.DisplacementBC(
    name='BC-PinnedBase', createStepName='Step-Equil',
    region=a.sets['Set-SkinBottom'], u3=0.0
)
mdl.DisplacementBC(
    name='BC-EquilXm', createStepName='Step-Equil',
    region=a.sets['Set-SkinXminus'], u1=0.0
)
mdl.DisplacementBC(
    name='BC-EquilYm', createStepName='Step-Equil',
    region=a.sets['Set-SkinYminus'], u2=0.0
)
# To prevent rigid body motion in X/Y during equilibrium since base is only constrained in Z
mdl.DisplacementBC(
    name='BC-EquilXp', createStepName='Step-Equil',
    region=a.sets['Set-SkinXplus'], u1=0.0
)
mdl.DisplacementBC(
    name='BC-EquilYp', createStepName='Step-Equil',
    region=a.sets['Set-SkinYplus'], u2=0.0
)

if LOAD_CASE == 'UNIAXIAL':
    mdl.boundaryConditions['BC-EquilXp'].deactivate('Step-Load')
    mdl.DisplacementBC(name='BC-Load-Xp', createStepName='Step-Load', region=a.sets['Set-SkinXplus'], u1=UX_UNIAXIAL)
elif LOAD_CASE == 'BIAXIAL':
    mdl.boundaryConditions['BC-EquilXm'].deactivate('Step-Load')
    mdl.boundaryConditions['BC-EquilXp'].deactivate('Step-Load')
    mdl.boundaryConditions['BC-EquilYm'].deactivate('Step-Load')
    mdl.boundaryConditions['BC-EquilYp'].deactivate('Step-Load')
    mdl.DisplacementBC(name='BC-Load-Xm', createStepName='Step-Load', region=a.sets['Set-SkinXminus'], u1=-UX_BIAXIAL)
    mdl.DisplacementBC(name='BC-Load-Xp', createStepName='Step-Load', region=a.sets['Set-SkinXplus'], u1=UX_BIAXIAL)
    mdl.DisplacementBC(name='BC-Load-Ym', createStepName='Step-Load', region=a.sets['Set-SkinYminus'], u2=-UY_BIAXIAL)
    mdl.DisplacementBC(name='BC-Load-Yp', createStepName='Step-Load', region=a.sets['Set-SkinYplus'], u2=UY_BIAXIAL)
elif LOAD_CASE == 'COMPRESSION':
    pass # All 4 sides remain fixed in-plane, base in Z, pressure on top
    mdl.Pressure(
        name='Load-Compression', createStepName='Step-Load',
        region=a.surfaces['Surf-AdhTop'], distributionType=UNIFORM,
        magnitude=P_COMPRESSION
    )

# ============================================================
# OUTPUT & JOB
# ============================================================
for k in list(mdl.fieldOutputRequests.keys()): del mdl.fieldOutputRequests[k]
for k in list(mdl.historyOutputRequests.keys()): del mdl.historyOutputRequests[k]

# Try full variable set first, fallback to safer subsets for older Abaqus versions
FO_VARS_ATTEMPTS = [
    ('S', 'LE', 'U', 'CPRESS', 'CSHEAR', 'CSDMG', 'CSTATUS'),
    ('S', 'LE', 'U', 'CPRESS', 'CSTRESS', 'CSDMG', 'CSTATUS'),
    ('S', 'LE', 'U', 'CPRESS', 'CSTRESS', 'CSTATUS'),
    ('S', 'LE', 'U', 'CPRESS', 'CSTATUS'),
    ('S', 'LE', 'U')
]

for attempt_vars in FO_VARS_ATTEMPTS:
    try:
        if 'FO-Equil' in mdl.fieldOutputRequests: del mdl.fieldOutputRequests['FO-Equil']
        if 'FO-Load' in mdl.fieldOutputRequests: del mdl.fieldOutputRequests['FO-Load']

        mdl.FieldOutputRequest(name='FO-Equil', createStepName='Step-Equil', variables=attempt_vars, numIntervals=N_INTERVALS)
        mdl.FieldOutputRequest(name='FO-Load', createStepName='Step-Load', variables=attempt_vars, numIntervals=N_INTERVALS)
        break
    except Exception:
        pass

ENERGY_VARS = ('ALLIE', 'ALLKE', 'ALLSE', 'ALLWK', 'ALLPD', 'ETOTAL')
mdl.HistoryOutputRequest(name='HO-Equil', createStepName='Step-Equil', variables=ENERGY_VARS, numIntervals=N_INTERVALS)
mdl.HistoryOutputRequest(name='HO-Load', createStepName='Step-Load', variables=ENERGY_VARS, numIntervals=N_INTERVALS)

mdb.Job(
    name=JOB_NAME, model='Model-SkinWound', memory=90, memoryUnits=PERCENTAGE,
    getMemoryFromAnalysis=True, explicitPrecision=SINGLE, nodalOutputPrecision=SINGLE,
    multiprocessingMode=DEFAULT, numCpus=4, numDomains=4
)
mdb.jobs[JOB_NAME].writeInput(consistencyChecking=OFF)
print('INFO: Input file written')

# mdb.jobs[JOB_NAME].submit(consistencyChecking=OFF)
# mdb.jobs[JOB_NAME].waitForCompletion()

mdb.saveAs(pathName='SkinWoundSimulation_%s.cae' % LOAD_CASE)
print('INFO: Script complete')
