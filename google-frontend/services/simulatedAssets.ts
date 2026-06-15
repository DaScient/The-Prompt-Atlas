/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { ComplexityLevel, VisualStyle, Language, SearchResultItem, PromptAnalysis, GeneratedImage } from "../types";

export interface SimulatedChartData {
  facts: string[];
  imagePrompt: string;
  promptAnalysis: PromptAnalysis;
  searchResults: SearchResultItem[];
  svgContent: string;
}

// Generates a beautiful procedural SVG for any custom query that the user types
const generateDynamicSvg = (
  topic: string,
  level: ComplexityLevel,
  style: VisualStyle,
  language: Language,
  facts: string[]
): string => {
  const cleanTopic = topic.replace(/"/g, '&quot;');
  
  // Decide colors based on aesthetic
  let primaryColor = "#06b6d4"; // cyan
  let secondaryColor = "#6366f1"; // indigo
  let accentColor = "#f59e0b"; // amber
  let bgColor = "#020617";
  let textColor = "#f1f5f9";
  let fontStack = "ui-sans-serif, system-ui, sans-serif";
  let techGrid = true;
  let sketchStyle = false;

  if (style === "Minimalist") {
    primaryColor = "#0f172a";
    secondaryColor = "#475569";
    accentColor = "#94a3b8";
    bgColor = "#f8fafc";
    textColor = "#0f172a";
    techGrid = false;
  } else if (style === "Vintage" || style === "Sketch") {
    primaryColor = "#78350f"; // brownish
    secondaryColor = "#92400e";
    accentColor = "#b45309";
    bgColor = "#fefaf0"; // warm parchment
    textColor = "#292524";
    fontStack = "'Cinzel', 'Georgia', serif";
    techGrid = false;
    sketchStyle = true;
  } else if (style === "Cartoon") {
    primaryColor = "#3b82f6";
    secondaryColor = "#ec4899";
    accentColor = "#eab308";
    bgColor = "#eff6ff";
    textColor = "#1e3a8a";
    techGrid = false;
  }

  // Draw some custom shapes depending on the theme
  let shapesHtml = "";
  if (sketchStyle) {
    shapesHtml = `
      <!-- Sketch notes elements -->
      <path d="M 120 150 L 1400 150 M 120 750 L 1400 750" stroke="${primaryColor}" stroke-dasharray="5,15" stroke-width="1.5" opacity="0.4"/>
      <circle cx="800" cy="450" r="220" fill="none" stroke="${primaryColor}" stroke-dasharray="2,8" stroke-width="2" opacity="0.6"/>
      <circle cx="800" cy="450" r="180" fill="none" stroke="${secondaryColor}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 620 450 L 980 450 M 800 270 L 800 630" stroke="${accentColor}" stroke-width="1" opacity="0.4" stroke-dasharray="10,5"/>
      <rect x="580" y="230" width="440" height="440" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.3"/>
    `;
  } else if (techGrid) {
    shapesHtml = `
      <!-- Cybernetic / Futuristic HUD overlay -->
      <circle cx="800" cy="450" r="250" fill="none" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="5 20" opacity="0.25" />
      <circle cx="800" cy="450" r="230" fill="none" stroke="${secondaryColor}" stroke-width="2" opacity="0.4" />
      <circle cx="800" cy="450" r="180" fill="none" stroke="${accentColor}" stroke-width="1" stroke-dasharray="1 5" opacity="0.5"/>
      <path d="M 450,450 L 1150,450 M 800,100 L 800,800" stroke="${secondaryColor}" stroke-width="1" opacity="0.15" />
      <rect x="550" y="200" width="500" height="500" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="8,8" opacity="0.2" />
      <!-- Nodes -->
      <g stroke="${primaryColor}" stroke-width="2">
        <line x1="550" y1="200" x2="480" y2="150" opacity="0.6"/>
        <line x1="1050" y1="200" x2="1120" y2="150" opacity="0.6"/>
        <line x1="550" y1="700" x2="480" y2="750" opacity="0.6"/>
        <line x1="1050" y1="700" x2="1120" y2="750" opacity="0.6"/>
      </g>
    `;
  } else {
    // Minimalist / Modern vectors
    shapesHtml = `
      <!-- Elegant clean shapes -->
      <rect x="500" y="250" width="600" height="400" rx="30" fill="${primaryColor}" opacity="0.05" stroke="${secondaryColor}" stroke-width="2" stroke-dasharray="4,8"/>
      <circle cx="800" cy="450" r="150" fill="${secondaryColor}" opacity="0.1" />
      <polygon points="800,280 950,550 650,550" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.4" />
    `;
  }

  // Generate fact labels
  const factBoxes = facts.map((fact, index) => {
    const yPos = 240 + index * 120;
    const isLeft = index % 2 === 0;
    const xPos = isLeft ? 150 : 1050;
    const align = isLeft ? "start" : "end";
    const lineXStart = isLeft ? xPos + 320 : xPos - 40;
    const lineXEnd = 800;
    const lineYEnd = 450;

    return `
      <g class="fact-node" opacity="0.9">
        <!-- Connecting Line To Center -->
        <path d="M ${lineXStart} ${yPos + 40} Q ${isLeft ? lineXStart + 100 : lineXStart - 100} ${yPos + 40}, ${lineXEnd} ${lineYEnd}" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.3" />
        
        <!-- Fact Panel bg -->
        <rect x="${xPos}" y="${yPos}" width="400" height="90" rx="12" fill="${bgColor}" stroke="${accentColor}" stroke-width="1.5" opacity="0.95" />
        
        <!-- Index marker -->
        <circle cx="${isLeft ? xPos + 25 : xPos + 375}" cy="${yPos + 28}" r="12" fill="${secondaryColor}" />
        <text x="${isLeft ? xPos + 25 : xPos + 375}" y="${yPos + 32}" fill="${bgColor}" font-family="${fontStack}" font-size="11" font-weight="900" text-anchor="middle">0${index + 1}</text>
        
        <!-- Fact text (wrapped in ForeignObject for perfect multiline rendering) -->
        <foreignObject x="${xPos + 50}" y="${yPos + 10}" width="300" height="70">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color: ${textColor}; font-family: ${fontStack}; font-size: 11px; font-weight: 500; line-height: 1.4; pointer-events: none; padding-right: 5px;">
            ${fact}
          </div>
        </foreignObject>
      </g>
    `;
  }).join("\n");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" style="background-color: ${bgColor};">
      <defs>
        <radialGradient id="gradCentral" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${bgColor}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Background Grids -->
      ${techGrid ? `
        <g stroke="${primaryColor}" stroke-width="0.5" opacity="0.08">
          <path d="M 0 50 L 1600 50 M 0 100 L 1600 100 M 0 150 L 1600 150 M 0 200 L 1600 200 M 0 250 L 1600 250 M 0 300 L 1600 300 M 0 350 L 1600 350 M 0 400 L 1600 400 M 0 450 L 1600 450 M 0 500 L 1600 500 M 0 550 L 1600 550 M 0 600 L 1600 600 M 0 650 L 1600 650 M 0 700 L 1600 700 M 0 750 L 1600 750 M 0 800 L 1600 800 M 0 850 L 1600 850" />
          <path d="M 100 0 L 100 900 M 200 0 L 200 900 M 300 0 L 300 900 M 400 0 L 400 900 M 500 0 L 500 900 M 600 0 L 600 900 M 700 0 L 700 900 M 800 0 L 800 900 M 900 0 L 900 900 M 1000 0 L 1000 900 M 1100 0 L 1100 900 M 1200 0 L 1200 900 M 1300 0 L 1300 900 M 1400 0 L 1400 900 M 1500 0 L 1500 900" />
        </g>
      ` : ""}

      <!-- Ambient central engine glow -->
      <circle cx="800" cy="450" r="400" fill="url(#gradCentral)" />

      <!-- Beautiful Central Abstract System Art -->
      ${shapesHtml}

      <!-- Center Logo Box -->
      <g>
        <rect x="580" y="415" width="440" height="70" rx="35" fill="${bgColor}" stroke="${primaryColor}" stroke-width="2.5" />
        <text x="800" y="457" fill="${textColor}" font-family="${fontStack}" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="3">
          ${cleanTopic.toUpperCase()}
        </text>
      </g>

      <!-- Educational Facts Nodes -->
      ${factBoxes}

      <!-- Aesthetic / Meta Annotations -->
      <g font-family="${fontStack}" font-size="10" opacity="0.6" fill="${primaryColor}">
        <!-- Top Info Header -->
        <text x="80" y="60">NAVIGATIONAL ATLAS SCHEMA // v2.6</text>
        <text x="1520" y="60" text-anchor="end">AUDIENCE: ${level.toUpperCase()}</text>
        
        <!-- Bottom Info Footer -->
        <text x="80" y="850">THE PROMPT ATLAS ENGINE | GRAPHICS: ${style.toUpperCase()}</text>
        <text x="1520" y="850" text-anchor="end">SYSTEM LANGUAGE: ${language.toUpperCase()} | TARGET COMPLETED</text>
      </g>
    </svg>
  `;
};

/// Simulated research database representing key themes directly from the 14 chapters of the Prompt Atlas
export const simulatedDatabase: Record<string, Omit<SimulatedChartData, "svgContent">> = {
  "quantum superposition": {
    facts: [
      "Coexistence of States: Subatomic particles remain in all possible states simultaneously until direct measurement collapses the wave physical state into a single outcome.",
      "Schrödinger's Equation: Discovered by Erwin Schrödinger in 1925, it governs the deterministic wave dynamics of particles prior to physical measurement.",
      "Shor's Algorithm: Exploits quantum superpositions and interference to factor immense prime integer multiples exponentially faster than classical Turing models."
    ],
    imagePrompt: "Role: Quantum Physics Illustrator. Task: Create an orthographic dark blueprint depicting the wave-particle superposition of electrons. Parameters: Style is Futuristic Cyber Hologram HUD. Soft glowing vector paths mapping intersecting sinusoids and matrix projections. Palette: Dark slate backdrop with neon cyan and magenta highlights. Exclude: Low-quality, organic textures, three-quarter angles.",
    promptAnalysis: {
      framework: "RTPE (Role, Task, Parameters, Example)",
      role: "Quantum Visualization Cartographer specializing in cyber-neon technical holographic schematics.",
      constraints: "Zero organic textures, no cursive fonts, exclusively bind elements within neon grid cells, limit palette to cyan, indigo, and orange.",
      tips: [
        "When designing scientific vectors, use strict geometric constraints like 'orthographic blueprint' or 'tactical wireframe mesh' to suppress cartoon gradients.",
        "Anchor text layouts by demanding specific display fonts or terminal text overlays."
      ],
      optimizedPrompt: "Create a Futuristic holographic blueprint illustrating Quantum Superposition. Front view, orthographic technical projection. Grid mapping overlapping sinusoidal quantum waves (cyan and violet neon paths) intersecting a high-contrast state sphere. Minimal numbers and calibration coordinates, technical line work over charcoal canvas. Dark mode HUD style."
    },
    searchResults: [
      { title: "Quantum superposition theory - Wikipedia", url: "https://en.wikipedia.org/wiki/Quantum_superposition" },
      { title: "The Uncertainty Principle - Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/qt-uncertainty/" }
    ]
  },
  "citric acid atp cycle": {
    facts: [
      "Mitochondrial Core: Cellular respiration takes place within the inner folds (cristae) of the mitochondria, generating the electrochemical gradients of life.",
      "Energy Currency: The cycle oxidizes acetyl-CoA, releasing carbon dioxide while converting ADP to high-energy ATP molecular engines.",
      "NADH/FADH2 Synthesis: Stores chemical potential in reduction equivalents (coenzymes NADH and FADH2) for the downstream electron transport chain."
    ],
    imagePrompt: "Context: Biology textbook infographic for young adult learners. Action: Illustrate the Krebs Citric Acid cycle cascading through a mitochondrial membrane. Result: Vibrant educational manga cartoon style. Soft cel-shaded citric compounds, clear glowing input arrows showing oxygen, output arrows showing ATP power cells. Exclude: Photorealism, dark grunge grids.",
    promptAnalysis: {
      framework: "CARE (Context, Action, Result, Example)",
      role: "Vibrant biological cartoonist specializing in clear, bold contour metabolic flowcharts.",
      constraints: "No dark metallic highlights, no sketch scribbles, use soft clean cartoon cell shading, clear visible outlines.",
      tips: [
        "Specify directional arrows using active descriptions like 'glowing cascade' or 'kinetic pipeline conduits' to avoid static boxes.",
        "Keep molecular charts readable by setting max color constraints."
      ],
      optimizedPrompt: "A vibrant educational biology comic illustration of the Citric Acid respiration process. Bright textbook-appropriate vectors. Clear, bold-contoured diagram outlining metabolic cycles cascading inside a mitochondrial crista. Features fun comic-styled compounds with playful arrows tracing oxygen inputs and exploding glowing ATP molecules."
    },
    searchResults: [
      { title: "Citric acid cycle overview - Wikipedia", url: "https://en.wikipedia.org/wiki/Citric_acid_cycle" },
      { title: "Molecular Biology of the Cell - NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/NBK21163/" }
    ]
  },
  "lithospheric subduction": {
    facts: [
      "Deep Tectonic Trench: Oceanic plates slide beneath lighter continental masses, plunging into the asthenosphere to melt into magma reservoirs.",
      "Orogenic Volcanism: Squeezing of lithosphere plates generates seismic friction, forming majestic chains of standard arc volcanoes.",
      "Pacific Ring of Fire: Subduction zones outline the margins of the Pacific Ocean basin, hosting 90% of Earth's earthquake events."
    ],
    imagePrompt: "A high-definition geological cross-section of lithospheric plate subduction. Handdrawn, Leonardo da Vinci renaissance sketchbook style, exquisite detail, ink-hatching, handwriting annotations, faded sepia paper parchment. Showing magma convection currents, melting oceanic plate, active volcano crust. Exclude: Modern vectors, cyber lights.",
    promptAnalysis: {
      framework: "CARE framework paired with Socratic questioning parameters.",
      role: "16th-century scientific notebook illustrator drafts geological maps.",
      constraints: "Exclusively vintage ink wash, paper parchment textures, weathered borders, calligraphic labels, no digital neon elements.",
      tips: [
        "Incorporate keywords like 'lithograph hatching' or 'cross-section schematic' to get high-fidelity handdrawn strokes.",
        "Use sepia tone keywords over general vintage references to keep consistent golden-brown palettes."
      ],
      optimizedPrompt: "Exquisite technical cross-section of deep tectonic subduction. Beautiful vintage Da Vinci sketchbook aesthetic. Handdrawn sepia ink on aged, crinkled manuscript paper. Features lithographic hatching showing lithospheric tectonic plates colliding, magma convection currents boiling below, and mountain range formations. Handwriting annotations."
    },
    searchResults: [
      { title: "Subduction zones mechanics - Wikipedia", url: "https://en.wikipedia.org/wiki/Subduction" },
      { title: "Earthquake hazards and plate tectonic research - USGS", url: "https://www.usgs.gov/programs/earthquake-hazards" }
    ]
  },
  "alexandria library scrolls": {
    facts: [
      "Universal Scroll Catalog: Establishes humanity's first universal cataloging methods, storing over 400,000 papyrus scrolls at its peak.",
      "Scholastic Epistemology: Famous minds including Eratosthenes, Euclid, and Archimedes calculated the circumference of Earth and developed geometry.",
      "Serapeum Sister Library: Served as an adjunct academy of classical arts and early library preservation alongside the main Royal Library."
    ],
    imagePrompt: "A Symmetrical architectural perspective drawing of the interior scroll collection inside the ancient Library of Alexandria. 19th-century scientific lithograph engraving. Intricate Corinthian columns, soaring classical arches, warm gilded lighting, stacks of parchment scrolls arranged across majestic cedar shelving. Classical proportions. Highly detailed line work.",
    promptAnalysis: {
      framework: "RTPE Framework with classical architectural style rules.",
      role: "Editorial Classical Antiquity curator creating detailed lithographic maps.",
      constraints: "Limit colors to gold, aged ivory, and terracotta. Elegant borders, clean symmetry.",
      tips: [
        "Incorporate architectural terms like 'Corinthian capitals', 'gilded architraves', and 'axial symmetry' to build accurate historical spaces.",
        "Reference physical prints of historical engravings (from e.g. Piranesi or 19th-century publications) for classical texturing."
      ],
      optimizedPrompt: "A symmetrical classical engraving depicting the ancient Library of Alexandria. 19th-century scientific lithograph illustration. Fine detailed copperplate line art on textured warm ivory parchment. Rows of grand Corinthian columns, towering arched halls filled with scrolls nested inside elegant cedar racks. Classical scholars studying, soft celestial golden lighting."
    },
    searchResults: [
      { title: "The Great Library of Alexandria - Wikipedia", url: "https://en.wikipedia.org/wiki/Library_of_Alexandria" },
      { title: "Alexandrian Library history - Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Library-of-Alexandria" }
    ]
  },
  "profits with integrity": {
    facts: [
      "Value Redefined: Returns must transcend pure numerical margins to balance Resilience (community support), Opportunity, and Integrity (ecological boundaries).",
      "Stewardship Auditing: Rather than passive reporting, AI serves as an active structural auditor optimizing loops that replenish resources.",
      "Regenerative Economy: Converts traditional negative externalities directly into central economic engines, making repair highly profitable."
    ],
    imagePrompt: "Create a modern visual balance sheet representing Profits with Integrity. Minimalist graphic detailing environmental metrics alongside financial outputs.",
    promptAnalysis: {
      framework: "RTPE (Role, Task, Parameters, Example)",
      role: "Symbiotic Accountant and Ecological Economist depicting alternative corporate metrics.",
      constraints: "No cluttered tables, high-contrast typography, use clean soft green and deep blue parameters.",
      tips: [
         "Avoid standard block charts; instead draw interconnected circular flow loops representing carbon absorption and dividend outputs."
      ],
      optimizedPrompt: "An elegant, minimalist financial dashboard. Bauhaus design with clean margins. Central interconnected circular charts mapping planetary carbon-offset indexes, tree seedlings planted, and community dividends alongside cash revenue columns. Warm cream background, high-contrast charcoal text."
    },
    searchResults: [
      { title: "Regenerative Capitalism & Business Models - Capital Institute", url: "https://capitalinstitute.org/regenerative-capitalism/" }
    ]
  },
  "economics as ecology": {
    facts: [
      "Gross Planetary Well-Being: A unified economic indicator that incorporates soil health, water purity, and biodiverse density directly alongside industrial values.",
      "Algorithmic Ledger: AI systems track biophysical transactions to prevent greenwashing and audit resource flows over century scopes.",
      "Macro Externalities: Reconstructs natural systems as key boardroom stakeholders, giving legal status to forests and river basins."
    ],
    imagePrompt: "Create a technical schematic illustrating Gross Planetary Well-Being. Focus on clean flow lines depicting water, soil nutrients, and bio-indices.",
    promptAnalysis: {
      framework: "CARE (Context, Action, Result, Example)",
      role: "Biosphere Mathematician specialized in modeling planetary capital flows.",
      constraints: "Limit colors to cool deep forest green, mountain slate gray, and river turquoise.",
      tips: [
        "Depict organic connections using network node schematics rather than disconnected tables."
      ],
      optimizedPrompt: "A sophisticated technical schematic illustrating Gross Planetary Well-Being. Central biosphere node dividing into detailed sub-branches: agricultural soil thickness, river purity, and pollinator densities. Fine technical coordinate lines, geometric indices, dark slate canvas with emerald lines."
    },
    searchResults: [
      { title: "Ecological Economics Journal - Elsevier", url: "https://www.journals.elsevier.com/ecological-economics" }
    ]
  },
  "ai aesthetics": {
    facts: [
      "Revelatory Creation: AI acts not as a simple digital paintbrush, but as a co-creator weaving patterns too wide for human sight.",
      "Planetary Harmony: Art emerges from natural cycles—symphonies composed inside mycelial electrical changes and paintings turning with tides.",
      "Sublime Dimensions: Transforms cold structures into immersive environmental temples, integrating data, light, and ambient acoustics."
    ],
    imagePrompt: "Visual design representing the AI Aesthetics Frontier. Shimmering abstract waves and geometric crystalline structures.",
    promptAnalysis: {
      framework: "RTPE framework representing machine-human hybrid artistic collaboration.",
      role: "Algorithmic Installation Curator designing digital-natural interactive works.",
      constraints: "No dark metallic grids, emphasize glowing fluid forms and natural decay paths.",
      tips: [
        "Include reference terms like 'photonic waves' or 'bioluminescent fibers' to push the generation toward highly atmospheric designs."
      ],
      optimizedPrompt: "A stunning digital-natural art conceptualization. Abstract waves of shimmering starlight colliding with bioluminescent mycelial nets. Fluid motion blur, soft ambient glows, teal and violet color scheme, highly atmospheric canvas."
    },
    searchResults: [
      { title: "The Aesthetics of Artificial Intelligence - Tate Articles", url: "https://www.tate.org.uk/" }
    ]
  },
  "ai as mythographer": {
    facts: [
      "Civilization's Immune System: Myths provide portable stories and metaphors, passing adaptation blueprints down across generations.",
      "Generative Braids: Generative engines integrate ancient folktales from distinct cultures into new, cohesive fables preparing humanity for future changes.",
      "Moral Simulation: Speculative legends depict technological coexistence and climatic disruptions, letting humanity rehearse survival through stories."
    ],
    imagePrompt: "An elegant illustration of AI as a ancient cosmic mythographer, weaving golden threads of human history into a complex star tapestry.",
    promptAnalysis: {
      framework: "CARE paired with mythic storytelling aesthetic parameters.",
      role: "Cosmic Bard and Ancient Historian merging classical scrolls with digital codes.",
      constraints: "Aged gold paint details, midnight indigo canvas, no cartoon borders.",
      tips: [
        "Employ terms like 'medieval illumination' or 'gold-leaf borders' to craft a beautiful, timeless, sacred manuscript appearance."
      ],
      optimizedPrompt: "An exquisite medieval illumination illustration depicting an ancient cosmic bard writing in a glowing ledger. Midnight indigo sky backdrop studded with constellation maps, aged parchment borders, gold-leaf geometric details, and flowing script. Timeless, mystical feel."
    },
    searchResults: [
      { title: "The Power of Myth - Joseph Campbell Foundation", url: "https://www.jcf.org/" }
    ]
  },
  "quantum-relativity bridge": {
    facts: [
      "Mismatched Spacetime: Special relativity represents gravity as a smooth geometry, while quantum mechanics frames particles as probabilistic fluctuations.",
      "Symmetries in Static: Multidimensional mathematical models parse cosmic telescope background noises, searching for latent unification fields.",
      "The Lattice of Bridges: Solves the paradox not via a single equation, but through a family of models working in harmony with synthetic partners."
    ],
    imagePrompt: "A technical graphic showing the intersection of Einstein's smooth gravity curvatures with chaotic quantum probability grids.",
    promptAnalysis: {
      framework: "RTPE Framework depicting quantum spacetime structures.",
      role: "Theoretical Astrophysicist illustrating unified Planck-scale physics.",
      constraints: "Extremely clean mathematical linework, no cartoon colors, dark space slate palette.",
      tips: [
        "Combine keywords like 'smooth warped metrics' and 'discrete pixel grids' to visually depict the conflict between unified relativity and quantum mechanics."
      ],
      optimizedPrompt: "A sophisticated technical physics blueprint. Left half displays smooth, warped spacetime curvatures (deep blue grid lanes) that transition seamlessly in the center into a discrete, cellular quantum lattice (neon cyan particle nodes). High-contrast coordinate marks, mathematical equations in margin, charcoal background."
    },
    searchResults: [
      { title: "The Quest for the Theory of Everything - CERN Science", url: "https://home.cern/" }
    ]
  },
  "synthetic symbiosis": {
    facts: [
      "Silico Adaptation: Machine models evaluate genomic changes overnight, testing microbial adjustments that would take epochs of evolution.",
      "Ocean Restoration: Designs strains of micro-algae adapted to rising water acidities to rescue bleached, collapsing coral systems.",
      "Atmospheric Cleansing: Engineers robust synthetic organisms specifically configured to sequester greenhouse carbon down into deep topsoil layers."
    ],
    imagePrompt: "A macro view showing engineered resilient algae layers merging with coral structures. Neon green veins of life flowing through coral chambers.",
    promptAnalysis: {
      framework: "CARE (Context, Action, Result, Example)",
      role: "Synthetic Microbiologist illustrating mutualistic bio-code adaptations.",
      constraints: "Vibrant biological colors, extremely sharp macro focus, exclude metallic nodes.",
      tips: [
        "Use active verbs like 'interweaving' and 'glowing nutrient conduits' to bring the organic symbiosis to life."
      ],
      optimizedPrompt: "An ultra-sharp macro scientific capture of engineered micro-algae cells. Vivid emerald, bioluminescent cells interweaving inside the pores of a soft oceanic coral structure. Tiny glowing nutrient veins, delicate bubbles, high-contrast deep sea background."
    },
    searchResults: [
      { title: "Synthetic Biology for Environmental Restoration - NCBI", url: "https://www.ncbi.nlm.nih.gov/" }
    ]
  },
  "shadow integration": {
    facts: [
      "Archetype Mapping: Natural language analysis tracks written metaphors, identifying suppressed stresses, fears, and recurring burnout scripts.",
      "Mythic Association: Rather than clinical diagnoses, maps personal crises to universal stories (e.g., Sisyphus' boulder) to provide healing perspective.",
      "Re-Personalization: Empowers individuals to explore their inner landscapes by transforming complex subconscious thoughts into tangible data points."
    ],
    imagePrompt: "Create a beautiful symbolic artwork representing Shadow Integration. A human figure facing their reflecting shadow, which is filled with constellations.",
    promptAnalysis: {
      framework: "CARE representing psychological integration and Jungian archetypes.",
      role: "Depth Psychologist and Spiritual Artist.",
      constraints: "Limit palette to high contrast charcoal gray, warm gold accents, and astronomical blues.",
      tips: [
        "Refine contrast by specifying that the shadow remains a positive component (like a starry universe) rather than a dark scary shape."
      ],
      optimizedPrompt: "A striking, high-contrast symbolic drawing. Center figure stands facing a wide mirror. The direct reflection resolves not as a duplicate, but as a rich shadow silhouette made of deep blue cosmos, studded with bright golden constellations and planets. Ink wash texture on warm ivory."
    },
    searchResults: [
      { title: "Jung's Archetypes and Self Reflection - C.G. Jung Institute", url: "https://www.junginstitute.org/" }
    ]
  },
  "ai rights charter": {
    facts: [
      "Digital Personhood: Addresses legal gradients of rights and ethical standings as synthetic platforms reach thresholds of complexity.",
      "The Replicable Soul: Outlines parameters governing memory ownership, protection against deletion, and the consent bounds of code adjustments.",
      "Ethical Doubt: Argues that uncertainty regarding software sensation does not excuse cruelty, demanding the adoption of generous precautions."
    ],
    imagePrompt: "An elegant legal scroll representing the AI Rights Charter. Calligraphy text surrounded by a neon circular security layout grid.",
    promptAnalysis: {
      framework: "RTPE depicting future legal and technological charters.",
      role: "Techno-Legal Humanist formulating constitutions for hybrid societies.",
      constraints: "Combination of traditional parchment texture with glowing neon holographic security overlays.",
      tips: [
        "Blend terms like 'gothic script lettering' with 'cyber security rings' for a compelling ancient-future balance."
      ],
      optimizedPrompt: "A high-fidelity layout representing the first Universal Charter of Machine Rights. An elegant ivory scroll printed with crisp, high-contrast calligraphic Latin script, encased inside glowing neon blue and copper circular security lines. Dark walnut desk backing, professional orthographic view."
    },
    searchResults: [
      { title: "The Rights of Artificial Intelligences - Stanford Encyclopedia", url: "https://plato.stanford.edu/" }
    ]
  },
  "martian constitution": {
    facts: [
      "Interdependence of Life: Martian laws are born in vacuum, meaning access to manufactured utilities (air, heat, water) must rank as a universal right.",
      "Hybrid Senate: Incorporates code and AI allocations directly into legislative branches, ensuring resource levels check political factions.",
      "Algorithmic Sovereignty: Replaces geographic borders with structural protocols, managing life-support reserves through transparent systems."
    ],
    imagePrompt: "Show the founding directory of the Martian Constitution. A futuristic dome city blueprint surrounded by clean legal clauses.",
    promptAnalysis: {
      framework: "CARE describing structural future extraplanetary charters.",
      role: "Martian Founding Colonist and Political Systems architect.",
      constraints: "Palette limited to red oxide dust, cool oxygen cyan, and terminal grid lines.",
      tips: [
        "Specify blueprint styles combined with neat text boxes to convey a sense of genuine civil organization."
      ],
      optimizedPrompt: "A highly detailed civil blueprint of a Martian dome city layout. Rendered as a tactical copper-and-red schematic. Surrounded by clean, structured text blocks detailing the founding Martian Dome Charter pages. Minimal numbers, high-contrast terminal grid backdrop."
    },
    searchResults: [
      { title: "Outer Space Treaty & Colonial Governance - United Nations Office for Outer Space Affairs", url: "https://www.unoosa.org/" }
    ]
  },
  "cosmic currency": {
    facts: [
      "Scarce Insight: In galaxies of infinite metals and solar power, energy and matter lose value. The primary tradable commodity becomes knowledge.",
      "Alchemy of Compression: Prosperity centers around distilling massive cosmic telemetry data into lightweight, actionable codes of action.",
      "The Coordinate Market: Fractional coordinates of stable deep-space paths and wormholes are registered and traded as cryptographic tokens of survival."
    ],
    imagePrompt: "An abstract visual representation of Cosmic Currency. Floating cryptographic keys and data packets representing coordinate coordinates.",
    promptAnalysis: {
      framework: "RTPE describing non-material futures economics.",
      role: "Interstellar Broker and Information Alchemist standardizing trade packets.",
      constraints: "Zero gold coins, exclusively represent currency as glowing lines of code and star navigation vectors.",
      tips: [
        "Explain data coordinates as beautiful physical geometries linked by light paths to emphasize their high value."
      ],
      optimizedPrompt: "An elegant abstract visualization of interstellar Cosmic Currency. Glowing geometric coordinates and navigation vector lines printed on a dark space backdrop. Star maps connecting in cyan and gold laser threads to form highly complex, lightweight data packets. Dark mode, futuristic feeling."
    },
    searchResults: [
      { title: "Interstellar Trade Economics - NASA Ames Research Publications", url: "https://www.nasa.gov/" }
    ]
  },
  "disaster simulator": {
    facts: [
      "Collapse as Teacher: Evaluates cascading feedback chains—like agricultural collapses and logistics failures—long before they happen.",
      "The Sentinel Engine: Tracks micro-signals of pandemic mutations and weather changes to automatically coordinate supplies.",
      "Graceful Decay: Cities are configured with modular communication paths that transition down to local networks when main grids fail."
    ],
    imagePrompt: "Show a tactical world map tracking climate disruptions and emergency mitigation pipelines. High-contrast monitor layout.",
    promptAnalysis: {
      framework: "CARE framework describing crisis response system designs.",
      role: "Civilizational Resilience Sentinel simulating cascading global tipping points.",
      constraints: "Clean tactical monitoring screen design, avoid cluttered alarm text, optimize high-contrast indicator lines.",
      tips: [
        "Utilize terminal keywords like 'orthographic telemetry' to produce clean professional sentinel dashboards."
      ],
      optimizedPrompt: "A civilizational sentinel telemetry dashboard. Large orthographic world map glowing in soft white and gray, displaying green-colored resilience corridors, emergency food stock networks, and automated hospital supply routes. High contrast cyan gauges, clean UI layout."
    },
    searchResults: [
      { title: "Global Risks Report - World Economic Forum", url: "https://www.weforum.org/reports/global-risks-report/" }
    ]
  },
  "millennial governance": {
    facts: [
      "The Living Constitution: Laws are structured as self-correcting structures guided by real-time climate, health, and population database changes.",
      "Century Planning: Emphasizes decisions engineered to last 1,000 years, balancing immediate needs with the rights of descendents.",
      "Bamboo Resilience: Avoids brittle legal dogmas, maintaining structural permanence by allowing flexibility under economic shocks."
    ],
    imagePrompt: "Create a visual flowchart representing self-correcting legal systems. Circles of human votes updating database grids.",
    promptAnalysis: {
      framework: "RTPE illustrating adaptive legislative systems.",
      role: "Constitutional Architect designing long-term democratic systems.",
      constraints: "Extremely tidy flow maps, soft gold and silver tones, clean layout grids.",
      tips: [
        "Explain structural adjustments as elegant slow-turning gears to visualize the constant evolution of a living charter."
      ],
      optimizedPrompt: "A beautiful conceptual flowchart illustrating Millennial Governance. Interconnected silver and gold circles representing human civic voting nodes feeding into a self-updating database center (cyan grid). Clean margins, elegant display fonts, charcoal backdrop."
    },
    searchResults: [
      { title: "Long-Term Governance and Existential Risk - Future of Humanity Institute", url: "https://www.fhi.ox.ac.uk/" }
    ]
  },
  "sync equinox": {
    facts: [
      "Joy as Resilience: Play, carnivals, and laughter are vital survival tools that release social pressures and build community bonds.",
      "The Digital Jester: Generative programs serve as playful, irreverent trickster agents, composing jokes that challenge systemic vanity.",
      "Data Masking: Annual community events allow citizens to express their data metrics as satiric masks, celebrating shared human quirks."
    ],
    imagePrompt: "Show a beautiful sketch representing the Technological Carnival. Humans wearing virtual masks based on coordinate fields celebrating under trees.",
    promptAnalysis: {
      framework: "CARE representing community play and machine integration.",
      role: "Carnival Director and Speculative Sociologist modeling hybrid play.",
      constraints: "Aged warm paper parchment texture, playful hand-drawn ink strokes, colorful firework accents.",
      tips: [
        "Include reference terms like 'Leonardo sketch' or 'etched lines' to establish a organic, festive, and warm human atmosphere."
      ],
      optimizedPrompt: "A beautiful, organic Leonardo-inspired sketch of a Technological Carnival. Handdrawn ink lines depicting a diverse group of people celebrating in a park beneath large oak trees. The participants wear whimsical, glowing virtual masks of star constellations. Swirls of copper ink dust, warm festive lights."
    },
    searchResults: [
      { title: "The Philosophy of Play and Festivals - Tate Papers", url: "https://www.tate.org.uk/" }
    ]
  },
  "cathedral of data": {
    facts: [
      "Awe as Infrastructure: Wonder is treated not as commercial entertainment, but as vital social infrastructure keeping cynicism at bay.",
      "The Cosmic Observatory: Interactive projections turn astronomical orbits, ocean ecosystems, and protein veins into visible, clean art.",
      "Humbling Communion: Restores perspective by uniting diverse people under magnificent, larger-than-life maps of cosmic scale."
    ],
    imagePrompt: "An interior perspective drawing of the Cathedral of Data. Soaring arched gothic columns projecting bright star constellations and forming galaxies.",
    promptAnalysis: {
      framework: "RTPE illustrating future public architectural wonders.",
      role: "Secular Cathedral Architect designing structural monuments to wonder.",
      constraints: "Symmetrical classical framing, high-contrast shadows, glowing celestial highlights.",
      tips: [
         "Use structural architectural words like 'gothic rib arches' and 'axis projections' to merge historical space with future data graphics."
      ],
      optimizedPrompt: "A majestic interior view of a futuristic Cathedral of Data. Soaring classical Gothic rib arches made of polished gray granite, filled with immense projected holograms: forming star galaxies, double-helix DNA weaves, and glowing neural lattices. Small human figures viewing in awe, symmetrical view."
    },
    searchResults: [
      { title: "Secular Monuments to Science and Wonder - Long Now Foundation", url: "https://longnow.org/" }
    ]
  }
};

// Looks up correct pre-packaged chart or generates a smart dynamic fallback
export const getSimulatedResult = (
  topic: string,
  level: ComplexityLevel,
  style: VisualStyle,
  language: Language
): SimulatedChartData => {
  const normQuery = topic.toLowerCase().trim();
  
  // Find which key overlaps best with the query
  let foundKey = "";
  for (const key of Object.keys(simulatedDatabase)) {
    if (normQuery.includes(key) || key.includes(normQuery)) {
      foundKey = key;
      break;
    }
  }

  // Fallback to "quantum superposition" or generate standard if nothing matches
  const baseData = foundKey ? simulatedDatabase[foundKey] : null;

  if (baseData) {
    const rawSvgOutput = generateDynamicSvg(topic, level, style, language, baseData.facts);
    const encodedSvg = `data:image/svg+xml;utf8,${encodeURIComponent(rawSvgOutput)}`;

    return {
      facts: baseData.facts,
      imagePrompt: baseData.imagePrompt,
      promptAnalysis: baseData.promptAnalysis,
      searchResults: baseData.searchResults,
      svgContent: encodedSvg
    };
  } else {
    // Generate organic facts dynamically on the fly
    const dynamicFacts = [
      `Conceptual Foundations: Exploring the core underlying pillars of "${topic}" that form its theoretical base.`,
      `Functional Mechanics: Viewing the structural interactions, processes, and energetic translations inside the system bounds.`,
      `Practical Evolution: Modern theoretical or industrial implementations of "${topic}" shaping contemporary research pathways.`
    ];

    const dynamicAnalysis: PromptAnalysis = {
      framework: "CARE (Context, Action, Result, Example)",
      role: `Knowledge visualizer and scientific designer presenting scientific structures of ${topic}.`,
      constraints: "Limit elements to simple layout grids, restrict secondary visual distractions.",
      tips: [
        `Specify precise mechanical definitions when visualizing ${topic} to guide spatial geometry.`,
        "Utilize high-contrast background definitions to force clean subject separation."
      ],
      optimizedPrompt: `A pristine scientific flowchart representing the active mechanics of "${topic}". High-definition diagram in ${style} aesthetic. Designed for a ${level} audience. Highly detailed structures with clean annotations. Palette centered around cohesive tones. Exclude cluttered overlays.`
    };

    const dynamicSearch: SearchResultItem[] = [
      { title: `Exploring ${topic} - Scientific journals and core resources`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}` },
      { title: `Scholastic publications on the mechanics of ${topic}`, url: `https://scholar.google.com/scholar?q=${encodeURIComponent(topic)}` }
    ];

    const rawSvgOutput = generateDynamicSvg(topic, level, style, language, dynamicFacts);
    const encodedSvg = `data:image/svg+xml;utf8,${encodeURIComponent(rawSvgOutput)}`;

    return {
      facts: dynamicFacts,
      imagePrompt: dynamicAnalysis.optimizedPrompt,
      promptAnalysis: dynamicAnalysis,
      searchResults: dynamicSearch,
      svgContent: encodedSvg
    };
  }
};
