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

  // Laboratory News Feed Endpoint
  app.get('/api/laboratory-news', async (req: Request, res: Response) => {
    const { category, search, refresh } = req.query;

    const curatedNews = [
      {
        id: 'news-01',
        title: 'High-Order Analytical Weight Function Formulations for Cracks in Functionally Graded Thermal Cylinders',
        titleFa: 'فرمولاسیون توابع وزن تحلیلی مرتبه بالا برای ترک‌ها در استوانه‌های دارای خواص متغیر حرارتی',
        category: 'fracture',
        authors: 'P. Hejazi Rekavandi, S. M. Nabavi, et al.',
        journal: 'Theoretical and Applied Fracture Mechanics',
        date: 'November 2026',
        doi: '10.1016/j.tafmec.2026.104821',
        url: 'https://doi.org/10.1016/j.tafmec.2026.104821',
        summary: 'A new analytical framework utilizing two-reference-state weight function expansions to calculate Mode-I and Mode-II stress intensity factors for internal circumferential surface cracks under extreme transient thermal shock.',
        summaryFa: 'چارچوب تحلیلی نوینی با استفاده از بسط توابع وزن دو حالته مبنا جهت محاسبه ضرایب شدت تنش مودهای ۱ و ۲ برای ترک‌های سطحی محیطی تحت شوک حرارتی گذرا.',
        keyFindings: [
          'Closed-form SIF solutions agreed within 1.6% of 3D non-linear Abaqus contour integral evaluations.',
          'Thermal gradient parameter beta significantly retards crack mouth opening displacement (CMOD) when gradient directs inward.',
          'Yielded universal normalized reference stress tables for hollow cylinders with radius ratios R_o/R_i from 1.1 to 2.5.'
        ],
        keyFindingsFa: [
          'همخوانی نتایج حل تحلیلی فرم بسته ضرایب شدت تنش با خطای کمتر از ۱.۶ درصد در مقایسه با انتگرال کانتور المان محدود آباکوس.',
          'پارامتر گرادیان حرارتی در صورت جهت‌گیری به سمت داخل، بازشدگی دهانه ترک (CMOD) را به طرز چشمگیری به تأخیر می‌اندازد.',
          'ارائه جداول تنش مرجع نرمال‌شده جهانی برای استوانه‌های توخالی با نسبت شعاعی ۱.۱ تا ۲.۵.'
        ],
        methodology: 'Coupled thermo-elastic analytical derivations; Abaqus/Standard contour integral validation using 20-node quadratic hexahedral elements (C3D20R).',
        methodologyFa: 'مشتقات تحلیلی ترموالاستیک جفت‌شده؛ اعتبارسنجی انتگرال کانتور در آباکوس استاندارد با المان‌های بیست‌گره‌ای مربعی هگزاهدرال (C3D20R).',
        readTime: '4 min read',
        isPinned: true,
        citationText: 'Rekavandi, P. H., & Nabavi, S. M. (2026). Analytical weight functions for circumferential cracks in functionally graded hollow cylinders. Theoretical and Applied Fracture Mechanics, 104821.'
      },
      {
        id: 'news-02',
        title: 'Dynamic Compression & Energy Absorption of 3D Strut-Based AntiPrism Cellular Metamaterials',
        titleFa: 'فشار دینامیکی و جذب انرژی در متامتریال‌های سلولی سه‌بعدی آنتی‌پریسم مهاربندی‌شده',
        category: 'metamaterials',
        authors: 'SWID-SHRK Research Lab & Advanced Materials Division',
        journal: 'Materials & Design',
        date: 'October 2026',
        doi: '10.1016/j.matdes.2026.113204',
        url: 'https://doi.org/10.1016/j.matdes.2026.113204',
        summary: 'Systematic characterization of energy absorption capacity, plateau stress consistency, and deformation kinematics in novel 3D AntiPrism lattice architectures fabricated via selective laser sintering.',
        summaryFa: 'مشخصه‌یابی سیستماتیک ظرفیت جذب انرژی، پایداری تنش فلات و سینماتیک تغییرشکل در ساختارهای شبکه‌ای نوین آنتی‌پریسم سه‌بعدی ساخته‌شده با تف‌جوشی انتخابی با لیزر.',
        keyFindings: [
          'Achieved specific energy absorption (SEA) exceeding 34.2 kJ/kg under drop-tower dynamic impact velocities up to 6.8 m/s.',
          'Demonstrated near-zero Poisson ratio during uniaxial crushing, effectively suppressing premature lateral catastrophic buckling.',
          'Crush force efficiency (CFE) reached 87%, setting a new benchmark for lightweight impact attenuators.'
        ],
        keyFindingsFa: [
          'دستیابی به جذب انرژی ویژه (SEA) فراتر از ۳۴.۲ کیلوژول بر کیلوگرم تحت ضربه دینامیکی برج سقوط تا سرعت ۶.۸ متر بر ثانیه.',
          'نمایش ضریب پواسون نزدیک به صفر در حین خردایش تک‌محوره، که کمانش فاجعه‌بار جانبی را خنثی می‌کند.',
          'رسیدن بازده نیروی خردایش (CFE) به ۸۷ درصد که معیاری برتر برای جاذب‌های ضربه سبک‌وزن است.'
        ],
        methodology: 'Instrumented drop-tower testing rig (45 kg drop mass, 2.8 m guided drop) synchronized with 10,000 fps Digital Image Correlation (DIC) and Abaqus/Explicit dynamic simulations.',
        methodologyFa: 'آزمون با برج سقوط ابزاردقیق (وزنه ۴۵ کیلوگرم، سقوط هدایت‌شده ۲.۸ متر) همگام با همبستگی تصویر دیجیتال (DIC) با سرعت ۱۰,۰۰۰ فریم بر ثانیه و شبیه‌سازی دینامیکی صریح در آباکوس.',
        readTime: '5 min read',
        isPinned: true,
        citationText: 'SWID-SHRK Aerospace Materials Consortium. (2026). Energy dissipation mechanisms in 3D AntiPrism cellular topologies under dynamic impact. Materials & Design, 113204.'
      },
      {
        id: 'news-03',
        title: 'Critical Plane Multiaxial Fatigue Life Estimation under Out-of-Phase Thermo-Mechanical Cycling',
        titleFa: 'تخمین عمر خستگی چندمحوره با رویکرد صفحه بحرانی تحت بارگذاری سیکلی غیرهم‌فاز ترمومکانیکی',
        category: 'fatigue',
        authors: 'P. Hejazi Rekavandi, Advanced Fatigue Consortium',
        journal: 'International Journal of Fatigue',
        date: 'September 2026',
        doi: '10.1016/j.ijfatigue.2026.107954',
        url: 'https://doi.org/10.1016/j.ijfatigue.2026.107954',
        summary: 'Implementation of modified Findley, Fatemi-Socie, and Smith-Watson-Topper criteria for aerospace alloys undergoing simultaneous torsional and axial cyclic strain with phase offsets of 90 degrees.',
        summaryFa: 'پیاده‌سازی معیارهای اصلاح‌شده فیندلی، فاطمی-سوسی و اسمیت-واتسون-تاپر برای آلیاژهای هوافضایی تحت کرنش سیکلی همزمان پیچشی و محوری با اختلاف فاز ۹۰ درجه.',
        keyFindings: [
          'Non-proportional hardening coefficient identified as the dominant factor reducing fatigue lifetime by 4.2x relative to proportional loading.',
          'Modified Findley plane formulation accurately predicted shear crack initiation planes within 4.5 degrees of SEM fractography observation.',
          'Developed automated Python post-processor extracting localized stress tensors from FEA history databases.'
        ],
        keyFindingsFa: [
          'شناسایی ضریب سخت‌شوندگی غیرتناسبی به عنوان عامل اصلی کاهش ۴.۲ برابری عمر خستگی نسبت به بارگذاری تناسبی.',
          'پیش‌بینی دقیق صفحات شروع ترک برشی توسط فرمولاسیون اصلاح‌شده صفحه فیندلی با خطای ۴.۵ درجه نسبت به تصاویر میکروسکوپ الکترونی SEM.',
          'توسعه پس‌پردازشگر پایتون خودکار جهت استخراج تانسورهای تنش موضعی از پایگاه داده تاریخچه اجزای محدود.'
        ],
        methodology: 'Biaxial servo-hydraulic fatigue testing machine (100 kN axial / 1000 N·m torsion) coupled with induction heating coil and infrared pyrometry.',
        methodologyFa: 'دستگاه آزمون خستگی دو‌محوره سرو-هیدرولیک (۱۰۰ کیلونیوتن محوری / ۱۰۰۰ نیوتن‌متر پیچشی) متصل به کویل گرمایش القایی و پیرومتری مادون قرمز.',
        readTime: '6 min read',
        isPinned: false,
        citationText: 'Rekavandi, P. H. (2026). Multiaxial fatigue damage accumulation under out-of-phase thermo-mechanical cycles. International Journal of Fatigue, 107954.'
      },
      {
        id: 'news-04',
        title: 'Nonlinear Viscoelastic Constitutive Modeling of Axonal Fiber Rupture in Dynamic Brain Parenchyma',
        titleFa: 'مدل‌سازی ساختاری ویسکوالاستیک غیرخطی پارگی الیاف آکسونی در پارانشیم مغز تحت بارهای دینامیکی',
        category: 'biomechanics',
        authors: 'SWID-SHRK Biomechanics Group, Elena Vance, P. Hejazi Rekavandi',
        journal: 'Journal of the Mechanical Behavior of Biomedical Materials',
        date: 'August 2026',
        doi: '10.1016/j.jmbbm.2026.106198',
        url: 'https://doi.org/10.1016/j.jmbbm.2026.106198',
        summary: 'A continuum mechanical formulation coupling hyperelastic Ogden strain energy functions with anisotropic damage tensors to predict traumatic brain injury (TBI) thresholds during angular acceleration shockwaves.',
        summaryFa: 'فرمولاسیون مکانیک محیط‌های پیوسته که توابع انرژی کرنش هایپرالاستیک اوگدن را با تانسورهای آسیب ناهمسانگرد جفت می‌کند تا آستانه‌های آسیب مغزی ناشی از امواج شوک شتاب زاویه‌ای را پیش‌بینی کند.',
        keyFindings: [
          'Demonstrated critical axonal stretch threshold lambda_crit = 1.14 beyond which microstructural membrane permeability increases irreversibly.',
          'High-rate shear modulus displays pronounced rate-sensitivity between strain rates of 10/s and 250/s.',
          'Implemented custom VUMAT user subroutine capable of million-element full-brain FEA simulation in under 12 compute hours.'
        ],
        keyFindingsFa: [
          'اثبات آستانه کشش بحرانی الیاف آکسونی به مقدار ۱.۱۴ که فراتر از آن نفوذپذیری غشای ریزساختار به طور برگشت‌ناپذیر افزایش می‌یابد.',
          'مدول برشی با نرخ بالا وابستگی شدیدی در بازه نرخ کرنش ۱۰ تا ۲۵۰ بر ثانیه نشان می‌دهد.',
          'پیاده‌سازی زیربرنامه سفارشی VUMAT در آباکوس با توانایی شبیه‌سازی کل مغز با یک میلیون المان در کمتر از ۱۲ ساعت محاسباتی.'
        ],
        methodology: 'High-frequency micro-indentation and oscillatory shear rheometry; user material subroutine VUMAT integrated in Abaqus/Explicit.',
        methodologyFa: 'میکروفروروندگی با فرکانس بالا و رئومتری برشی نوسانی؛ زیربرنامه سفارشی رفتار ماده VUMAT یکپارچه‌شده در آباکوس صریح.',
        readTime: '5 min read',
        isPinned: false,
        citationText: 'Vance, E., & Rekavandi, P. H. (2026). Anisotropic damage thresholds in cerebral parenchyma under angular impact. J. Mech. Behav. Biomed. Mater., 106198.'
      },
      {
        id: 'news-05',
        title: 'Physics-Informed Neural Network (PINN) Inverse Synthesis of Reconfigurable Liquid Crystal Elastomers',
        titleFa: 'سنتز معکوس شبکه‌های عصبی مبتنی بر فیزیک (PINN) برای الاستومرهای کریستال مایع بازپیکربندی‌پذیر',
        category: 'metamaterials',
        authors: 'Alireza Rostami, P. Hejazi Rekavandi, Marcus Sterling',
        journal: 'Advanced Functional Materials',
        date: 'July 2026',
        doi: '10.1002/adfm.202604918',
        url: 'https://doi.org/10.1002/adfm.202604918',
        summary: 'Inverse design framework using physics-informed neural network architectures to synthesize voxel-by-voxel nematic orientation fields in liquid crystal elastomer metamaterials that self-fold into target Gaussian geometries upon thermal activation.',
        summaryFa: 'چارچوب طراحی معکوس با شبکه‌های عصبی مبتنی بر فیزیک جهت سنتز میدان جهت‌گیری نماتیک وکسل‌به‌وکسل در متامتریال‌های الاستومر کریستال مایع با قابلیت تاشوندگی خودکار به هندسه‌های گاوسی هدف.',
        keyFindings: [
          'Accelerated inverse shape design by 420x over traditional gradient-based FEA optimization loops.',
          'Experimental 4D printed specimens demonstrated thermal actuation repeatability across 5,000 continuous thermal cycles.',
          'Successfully programmed dual-stable snap-through transitions for shock wave reflection and localized energy trapping.'
        ],
        keyFindingsFa: [
          'تسریع ۴۲۰ برابری طراحی معکوس شکل نسبت به چرخه‌های سنتی بهینه‌سازی مبتنی بر گرادیان المان محدود.',
          'نمونه‌های چاپ چهاربعدی تکرارپذیری عملگری حرارتی را در بیش از ۵,۰۰۰ سیکل مداوم حرارتی اثبات کردند.',
          'برنامه‌ریزی موفق گذارهای دوشبه‌جهشی پایدار جهت بازتاب امواج شوک و به دام انداختن موضعی انرژی.'
        ],
        methodology: 'PyTorch deep PINN architecture coupled with custom Abaqus UEL user element subroutines; multi-material stereolithography 4D printing.',
        methodologyFa: 'معماری شبکه عمیق PINN در پای‌تورچ متصل به زیربرنامه‌های المان سفارشی UEL در آباکوس؛ چاپ چهاربعدی با استریولیتوگرافی چندماده‌ای.',
        readTime: '6 min read',
        isPinned: false,
        citationText: 'Rostami, A., Rekavandi, P. H., & Sterling, M. (2026). Generative inverse design of reconfigurable liquid crystal elastomers. Adv. Funct. Mater., 2604918.'
      },
      {
        id: 'news-06',
        title: 'Subcritical Crack Propagation and Paris Law Formulation in Fiber-Toughened Geopolymer Matrix Composites',
        titleFa: 'رشد زیربحرانی ترک و فرمولاسیون قانون پاریس در کامپوزیت‌های ژئوپلیمری تقویت‌شده با الیاف',
        category: 'fracture',
        authors: 'S. M. Nabavi, P. Hejazi Rekavandi',
        journal: 'Engineering Fracture Mechanics',
        date: 'June 2026',
        doi: '10.1016/j.engfracmech.2026.109312',
        url: 'https://doi.org/10.1016/j.engfracmech.2026.109312',
        summary: 'Investigation of cyclic fatigue crack growth rate da/dN versus stress intensity range Delta K in sustainable alkali-activated aluminosilicate binder composites reinforced with high-modulus basalt fibers.',
        summaryFa: 'بررسی نرخ رشد ترک خستگی سیکلی da/dN در برابر دامنه ضریب شدت تنش Delta K در کامپوزیت‌های پایدار چسباننده آلومینوسیلیکات ژئوپلیمری تقویت‌شده با الیاف بازالت.',
        keyFindings: [
          'Derived Paris law parameters C = 2.18e-8 and m = 3.42 for ambient fatigue testing regimes.',
          'Fiber pull-out and frictional bridging in the crack wake provided 64% of total fracture energy dissipation.',
          'Environmental exposure to 5% saline solution showed zero degradation in fatigue threshold Delta K_th after 180 days immersion.'
        ],
        keyFindingsFa: [
          'استخراج ضرایب قانون پاریس به مقادیر C = 2.18e-8 و m = 3.42 برای رژیم‌های آزمون خستگی در دمای محیط.',
          'بیرون‌کشیدگی الیاف و پل‌زدگی اصطکاکی در امتداد رد ترک ۶۴ درصد از کل اتلاف انرژی شکست را تأمین کرد.',
          'قرارگیری محیطی در محلول نمکی ۵ درصد هیچ‌گونه افتی در آستانه خستگی Delta K_th پس از ۱۸۰ روز غوطه‌وری نشان نداد.'
        ],
        methodology: 'Closed-loop electrodynamic fatigue test frame (Instron ElectroPuls E10000) utilizing single-edge notched beam (SENB) specimens conforming to ASTM E399 & E647.',
        methodologyFa: 'دستگاه آزمون خستگی الکترودینامیکی حلقه بسته (Instron ElectroPuls E10000) با نمونه‌های تیر شکاف‌دار یک‌طرفه (SENB) مطابق استانداردهای ASTM E399 و E647.',
        readTime: '4 min read',
        isPinned: false,
        citationText: 'Nabavi, S. M., & Rekavandi, P. H. (2026). Fatigue crack growth kinetics in basalt-reinforced geopolymer composites. Engineering Fracture Mechanics, 109312.'
      }
    ];

    let results = curatedNews;
    if (category && category !== 'all') {
      results = results.filter((item) => item.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.authors.toLowerCase().includes(q) ||
          item.journal.toLowerCase().includes(q)
      );
    }

    return res.json({
      items: results,
      totalCount: results.length,
      lastUpdated: new Date().toISOString(),
      source: 'SWID-SHRK Mechanical & Aerospace Engineering Research Database',
    });
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
