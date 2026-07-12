---
name: task-cost-classifier
description: Classifies a list of operational tasks into the 6 portfolio services (Workflow Optimization, AI Assistants, Business Process Automation, AI Automation, Custom AI Applications, AI Consulting) and calculates project costs.
---

# Task Cost Classifier Skill

This skill provides a structured framework to analyze client tasks, map them to specific service categories, estimate execution hours, and calculate cost projections.

## Core Rate Structure (Ascending)
1. **Workflow Optimization** — **₹1,400/hr**
2. **AI Assistants** — **₹1,500/hr**
3. **Business Process Automation** — **₹1,600/hr**
4. **AI Automation** — **₹1,800/hr**
5. **Custom AI Applications** — **₹2,000/hr**
6. **AI Consulting** — **₹2,000/hr**

---

## Interactive User Engagement Protocol

When executing this skill, the agent **must** actively prompt the user for project parameters. 

### Step 1: Request Inputs
Ask the user to clarify the following details to ensure accurate pricing:
* **Client & Project Name**
* **Plan Mode Choice**:
  * *Client-Bare* (1.0x)
  * *Work + Consulting* (1.3x)
  * *Consulting Only* (1.8x)
* **Estimated Hours**
* **Additional Expenses** (e.g. server hosting, API keys, third-party subscriptions)
* **Add-ons & Adjustments**:
  * Include Discovery & Requirements Session (+₹2,000)?
  * Include GST (18%)?
  * Include Rush Charge / Discount?

### Step 2: Handle Missing Inputs & Footer Terms
If the user denies providing these inputs, declines to answer, or leaves details blank, the agent must estimate the tasks using conservative defaults (e.g. Work + Consulting mode, standard hours) **and append the following footer** summarizing all neglected terms to avoid discrepancies:

```markdown
---
### ⚠️ Important Notice: Additional Terms & Conditions
* **Taxation**: Prices do not include GST (18%) which may apply depending on billing location.
* **Discovery Session Note**: The flat ₹2,000 Discovery pricing is valid for first-time clients only and covers up to 2 hours. Additional workshop/consulting time falls back to standard Consulting Skill Rates.
* **Plan Multipliers**: Pricing is subject to change if the engagement mode transitions from Execution-Only (1.0x) to Full-Service/Strategy (1.3x - 1.8x).
* **Rush/Expedited Delivery**: A premium charge may apply if tight deadlines require overtime or weekend work.
```

---

## Classification Guidelines

### 1. Workflow Optimization (₹1,400/hr)
* **Definition**: Enhancing existing software and process steps.
* **Keywords**: *redesign, tool improvement, CRM integration, bottleneck analysis, auditing.*
* **Example**: "Link our existing Slack with HubSpot to notify the team when a new deal stage changes."

### 2. AI Assistants (₹1,500/hr)
* **Definition**: Conversational interfaces or automated chat handlers.
* **Keywords**: *chatbot, support agent, knowledge search, onboarding bot, voice agent.*
* **Example**: "Build a bot that answers internal questions about our company handbook policies."

### 3. Business Process Automation (₹1,600/hr)
* **Definition**: Connecting multiple systems to automate an end-to-end departmental process.
* **Keywords**: *HR pipelines, invoicing flows, inventory sync, lead routing.*
* **Example**: "When an invoice is approved in QuickBooks, send a PDF copy to Dropbox and text the client via Twilio."

### 4. AI Automation (₹1,800/hr)
* **Definition**: Running single-purpose automated AI pipelines for content or data work.
* **Keywords**: *report generation, email sorting/replying, document summarization, scheduled scripts.*
* **Example**: "Parse daily PDF reports from our suppliers using Claude API and extract the line items into Excel."

### 5. Custom AI Applications (₹2,000/hr)
* **Definition**: Building custom user interfaces, portals, or full systems featuring embedded AI capabilities.
* **Keywords**: *dashboard, portal, visual app, customized CRM, RAG database.*
* **Example**: "Create a React-based client dashboard where customers can log in and view their AI-analyzed usage trends."

### 6. AI Consulting (₹2,000/hr)
* **Definition**: High-level strategic planning, roadmapping, or technical audit without direct coding.
* **Keywords**: *readiness assessment, strategy, vendor selection, team training, roadmap.*
* **Example**: "Assess our current customer support department and deliver a detailed plan showing where AI can save costs."

---

## Cost Calculation Workflow

For any list of tasks provided by a client:
1. **Map**: Align each task to the closest category above.
2. **Estimate**: Propose a realistic hourly duration for each task.
3. **Subtotal**: Multiply `Hours * Category Rate`.
4. **Sum**: Calculate the sum of all task subtotals.
5. **Add-ons**:
   * Add Discovery Session (`+₹2,000` flat) if requested (first-time clients).
   * Apply plan multipliers if applicable (e.g., `1.3x` for Work + Consulting).
