# GVW26 — Topics

## Overview

### GVW26 — AI Explainer Series

- Repository layout
- Core Notes
- Microsoft Copilot Topic Packs
- Reference
- Interactive Webpage
  - What the `.bat` and `.sh` launchers do
  - No Node.js required
  - What you get
- How to Use These Notes
  - The path forward: further reading & homework
- Versioning
- Notes on Accuracy

## Planning

### GVW26 — Pending Work & Syllabus Coverage Map

- How to use this file
- 1. Verdict
- 2. Scorecard
- 3. Module-by-module assessment
  - Module 01 — Foundations of AI & Generative Language Models
  - Module 02 — Technical Mechanics: Embeddings, Vectors, Hyperparameters & MCP
  - Module 03 — Enterprise RAG & Speech-to-Text Transcription
  - Module 04 — Microsoft Copilot Enterprise & Office Power-Workflows
  - Module 05 — ETL Pipeline Augmentation & Automation (Python, JS, Node)
  - Module 06 — Enterprise Governance, Security, Data Retention & GxP
- 4. Glossary — 14 core concepts
- 5. Pharma prompt bank — 8 prompts
- 6. Governance matrix and compliance cards
- 7. Delivery framework (facilitator material)
- 8. Pending explainer topics
  - Foundations
  - Models and architecture
  - Agents and applications
  - Safety, ethics and society
  - Cost, operations and performance
  - Practical and hands-on
- 9. What GVW26 already adds beyond the syllabus
- 10. Prioritised backlog
  - P0 — closes a whole module
  - P1 — closes the partials
  - P2 — completeness
- 11. Companion topic files
- 12. Definition of done for a new note
- 13. Change log

## AI Foundations

### The AI Capability Funnel: Structural Divergence in AI Perception

- The Four Layers of the Funnel
- The Three Filters
- Why the Funnel Widens Instead of Closing
- What Each Layer Gets Wrong
- How to Move Down the Funnel
- A 20-Minute Self-Audit
- The Takeaway
- Further Reading & Self-Study
- Caveats & Provenance

### AI Fundamentals Series — Foundations, Mechanics, Agents and Safety

- 1. What is an LLM?
- 2. What is a Token?
- 3. Tokens & Embeddings
- 4. What is an AI Agent?
- 5. Engineering
  - Prompt Engineering (The Instruction Layer)
  - Context Engineering (The Information Layer)
  - Harness Engineering (The Execution & Control Layer)
  - Evaluation (The Feedback Layer)
- 6. Temperature & Sampling Deep Dive
- 7. AI Hallucinations
- 8. Prompting, RAG, and Fine-Tuning
  - Prompt Engineering (The First Step)
  - RAG / Retrieval-Augmented Generation (The Knowledge Layer)
  - Fine-Tuning (The Behavior Layer)
  - Side-by-Side
  - Combining Them in Production
- 9. Transformer Deep Dive
- 10. Multimodal AI
- 11. Open vs. Closed Models
- 12. Model Sizes & Quantisation
- 13. Reasoning Models & Test-Time Compute
- 14. Mixture of Experts (MoE)
- 15. Tool Calling (Function Calling)
- 16. RAG (Retrieval-Augmented Generation)
- 17. MCP (Model Context Protocol)
- 18. Computer Use & Browser Agents
- 19. AI Bias & Fairness
- 20. AI Privacy & Data Governance
- 21. Observability & Guardrails in Production
- 22. Deployment Options
- 23. Vector Databases
- 24. Automation with AI
- 25. Latest AI Innovations: Agents, Skills, Loops, Hooks, and APIs
- 26. AI-Assisted Reverse Engineering & Code Cloning
- 27. System Design & AI Comparisons
  - Identity & Access (Security)
  - Performance Metrics
  - Traffic Management
  - Architecture & Routing
  - AI Infrastructure
- 28. Traditional RAG vs ColPali
- 29. The Anatomy of an AI Agent
- 30. MCP vs Agents, APIs & Tools
- 31. The Essential LLM Parameters
- 32. AI Agents & MCP
- 33. Retrieval, Databases & Model Optimisation
  - Retrieval Strategies
  - Database Architectures
  - Structuring Knowledge
  - Model Training & Optimisation
