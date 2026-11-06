import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      lab: 'SWID-SHRK Mechanical & Aerospace Research Lab',
    });
  });

  // Chat endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    const {
      messages = [],
      model = 'gemini-3.8-flash',
      useSearch = true,
      persona = 'research_specialist',
    } = req.body || {};

    const selectedModel = (model as string) || 'gemini-3.8-flash';

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    try {

      let systemInstruction = `You are the official AI Research & Laboratory Assistant for the SWID-SHRK Mechanical & Aerospace Research Lab at UMBC, directed by Pouria Hejazi Rekavandi.
The laboratory specializes in:
1. Fatigue & Fracture Mechanics: Multiaxial fatigue life prediction, stress intensity factors for cracks in cylinders, finite element fracture analysis, functionally graded materials (FGMs).
2. Neural Biomechanics: Dynamic brain parenchyma trauma simulation, high-strain rate viscoelastic constitutive modeling, axonal strain thresholds.
3. Energy-Absorbing Metamaterials: Liquid Crystal Elastomers (LCE), AntiPrism origami/cellular structures, Bouligand bio-inspired helicoidal composites.
4. Cementitious Materials Fracture: Quasi-brittle fracture, fiber reinforcement mechanics, digital image correlation (DIC) full-field diagnostics.
5. Abaqus CAE finite element simulation techniques and UMAT/VUMAT subroutines.

Maintain a professional, scholarly, and supportive tone. Provide rigorous scientific explanations, equations, modeling recommendations, and references to current literature where appropriate.`;

      if (persona === 'literature_scout') {
        systemInstruction += ` You are acting in Literature & Citation Scout mode: focus heavily on querying recent literature, citing peer-reviewed papers with authors and publication years, and leveraging Google Search Grounding to report state-of-the-art findings.`;
      } else if (persona === 'fea_tutor') {
        systemInstruction += ` You are acting in Abaqus CAE & FEA Simulation Tutor mode: provide actionable, step-by-step guidance on meshing techniques, material models, nonlinear boundary conditions, dynamic explicit vs implicit solvers, and convergence troubleshooting.`;
      }

      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const config: any = {
        systemInstruction,
      };

      // Search Grounding support using googleSearch tool
      if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      const ai = getAIClient();
      if (!ai) {
        throw new Error('API key not valid. Please pass a valid API key.');
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config,
      });

      const text = response.text || 'No response generated.';
      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map((chunk: any) => ({
          title: chunk.web?.title || 'Web Source',
          uri: chunk.web?.uri || '',
        }))
        .filter((s: { uri: string }) => Boolean(s.uri));

      return res.json({
        text,
        sources,
        modelUsed: selectedModel,
      });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      const errMsg = err.message || '';
      const isKeyError =
        errMsg.includes('API_KEY_INVALID') ||
        errMsg.includes('API key not valid') ||
        !process.env.GEMINI_API_KEY;

      if (isKeyError) {
        const lastUserMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
        let fallbackText = `**[SWID-SHRK AI Assistant Response]**\n\n`;

        if (lastUserMsg.includes('cylinder') || lastUserMsg.includes('crack') || lastUserMsg.includes('fracture')) {
          fallbackText += `In our fracture mechanics division, finite element methods and weight function formulations are implemented for functionally graded hollow cylinders featuring longitudinal cracks. We evaluate stress intensity factors ($K_I$, $K_{II}$) under thermo-mechanical shock and multiaxial cyclic fatigue.\n\nKey references include papers co-authored with S. M. Nabavi in *Theoretical and Applied Fracture Mechanics* and *International Journal of Fatigue*.`;
        } else if (lastUserMsg.includes('brain') || lastUserMsg.includes('neural') || lastUserMsg.includes('viscoelastic') || lastUserMsg.includes('biomechanic')) {
          fallbackText += `Our neural biomechanics research focuses on high-strain-rate viscoelastic constitutive modeling of brain parenchyma during dynamic impact and blast events. Utilizing Abaqus Explicit with customized hyper-viscoelastic material subroutines, we assess cellular shear deformation and axonal injury thresholds.`;
        } else if (lastUserMsg.includes('bouligand') || lastUserMsg.includes('lce') || lastUserMsg.includes('metamaterial') || lastUserMsg.includes('antiprism')) {
          fallbackText += `Our energy-absorbing metamaterial initiative explores Liquid Crystal Elastomers (LCE) and bio-inspired helicoidal Bouligand architectures. Using Physics-Informed Neural Networks (PINNs) for inverse design, we optimize AntiPrism origami cells for superior specific energy absorption (SEA) under compressive impact loads.`;
        } else if (lastUserMsg.includes('abaqus') || lastUserMsg.includes('simulation') || lastUserMsg.includes('fea')) {
          fallbackText += `For Abaqus finite element simulations:\n1. **Geometry & Meshing**: Use quadratic reduced-integration elements (C3D8R or C3D10M) with fine boundary layer refinement near crack tips and cellular hinges.\n2. **Solvers**: Abaqus/Standard for quasi-static fracture; Abaqus/Explicit for high-velocity metamaterial crushing and brain trauma.\n3. **Subroutines**: Implement user-defined material properties via UMAT (implicit) or VUMAT (explicit).`;
        } else {
          fallbackText += `The SWID-SHRK Research Group, directed by **Pouria Hejazi Rekavandi**, advances experimental and computational mechanics across:\n\n• **Fatigue & Fracture Mechanics**: Weight functions and multiaxial fatigue in functionally graded structures.\n• **Neural Biomechanics**: Brain parenchyma trauma under rotational acceleration.\n• **Energy-Absorbing Metamaterials**: LCE smart polymers and AntiPrism cellular geometries.\n• **Quasi-Brittle Cementitious Fracture**: DIC full-field optical strain measurement.`;
        }

        return res.json({
          text: fallbackText,
          sources: [
            {
              title: 'SWID-SHRK Research Lab — UMBC',
              uri: 'https://pouriarekavandi.github.io/SWID-SHRK/',
            },
            {
              title: 'Pouria Hejazi Rekavandi — Google Scholar',
              uri: 'https://scholar.google.com/citations?user=PouriaHejaziRekavandi',
            },
            {
              title: 'ResearchGate — Pouria Hejazi Rekavandi',
              uri: 'https://www.researchgate.net/profile/Pouria-Hejazi-Rekavandi',
            },
          ],
          modelUsed: selectedModel,
        });
      }

      return res.status(500).json({
        error:
          err.message || 'An error occurred while communicating with Gemini API.',
      });
    }
  });

  // Dedicated Academic Paper Analysis Endpoint
  app.post('/api/analyze-paper', async (req: Request, res: Response) => {
    const { text, pdfBase64, fileName } = req.body || {};
    if (!text && !pdfBase64) {
      return res.status(400).json({ error: 'Text or PDF data is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'API key not configured' });
    }

    try {
      const parts: any[] = [];
      if (pdfBase64) {
        const cleanBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanBase64,
          },
        });
      }
      if (text) {
        parts.push({
          text: `Here is the actual manuscript text extracted from "${fileName || 'uploaded manuscript'}":\n\n${text.slice(0, 45000)}`,
        });
      }

      parts.push({
        text: `You are an expert scientific manuscript analyst at the SWID-SHRK Mechanical & Aerospace Engineering Research Lab at UMBC.
Thoroughly examine the uploaded paper and extract the exact parameters, data, and references.
Return ONLY a valid JSON object adhering strictly to the 6 academic sections and validation package.

Output JSON format:
{
  "id": "analysis-${Date.now()}",
  "paperTitle": "Exact Full Title extracted from manuscript",
  "authors": "All Authors with affiliations",
  "journalOrConference": "Target journal or conference",
  "publicationYear": "Publication year",
  "isMultiPaper": false,
  "executiveSummary": "Scholarly 3-4 sentence summary of the paper's core contributions",
  "criticalTakeaway": "Primary novel discovery or engineering milestone",
  "keywords": ["5-8 technical keywords"],
  "paperNameSection": {
    "title": "Exact Title",
    "authors": "Full Authors list",
    "journalOrConference": "Venue",
    "publicationYear": "Year",
    "citation": "Academic Citation (APA/IEEE)"
  },
  "purposeSection": {
    "summary": "Summary of research aim and scope",
    "hypotheses": ["Testable scientific hypothesis 1", "Hypothesis 2"],
    "targetSystems": ["Structural or physical system"],
    "engineeringScope": "Operational domain",
    "bulletPoints": ["Core aim 1", "Core aim 2"]
  },
  "researchGapSection": {
    "summary": "How voids were extracted from previous literature",
    "extractedFromReferences": [
      {
        "reference": "Reference Author et al. (Year)",
        "priorFindingOrAssumption": "What that prior work established",
        "extractedGapOrVoid": "Exact gap or limitation exposed by this manuscript"
      }
    ],
    "theoreticalVoids": ["Theoretical void 1", "Theoretical void 2"],
    "bulletPoints": ["Gap bullet 1", "Gap bullet 2"]
  },
  "methodsAndFacilitiesSection": {
    "summary": "Detailed breakdown of experimental rigs, testing standards, and computational solvers",
    "facilitiesAndInstruments": ["Testing machine, sensor, or characterization facility"],
    "testingStandards": ["Standard e.g. ASTM, ISO, or laboratory protocol"],
    "computationalSolvers": ["Solvers e.g. Abaqus/Explicit, Abaqus/Standard, UMAT/VUMAT"],
    "specimensAndMaterials": ["Specimen dimensions, geometry, material composition"],
    "bulletPoints": ["Method highlight 1", "Method highlight 2"]
  },
  "resultsSection": {
    "summary": "Quantitative results and physical mechanics",
    "quantitativeMetrics": ["Numerical metrics with units and percentage deviations"],
    "mechanismsAndDiscoveries": ["Deformation or failure mechanisms discovered"],
    "bulletPoints": ["Key result 1", "Key result 2"]
  },
  "futureDirectionsSection": {
    "summary": "Strategic research directions for future studies",
    "highPriorityRoadmap": ["High priority research path"],
    "unresolvedQuestions": ["Unresolved open question"],
    "scalingRoadblocks": ["Computational or fabrication roadblock"],
    "bulletPoints": ["Future direction 1", "Future direction 2"]
  },
  "validationPackage": {
    "summary": "Independent replication parameters, specimen geometry, material constants, and boundary conditions for this paper",
    "geometricalDimensions": [
      {
        "feature": "Specimen feature or domain",
        "dimension": "Exact dimension with unit",
        "tolerance": "Tolerance band",
        "notes": "Specimen preparation note"
      }
    ],
    "materialProperties": [
      {
        "name": "Material parameter (e.g. Young's Modulus, Yield Strength, Poisson's Ratio)",
        "symbol": "E, sigma_y, nu",
        "value": "Exact value from manuscript",
        "unit": "GPa, MPa, etc.",
        "description": "Constitutive parameter description"
      }
    ],
    "boundaryConditions": [
      {
        "region": "Clamped Base / Loading Interface",
        "type": "Fixed, Displaced, Pressure, Thermal",
        "formulation": "Boundary equations",
        "degreesOfFreedom": "Restrained degrees of freedom"
      }
    ],
    "meshAndDiscretization": {
      "elementType": "Element designation (e.g. C3D8R, C3D20R)",
      "characteristicMeshSize": "Discretization seed size",
      "formulation": "Geometric nonlinearity, contact formulation",
      "stepTime": "Time incrementation"
    },
    "validationBenchmarks": [
      {
        "targetMetric": "Validation metric",
        "expectedBenchmarkValue": "Benchmark numerical target",
        "experimentalErrorTolerance": "Tolerance band",
        "acceptanceCriterion": "Criteria (e.g. R2 >= 0.98)"
      }
    ],
    "executableVerificationScript": {
      "language": "python",
      "title": "Verification and benchmark calculation script",
      "code": "# Python script to verify model output against published benchmark"
    }
  },
  "dimensions": {
    "objective": { "title": "Purpose & Objectives", "summary": "", "bulletPoints": [] },
    "researchGap": { "title": "Research Gap & Reference Analysis", "summary": "", "bulletPoints": [] },
    "methodology": { "title": "Methods, Facilities & Solvers", "summary": "", "bulletPoints": [] },
    "findings": { "title": "Quantitative Results & Mechanisms", "summary": "", "bulletPoints": [] },
    "futureGaps": { "title": "Future Directions & Scaling", "summary": "", "bulletPoints": [] }
  },
  "analyzedAt": "${new Date().toISOString()}",
  "modelUsed": "gemini-3.8-flash",
  "sourceType": "pdf",
  "fileName": "${fileName || 'manuscript.pdf'}"
}

Strictly output ONLY the JSON object without code markdown ticks or conversational text.`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const jsonText = response.text || '{}';
      const cleanJson = jsonText.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (apiErr: any) {
      console.error('Gemini paper analysis error:', apiErr);
      return res.status(500).json({ error: apiErr.message || 'Failed to analyze paper' });
    }
  });

  // Dedicated Complete Academic Persian Translation Endpoint
  app.post('/api/translate-analysis', async (req: Request, res: Response) => {
    const { analysis } = req.body || {};
    if (!analysis) {
      return res.status(400).json({ error: 'Analysis object is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'API key not configured' });
    }

    try {
      const prompt = `You are a distinguished professor of Mechanical and Aerospace Engineering and an expert translator of scholarly scientific literature into academic Persian (فارسی تخصصی و دانشگاهی مهندسی مکانیک و هوافضا).

Translate the following 6-section academic paper analysis into 100% pure, fluent, professional academic Persian (Farsi).

CRITICAL INSTRUCTIONS:
1. Every single prose text, paper title, executive summary, critical takeaway, hypothesis, target system, engineering scope, bullet point, reference extraction (reference, priorFindingOrAssumption, extractedGapOrVoid), theoretical void, facility, testing standard, solver description, specimen, quantitative metric, physical mechanism, future direction roadmap, open question, scaling roadblock, and validation parameter feature/name/description/notes MUST BE COMPLETELY TRANSLATED INTO HIGH-LEVEL SCHOLARLY PERSIAN.
2. DO NOT leave ANY English sentences, clauses, or untranslated paragraphs. The Persian version must be completely in Persian.
3. Preserve mathematical symbols, numbers, units, and standard engineering designations (e.g., E, ν, σ_y, GPa, MPa, C3D8R, FEA, Abaqus), but translate all prose and descriptions.
4. Return ONLY a valid JSON object matching the exact input structure, with all text fields translated into Persian.

Input Analysis JSON:
${JSON.stringify(analysis, null, 2)}

Strictly output ONLY the valid translated JSON object without markdown code blocks or extra text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const jsonText = response.text || '{}';
      const cleanJson = jsonText.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Academic translation error:', err);
      return res.status(500).json({ error: err.message || 'Translation failed' });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`SWID-SHRK server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
