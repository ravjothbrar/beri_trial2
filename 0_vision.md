BERI Project Vision 

Project Name:

BERI - Bespoke Education Retrieval Infrastructure 

 

Vision: Make Haberdashers’ Schools policies instantly searchable and reliably answerable via an on-device, citation-first chatbot that works without a backend. 

 

Problem Statement 

Haberdashers' Schools have extensive policy documents (E-Safety, Data Protection, Acceptable Use, Academic Integrity) that students and staff need to reference frequently. Currently: 

Policy documents are lengthy PDFs that are difficult to navigate 

Students don't know where to find answers to specific questions 

Staff repeatedly answer the same policy-related questions 

Existing AI tools (like Copilot) don't have access to school-specific policies 

Commercial AI solutions require sending school data to external servers 

Solution 

A fully browser-based RAG chatbot that: 

Runs entirely on the user’s device (no backend). 

Answers questions using only official Habs policy documents. 

Provides source citations for verification. 

Works offline after initial model download and indexing. 

Maintains privacy by keeping documents, queries, and answers local. 

Target Outcome 

Students and staff can ask natural language questions about school policies and receive accurate, sourced answers in under 15 seconds - without any data leaving their device. 

Why Software? 

This cannot be solved with: 

A spreadsheet: Policies are too complex and interconnected 

A simple search: Users don't know the right keywords 

Existing tools: No tool combines local-only processing with school-specific knowledge 

Manual process: Staff time is better spent on education, not answering repetitive questions 

Why Now? 

Browser-based AI (WebLLM, Transformers.js) has matured enough to run capable models locally 

WebGPU provides GPU acceleration in browsers 

Small language models (SmolLM2, Qwen) are now good enough for RAG tasks 

This positions Habs at the forefront of AI in education 

 

 

Success Vision 

Student asks: “Can I use ChatGPT for homework?” → receives a concise answer plus citation to Academic Integrity Policy. 

Student asks: “Can I install apps on a school device?” → answer plus citation to Acceptable Use / E-Safety. 

Staff asks: “What’s the reporting process for [X]?” → answer plus citation to relevant safeguarding / procedure sections. 

User asks: “Where is this stated?” → BERI highlights/links to the specific cited passages. 

 

Behavioural Requirements for Answers  

When responding, BERI must: 

Use only the indexed policy corpus (no web knowledge, no general advice beyond what policies support). 

Provide citations for all answers (or explicitly state: “No relevant policy text found”). 

Avoid “hallucinating policy”: 

If the policy text does not support an answer, BERI must not invent it. 

BERI should instead: provide the closest relevant citation and recommend checking with staff if needed. 

Use clear, accessible language appropriate for students and staff. 

Where policy language is ambiguous, quote the relevant clause(s) briefly and explain the ambiguity. 

 

 

Project Constraints 

Constraint 

Requirement 

Backend 

None - fully browser-based 

API Calls 

None after initial model download 

Data Privacy 

All processing on user's device 

Target Browser 

Microsoft Edge (WebGPU) 

Target Hardware 

Microsoft Surface Pro 

Response Time 

<15 seconds for full response 

Demo Deadline 

January 26th, 2025 

 

What BERI Is NOT 

A general-purpose chatbot. 

A replacement for staff judgment on complex or safeguarding-sensitive issues. 

A tool for drafting, editing, or creating official policies. 

An internet-connected service during normal operation (post model download). 

North Star Metric 

Task Completion Rate: % of policy questions that users can answer using BERI without needing to ask a human or search the original PDF. 

Target: 80% for common policy questions. 

 

Supporting Metrics (Operational) 

Citation correctness rate: % of answers where citations genuinely support the claim. 

“No answer” quality: % of cases where BERI appropriately refuses / asks user to consult staff instead of hallucinating. 

Latency distribution: median and p90 end-to-end time (target hardware). 

User effort: average time-to-answer for top queries vs baseline (manual PDF search). 

Risk / Failure Modes to Avoid 

False confidence without citations (must not happen). 

Citations that do not support the answer (worse than no answer). 

Slow responses that discourage use (must stay within target). 

UI complexity that makes the tool feel harder than searching a PDF. 

Accidental network calls beyond initial model download (breaks trust). 