- 34. Model-on-Silicon: Taalas, Chat Jimmy and Hard-Wired Inference
- Related Notes
- Sources and Provenance

### Follow-Up Topics (AI Explainer / Infographic Style)

- Foundations
- Models & Architecture
- Agents & Applications
- Safety, Ethics & Society
- Cost, Ops & Performance
- Practical / Hands-On

## RAG & Retrieval

### Retrieval and RAG Quality — Embeddings, Chunking, Indexes and Grounded Answers

- 1. What an Embedding Is
  - The core idea: meaning becomes distance
  - The vector: a row of numbers
  - Dimensions and normalisation
  - What the numbers do not encode
  - Consequences for the pipeline
- 2. Cosine, Dot Product and Euclidean Distance
  - Why normalised vectors make cosine and dot product equivalent
  - When each is appropriate
  - Common implementation mistakes
- 3. Biomedical and Domain Embeddings
  - Clinical acronyms
  - Drug names and brand mapping
  - Regulatory vocabulary
  - The verdict
  - What to do in practice
- 4. Asymmetric Search
  - Why one vector space struggles
  - The solution: instruction-tuned embedding models
  - Getting it wrong is easy
  - Alternatives and complements
- 5. Similarity Thresholds
  - Why an arbitrary cut-off fails
  - How to calibrate
  - Implementation notes
- 6. Vector Normalisation and Precision
  - The memory arithmetic
  - Quantisation families
  - Why normalisation is the enabler
  - The accuracy cost, and how to buy it back
- 7. Reranking with Embeddings
  - Bi-encoders: speed and recall
  - Cross-encoders: precision and nuance
  - Where each belongs
  - Practical guidance
- 8. Chunking Strategies
  - The core strategies
  - How the choice changes retrieval
  - Trade-offs: SOPs versus CSRs
  - Choosing a strategy
- 9. Chunk Size and Overlap
  - How size affects the pipeline
  - Why overlap matters
  - Sizing by content type
  - Measuring instead of guessing
- 10. Structure-aware Parsing, Table Extraction and Parent–Child Retrieval
  - Structure-aware parsing
  - Table extraction
  - Parent–child retrieval
  - The ingestion pipeline
- 11. Index Build vs Query Time
  - HNSW: a layered graph
  - IVF: inverted lists
  - Product quantisation inside the index
  - Tuning recall against latency
- 12. Hybrid Indexing
  - The blind spots
  - Dense versus sparse
  - Fusion methods
  - Engineering notes
- 13. Metadata Filtering
  - The mechanics
  - Why post-filtering collapses recall
  - Designing metadata
  - Rules that prevent the failure
- 14. Access-Control Trimming
  - The leak path
  - Why post-query trimming is too late
  - Carrying ACLs into the index
  - Keeping permissions current
  - The honest limits
- 15. Top-k and the Context Budget
  - The arithmetic
  - Why more context can reduce quality
  - Choosing k
  - Ordering the assembled context
- 16. Citation Grounding
  - Carrying identity
  - Instructing the model
  - Strict refusal
  - Verifying citations
  - What good looks like
- 17. The RAG Lifecycle
  - How failures cascade
  - Building the first version
- 18. Caching
  - The three caches
  - Embedding cache
  - Retrieval cache
  - Answer cache (semantic cache)
  - Invalidation rules that hold up
- 19. Generation Metrics
  - The four metrics
  - Faithfulness
  - Answer correctness
  - Citation accuracy
  - Refusal correctness
  - Making the metrics operational
- 20. Failure Analysis
  - 1. Retrieval misses
  - 2. Ranking errors
  - 3. Context dilution
  - 4. Generation errors
  - Workflow
- 21. Latency Budget
  - The budget
  - Where the milliseconds go
  - Making it faster without making it worse
  - Observability
- 22. Index Freshness
  - Update frequency
  - Effective and expiry dates
  - Stale-answer risk
  - Operating the freshness loop
- 23. The RAG Triad
  - The three legs
  - Context relevance
  - Faithfulness
  - Answer relevance
  - Isolating the failure
  - Running it
  - Limits worth stating
- Related Notes
- Sources and Provenance

### Speech-to-Text for Regulated Work — Whisper, Diarisation, Redaction and the Audio Pipeline

