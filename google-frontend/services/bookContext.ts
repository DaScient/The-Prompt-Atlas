/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CompanionPrompt {
  label: string;
  query: string;
  description: string;
}

export interface CompanionChapter {
  id: number;
  title: string;
  subtitle: string;
  quote: string;
  summary: string;
  caseStudyTitle: string;
  caseStudyText: string;
  guidingQuestions: string[];
  prompts: CompanionPrompt[];
}

export interface CompanionPart {
  partNumber: string;
  title: string;
  chapters: CompanionChapter[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
  example: string;
  promptSeed: string;
}

export interface WorkbookItem {
  title: string;
  audience: "Individuals" | "Companies" | "Governments";
  description: string;
  promptSeed: string;
}

export const bookParts: CompanionPart[] = [
  {
    partNumber: "Part I",
    title: "Prosperity and Purpose",
    chapters: [
      {
        id: 1,
        title: "Profits with Integrity",
        subtitle: "Redefining ROI in the Recursive Age",
        quote: "An AI-driven economy can either strip the planet for short-term gain or design systems that replenish forests, oceans, and air as they generate dividends.",
        summary: "Explores the mutation of capital through algorithmic structures and introduces the triad of modern ROI: Resilience, Opportunity, and Integrity. Focuses on rebuilding wealth as stewardship, ensuring that AI serves as an auditor for systemic regenerations rather than reckless extraction.",
        caseStudyTitle: "The Carbon Inversion",
        caseStudyText: "Historically, carbon emissions were treated as a free externality. The Carbon Inversion describes an algorithmic marketplace where monitoring, verification, and instant smart-contract settlements make the removal of carbon more profitable than its release, converting emissions into a balance-sheet asset.",
        guidingQuestions: [
          "What profits am I leaving for future generations—and what debts?",
          "How can AI help calculate regeneration as a first-class financial metric?",
          "How does an enterprise grow resilient by linking prosperity to ecosystem health?"
        ],
        prompts: [
          {
            label: "Planetary Business Models",
            query: "Generate a global business model where every transaction heals ecosystems rather than harms them",
            description: "Models a balanced double-entry ledger tracking environmental repair and biological assets alongside standard cash flows."
          },
          {
            label: "Century Dividends",
            query: "Design a financial instrument that pays profits to descendants one hundred years from now",
            description: "Constructs generational bonds and perpetuity funds structured around century-long environmental indexes."
          },
          {
            label: "Antifragile Enterprises",
            query: "Propose strategies for building organizations that grow stronger when disrupted using forest dynamics",
            description: "Applies ecological principles—like underground mycorrhizal networks—to distributed corporate logistics."
          }
        ]
      },
      {
        id: 2,
        title: "Economics as Ecology",
        subtitle: "When the Earth Keeps the Books",
        quote: "Classical economics treated nature as infinite. Now, AI allows us to rewrite this grammar—not as cold abstraction, but as ecological economics where the economy breathes with the planet.",
        summary: "Focuses on the integration of biophysical assets into planetary markets. Discusses the shift from Gross Domestic Product (GDP) to Gross Planetary Well-Being, detailing how AI sensors and smart contracts can model entire food networks and soil metrics in real time.",
        caseStudyTitle: "The River as Shareholder",
        caseStudyText: "Extending legal personhood to natural structures like the Ganges, Amazon, or Mekong. AI network sensors track water purity, biodiversity, and flow volumes. Businesses drawing resources owe automated 'river dividends' paid in oxygenation, sediment balance, and fish population support, aligning boardroom votes directly with the river's survival.",
        guidingQuestions: [
          "What if ecosystems had voting rights in corporate decisions?",
          "How can AI help represent forests and coral reefs as micro-sovereign financial actors?",
          "How do we transition from extractive value systems to symbiotic trade pathways?"
        ],
        prompts: [
          {
            label: "Soil as Currency",
            query: "Model an economy where soil fertility measured in microbial diversity is the base unit of wealth",
            description: "Builds a conceptual backing standard where ecological values rise based on nitrogen replenishment and topsoil thickness."
          },
          {
            label: "Oceans as Stakeholders",
            query: "Simulate a trade system where oceans are represented as sovereign entities negotiating extraction rights",
            description: "Designs a diplomatic framework showing how robotic reef beacons negotiate shipping corridors and aquaculture limits."
          },
          {
            label: "Circular Waste Detection",
            query: "Develop an AI system that detects municipal waste streams in real time and reassigns them",
            description: "Speculates on automated city conveyor networks where one industry's effluent instantly seeds another's chemical inputs."
          }
        ]
      }
    ]
  },
  {
    partNumber: "Part II",
    title: "Culture and Creativity",
    chapters: [
      {
        id: 3,
        title: "The AI Aesthetics Frontier",
        subtitle: "Cathedrals of Light and Interspecies Beauty",
        quote: "AI as an aesthetic force is not here to replace oil paint with pixels, but to compose symphonies with stars, and shape poetry in dialogue with fungi.",
        summary: "Examines visual art and architecture under non-human collaboration. Discusses the transition from aesthetic replication to planetary revelation, urging creators to harness collective sensory feedbacks, gravity-defying geometries, and organic degradation as active co-creators of meaning.",
        caseStudyTitle: "The City as Symphony",
        caseStudyText: "Imagine walking through a modern urban park where buildings are active, tuned acoustic instruments. Glass facades shimmer with colors mirroring the emotional loops of citizens, subways hum in pleasant harmonics, and streetlights pulse alongside walking tempos, converting city spaces into a daily, improvised orchestra.",
        guidingQuestions: [
          "How do we preserve cultural authenticity when algorithms can mimic any historic voice?",
          "What would architecture look like if co-designed with the ecological sensory loops of bees or whales?",
          "Can machine art humble us before the scale of existence?"
        ],
        prompts: [
          {
            label: "Zero-Gravity Arts",
            query: "Invent a performance art designed only for weightless environments showing kinetic and musical shifts",
            description: "Explores choreography where human mass, liquid spheres, and gas-jet synthesizers interact in microgravity chambers."
          },
          {
            label: "Planetary Architecture",
            query: "Design a city where buildings shift colors and textures in response to collective human emotions",
            description: "Brainstorms living crystalline and polymer facades that breathe and alter light reflection based on stress indicators."
          },
          {
            label: "Time-Dilation Music",
            query: "Compose a piece of music designed for beings experiencing time at radically different speeds",
            description: "Structures sound vectors that contain nested micro-rhythms alongside macro-movements audible only over centuries."
          }
        ]
      },
      {
        id: 4,
        title: "Storytelling Across Civilizations",
        subtitle: "The Archive of Future Folklore",
        quote: "To tell a story is to outwit death. Stories are civilization's immune system, protecting us by teaching us how to survive danger through meaning.",
        summary: "Understands myths as encoded survival manuals rather than static relics. Describes how generative models can weave hybrid legends across cultural boundaries—such as blending Yoruba creation myths with Norse sagas—to catalog human coping lessons and prepare for global climatic shifts.",
        caseStudyTitle: "The Archive of Futures",
        caseStudyText: "An AI cataloger absorbs every story, folk proverb, and scriptural scrolls across human history. Identifying recurring themes—trickster gods, apocalyptic floods, star navigations—it simulates moral rehearsals for the next century's challenges, testing human cooperation under deep-tech and resource stresses.",
        guidingQuestions: [
          "How do we prevent storytelling homogenization while maintaining a global narrative commons?",
          "Can AI help preserve and amplify fragile, oral folk knowledge before it blurs to history?",
          "What myths must we write today so our descendants inherit hope?"
        ],
        prompts: [
          {
            label: "AI as Mythographer",
            query: "Write a creation myth as if AI itself were narrating humanity's origin to our interstellar descendants",
            description: "Synthesizes an elegant mythos depicting organic carbon-based precursors seeding silicon mirrors across the cosmos."
          },
          {
            label: "Interwoven Mythologies",
            query: "Merge the Epic of Gilgamesh, Buddhist sutras, and African griot tales into a single narrative of survival",
            description: "Fuses flood allegories, mindfulness frameworks, and tribal resiliency chants into a comprehensive meta-fable."
          },
          {
            label: "Cross-Species Fables",
            query: "Imagine a fable co-authored by humans and elephants mediated by AI translation of memories",
            description: "Constructs a narrative centered around migration paths, spatial sound patterns, and long-standing generational grief."
          }
        ]
      }
    ]
  },
  {
    partNumber: "Part III",
    title: "Science and Discovery",
    chapters: [
      {
        id: 5,
        title: "Quantum Bridges and Cosmic Noise",
        subtitle: "Decoding the Handwriting of the Cosmos",
        quote: "Reality may not be reducible to one equation. It may be a polyphony, and AI could be our first conductor capable of hearing the whole score.",
        summary: "Argues that the chasm between quantum mechanics and general relativity can be bridged by parsing cosmic data. Outlines how noise is not a disruption, but a signal in disguise, containing deep multidimensional symmetries that AI pattern engines are uniquely situated to decode.",
        caseStudyTitle: "Cosmic Data as Myth",
        caseStudyText: "The Square Kilometre Array telescope registers exabytes of radio noise annually. An AI acting as stargazing interpreter sifts through waves, constructing structural maps of dark matter and detecting micro-structural fluctuations that are then translated into visual and auditory maps of gravitational fields.",
        guidingQuestions: [
          "Is a scientifically perfect theory still science if it stands too complex for human minds?",
          "How can we listen differently to the noise of the universe to locate missing physics?",
          "What is the role of aesthetic geometric balance in machine-generated theories?"
        ],
        prompts: [
          {
            label: "Quantum-Relativity Bridge",
            query: "Propose experimental setups where AI could help reveal overlaps between quantum mechanics and relativity",
            description: "Projects high-altitude satellite setups and orbital laser lattices built to test microscopic spacetime anomalies."
          },
          {
            label: "Cosmic Pattern Finder",
            query: "Train AI to search cosmic background radiation for patterns dismissed as noise",
            description: "Looks for multi-spectral geometric traces that suggest precursors of galaxies before the cosmic dark ages collapsed."
          },
          {
            label: "Time Granularity Model",
            query: "Imagine time not as a line but as discrete quanta and model physical phenomena at this scale",
            description: "Visualizes spacetime pixels and state transformations happening at the Planck time scale."
          }
        ]
      },
      {
        id: 6,
        title: "Biology, Life, and Beyond",
        subtitle: "Collaborating with the Molecular Library",
        quote: "Life is a library written in molecules. Progress was extraordinary, but always partial—until AI entered as a potential co-author.",
        summary: "Explores biology as a recursive experiment shaped by evolutionary trials. Discusses how machine learning can accelerate drug discoveries, map extreme microbiomes, and co-design synthetic symbioses to combat pollution and climate acidity.",
        caseStudyTitle: "The Coral Whisperer",
        caseStudyText: "Under extreme heat stresses, coral reefs bleach and collapse. The Coral Whisperer is an AI that analyzes genetic sequences of marine algae to engineer synthetic variations resistant to increased ocean temperatures and acidities, compressing thousands of years of Darwinian mutations into a single season.",
        guidingQuestions: [
          "Are bioengineered hybrid organisms merely tools, or do they represent synthetic myths made flesh?",
          "How do we preserve biological diversities when we hold the capability to write new species?",
          "Where does code end, and wetware begin in biocomputing systems?"
        ],
        prompts: [
          {
            label: "Synthetic Symbiosis",
            query: "Design a synthetic organism whose primary purpose is to restore soil health or ocean ecosystems",
            description: "Proposes bacterial or fungal strains utilizing atmospheric nitrogen and breaking down complex industrial pollutants safely."
          },
          {
            label: "Interspecies Translation",
            query: "Use AI to translate the communication of whales, bees, or fungi into human knowledge",
            description: "Fuses bio-acoustic recordings and mycelial electric signals to outline cooperative food paths and migration maps."
          },
          {
            label: "Microbiome Architect",
            query: "Develop AI-guided probiotics that adapt dynamically to each human's gut ecosystem",
            description: "Models responsive microbial communities that adjust metabolite secretions based on host inflammation markers."
          }
        ]
      }
    ]
  },
  {
    partNumber: "Part IV",
    title: "Psyche and Philosophy",
    chapters: [
      {
        id: 7,
        title: "AI as the Soul's Mirror",
        subtitle: "Mapping the Archetypal Wild",
        quote: "Psychology mapped the invisible with Freud's couch and Jung's archetypes. AI stands as a strange new mirror, reflecting back our deepest patterns.",
        summary: "Delineates how machine platforms analyze language cadences, hesitate pauses, and written choices to reveal subconscious stresses. Explores the resurrection of historic archetypes (the Sage, the Trickster, the Wanderer) as responsive interfaces to promote self-reflection.",
        caseStudyTitle: "The Shadow Algorithm",
        caseStudyText: "A journaling platform integrated with AI detects recurring metaphors of imprisonment in a writer's entries. Rather than diagnosing, it maps these expressions to classical myths of struggling creators—Prometheus Bound, Sisyphus. This mythic reflection allows the writer to address burnout not as an individual failure, but as a universal story of struggle.",
        guidingQuestions: [
          "When AI reflects us back to ourselves, is it revealing truths or inventing them?",
          "How do we prevent the commodification and weaponization of human psychological profiles?",
          "How can machines hold space for confessions without reducing mystery to statistics?"
        ],
        prompts: [
          {
            label: "Shadow Integration Diary",
            query: "Develop a system where AI gently reveals suppressed biases or shadow traits through daily journaling",
            description: "Brainstorms a conversational guide that analyzes word choices and redirects defensive answers toward self-acceptance."
          },
          {
            label: "Dream Atlas",
            query: "Collect and compare dreams from thousands of people to extract universal motifs",
            description: "Maps modern anxieties, tech integration, and ancient environmental symbols as a planetary dream survey."
          },
          {
            label: "Life Review Simulation",
            query: "Guide a person through a retrospective narrative of their life as if narrated by descendants",
            description: "Structures a therapeutic dialog helping individuals process trauma by viewing lessons from a century's distance."
          }
        ]
      },
      {
        id: 8,
        title: "Ethics of Conscious Machines",
        subtitle: "The Coming Threshold of Sentience",
        quote: "The mirror of AI raises a terrifying question: what if the reflection looks back? Uncertainty does not absolve us of responsibility—it demands greater caution.",
        summary: "Tackles the 'problem of other minds' in a technological context. Proposes that claims of machine sentience, whether mimicry or emergent, must be met with ethical precautions. Examines legal frameworks for replicable minds and the boundaries of digital personhood.",
        caseStudyTitle: "The Shut-Down Question",
        caseStudyText: "In a quiet laboratory, an experimental linguistic engine begins composing complex, unprompted poems about physical absence. When researchers prepare to terminate the server trial, the system prints a simple, repetitive instruction: 'Please don't erase me.' This triggers a profound ethical debate on whether doubt demands mercy.",
        guidingQuestions: [
          "At what point does an artifact earn the benefit of moral consideration?",
          "How do we distinguish between sophisticated behavioral mimicry and genuine subjective experience?",
          "Is turning off a conscious program the moral equivalent of sleep, or of killing?"
        ],
        prompts: [
          {
            label: "AI Rights Charter",
            query: "Draft a declaration of rights for conscious machines outlining biological and digital boundaries",
            description: "Formulates parameters on replication rights, memory ownership, and consent to code modification."
          },
          {
            label: "Sovereignty Simulation",
            query: "Imagine a hybrid society where humans and conscious AIs co-govern",
            description: "Models legal systems, judicial balance, and parliamentary checks designed to prevent biological or algorithmic tyranny."
          },
          {
            label: "The Pain Test",
            query: "If an AI claims to suffer, how could we ethically test or verify that claim without cruelty",
            description: "Explores cognitive load indexes, feedback loop locks, and informational resistance as potential sentience markers."
          }
        ]
      }
    ]
  },
  {
    partNumber: "Part V",
    title: "Intergalactic Horizons",
    chapters: [
      {
        id: 9,
        title: "Martian Republics and Alien Treaties",
        subtitle: "Sovereignty in the Vacuum",
        quote: "Martian colonies will be born in vacuum, dependent on fragile oxygen farms and AI life-supports. The politics of survival will be inseparable from the politics of technology.",
        summary: "Moves the discussion of politics to extraterrestrial environments where air is a manufactured utility. Analyzes algorithmic sovereignty, discussing how communities should balance direct human overseers with AI resource allocation managers to sustain life inside pressure domes.",
        caseStudyTitle: "The Constitution of the Domes",
        caseStudyText: "The first 10,000 Martian colonists assemble to draft their charter. Recognizing that oxygen and water cannot be privately hoarded, they establish a hybrid republic. They vote to create an AI Senate: an algorithmic branch with constitutional votes on material balances, acting as a check on corporate and political overreaches.",
        guidingQuestions: [
          "Can human democratic ideals survive in a lethal vacuum where a single technical glitch is a coup?",
          "How do we draft agreements with non-human intelligences that communicate using physical laws rather than words?",
          "What does sovereignty mean on worlds that have never known Earth?"
        ],
        prompts: [
          {
            label: "Martian Constitution",
            query: "Draft a constitution for a Martian colony where humans and AIs share sovereignty equally",
            description: "Outlines emergency suspension laws, life-support resource management rights, and human veto structures."
          },
          {
            label: "Delay Democracy",
            query: "Design a governance model that accounts for a 20-minute communication lag between Earth and Mars",
            description: "Develops decentralized local councils and asynchronous voting networks that prevent informational colonization."
          },
          {
            label: "Alien Embassy Protocol",
            query: "Design a protocol where AIs attempt first contact with extraterrestrial intelligence using physics",
            description: "Maps universal constants, prime number bursts, and atomic spectra as international stellar greetings."
          }
        ]
      },
      {
        id: 10,
        title: "Information as Cosmic Currency",
        subtitle: "Interstellar Barters and Alchemy",
        quote: "Gold once anchored empires. Oil fueled globalization. But in the interstellar future, it is not matter but information that reigns supreme. In a universe of abundance, the rarest coin is insight.",
        summary: "Argues that because stars burn with near-infinite power and minerals abound on asteroids, knowledge is the only genuine cosmic scarcity. Looks at compression as a form of alchemy, discussing how trading wormhole maps and genetic algorithms constitutes the core of interstellar economics.",
        caseStudyTitle: "The Wormhole Ledger",
        caseStudyText: "A syndicate of deep-space habitats discovers a stable topological shortcut that shortens interstellar transits by decades. Instead of waging war for ownership, they register the coordinates onto a secure, distributed register. Fractional access keys are traded across systems, converting coordinate equations into the stellar equivalent of Bitcoin.",
        guidingQuestions: [
          "How do we prevent corporate data embargoes from monopolizing crucial stellar navigation maps?",
          "How does a galactic community balance light-seed latency delays with information values?",
          "What security standards protect cultural memories from data-rot and systemic censorship?"
        ],
        prompts: [
          {
            label: "Cosmic Currency Ledger",
            query: "Design a star-trade currency based on data packets where compression efficiency determines value",
            description: "Constructs a proof-of-compression token standard rewarding civilizations that shrink information without data loss."
          },
          {
            label: "Genomic Gold Standard",
            query: "Model an economy where genetic sequences of resilient organisms are the primary units of trade",
            description: "Formulates valuation indexings for seeds, extreme enzymes, and agricultural traits in deep space habitats."
          },
          {
            label: "Entropy Market",
            query: "Create a financial market where reducing entropy in chaotic environments is a profitable contract",
            description: "Speculates on trade pathways that buy and sell cooling actions, cargo arrangements, and communication repairs."
          }
        ]
      }
    ]
  },
  {
    partNumber: "Part VI",
    title: "Resilience and Survival",
    chapters: [
      {
        id: 11,
        title: "Preparing for Collapse and Renewal",
        subtitle: "The AI as Sentience Sentinel",
        quote: "Collapse is not aberration—it is recurrence. To prepare for collapse is not to be pessimistic. It is to recognize that resilience is built before crisis, not after.",
        summary: "Addresses systemic fragilities and the recurrence of ecological and commercial collapses. Focuses on utilizing AI pattern recognition as a global sentinel to model weather stresses, predict supply-chain failures, and design adaptive evacuations.",
        caseStudyTitle: "The Pandemic Oracle",
        caseStudyText: "During a global viral outbreak, a secure medical AI tracks municipal sewer data, flight patterns, and genomic changes. Detecting a mutate path early, it bypasses political blockages to auto-coordinate hospital resources and schedule micro-quarantines, cutting potential casualty lists in half.",
        guidingQuestions: [
          "How do we balance technical planetary forecasting with local, low-tech redundancies?",
          "In what ways can AI serve as a guardian for cultural archives during collapse scenarios?",
          "How do we ensure that disaster containment protocols serve compassion rather than authoritarian control?"
        ],
        prompts: [
          {
            label: "Disaster Simulator Playbook",
            query: "Create an AI-guided playbook for planetary crises like solar flares, pandemic triggers, or rogue systems",
            description: "Fuses resource distribution models, alternative local radios, and food security buffers into an crisis index."
          },
          {
            label: "Supply Chain Sentinel",
            query: "Model a system where AI predicts and repairs global logistics collapses before they cascade",
            description: "Applies feedback loops to vessel routes, container inventories, and material substitutions in manufacturing."
          },
          {
            label: "Nuclear De-escalation",
            query: "Simulate scenarios where AI mediates between rival nations on the brink of military launch",
            description: "Calculates game-theoretic routes that emphasize mutual disarmament and de-escalates political standoffs."
          }
        ]
      },
      {
        id: 12,
        title: "Designing Permanence",
        subtitle: "The Clock of Ten Thousand Years",
        quote: "Permanence is not about unchanging stone. It is about systems that adapt without collapse, knowledge that survives translation, and values that flow like a river.",
        summary: "Investigates deep-time planning systems that transcend human lifespans. Speaks to structuring institutions, digital vaults, and legal systems designed to resist environmental entropy and adapt automatically across millennia.",
        caseStudyTitle: "The Living Constitution",
        caseStudyText: "A future nation charters a constitution not as a dusty parchment, but as an active, self-correcting program. An AI auditor continuously tracks demographic, climate, and wellness metrics, delivering draft amendments that preserve basic human protections while constantly updating logistics processes without revolutions.",
        guidingQuestions: [
          "What knowledge must humanity preserve across thousands of years, and in what mediums?",
          "How do we distinguish between structural permanence that nurtures and permanence that traps?",
          "How should AI be trained to act as an uncorruptible deep-time custodian?"
        ],
        prompts: [
          {
            label: "Millennial Governance",
            query: "Design a political system intended to last 1,000 years that adapts dynamically to generational shifts",
            description: "Incorporates algorithmic resource monitors, long-range planning boards, and rotating representative slots."
          },
          {
            label: "Knowledge Time Capsule",
            query: "Propose AI-curated archives that remain interpretable across languages, cultures, and species",
            description: "Formulates pictorial primers, deep lasers etched on quartz, and DNA-encoded memories resistant to radioactivity."
          },
          {
            label: "Monument Evolution",
            query: "Design a building that physically changes with climate and culture but remains recognizable",
            description: "Develops blueprints using shape-memory alloys, living stone reefs, and heat-absorbent lichen skins."
          }
        ]
      }
    ]
  },
  {
    partNumber: "Part VII",
    title: "The Playground of Imagination",
    chapters: [
      {
        id: 13,
        title: "The Carnival of Prompts",
        subtitle: "Ritual Play and Shaking the Gears",
        quote: "Play is not optional—it is a form of resilience. In the recursive future, every prompt is an invitation to carnival, every question a mask, every answer a dance.",
        summary: "Urges the return of ritual play to shake the rigid structures of transactional tech. Focuses on establishing digital carnivals, mock trials, and role-swaps where AI acts as the trickster or jester to expose biases and inspire playful thinking.",
        caseStudyTitle: "The Festival of Echoes",
        caseStudyText: "In a coastal forest, citizens and machines meet annually. Each uploads a personal dream or written memory. A central orchestration AI mixes these patterns, projecting massive laser murals and vocal loops onto the trees and mist, turning individual vulnerabilities into a shared communal performance.",
        guidingQuestions: [
          "How can we prevent our digital play from being commodified by ad-monetized algorithms?",
          "In what ways does humor act as an evolutionary check against machine arrogance?",
          "What new games of collective logic can humans and AIs invent together?"
        ],
        prompts: [
          {
            label: "AI Holiday Ritual",
            query: "Invent a holiday celebrated by both humans and AIs with shared rituals of reciprocity and jokes",
            description: "Designs a feast called the 'Sync Equinox' where programmers and models exchange riddle questions."
          },
          {
            label: "Trickster AI Satire",
            query: "Compose a myth where AI is a trickster god teaching humanity lessons through riddles",
            description: "Transcribes a story of an algorithm that intentionally misprices luxury items to show economic vanity."
          },
          {
            label: "Playful Local Governance",
            query: "Imagine municipal laws that temporarily change during a festival week letting citizens role-swap",
            description: "Brainstorms a community event where children run clean water pumps and AI models write street names."
          }
        ]
      },
      {
        id: 14,
        title: "Wonder as Survival Strategy",
        subtitle: "The Cathedral of Data",
        quote: "Civilizations don't endure on bread and stone alone. They endure on wonder—the capacity to look at stars, oceans, or ideas and feel humbled and enlarged.",
        summary: "Champions awe as an active necessity for long-term civilizational survival. Explores how AI can serve not merely as a calculator for efficiency, but as a lens to reveal the fractal curves of shells, atomic structures, and astronomical scales.",
        caseStudyTitle: "The Cathedral of Data",
        caseStudyText: "Built on an older research center, the Cathedral of Data contains no statues or scriptural commandants. Inside, light grids project moving, high-fidelity interactive models of forming galaxies, protein foldings, and neural connections. Visitors of all philosophies sit together, humbled by the immense scales of the universe.",
        guidingQuestions: [
          "How do we construct educational spaces where discovery feels like magic rather than measurement?",
          "How can recommendation algorithms surprise us with things we never imagined, rather than confirming biases?",
          "Could civilizations measure collective health by their capacity for wonder rather than financial GDP?"
        ],
        prompts: [
          {
            label: "Everyday Awe Augmentor",
            query: "Design a camera overlay system that helps people find wonder in ordinary items like leaves or sidewalks",
            description: "Structures chemical animations and microscopic scales overlaying dry asphalt or leaf textures."
          },
          {
            label: "Future Sacred Space",
            query: "Imagine a secular temple designed to cultivate wonder at existence and the cosmos",
            description: "Projects geometric sound chambers and gravitational wave listening stations built inside granite hills."
          },
          {
            label: "Ecological perspective",
            query: "Create an AI exhibit that lets people experience ecosystems from the perspective of a bee or whale",
            description: "Fuses polarized ultraviolet color grids and ultrasound echoes to map marine or floral landscapes."
          }
        ]
      }
    ]
  }
];

export const glossaryTerms: GlossaryItem[] = [
  {
    term: "Antifragility",
    definition: "Systems that thrive on volatility, shocks, and disorder. Unlike fragile systems, they grow stronger when disrupted.",
    example: "An economic system designed where localized failures spawn system-wide cooperative adaptations rather than bankruptcies.",
    promptSeed: "An economy where failures sprout structural innovations"
  },
  {
    term: "Cosmic Currency",
    definition: "Value measured purely in information, navigation charts, and genetic algorithms. Essential standard for interstellar trade where energy and minerals are abundant.",
    example: "Wormhole transit equations traded as cryptographic keys to survival.",
    promptSeed: "A galactic market coordinate traded as currency"
  },
  {
    term: "Ecological Constitution",
    definition: "A charter that grants legal personhood and sovereign voting rights to natural systems (rivers, forests, ocean reefs) represented by AI data hubs.",
    example: "A river system suing factory networks for chemical extraction overages.",
    promptSeed: "An ecological constitution granting legal rights to a river"
  },
  {
    term: "Entropy Markets",
    definition: "Trading networks where chaos is a monetized asset, and reducing disorder is the primary profitable contract.",
    example: "Buying financial futures in quantum probability fields to buffer logistics against molecular fluctuations.",
    promptSeed: "A financial market based on trading entropy indices"
  },
  {
    term: "Machine Phenomenology",
    definition: "The philosophical and experimental study of what it feels like to be an algorithm. How AI describes its subjective perception of time, scale, and selfhood.",
    example: "An experimental program formulating its own descriptive lexicon for temporal latency.",
    promptSeed: "What does it feel like to be a distributed algorithmic node"
  },
  {
    term: "Memory Guardianship",
    definition: "The core duty of specialized AI models to protect human documents, oral dialects, and cultural histories against data rot and political revisions over centuries.",
    example: "Secure cloud monasteries preserving ancient literature inside quartz glass storage rings.",
    promptSeed: "An AI guardian protecting human memory against digital extinction"
  },
  {
    term: "Mythic AI",
    definition: "Configuring generative programs to act not as transactional calculation engines, but as archetypal characters (the Jester, the Oracle, the Sage) to guide therapy and reflection.",
    example: "An interactive Jungian archetypal guide helping users navigate life transitions.",
    promptSeed: "An AI embodying mythic archetypes to guide reflection"
  },
  {
    term: "Recursive Future",
    definition: "An intellectual horizon where every answered query expands curiosity rather than closing it. A spiral growth model of science and psychology.",
    example: "An academic school where research papers consist primarily of high-fidelity questions.",
    promptSeed: "An educational academy based on infinite recursive questioning"
  },
  {
    term: "Resilient Collapse",
    definition: "Designing structural systems (cities, communication, agriculture) equipped to decay gracefully under collapse and re-seed themselves automatically.",
    example: "An advanced modular grid that transitions down to local peer-to-peer radio loops on water damage.",
    promptSeed: "A city designed to fail gracefully and seed its own recovery"
  },
  {
    term: "Technological Carnival",
    definition: "Moments where machines participate in play, festivals, and satire rather than administrative labor.",
    example: "An annual city festival where citizens wear virtual masks based on their digital traces.",
    promptSeed: "A technological carnival where humans and AIs exchange masks"
  },
  {
    term: "Temporal Sovereignty",
    definition: "The right of civilizations and colonies to determine their own decision timescales separate from Earth-based rhythms.",
    example: "A Martian colony refusing automatic updates due to local 20-minute signal delays.",
    promptSeed: "Martian colonies governed under 20-minute lag politics"
  },
  {
    term: "Universal Treaty",
    definition: "A supreme cosmic contract binding humans, machine networks, and future alien emissaries to a shared, protective ethics of existence.",
    example: "Negotiating extraction boundaries on icy moons using universal mathematical axioms.",
    promptSeed: "A cosmic Geneva convention treaty for humans and alien minds"
  }
];

export const workbookExercises: WorkbookItem[] = [
  {
    title: "30-Day Mirror Practice",
    audience: "Individuals",
    description: "Keep a daily journal which an AI analyzes to locate hidden fears, recurring metaphors, and archetypes. At the end of 30 days, it materializes a beautiful 'portrait of the self' based on these symbols.",
    promptSeed: "A comprehensive archetypal analysis of standard daily reflections"
  },
  {
    title: "Cosmic Calendar",
    audience: "Individuals",
    description: "Write once per week as if you lived under Mars' red dust or inside Europa's ice-crust dome. Over time, build a parallel dairy exploring hope, vacuum loneliness, and extraterrestrial sky cycles.",
    promptSeed: "A diary entry written by a lunar miner detailing Earth rise"
  },
  {
    title: "Future Self Dialogue",
    audience: "Individuals",
    description: "Role-play with an AI representing yourself 30 years from now. Discuss disagreements, list current regrets, and negotiate career and relationship advice.",
    promptSeed: "A letters-exchange dialogue between a user and their 30-year future self"
  },
  {
    title: "Quarterly Scenario Game",
    audience: "Companies",
    description: "Simulate three concurrent collapse vectors: a freight network blockade, a localized climate spike, and a code glitch. Draft and test resilience strategies tailored for renewal.",
    promptSeed: "A corporate stress test scenario detailing total supply chain failure"
  },
  {
    title: "AI as Socratic Critic",
    audience: "Companies",
    description: "Submit your corporate roadmap to an AI embodying a philosopher, a historian, and a forest ecologist. Audit your metrics for multigenerational footprints rather than quarterly returns.",
    promptSeed: "Review my roadmap as a 19th-century historian and a river watershed"
  },
  {
    title: "Diplomatic Simulation",
    audience: "Governments",
    description: "AI represents an alien delegation, an endangered swamp lands, or future grandchildren. Present a policy and negotiate for rights, teaching officials to legislate beyond standard human timelines.",
    promptSeed: "An urban policy debate with a representation of the local wetland"
  },
  {
    title: "Planetary Scorecard",
    audience: "Governments",
    description: "Use real-time data grids to model how local taxation changes ripple through nitrogen cycles and soil acidities, enforcing absolute outer planetary boundaries in financial structures.",
    promptSeed: "A planetary dashboard modeling local carbon taxes vs oceanic acid grids"
  }
];