- 1. Whisper Model Sizes
  - The tiers
  - When the smallest model is enough
  - The turbo row, and why it exists
  - Speed, memory and the runtime
  - Choosing in practice
- 2. Medical Vocabulary Priming
  - What priming fixes
  - Building the lexicon
  - Limits and failure modes
  - Measuring whether it worked
- 3. Speaker Diarisation
  - The pipeline
  - Roles, not just clusters
  - Tools and what they cost
  - Accuracy limits
  - Manual correction that survives audit
- 4. Noisy Audio
  - What actually goes wrong
  - The preprocessing chain
  - Denoising and WER
  - Definition and reporting of WER
- 5. Timestamps and Provenance
  - What to store
  - Why each link matters
  - Failure modes
  - The provenance chain in one line
- 6. PHI Redaction After Transcription
  - What counts as PHI
  - The redaction pipeline
  - Measure recall, not throughput
  - The legal distinctions that change the design
  - Common mistakes
- 7. Audio → Summary → Actions
  - The five stages
  - What good stage output looks like
  - Human-in-the-loop, by design
  - Reliability and idempotency
  - Metrics that show the pipeline works
  - The pattern to copy
- Related Notes
- Sources and Provenance

### RAG & Retrieval Topics (Modules 02–03)

- Embeddings and similarity
- Indexing and chunking
- Vector databases and search infrastructure
- Retrieval quality and ranking
- RAG architecture and grounding
- Evaluation and benchmarking
- Audio, speech and multimodal ingestion
- Operations, security and cost
- Hands-on labs and deliverables

## Microsoft Copilot

### Copilot Across the Microsoft Stack — Master Topic Pack

- 0. The Single Most Important Distinction
- 1. Topic Map (what to cover)
- 2. The "Easiest Wins" Ladder (teach this order)
- 3. Cross-Tool Workflows (the real payoff)
  - Workflow A — Meeting → follow-up (Office suite)
  - Workflow B — Monthly reporting
  - Workflow C — Research → decision
  - Workflow D — Build an AI capability (pro-code)
  - Workflow E — Data & reporting engineering
- 4. Repeated Tasks Worth Automating First
- 5. Microsoft's Pitch (the messaging you can reuse)
- 6. Game-Changing Features of 2026 (the highlight reel)
- 7. Licensing, Credits & Cost Control
- 8. Governance, Security & Data Boundaries
- 9. A 30 / 60 / 90-Day Adoption Path
- 10. What's Still Hard (keep humans in the loop)
- 11. Cross-Tool Prompt Cookbook (Problem → Solution)
  - A. The meeting-to-everything pipeline 🤖 🔁
  - B. The reporting cycle 🔁 🧩
  - C. The decision and proposal pipeline 🔁 📓
  - D. Research and learning 🔁 🧩
  - E. Building an AI capability (the pro-code path) 🤖 🧩
  - F. Data and engineering work 🔁 🧩
  - G. Personal productivity (the daily loop)
  - H. Quick reference card
- 12. Sources (highest-signal)

### Copilot in Microsoft Word — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Use Copilot in Word (start here)
- 3. Tutorial Path (5-minute walkthrough)
- 4. What It Solves / Where It Streamlines Repetitive Work
- 5. Microsoft's Pitch (the messaging you can reuse)
- 6. Game-Changing / Highlight Features
- 7. Latest News Timeline (2026)
- 8. Prompt Cookbook (Problem → Solution)
  - A. Starting from nothing
  - B. Fixing a document someone else wrote
  - C. Comparison, gaps and review
  - D. Turning prose into structure
  - E. Audience, tone and localisation
  - F. Recurring documents (become a template)
  - G. Agent Mode: whole-document jobs 🤖
  - H. Pharma & GxP documents
  - I. Quick reference card
- 9. Gotchas & Guardrails
- 10. Sources

### Copilot in Microsoft Excel — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Use Copilot in Excel (start here)
- 3. Tutorial Path (10-minute walkthrough)
- 4. What It Solves / Where It Streamlines Repetitive Work
- 5. Microsoft's Pitch (the messaging you can reuse)
- 6. Game-Changing / Highlight Features
- 7. Latest News Timeline (2026)
- 8. Prompt Cookbook (Problem → Solution)
  - A. "I have data and no idea what's in it"
  - B. Data clean-up (the #1 time sink)
  - C. Analysis without formulas
  - D. Reporting and repeating
  - E. Getting unstuck
  - F. Regulated data checks
  - G. Quick reference card
- 9. Gotchas & Guardrails
- 10. Sources

### Copilot in Microsoft PowerPoint — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Use Copilot in PowerPoint (start here)
- 3. Tutorial Path (10-minute walkthrough)
- 4. What It Solves / Where It Streamlines Repetitive Work
- 5. Microsoft's Pitch (the messaging you can reuse)
- 6. Game-Changing / Highlight Features
- 7. Latest News Timeline (2026)
- 8. Prompt Cookbook (Problem → Solution)
  - A. The deck that has to exist tomorrow
  - B. Making it look like it came from your company
  - C. Fixing a bad deck
  - D. Visuals and images
  - E. Presenting and handling questions
  - F. Recurring decks
  - G. Pharma & regulatory decks
  - H. Quick reference card
- 9. Gotchas & Guardrails
- 10. Sources

### Copilot in Microsoft Outlook — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Use Copilot in Outlook (start here)
- 3. Tutorial Path (10-minute walkthrough)
- 4. What It Solves / Where It Streamlines Repetitive Work
- 5. Microsoft's Pitch (the messaging you can reuse)
- 6. Game-Changing / Highlight Features
- 7. Latest News Timeline (2026)
- 8. Prompt Cookbook (Problem → Solution)
  - A. Inbox overload
  - B. Reply and follow-up
  - C. Meetings and calendar
  - D. Rules and automation
  - E. Writing and quality
  - F. Grounding email in your wider work
  - G. Quick reference card
- 9. Gotchas & Guardrails
- 10. Sources

### Copilot in Microsoft OneNote — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Use Copilot in OneNote (start here)
- 3. Tutorial Path (10-minute walkthrough)
- 4. What It Solves / Where It Streamlines Repetitive Work
- 5. Microsoft's Pitch (the messaging you can reuse)
- 6. Game-Changing / Highlight Features
- 7. Latest News Timeline (2026)
- 8. Prompt Cookbook (Problem → Solution)
  - A. Notes you can't face reading again
  - B. Turning capture into action
  - C. Learning and study
  - D. Seeing the shape of your thinking
  - E. Handing work off
  - F. Whole-notebook work 🧩
  - G. Quick reference card
- 9. Gotchas & Guardrails
- 10. Sources

### Microsoft Foundry + Copilot — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Get Started (tutorial path)
- 3. What It Solves / Where It Streamlines Repetitive Work
- 4. Microsoft's Pitch (the messaging you can reuse)
- 5. Game-Changing / Highlight Features
- 6. Latest News Timeline (2026)
- 7. Prompt / CLI Cookbook (Problem → Solution)
  - A. Prototyping an idea in an afternoon
  - B. Making an agent that actually knows your business
  - C. Agents that remember
  - D. Shipping it to real users
  - E. Doing this properly (governance and cost)
  - F. CLI quick reference
  - G. Quick reference card
- 8. Gotchas & Guardrails
- 9. Sources

### GitHub Copilot in SSMS (SQL Server Management Studio) — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Use Copilot in SSMS (start here)
- 3. Tutorial Path (15-minute walkthrough)
- 4. What It Solves / Where It Streamlines Repetitive Work
- 5. Microsoft's Pitch (the messaging you can reuse)
- 6. Game-Changing / Highlight Features
- 7. Latest News Timeline
- 8. Prompt Cookbook (Problem → Solution)
  - A. "I've inherited a database I don't understand"
  - B. Writing queries faster
  - C. Performance problems
  - D. Errors and incidents
  - E. Admin and maintenance scripts
  - F. Migrations and modernisation
  - G. Quick reference card
- 9. Gotchas & Guardrails
- 10. Sources

### Azure Cosmos DB + AI/Copilot — Topic Pack

- 1. Topic Map (what to cover)
- 2. Easiest Ways to Get Started (tutorial path)
- 3. What It Solves / Where It Streamlines Repetitive Work
- 4. Microsoft's Pitch (the messaging you can reuse)
- 5. Game-Changing / Highlight Features
- 6. Latest News Timeline (2026)
- 7. Prompt / Code Cookbook (Problem → Solution)
  - A. "I don't know the query syntax for this API"
  - B. Designing the data model (the thing that's hard to undo)
  - C. Building AI features on the data
  - D. Migration and modernisation
  - E. Cost and scale
  - F. Dev environment and CI/CD
  - G. Quick reference card
- 8. Gotchas & Guardrails
- 9. Sources

## Automation & ETL

### LLM Nodes in Production Pipelines — Structured Outputs, Idempotency, Retries and Cost

- 1. Where LLMs Beat Rules
- 2. LLM Nodes Inside a Pipeline
- 3. Idempotency and Reprocessing
- 4. Human-Review Queues
- 5. Batch vs Streaming
- 6. Pydantic Models
- 7. JSON Schema and Strict Mode
- 8. Schema Evolution
- 9. Round-Trip Testing
- 10. Fallback Models
- 11. Timeouts and Circuit Breakers
- 12. Async and Concurrency
- 13. Caching
- 14. Cost Controls
- Related Notes
- Sources and Provenance

### Operating LLM Pipelines — Evaluation, Observability, Runbooks and Security

- 1. Golden Datasets
  - Building one that survives contact with production
  - Keeping it honest
- 2. Field-Level Accuracy
  - Precision, recall and the asymmetry between them
  - Reporting that drives a decision
  - Coverage versus accuracy
- 3. Regression Runs on Prompt Change
  - What counts as a change
  - Thresholds that are not noise
  - What to compare
  - When the gate fails
- 4. Drift Detection
  - Signals you can compute without labels
  - Accuracy decay needs a labelled trickle
  - The response is a decision, not an alert
- 5. Observability
  - Traces before logs
  - Sampling and cardinality
  - Dashboards that answer a question
- 6. Alerting
  - SLOs and burn rate
  - Making an alert actionable
- 7. Reproducibility
  - The replay harness
  - Seeds are a request, not a guarantee
- 8. Runbooks
  - Anatomy of a runbook
  - The bad-batch runbook
  - Drills and maintenance
- 9. Secrets Management
  - Managed identity and federation in practice
  - Rotation, detection and break-glass
- 10. Least-Privilege Access
  - Read-only by default, write through one door
  - Proving it
- 11. Prompt Injection Through Documents
  - Where injection hides
  - Controls in depth
  - Testing for it
- 12. PII in Logs
  - The redaction pipeline
  - Regulated data needs a different rule
  - Measuring redaction
- 13. Audit Trail
  - ALCOA+ in a pipeline
  - Integrity
- 14. Agent Permissions
  - The intent-to-write queue
  - Scoping the agent itself
- Related Notes
- Sources and Provenance

### Microsoft 365 Automation — Office Scripts, Power Automate, Webhooks and Graph

- 1. The Automation Stack
  - Power Query or Office Scripts?
  - The deterministic boundary
  - Prompt: classify the steps before building anything
- 2. Office Scripts in Excel
  - A script that upserts validated rows
  - Calling it from a flow
  - The limits that shape the design
  - What not to put in a script
  - Prompt: generate a script from a contract
- 3. Power Automate Flows
  - The six patterns worth knowing
  - The actions that carry the design
  - Expressions you will use every day
  - Idempotency, retries and the dead-letter list
  - Approvals that are real
  - Limits that change the design
  - Prompt: turn a procedure into a flow outline
- 4. Webhooks and Azure Functions
  - The HTTP contract
  - Python v2: validate, enqueue, acknowledge
  - Node.js v2: the same contract
  - Security for a public endpoint
  - Limits that decide the shape
  - Prompt: generate the endpoint and its tests
- 5. SharePoint and OneDrive Connectors
  - The folder lifecycle
  - The connector actions that matter
  - Idempotency in a library
  - Avoiding the retrigger loop
  - Permissions and ownership
  - Prompt: design the lifecycle before the flow
- 6. Outlook and Teams Triggers
  - The intake envelope
  - Outlook triggers
  - Teams triggers and actions
  - An adaptive card that asks for a real decision
  - Latency and volume
  - Prompt: write the intake rules
- 7. Copilot Studio vs Pro-Code
  - The decision table
  - The hybrid pattern
  - A minimal custom-connector contract
  - ALM for low-code
  - Prompt: choose the boundary
- 8. Graph API for Automation
  - Authentication models
  - Permission scoping
  - Delta sync for a document library
  - Throttling, batching and the shape of a good call
  - Change notifications
  - Prompt: map the task to the minimum permissions
- 9. The End-to-End Reference Pipeline
  - The shape
  - The stage contract
  - The JSON contract between layers
  - Deployment checklist
  - The test plan
  - Prompt: review the architecture before you build it
- Related Notes
- Sources and Provenance

### Automation & ETL Topics (Module 05)

- ETL architecture and LLM nodes
- Structured outputs and validation
- Pharma data tasks
- Microsoft 365 automation
- Reliability, scale and cost
- Evaluation and operations
- Security and governance
- Hands-on labs and deliverables

## Pharma & GxP

### Enterprise AI Governance for Pharma — Data Tiers, GxP Validation and Audit Evidence

- 1. The Four-Tier Data Classification Matrix
- 2. PHI, PII and De-identification for AI
  - Direct vs indirect identifiers
  - HIPAA Safe Harbor vs GDPR pseudonymisation
  - What "de-identified" must mean before prompting
- 3. GxP Record Retention vs AI Prompt Retention
  - GxP record-retention obligations
  - AI vendor retention windows
  - Keeping the regulated record outside the model
- 4. GAMP 5: Risk-Based Computerised System Validation
  - The software categories
  - Where AI tools land
- 5. FDA 21 CFR Part 11: Electronic Records and Signatures
  - The predicate rule
  - Electronic records
  - Electronic signatures
  - Audit trails
  - Access control
  - Record retention
- 6. Computerised System Validation (CSV) Lifecycle
- 7. Human-in-the-Loop (HITL) Sign-Off
  - Where a qualified person must review
  - What the reviewer must see
  - How the signature is captured
  - Why "the model said so" is never a defence
- 8. Source Citation and Grounding Evidence
  - 1. Page and paragraph citations
  - 2. Chunk IDs
  - 3. Retrieval scores
  - 4. The traceability rule for quantitative claims
- 9. Prompt and Response Logging: Auditability
  - What to log
  - Where to store it
  - How to make it tamper-evident
- 10. Enterprise AI Security and Compliance Framework
  - 1. Prompt injection (direct and indirect)
  - 2. Jailbreaks and policy bypass
  - 3. Data exfiltration through agents
  - 4. Oversharing and permission hygiene
  - 5. Purview DLP and sensitivity labels
  - 6. Entra Agent ID and agent identity
  - 7. Secrets and API keys
  - 8. Red teaming and pre-deployment testing
- 11. Quality Control: Confidence Scoring and Escalation
  - Confidence scoring and review queues
  - Four-eyes review and escalation
- 12. Acceptable-Use Policy and AI System Inventory
  - The one-page acceptable-use policy
  - The AI system inventory
- 13. Build vs Buy: Configured Copilot, Custom RAG and Local Models
- 14. ROI and Business Case
  - The four drivers
  - Total cost of ownership
  - Building a defensible case
- Related Notes
- Sources and Provenance

### Out-of-Syllabus Pharma AI Topics — An Exploration Menu

- Topic map
- 1. Predictive Analytics for Pharmacokinetics (ADME)
- 2. Natural Language Processing for Literature and Patent Search
- 3. Computer Vision for Imaging Analysis
- 4. Deep Learning for Drug Discovery
- 5. Clinical Decision Support Systems
- 6. AI-powered Regulatory Compliance
- 7. Supply Chain Optimisation with AI
- 8. AI-assisted Quality Control
- 9. Personalised Medicine with AI
- 10. Digital Twinning for Manufacturing
- Teaching this beyond the syllabus
- Guardrails for any out-of-syllabus experiment
- Definition of done for an exploration memo
- Sources

### Pharma & GxP Topics (Module 06)

- Data boundaries and retention
- Validation and GxP
- Audit trails and evidence
- Security, access and threats
- Human oversight and quality
- Regulation and policy
- Pharma data scenarios
- Vendor, operating model and training
