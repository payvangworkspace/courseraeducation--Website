import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";
import {
  BookOpen,
  Clock,
  User,
  Star,
  Search,
  CheckCircle,
  ArrowRight,
  Sparkles,
  DollarSign,
  X,
  ShieldCheck,
  Zap,
  Award,
  Layers
} from "lucide-react";

const BRAND_NAME = "Coursera Education";

const COURSES_DATA = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering & System Directives",
    tagline: "Master production-grade prompts, Pydantic JSON schemas, and red-team safety.",
    category: "Prompt Engineering",
    badge: "Bestseller",
    badgeColor: "#C99A3D",
    priceUSD: 1249,
    priceAED: 4584,
    rating: 4.9,
    reviewsCount: 382,
    studentsCount: 1420,
    duration: "4 Weeks",
    modulesCount: 8,
    level: "Beginner to Intermediate",
    instructor: "Alex Morgan",
    instructorRole: "Lead AI Architect",
    icon: "✨",
    overview: "This track transforms simple prompt crafting into scalable engineering. You will learn dynamic Few-Shot contextual retrieval, structural output formatting with JSON/Pydantic schemas, system persona allocation, and prompt injection defense strategies for production applications.",
    whatYouWillLearn: [
      "Design deterministic system directives and persona roles",
      "Enforce structural JSON outputs with Pydantic & Zod schemas",
      "Implement dynamic Few-Shot exemplar selection strategies",
      "Defend against prompt injection, jailbreaks, and data extraction",
      "Benchmark token cost, latency, and response quality",
      "Build automated evaluation harnesses for prompt iteration"
    ],
    curriculum: [
      { title: "Module 1: Prompt Architecture & Tokenization Mechanics", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 2: System Directives & Persona Allocation", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 3: Structural Output Formatting (JSON/Pydantic)", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 4: Dynamic Few-Shot Retrieval & Selection", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 5: Red Teaming & Prompt Injection Defense", duration: "5 Lessons · 3.0 hrs" },
      { title: "Module 6: Cost, Latency & Token Optimization", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 7: Automated Evaluation & Benchmarking", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 8: Capstone: Production Prompt Pipeline", duration: "2 Lessons · 4.0 hrs" }
    ]
  },
  {
    id: "rag-architecture",
    title: "Enterprise RAG & Vector Database Design",
    tagline: "Build scalable retrieval-augmented generation with hybrid search & reranking.",
    category: "RAG & VectorDB",
    badge: "Popular",
    badgeColor: "#7A1F2B",
    priceUSD: 1499,
    priceAED: 5501,
    rating: 4.95,
    reviewsCount: 420,
    studentsCount: 980,
    duration: "6 Weeks",
    modulesCount: 10,
    level: "Intermediate to Advanced",
    instructor: "Sarah Chen",
    instructorRole: "Principal Data Scientist",
    icon: "🔗",
    overview: "Learn how to architect enterprise-grade Retrieval-Augmented Generation (RAG) platforms. Master dense and sparse vector embeddings, advanced chunking methods, Pinecone & Qdrant vector indexing, cross-encoder reranking, and hallucination reduction.",
    whatYouWillLearn: [
      "Understand vector spaces, cosine similarity, and HNSW indexing",
      "Implement semantic, recursive, and agentic document chunking",
      "Configure vector databases (Pinecone, Qdrant, Milvus)",
      "Combine BM25 sparse search with dense vector hybrid search",
      "Integrate Cohere & BGE cross-encoder rerankers",
      "Implement HyDE (Hypothetical Document Embeddings)",
      "Evaluate RAG pipelines using RAGAS and the RAG Triad framework"
    ],
    curriculum: [
      { title: "Module 1: Vector Embeddings & Similarity Metrics", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Document Ingestion & Chunking Strategies", duration: "5 Lessons · 2.5 hrs" },
      { title: "Module 3: Vector Databases (Pinecone, Qdrant, Milvus)", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Hybrid Search & BM25 Integration", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 5: Cross-Encoder Reranking & Context Compression", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 6: Query Transformation & HyDE Mechanics", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Hallucination Mitigation & RAG Triad Evaluation", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 8: Enterprise Access Control & Multi-Tenancy Vector Search", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 9: Real-time Streaming & Semantic Cache Layering", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 10: Capstone: Enterprise Knowledge Base Assistant", duration: "3 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "agentic-ai",
    title: "Agentic AI & Multi-Agent Orchestration",
    tagline: "Build autonomous multi-step reasoning agents with LangGraph & CrewAI.",
    category: "Agentic AI",
    badge: "Advanced",
    badgeColor: "#2563EB",
    priceUSD: 1799,
    priceAED: 6602,
    rating: 4.98,
    reviewsCount: 290,
    studentsCount: 740,
    duration: "8 Weeks",
    modulesCount: 12,
    level: "Advanced",
    instructor: "James Wilson",
    instructorRole: "AI Systems Lead",
    icon: "💡",
    overview: "Master autonomous agent architectures capable of multi-step planning, tool execution, API integration, and agentic delegation. Build production workflows using LangGraph state graphs, AutoGen multi-agent networks, and CrewAI role-playing agents.",
    whatYouWillLearn: [
      "Implement ReAct (Reasoning + Acting) loops & Plan-and-Solve patterns",
      "Define custom tool-calling interfaces with strict validation",
      "Manage persistent memory and session-state persistence",
      "Design human-in-the-loop approval and intervention hooks",
      "Orchestrate multi-agent networks with specialized roles",
      "Build state machines with LangGraph directed graphs",
      "Implement fallback retry strategies for robust tool execution"
    ],
    curriculum: [
      { title: "Module 1: Agentic Reasoning Loop (ReAct & Plan-and-Solve)", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 2: Tool Calling & Function Calling APIs", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 3: State Management & Persistent Memory", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 4: Human-in-the-Loop Approval Protocols", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 5: Multi-Agent Collaboration Frameworks", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 6: LangGraph State Graph Development", duration: "5 Lessons · 3.5 hrs" },
      { title: "Module 7: Dynamic Task Allocation & Sub-Agent Spawning", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Error Handling, Retries & Fallback Loops", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 9: Code Execution & Sandbox Security", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 10: Multi-Modal Agents (Vision + Voice + Code)", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 11: Agent Performance Evaluation & Benchmarks", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 12: Capstone: Autonomous Full-Stack Software Engineer Agent", duration: "3 Lessons · 6.0 hrs" }
    ]
  },
  {
    id: "ml-foundations",
    title: "Machine Learning & Deep Learning Foundations",
    tagline: "Core ML algorithms, PyTorch deep neural networks, and model deployment.",
    category: "ML & Deep Learning",
    badge: "Essential",
    badgeColor: "#16A34A",
    priceUSD: 1199,
    priceAED: 4400,
    rating: 4.88,
    reviewsCount: 510,
    studentsCount: 2150,
    duration: "6 Weeks",
    modulesCount: 10,
    level: "Beginner to Intermediate",
    instructor: "Priya Patel",
    instructorRole: "Machine Learning Researcher",
    icon: "🧠",
    overview: "A comprehensive hands-on foundation in modern Machine Learning and Deep Learning. Gain intuitive and mathematical understanding of gradient descent, neural network architectures, PyTorch tensor mechanics, computer vision, and NLP model deployment.",
    whatYouWillLearn: [
      "Master Linear, Logistic Regression & Gradient Descent mechanics",
      "Build Decision Trees, Random Forests & XGBoost models",
      "Understand backpropagation and computational graphs",
      "Build custom PyTorch Deep Neural Networks (DNNs)",
      "Train Convolutional Neural Networks (CNNs) for vision tasks",
      "Implement Transformers & Attention Mechanisms from scratch",
      "Export models with ONNX / TorchScript for low-latency inference"
    ],
    curriculum: [
      { title: "Module 1: Regression, Classification & Gradient Descent", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Ensemble Methods: Random Forests & XGBoost", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Neural Networks & Backpropagation Math", duration: "5 Lessons · 3.0 hrs" },
      { title: "Module 4: PyTorch Basics & Tensor Acceleration", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 5: Convolutional Neural Networks (CNNs)", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 6: Recurrent Networks & Sequence Modeling", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Attention Mechanisms & Transformer Core", duration: "5 Lessons · 3.5 hrs" },
      { title: "Module 8: Model Regularization & Hyperparameter Tuning", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 9: MLOps: Model Packaging & Inference Microservices", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 10: Capstone: End-to-End Deep Learning Pipeline", duration: "3 Lessons · 4.0 hrs" }
    ]
  },
  {
    id: "llm-finetuning",
    title: "LLM Fine-Tuning, Quantization & vLLM Hosting",
    tagline: "Fine-tune open LLMs (Llama 3, Qwen) with LoRA, QLoRA & DPO alignment.",
    category: "ML & Deep Learning",
    badge: "Hot",
    badgeColor: "#DC2626",
    priceUSD: 1899,
    priceAED: 6969,
    rating: 4.96,
    reviewsCount: 180,
    studentsCount: 520,
    duration: "6 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "Marcus Lee",
    instructorRole: "LLM Infrastructure Engineer",
    icon: "⚡",
    overview: "Master fine-tuning open-weights models (Llama 3, Mistral, Qwen) for domain-specific tasks. Learn Parameter-Efficient Fine-Tuning (PEFT/LoRA/QLoRA), Direct Preference Optimization (DPO), GGUF/AWQ quantization, and ultra-fast hosting with vLLM.",
    whatYouWillLearn: [
      "Curate instruction & preference datasets for fine-tuning",
      "Configure Unsloth, HuggingFace TRL & PEFT for LoRA training",
      "Execute 4-bit QLoRA training on single-GPU instances",
      "Align model output with DPO (Direct Preference Optimization)",
      "Quantize weights to GGUF, AWQ, and EXL2 formats",
      "Deploy high-throughput inference nodes using vLLM & Ollama",
      "Monitor GPU memory utilization, vRAM bottlenecks & token throughput"
    ],
    curriculum: [
      { title: "Module 1: Open Weights Models & Data Curation", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 2: PEFT & LoRA Mathematical Principles", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 3: QLoRA 4-bit Quantization Training", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Alignment with DPO & Preference Data", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 5: Model Quantization (GGUF, AWQ, EXL2)", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 6: High-Throughput vLLM & Tensor Parallelism", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 7: Continuous Evaluation & Benchmark Testing", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Capstone: Enterprise Domain-Specific LLM Deployment", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "ai-safety",
    title: "AI Safety, Governance & Enterprise Red-Teaming",
    tagline: "Enterprise risk mitigation, red-teaming frameworks, and UAE/EU AI compliance.",
    category: "Governance & Safety",
    badge: "Enterprise",
    badgeColor: "#059669",
    priceUSD: 1099,
    priceAED: 4033,
    rating: 4.89,
    reviewsCount: 210,
    studentsCount: 610,
    duration: "4 Weeks",
    modulesCount: 6,
    level: "Intermediate",
    instructor: "Dr. Elena Rostova",
    instructorRole: "AI Safety & Compliance Director",
    icon: "🛡️",
    overview: "A comprehensive operational framework for enterprise AI safety, risk management, red-teaming methodologies, data privacy controls (UAE AI Ethics & EU AI Act compliance), PII redaction, and automated toxicity classifiers.",
    whatYouWillLearn: [
      "Establish enterprise AI governance & risk evaluation matrices",
      "Perform adversarial red-teaming and jailbreak vulnerability testing",
      "Implement real-time input/output toxicity classifiers & guardrails",
      "Anonymize PII and prevent data leakage in LLM prompts",
      "Audit model bias and fairness across demographic distributions",
      "Ensure compliance with UAE AI & Data Protection frameworks"
    ],
    curriculum: [
      { title: "Module 1: Enterprise AI Risk & Governance Frameworks", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 2: Red-Teaming & Adversarial Prompt Exploits", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Real-Time Guardrails & Output Filtering", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 4: PII Redaction & Data Privacy Controls", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 5: Bias Auditing & Demographic Fairness", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Capstone: Enterprise AI Safety & Governance Audit", duration: "2 Lessons · 3.5 hrs" }
    ]
  },
  {
    id: "fullstack-ai-engineering",
    title: "Full-Stack AI Application Engineering",
    tagline: "Build production Next.js & FastAPI web applications with AI capabilities.",
    category: "Agentic AI",
    badge: "Popular",
    badgeColor: "#7A1F2B",
    priceUSD: 1599,
    priceAED: 5868,
    rating: 4.93,
    reviewsCount: 310,
    studentsCount: 890,
    duration: "6 Weeks",
    modulesCount: 9,
    level: "Intermediate to Advanced",
    instructor: "David Miller",
    instructorRole: "Principal Full-Stack Architect",
    icon: "🚀",
    overview: "Build modern, resilient full-stack applications with React, Next.js, FastAPI, PostgreSQL, and LLM integrations. Master streaming responses (Server-Sent Events), WebSocket state sync, rate-limiting, and async background queues (Celery/Redis).",
    whatYouWillLearn: [
      "Architect asynchronous Python FastAPI backends with Pydantic",
      "Stream real-time LLM outputs using Server-Sent Events (SSE)",
      "Manage persistent user sessions, JWT tokens, and OAuth2",
      "Integrate vector search & PostgreSQL pgvector into web apps",
      "Design responsive React micro-frontends with Tailwind CSS",
      "Deploy scalable microservices using Docker, Kubernetes & Vercel"
    ],
    curriculum: [
      { title: "Module 1: FastAPI Microservice Architecture", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Async Endpoints & WebSockets", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 3: Server-Sent Events (SSE) Streaming", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 4: PostgreSQL pgvector & Relational Storage", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 5: React & Next.js AI Interface Design", duration: "5 Lessons · 3.5 hrs" },
      { title: "Module 6: Redis Rate Limiting & Queue Orchestration", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Authentication & RBAC Security", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 8: Dockerization & Kubernetes Deployment", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 9: Capstone: Production AI SaaS Platform", duration: "3 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "multimodal-vision-llm",
    title: "Multimodal LLMs & Vision-Language Architectures",
    tagline: "Build multimodal vision-language agents with GPT-4V, LLaVA & Whisper.",
    category: "ML & Deep Learning",
    badge: "Advanced",
    badgeColor: "#2563EB",
    priceUSD: 1699,
    priceAED: 6235,
    rating: 4.97,
    reviewsCount: 230,
    studentsCount: 540,
    duration: "7 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "Dr. Aris Thorne",
    instructorRole: "Vision & AI Lead",
    icon: "👁️",
    overview: "Explore multimodal artificial intelligence combining vision, speech, and text reasoning. Learn image feature extraction (CLIP, SigLIP), cross-modal attention mechanisms, visual question answering (VQA), and Whisper real-time audio transcriptions.",
    whatYouWillLearn: [
      "Understand CLIP & SigLIP visual embedding spaces",
      "Build Vision-Language Models using LLaVA architecture",
      "Process complex document images, charts & OCR extractions",
      "Integrate OpenAI GPT-4 Vision & Claude 3 Multimodal APIs",
      "Deploy real-time audio transcription with Whisper & VAD",
      "Build interactive multimodal assistant pipelines"
    ],
    curriculum: [
      { title: "Module 1: Visual Embeddings & CLIP Architecture", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 2: Cross-Modal Attention Mechanics", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Open-Source VLM Fine-Tuning (LLaVA)", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Document Analysis & Chart OCR Extraction", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 5: Real-time Audio Processing with Whisper", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 6: Multi-Modal Agent Tool Execution", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Latency & Video Stream Processing", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 8: Capstone: Multimodal Medical Image Assistant", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "langchain-llamaindex-agents",
    title: "AI Agents with LangChain & LlamaIndex Frameworks",
    tagline: "Build enterprise data routing pipelines & advanced agent graphs.",
    category: "Agentic AI",
    badge: "Bestseller",
    badgeColor: "#C99A3D",
    priceUSD: 1399,
    priceAED: 5134,
    rating: 4.91,
    reviewsCount: 360,
    studentsCount: 1120,
    duration: "5 Weeks",
    modulesCount: 7,
    level: "Intermediate",
    instructor: "Sophia Martinez",
    instructorRole: "Senior AI Solutions Architect",
    icon: "⚙️",
    overview: "Master standard AI developer frameworks: LangChain v0.2, LangGraph, and LlamaIndex. Build automated document indexing pipelines, hierarchical summary indexes, router engines, and self-correcting code generation agents.",
    whatYouWillLearn: [
      "Build modular chains, prompts & memory using LangChain LCEL",
      "Construct LlamaIndex document stores & query engines",
      "Implement multi-document router & sub-question query engines",
      "Design self-correcting code generation & SQL agents",
      "Integrate enterprise connectors (Slack, Google Drive, Jira)",
      "Evaluate framework overhead, tracing & observability with LangSmith"
    ],
    curriculum: [
      { title: "Module 1: LangChain Expression Language (LCEL)", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: LlamaIndex Indexing & Query Engines", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Sub-Question & Router Query Mechanics", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 4: SQL & Database Query Agent Design", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 5: Enterprise API & Tool Connectors", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Observability & Tracing with LangSmith", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Capstone: Enterprise Knowledge Graph Agent", duration: "2 Lessons · 4.0 hrs" }
    ]
  },
  {
    id: "enterprise-mlops-monitoring",
    title: "Enterprise MLOps & Model Monitoring Pipelines",
    tagline: "CI/CD for Machine Learning, data drift detection, and MLflow tracking.",
    category: "Governance & Safety",
    badge: "Enterprise",
    badgeColor: "#059669",
    priceUSD: 1449,
    priceAED: 5318,
    rating: 4.92,
    reviewsCount: 195,
    studentsCount: 480,
    duration: "5 Weeks",
    modulesCount: 7,
    level: "Intermediate to Advanced",
    instructor: "Vikram Rao",
    instructorRole: "Head of Infrastructure & MLOps",
    icon: "📊",
    overview: "Master automated production pipelines for ML and LLMs. Implement model versioning with MLflow, data drift monitoring with Evidently AI, CI/CD model deployment with GitHub Actions, and automated rollback strategies.",
    whatYouWillLearn: [
      "Track experiments & register model artifacts with MLflow",
      "Automate CI/CD model packaging & unit testing pipelines",
      "Monitor data drift, concept drift & feature distribution decay",
      "Implement Prometheus metrics & Grafana dashboards for ML",
      "Deploy A/B testing & shadow deployment traffic splitters",
      "Ensure regulatory model auditing & version provenance"
    ],
    curriculum: [
      { title: "Module 1: MLflow Experiment Tracking & Registry", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Automated CI/CD for Machine Learning", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Data Drift & Concept Drift Detection", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 4: Prometheus & Grafana Monitoring Setups", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 5: A/B Testing & Canary Deployments", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Automated Incident Response & Model Rollback", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Capstone: Automated Enterprise MLOps Pipeline", duration: "2 Lessons · 4.0 hrs" }
    ]
  },
  {
    id: "quantum-ml-foundations",
    title: "Quantum Machine Learning & Next-Gen Compute",
    tagline: "Quantum circuit design, variational quantum eigensolvers & PennyLane ML.",
    category: "ML & Deep Learning",
    badge: "Specialized",
    badgeColor: "#C99A3D",
    priceUSD: 1899,
    priceAED: 6969,
    rating: 4.94,
    reviewsCount: 140,
    studentsCount: 320,
    duration: "8 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "Prof. Hans Weber",
    instructorRole: "Quantum Computing Researcher",
    icon: "⚛️",
    overview: "Explore the bleeding edge of computing where Quantum Mechanics meets Deep Learning. Learn qubit gate operations, quantum neural networks, PennyLane & Qiskit libraries, Variational Quantum Algorithms (VQE), and hybrid quantum-classical models.",
    whatYouWillLearn: [
      "Understand qubit superposition, entanglement & quantum logic gates",
      "Program quantum circuits with IBM Qiskit & Xanadu PennyLane",
      "Implement Variational Quantum Eigensolvers (VQE)",
      "Build Hybrid Quantum-Classical Neural Networks (QNNs)",
      "Analyze quantum advantage for optimization & machine learning",
      "Run algorithms on actual NISQ quantum hardware backends"
    ],
    curriculum: [
      { title: "Module 1: Qubit Mechanics & Quantum Gates", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 2: IBM Qiskit & PennyLane Frameworks", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Quantum Variational Circuits", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Quantum Neural Networks (QNNs)", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 5: Quantum Kernel Estimation & SVMs", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Hybrid Quantum-Classical Training Loops", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 7: Quantum Optimization & Error Mitigation", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 8: Capstone: Quantum Feature Classification Model", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "gpu-cluster-infrastructure",
    title: "AI Infrastructure & GPU Cluster Management",
    tagline: "NVIDIA H100/A100 cluster orchestration, InfiniBand & Slurm setups.",
    category: "Governance & Safety",
    badge: "Hot",
    badgeColor: "#DC2626",
    priceUSD: 1749,
    priceAED: 6418,
    rating: 4.96,
    reviewsCount: 175,
    studentsCount: 410,
    duration: "6 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "Elena Rostova",
    instructorRole: "AI Infrastructure & Cloud Lead",
    icon: "💻",
    overview: "Master large-scale AI compute infrastructure operations. Architect Multi-GPU multi-node clusters, configure NVIDIA NCCL, InfiniBand networking, Slurm job schedulers, Kubernetes KubeFlow, and optimize vRAM GPU throughput.",
    whatYouWillLearn: [
      "Configure NVIDIA GPU drivers, CUDA toolkits & Container Runtime",
      "Optimize multi-node GPU communication using NCCL & InfiniBand",
      "Manage HPC workload scheduling with Slurm & Kubernetes",
      "Set up Distributed Data Parallel (DDP) & DeepSpeed Megatron-LM",
      "Monitor vRAM bottlenecks, thermal throttling & GPU metrics",
      "Calculate infrastructure TCO & power consumption profiles"
    ],
    curriculum: [
      { title: "Module 1: NVIDIA GPU Architecture & CUDA Driver Tuning", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 2: High-Speed Networking (InfiniBand & RoCE)", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Slurm Workload Scheduler Configuration", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Kubernetes GPU Operator & KubeFlow", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 5: PyTorch DDP & DeepSpeed Distributed Training", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 6: Storage Systems for AI (Lustre & GPFS)", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: GPU Utilization Telemetry & Cost Management", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Capstone: 64-GPU Enterprise Cluster Deployment", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "synthetic-data-privacy",
    title: "Synthetic Data Generation & Data Privacy",
    tagline: "Generate anonymized tabular & text datasets with GANs, Diffusers & Differential Privacy.",
    category: "Governance & Safety",
    badge: "Essential",
    badgeColor: "#16A34A",
    priceUSD: 1149,
    priceAED: 4217,
    rating: 4.87,
    reviewsCount: 160,
    studentsCount: 390,
    duration: "4 Weeks",
    modulesCount: 6,
    level: "Intermediate",
    instructor: "Dr. Elena Rostova",
    instructorRole: "Data Privacy & Compliance Director",
    icon: "🔐",
    overview: "Master synthetic dataset generation to bypass GDPR & HIPAA privacy compliance barriers. Learn SDV (Synthetic Data Vault), Differential Privacy (DP-SGD), tabular GANs (CTGAN), and privacy leak vulnerability auditing.",
    whatYouWillLearn: [
      "Understand Differential Privacy mathematical foundations (Epsilon-Delta)",
      "Generate synthetic tabular data with CTGAN & TVAE models",
      "Anonymize sensitive text datasets with PII masking & entity replacement",
      "Evaluate statistical fidelity vs privacy leakage risk tradeoffs",
      "Audit membership inference & shadow model extraction attacks",
      "Comply with global GDPR, HIPAA & UAE data protection laws"
    ],
    curriculum: [
      { title: "Module 1: Differential Privacy Principles & Noise Injection", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 2: Tabular Data Generation (CTGAN & SDV)", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Text Synthetic Generation & LLM Dataset Curations", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 4: Fidelity & Correlation Benchmark Metrics", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 5: Membership Inference Attack Red-Teaming", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Capstone: Privacy-Preserving Synthetic Data Pipeline", duration: "2 Lessons · 3.5 hrs" }
    ]
  },
  {
    id: "rlhf-alignment-engineering",
    title: "RLHF & Preference Alignment Engineering",
    tagline: "Align LLMs using PPO, DPO, KTO & Reward Model training pipelines.",
    category: "ML & Deep Learning",
    badge: "Hot",
    badgeColor: "#DC2626",
    priceUSD: 1949,
    priceAED: 7153,
    rating: 4.98,
    reviewsCount: 155,
    studentsCount: 340,
    duration: "7 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "Marcus Lee",
    instructorRole: "Lead Alignment Scientist",
    icon: "🎯",
    overview: "Master advanced preference alignment algorithms for Large Language Models. Train Bradley-Terry reward models, execute Proximal Policy Optimization (PPO), Direct Preference Optimization (DPO), and Kahneman-Tversky Optimization (KTO).",
    whatYouWillLearn: [
      "Curate pairwise preference datasets (Human & AI Feedback - RLAIF)",
      "Train Bradley-Terry Reward Models & loss function tuning",
      "Implement PPO actor-critic loops with KL-divergence penalty caps",
      "Execute DPO (Direct Preference Optimization) without reward model overhead",
      "Align models with KTO (Kahneman-Tversky Optimization) binary signals",
      "Mitigate reward hacking and mode collapse in alignment pipelines"
    ],
    curriculum: [
      { title: "Module 1: Alignment Mathematics & Bradley-Terry Modeling", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 2: Human & AI Preference Dataset Curation (RLAIF)", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 3: Reward Model Architecture & Training", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Proximal Policy Optimization (PPO) Deep Dive", duration: "5 Lessons · 3.5 hrs" },
      { title: "Module 5: Direct Preference Optimization (DPO) Mechanics", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 6: Kahneman-Tversky Optimization (KTO)", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Reward Hacking Defense & Jailbreak Benchmarks", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Capstone: Aligning an Open LLM for Enterprise Safety", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "advanced-vector-caching",
    title: "Advanced Vector Search & Semantic Caching",
    tagline: "Optimize RAG latency & cloud costs with Redis, GPTCache & HNSW indexing.",
    category: "RAG & VectorDB",
    badge: "Popular",
    badgeColor: "#7A1F2B",
    priceUSD: 1349,
    priceAED: 4951,
    rating: 4.92,
    reviewsCount: 280,
    studentsCount: 670,
    duration: "5 Weeks",
    modulesCount: 7,
    level: "Intermediate to Advanced",
    instructor: "Sarah Chen",
    instructorRole: "Principal VectorDB Engineer",
    icon: "⚡",
    overview: "Reduce LLM API costs by up to 80% and latency to sub-50ms using semantic cache layers. Master Redis Vector Similarity Search (VSS), GPTCache, product quantization (PQ), and HNSW graph indexing.",
    whatYouWillLearn: [
      "Architect low-latency semantic caching with Redis & GPTCache",
      "Configure HNSW graph indexing parameters (M, efConstruction, efSearch)",
      "Implement Scalar & Product Quantization (IVF-PQ) for memory reduction",
      "Design dynamic distance thresholds & similarity match fallbacks",
      "Invalidate caches based on real-time data updates",
      "Benchmark throughput, memory footprints & cash savings"
    ],
    curriculum: [
      { title: "Module 1: Semantic Caching Principles & Cost Optimization", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Redis Vector Search & In-Memory Storage", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: HNSW & IVF-PQ Index Tuning", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Similarity Distance Metrics & Threshold Tuning", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 5: GPTCache Integration & Custom Eviction Policies", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Multi-Tenant Vector Partitioning & Invalidation", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Capstone: Ultra-Fast Enterprise RAG Cache Layer", duration: "2 Lessons · 4.0 hrs" }
    ]
  },
  {
    id: "ai-search-recommendations",
    title: "AI-Powered Search & Recommendation Engines",
    tagline: "Build neural search systems with Vespa, OpenSearch & two-tower models.",
    category: "RAG & VectorDB",
    badge: "Advanced",
    badgeColor: "#2563EB",
    priceUSD: 1429,
    priceAED: 5244,
    rating: 4.90,
    reviewsCount: 220,
    studentsCount: 510,
    duration: "6 Weeks",
    modulesCount: 8,
    level: "Intermediate to Advanced",
    instructor: "David Miller",
    instructorRole: "Search & Retrieval Architect",
    icon: "🔍",
    overview: "Master modern neural search and e-commerce recommendation systems. Build two-tower neural retrieval models, integrate Vespa.ai, configure OpenSearch KNN vector indexes, and implement learning-to-rank (LTR) algorithms.",
    whatYouWillLearn: [
      "Design Two-Tower Neural Retrieval architectures for candidate generation",
      "Configure Vespa.ai for high-throughput tensor ranking",
      "Build hybrid BM25 + Vector indexes in OpenSearch",
      "Train XGBoost Learning-to-Rank (LTR) re-ranking models",
      "Implement personalized e-commerce recommendation feeds",
      "Evaluate search relevance using NDCG@K, MRR & MAP metrics"
    ],
    curriculum: [
      { title: "Module 1: Modern Neural Search Fundamentals", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Two-Tower Neural Candidate Generation", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: OpenSearch Vector KNN & Hybrid Scoring", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 4: Vespa.ai Tensor Computation & Indexing", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 5: Learning-to-Rank (LTR) with XGBoost", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Real-Time Personalization & User Embeddings", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Search Relevance Evaluation (NDCG, MRR)", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Capstone: Enterprise E-Commerce Neural Search", duration: "2 Lessons · 4.5 hrs" }
    ]
  },
  {
    id: "prompt-optimization-evals",
    title: "Production Prompt Optimization & Automated Red-Teaming",
    tagline: "DSPy prompt compilation, automated Few-Shot generation & LLM-as-a-Judge evals.",
    category: "Prompt Engineering",
    badge: "Hot",
    badgeColor: "#DC2626",
    priceUSD: 1179,
    priceAED: 4327,
    rating: 4.93,
    reviewsCount: 270,
    studentsCount: 780,
    duration: "4 Weeks",
    modulesCount: 6,
    level: "Intermediate",
    instructor: "Alex Morgan",
    instructorRole: "Prompt Evaluation Lead",
    icon: "📐",
    overview: "Move beyond manual trial-and-error prompt tweaking. Learn DSPy (Declarative Self-improving Language Programs), automated prompt optimizers (BootstrapFewShot, MIPRO), and LLM-as-a-Judge evaluation pipelines.",
    whatYouWillLearn: [
      "Program prompts algorithmically using Stanford DSPy framework",
      "Compile prompts with MIPRO & BootstrapFewShot optimizers",
      "Build LLM-as-a-Judge evaluation matrices with G-Eval methodology",
      "Automate prompt injection & jailbreak red-teaming sweeps",
      "Track regression testing across model version upgrades",
      "Minimize token consumption while improving output accuracy"
    ],
    curriculum: [
      { title: "Module 1: DSPy Framework & Declarative Prompting", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 2: Automated Few-Shot Selection & Optimizers", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: LLM-as-a-Judge & G-Eval Scoring Metrics", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 4: Automated Vulnerability & Jailbreak Sweeps", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 5: Regression Testing & Continuous Integration", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 6: Capstone: Automated DSPy Production Pipeline", duration: "2 Lessons · 3.5 hrs" }
    ]
  },
  {
    id: "autonomous-code-agents",
    title: "Autonomous Code Generation & Software Agents",
    tagline: "Build AI coding assistants, automated bug fixers & secure sandboxes.",
    category: "Agentic AI",
    badge: "Advanced",
    badgeColor: "#2563EB",
    priceUSD: 1649,
    priceAED: 6052,
    rating: 4.97,
    reviewsCount: 340,
    studentsCount: 820,
    duration: "6 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "James Wilson",
    instructorRole: "AI Code Generation Systems Lead",
    icon: "💻",
    overview: "Build autonomous software engineering agents capable of parsing repositories, writing unit tests, debugging stack traces, and executing code inside secure Docker sandboxes.",
    whatYouWillLearn: [
      "Parse AST (Abstract Syntax Trees) & repository code graphs",
      "Integrate Tree-Sitter & RepoQA code indexing engines",
      "Execute generated code inside isolated gVisor / Docker sandboxes",
      "Implement iterative self-healing & test-driven repair loops",
      "Build automated Pull Request review & code refactoring agents",
      "Prevent code injection, arbitrary command execution & security leaks"
    ],
    curriculum: [
      { title: "Module 1: Code Parsing & AST Representation", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Repository-Wide Context Retrieval (RepoQA)", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Secure Sandbox Isolation (gVisor & Docker)", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Self-Healing & Test-Driven Iteration Loops", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 5: Automated Code Review & Refactoring Agents", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Command Execution & Shell Tooling Integration", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Benchmarking with SWE-bench Framework", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Capstone: Autonomous Full-Repository Developer Agent", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "conversational-voice-ai",
    title: "Conversational AI & Voice Agent Architecture",
    tagline: "Build ultra-low latency real-time voice agents with LiveKit, VAD & ElevenLabs.",
    category: "Agentic AI",
    badge: "Popular",
    badgeColor: "#7A1F2B",
    priceUSD: 1549,
    priceAED: 5685,
    rating: 4.94,
    reviewsCount: 290,
    studentsCount: 710,
    duration: "5 Weeks",
    modulesCount: 7,
    level: "Intermediate to Advanced",
    instructor: "Sophia Martinez",
    instructorRole: "Voice AI Engineer",
    icon: "🎙️",
    overview: "Build sub-800ms real-time conversational voice bots. Master WebRTC streaming via LiveKit, Voice Activity Detection (Silero VAD), Deepgram STT, OpenAI GPT-4o real-time API, and ElevenLabs TTS.",
    whatYouWillLearn: [
      "Stream full-duplex audio with WebRTC & LiveKit Agents framework",
      "Implement Silero Voice Activity Detection (VAD) for instant interruption",
      "Integrate Deepgram & Whisper streaming Speech-to-Text (STT)",
      "Configure OpenAI Realtime WebSockets API",
      "Stream natural Text-to-Speech (TTS) with ElevenLabs & Cartesia",
      "Handle call transfer, telephony PSTN integration & IVR logic"
    ],
    curriculum: [
      { title: "Module 1: Real-time Audio Streaming Mechanics (WebRTC)", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Silero VAD & Interruption Handling", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 3: High-Speed Streaming STT (Deepgram)", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 4: OpenAI Realtime WebSockets API Protocol", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 5: Ultra-Low Latency TTS (ElevenLabs / Cartesia)", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Telephony PSTN & Twilio Call Integration", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Capstone: Autonomous Customer Support Voice Agent", duration: "2 Lessons · 4.5 hrs" }
    ]
  },
  {
    id: "fintech-domain-llms",
    title: "Domain-Specific LLMs for Finance & FinTech",
    tagline: "Financial statement parsing, SEC 10-K RAG, and automated compliance auditing.",
    category: "ML & Deep Learning",
    badge: "Enterprise",
    badgeColor: "#059669",
    priceUSD: 1849,
    priceAED: 6786,
    rating: 4.96,
    reviewsCount: 205,
    studentsCount: 460,
    duration: "6 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "Dr. Aris Thorne",
    instructorRole: "FinTech AI Solutions Lead",
    icon: "📈",
    overview: "Tailor AI for banking, trading, and financial compliance. Learn numerical table parsing, financial ratio extractions, SEC 10-K / 10-Q filing analysis, fraud detection prompts, and FinGPT model fine-tuning.",
    whatYouWillLearn: [
      "Extract structured numerical data from complex PDF financial tables",
      "Fine-tune open LLMs on financial corpus (FinGPT / BloombergGPT methods)",
      "Build SEC 10-K & 10-Q filing Q&A RAG applications",
      "Implement real-time transaction fraud detection classifiers",
      "Ensure compliance with anti-money laundering (AML) & KYC laws",
      "Evaluate financial model accuracy & hallucination risks"
    ],
    curriculum: [
      { title: "Module 1: Financial Document Ingestion & Table Extraction", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 2: SEC Filing RAG Architectures (10-K & 10-Q)", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: FinGPT Fine-Tuning & Domain Vocabulary", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Fraud Detection & Anomaly Classification", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 5: Automated Credit Risk Assessment Prompts", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Anti-Money Laundering (AML) Compliance Audits", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Hallucination Prevention in Numerical Reasoning", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Capstone: Enterprise Investment Analyst Assistant", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "healthcare-clinical-ai",
    title: "Healthcare AI & Clinical LLM Safety",
    tagline: "Medical report summarization, HIPAA compliance & BioGPT fine-tuning.",
    category: "Governance & Safety",
    badge: "Specialized",
    badgeColor: "#C99A3D",
    priceUSD: 1779,
    priceAED: 6529,
    rating: 4.95,
    reviewsCount: 165,
    studentsCount: 370,
    duration: "6 Weeks",
    modulesCount: 7,
    level: "Advanced",
    instructor: "Dr. Elena Rostova",
    instructorRole: "Medical AI & Governance Director",
    icon: "🏥",
    overview: "Deploy safe AI systems in healthcare and clinical settings. Learn DICOM image integration, HIPAA-compliant PII/PHI redaction, EHR clinical note summarization, and Med-PaLM evaluation frameworks.",
    whatYouWillLearn: [
      "Redact Protected Health Information (PHI) under HIPAA standards",
      "Fine-tune medical models (BioGPT, MedLM) on clinical notes",
      "Summarize Electronic Health Records (EHR) safely",
      "Integrate medical image analysis with vision-language models",
      "Evaluate clinical diagnostic accuracy & safety guardrails",
      "Audit medical AI bias across patient demographic cohorts"
    ],
    curriculum: [
      { title: "Module 1: HIPAA PHI Privacy & De-Identification Protocols", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: EHR Clinical Note Ingestion & Parsing", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: BioGPT Fine-Tuning & Medical Terminology", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Medical Imaging (DICOM) & Vision Integration", duration: "3 Lessons · 2.5 hrs" },
      { title: "Module 5: Clinical Safety Guardrails & Fallback Triggers", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: FDA AI Medical Device Regulatory Compliance", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Capstone: Clinical Decision Support Assistant", duration: "2 Lessons · 4.5 hrs" }
    ]
  },
  {
    id: "edge-mobile-ai-inference",
    title: "Real-Time Edge AI & Mobile Inference",
    tagline: "Deploy ONNX, TensorRT, CoreML & llama.cpp models on iOS, Android & IoT.",
    category: "ML & Deep Learning",
    badge: "Essential",
    badgeColor: "#16A34A",
    priceUSD: 1299,
    priceAED: 4767,
    rating: 4.89,
    reviewsCount: 240,
    studentsCount: 590,
    duration: "5 Weeks",
    modulesCount: 7,
    level: "Intermediate to Advanced",
    instructor: "Vikram Rao",
    instructorRole: "Embedded AI & Edge Lead",
    icon: "📱",
    overview: "Run deep learning models directly on mobile devices and edge hardware without cloud latency. Master ONNX Runtime, Apple CoreML, Android NNAPI, TensorRT execution providers, and llama.cpp GGUF quantization.",
    whatYouWillLearn: [
      "Export PyTorch models to ONNX & CoreML formats",
      "Optimize model weights with TensorRT FP16/INT8 quantization",
      "Run local LLM inference on iOS & Android via llama.cpp",
      "Minimize battery drain, vRAM memory footprint & thermal throttling",
      "Build offline-first mobile applications with local vector search",
      "Deploy computer vision models on Raspberry Pi & NVIDIA Jetson"
    ],
    curriculum: [
      { title: "Module 1: Edge AI Principles & On-Device Constraints", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 2: PyTorch Model Export (ONNX & TorchScript)", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 3: Apple CoreML & iOS Neural Engine Integration", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 4: Android NNAPI & TensorFlow Lite Execution", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 5: Local LLMs on Mobile (llama.cpp & MLC-LLM)", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 6: NVIDIA Jetson & Embedded Edge Hardware", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Capstone: Offline Mobile AI Assistant App", duration: "2 Lessons · 4.0 hrs" }
    ]
  },
  {
    id: "graph-neural-networks-rag",
    title: "Graph Neural Networks & Knowledge Graph RAG",
    tagline: "Build GraphRAG platforms with Neo4j, PyTorch Geometric & NetworkX.",
    category: "RAG & VectorDB",
    badge: "Advanced",
    badgeColor: "#2563EB",
    priceUSD: 1679,
    priceAED: 6162,
    rating: 4.95,
    reviewsCount: 185,
    studentsCount: 430,
    duration: "6 Weeks",
    modulesCount: 8,
    level: "Advanced",
    instructor: "Dr. Aris Thorne",
    instructorRole: "Graph Data Scientist",
    icon: "🕸️",
    overview: "Combine Knowledge Graphs with Retrieval-Augmented Generation (GraphRAG). Learn Neo4j Cypher query construction, entity-relationship extractions, PyTorch Geometric GNNs, and Microsoft GraphRAG implementation.",
    whatYouWillLearn: [
      "Extract entities & relationships from unstructured text with LLMs",
      "Construct enterprise Knowledge Graphs in Neo4j database",
      "Query knowledge graphs using automated Cypher generation",
      "Train Graph Neural Networks (GCN, GAT) with PyTorch Geometric",
      "Implement Microsoft GraphRAG hierarchical community detection",
      "Combine vector search with graph traversal for hybrid retrieval"
    ],
    curriculum: [
      { title: "Module 1: Knowledge Graph Fundamentals & Property Graphs", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 2: Entity & Relationship Extraction with LLMs", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 3: Neo4j Cypher Query Construction & Indexing", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 4: Graph Convolutional Networks (GCN & GAT)", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 5: Microsoft GraphRAG & Community Detection", duration: "4 Lessons · 3.0 hrs" },
      { title: "Module 6: Hybrid Vector + Graph Retrieval Traversal", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 7: Graph Visualization & Topological Analytics", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 8: Capstone: Enterprise Knowledge Graph RAG Platform", duration: "2 Lessons · 5.0 hrs" }
    ]
  },
  {
    id: "ai-product-strategy",
    title: "AI Product Management & Strategy Engineering",
    tagline: "Product roadmapping, AI unit economics, latency/cost budgets & UX design.",
    category: "Prompt Engineering",
    badge: "Essential",
    badgeColor: "#16A34A",
    priceUSD: 1050,
    priceAED: 3854,
    rating: 4.86,
    reviewsCount: 390,
    studentsCount: 1540,
    duration: "4 Weeks",
    modulesCount: 6,
    level: "Beginner to Intermediate",
    instructor: "David Miller",
    instructorRole: "VP of AI Product Strategy",
    icon: "📊",
    overview: "Designed for product managers, engineering leads, and founders. Learn AI unit economics, token cost budgeting, latency SLAs, fallback user experience design, and vendor API vs open-source build vs buy evaluation.",
    whatYouWillLearn: [
      "Calculate AI unit economics, token margins & API cost projections",
      "Evaluate Build vs Buy (Open-Source vs Proprietary APIs)",
      "Design UX patterns for non-deterministic AI outputs & fallbacks",
      "Define SLAs for AI latency, throughput & hallucination rates",
      "Manage AI product roadmaps, sprint planning & risk matrices",
      "Communicate AI capabilities effectively to executive stakeholders"
    ],
    curriculum: [
      { title: "Module 1: AI Product Lifecycle & Strategy", duration: "3 Lessons · 1.5 hrs" },
      { title: "Module 2: Token Economics & Cost Modeling", duration: "4 Lessons · 2.0 hrs" },
      { title: "Module 3: Build vs Buy Decision Frameworks", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 4: Designing Non-Deterministic UX & Fallbacks", duration: "4 Lessons · 2.5 hrs" },
      { title: "Module 5: Defining AI Quality Metrics & SLAs", duration: "3 Lessons · 2.0 hrs" },
      { title: "Module 6: Capstone: AI Product Strategy & Pitch Deck", duration: "2 Lessons · 3.5 hrs" }
    ]
  }
];

const COMBO_OFFERS = [
  {
    id: "ai-architect-bundle",
    title: "Full-Stack AI Architect Master Bundle",
    tagline: "Complete end-to-end engineering from system prompts to autonomous multi-agent pipelines.",
    coursesIncluded: [
      "Prompt Engineering & System Directives",
      "Enterprise RAG & Vector Database Design",
      "Agentic AI & Multi-Agent Orchestration"
    ],
    originalPriceUSD: 4547,
    comboPriceUSD: 1999,
    comboPriceAED: 7336,
    savingsPercent: "SAVE 56%",
    badge: "BEST VALUE BUNDLE",
    badgeColor: "#C99A3D",
    icon: "🔥",
    features: [
      "Full access to 3 core AI tracks (30 modules)",
      "Dedicated 1-on-1 mentor code reviews",
      "Lifetime updates & course completion certificates"
    ]
  },
  {
    id: "governance-safety-suite",
    title: "Enterprise AI Safety & Governance Suite",
    tagline: "Risk mitigation, adversarial red-teaming, data privacy, and automated MLOps monitoring.",
    coursesIncluded: [
      "AI Safety, Governance & Enterprise Red-Teaming",
      "Synthetic Data Generation & Data Privacy",
      "Enterprise MLOps & Model Monitoring Pipelines"
    ],
    originalPriceUSD: 3697,
    comboPriceUSD: 1699,
    comboPriceAED: 6235,
    savingsPercent: "SAVE 54%",
    badge: "ENTERPRISE SUITE",
    badgeColor: "#059669",
    icon: "🛡️",
    features: [
      "Full access to 3 safety & compliance tracks (19 modules)",
      "UAE AI Ethics & EU AI Act compliance templates",
      "Enterprise multi-seat deployment options"
    ]
  },
  {
    id: "deep-learning-llm-pro",
    title: "Deep Learning & LLM Fine-Tuning Pro Bundle",
    tagline: "From PyTorch tensor math to 4-bit QLoRA fine-tuning and RLHF preference alignment.",
    coursesIncluded: [
      "Machine Learning & Deep Learning Foundations",
      "LLM Fine-Tuning, Quantization & vLLM Hosting",
      "RLHF & Preference Alignment Engineering"
    ],
    originalPriceUSD: 5047,
    comboPriceUSD: 1899,
    comboPriceAED: 6969,
    savingsPercent: "SAVE 62%",
    badge: "MOST POPULAR BUNDLE",
    badgeColor: "#7A1F2B",
    icon: "⚡",
    features: [
      "Full access to 3 deep learning & LLM tracks (26 modules)",
      "Unsloth, vLLM & DeepSpeed optimization code",
      "Lifetime access & priority instructor Q&A"
    ]
  },
  {
    id: "all-access-pass",
    title: "All-Access Enterprise Learning Pass",
    tagline: "Unlimited access to all 24 current & future practical AI engineering tracks.",
    coursesIncluded: [
      "All 24 Professional Courses Included",
      "Exclusive access to upcoming 2026 courses",
      "Direct 1-on-1 Mentorship & Code Review Access"
    ],
    originalPriceUSD: 36000,
    comboPriceUSD: 1999,
    comboPriceAED: 7336,
    savingsPercent: "SAVE 94%",
    badge: "ULTIMATE PASS",
    badgeColor: "#2563EB",
    icon: "🌟",
    features: [
      "Complete access to all 24 courses in catalog (180+ modules)",
      "Private Discord VIP channel & live Q&A",
      "Unlimited course completion certificates"
    ]
  },
  {
    id: "neural-search-graph-bundle",
    title: "Neural Search & Knowledge Graph Bundle",
    tagline: "Advanced semantic search, hybrid vector retrieval, and Neo4j Knowledge Graph RAG.",
    coursesIncluded: [
      "Advanced Vector Search & Semantic Caching",
      "AI-Powered Search & Recommendation Engines",
      "Graph Neural Networks & Knowledge Graph RAG"
    ],
    originalPriceUSD: 4457,
    comboPriceUSD: 1799,
    comboPriceAED: 6602,
    savingsPercent: "SAVE 60%",
    badge: "SEARCH MASTER BUNDLE",
    badgeColor: "#C99A3D",
    icon: "🕸️",
    features: [
      "Full access to 3 retrieval & search tracks (23 modules)",
      "HNSW indexing, Redis caching & Neo4j graph code",
      "Lifetime updates & course completion certificates"
    ]
  },
  {
    id: "edge-multimodal-suite",
    title: "Edge AI & Multimodal Vision Suite",
    tagline: "Deploy multimodal vision LLMs, real-time voice agents, and low-latency edge inference.",
    coursesIncluded: [
      "Multimodal LLMs & Vision-Language Architectures",
      "Conversational AI & Voice Agent Architecture",
      "Real-Time Edge AI & Mobile Inference"
    ],
    originalPriceUSD: 4547,
    comboPriceUSD: 1849,
    comboPriceAED: 6786,
    savingsPercent: "SAVE 59%",
    badge: "EDGE & VISION SUITE",
    badgeColor: "#16A34A",
    icon: "📱",
    features: [
      "Full access to 3 vision, voice & edge tracks (22 modules)",
      "WebRTC streaming, Silero VAD & CoreML/TensorRT code",
      "Lifetime access & priority instructor Q&A"
    ]
  }
];

const CATEGORIES = ["All", "Prompt Engineering", "RAG & VectorDB", "Agentic AI", "ML & Deep Learning", "Governance & Safety"];

export default function CoursesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  // Filter courses based on category and search query
  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRegisterCourse = (course) => {
    // Per requirement: Clicking register/enroll redirects the user to the login page
    navigate("/login", { state: { courseId: course.id, courseTitle: course.title } });
  };

  const handleRegisterCombo = (combo) => {
    navigate("/login", { state: { comboId: combo.id, comboTitle: combo.title } });
  };

  return (
    <div style={{ backgroundColor: "#FDF6EE", color: "#241417", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar brandName={BRAND_NAME} active="Courses" onCtaClick={() => setContactOpen(true)} />

      {/* HEADER HERO BANNER */}
      <section style={{ background: "linear-gradient(135deg, #241417 0%, #3D141C 60%, #7A1F2B 100%)", color: "#ffffff", padding: "70px 24px 50px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ maxWidth: "850px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(201, 154, 61, 0.18)", border: "1px solid rgba(201, 154, 61, 0.35)", borderRadius: "9999px", padding: "6px 18px", fontSize: "12.5px", fontWeight: 700, color: "#C99A3D", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Sparkles style={{ width: 15, height: 15 }} />
            PRACTICAL AI & SOFTWARE TRACKS
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Explore Professional Courses
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(253, 246, 238, 0.85)", margin: "0 0 12px 0", lineHeight: 1.6 }}>
            Master production-grade AI engineering, RAG pipelines, agentic orchestration, fine-tuning, and safety frameworks taught by industry experts.
          </p>
          <p style={{ fontSize: "14.5px", color: "#C99A3D", fontWeight: 600, margin: "0 0 28px 0" }}>
            ✨ Note: All of these courses can also be customized to meet your specific team or project requirements.
          </p>

          {/* SEARCH BAR */}
          <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
            <Search style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", width: 20, height: 20, color: "#9E8984" }} />
            <input
              type="text"
              placeholder="Search by course title, topic, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px 16px 52px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.2)",
                backgroundColor: "rgba(255,255,255,0.95)",
                color: "#241417",
                fontSize: "15px",
                fontWeight: 500,
                outline: "none",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                boxSizing: "border-box"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b5a56" }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* CUSTOMIZATION ANNOUNCEMENT BANNER */}
        <div style={{ backgroundColor: "#FAF2E8", border: "1px solid rgba(201, 154, 61, 0.4)", borderRadius: "16px", padding: "14px 24px", marginBottom: "36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", boxShadow: "0 4px 16px rgba(122, 31, 43, 0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14.5px", color: "#7A1F2B" }}>
            <Sparkles style={{ width: 18, height: 18, color: "#C99A3D", flexShrink: 0 }} />
            <span>Looking for tailored content? <strong>All courses listed here can also be customized</strong> based on your team's specific requirements.</span>
          </div>
          <button
            onClick={() => setContactOpen(true)}
            style={{ backgroundColor: "#7A1F2B", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "8px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Contact for Custom Course
          </button>
        </div>

        {/* SPECIAL COMBO OFFERS & BUNDLES SECTION */}
        <div style={{ marginBottom: "60px", marginTop: "10px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(201, 154, 61, 0.15)", border: "1px solid rgba(201, 154, 61, 0.4)", color: "#7A1F2B", borderRadius: "9999px", padding: "6px 20px", fontSize: "12.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
              <Zap style={{ width: 15, height: 15, color: "#C99A3D" }} />
              LIMITED TIME SAVINGS BUNDLES
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#7A1F2B", margin: "0 0 10px 0", letterSpacing: "-0.01em" }}>
              Special Combo Offers &amp; Master Bundles
            </h2>
            <p style={{ fontSize: "15.5px", color: "#6b5a56", margin: 0, maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
              Bundle multiple professional tracks together to save up to 62% off individual course fees with full lifetime access &amp; priority 1-on-1 mentorship.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px" }}>
            {COMBO_OFFERS.map((combo) => (
              <div
                key={combo.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "28px",
                  border: "1.5px solid rgba(201, 154, 61, 0.4)",
                  boxShadow: "0 10px 32px rgba(122, 31, 43, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 18px 45px rgba(122, 31, 43, 0.14)";
                  e.currentTarget.style.borderColor = "rgba(201, 154, 61, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 32px rgba(122, 31, 43, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(201, 154, 61, 0.4)";
                }}
              >
                {/* CARD TOP BADGE BAR */}
                <div style={{ padding: "24px 28px 18px", backgroundColor: "#FAF2E8", borderBottom: "1px solid rgba(122, 31, 43, 0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span style={{ backgroundColor: combo.badgeColor, color: "#ffffff", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", padding: "5px 14px", borderRadius: "9999px", letterSpacing: "0.06em", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                      {combo.badge}
                    </span>
                    <span style={{ background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)", color: "#ffffff", fontSize: "11.5px", fontWeight: 800, padding: "4px 12px", borderRadius: "9999px", boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)" }}>
                      {combo.savingsPercent}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ fontSize: "28px", lineHeight: 1 }}>{combo.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 6px 0", lineHeight: 1.25 }}>
                        {combo.title}
                      </h3>
                      <p style={{ fontSize: "13.5px", color: "#6b5a56", lineHeight: 1.45, margin: 0 }}>
                        {combo.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CARD MAIN BODY */}
                <div style={{ padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    {/* INCLUDED COURSES CONTAINER */}
                    <div style={{ backgroundColor: "rgba(122, 31, 43, 0.03)", borderRadius: "18px", padding: "16px 18px", marginBottom: "20px", border: "1px solid rgba(122, 31, 43, 0.08)" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#9E8984", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "10px" }}>
                        Tracks Included in Bundle:
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {combo.coursesIncluded.map((c, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#241417", fontWeight: 700, lineHeight: 1.4 }}>
                            <CheckCircle style={{ width: 15, height: 15, color: "#C99A3D", flexShrink: 0, marginTop: "1px" }} />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FEATURES BULLETS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                      {combo.features.map((feat, idx) => (
                        <div key={idx} style={{ fontSize: "12.5px", color: "#544346", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
                          <Sparkles style={{ width: 13, height: 13, color: "#7A1F2B", flexShrink: 0 }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRICING & ACTION BUTTON */}
                  <div style={{ borderTop: "1px solid rgba(122, 31, 43, 0.1)", paddingTop: "20px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E8984", textTransform: "uppercase", display: "block" }}>Bundle Fee</span>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          <span style={{ fontSize: "14px", color: "#9E8984", textDecoration: "line-through", fontWeight: 600 }}>
                            ${combo.originalPriceUSD.toLocaleString()}
                          </span>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 800, color: "#7A1F2B" }}>
                            ${combo.comboPriceUSD.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: "12.5px", color: "#6b5a56", fontWeight: 600, backgroundColor: "#FAF2E8", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(122,31,43,0.1)" }}>
                        ({combo.comboPriceAED.toLocaleString()} AED)
                      </span>
                    </div>

                    <button
                      onClick={() => handleRegisterCombo(combo)}
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #7A1F2B 0%, #4A101A 100%)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "14px",
                        padding: "14px 20px",
                        fontSize: "14.5px",
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: "0 6px 18px rgba(122, 31, 43, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(1.15)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(122, 31, 43, 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "none";
                        e.currentTarget.style.boxShadow = "0 6px 18px rgba(122, 31, 43, 0.25)";
                      }}
                    >
                      Claim Combo Offer <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CATEGORY FILTER TABS */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", overflowX: "auto", paddingBottom: "16px", marginBottom: "36px" }} className="scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: isActive ? "1px solid #7A1F2B" : "1px solid rgba(122, 31, 43, 0.15)",
                  backgroundColor: isActive ? "#7A1F2B" : "#ffffff",
                  color: isActive ? "#ffffff" : "#6b5a56",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 4px 14px rgba(122, 31, 43, 0.2)" : "0 2px 6px rgba(0,0,0,0.02)"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* RESULTS HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#7A1F2B", margin: 0 }}>
            Available Courses <span style={{ fontSize: "14px", fontWeight: 600, color: "#9E8984" }}>({filteredCourses.length})</span>
          </h2>
          <div style={{ fontSize: "13px", color: "#6b5a56", fontWeight: 600 }}>
            Showing {selectedCategory} track
          </div>
        </div>

        {/* COURSES GRID */}
        {filteredCourses.length === 0 ? (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "60px 20px", textAlign: "center", border: "1px solid rgba(122, 31, 43, 0.1)" }}>
            <BookOpen style={{ width: 48, height: 48, color: "#9E8984", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 8px 0" }}>No Courses Found</h3>
            <p style={{ fontSize: "14px", color: "#6b5a56", margin: "0 0 20px 0" }}>Try adjusting your search query or category filter.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              style={{ backgroundColor: "#7A1F2B", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "10px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px" }}>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  border: "1px solid rgba(122, 31, 43, 0.12)",
                  boxShadow: "0 6px 24px rgba(122, 31, 43, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(122, 31, 43, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(122, 31, 43, 0.05)";
                }}
              >
                {/* CARD TOP BANNER */}
                <div style={{ padding: "24px 28px 16px", backgroundColor: "#FAF2E8", borderBottom: "1px solid rgba(122, 31, 43, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "16px", backgroundColor: "#ffffff", border: "1px solid rgba(122, 31, 43, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    {course.icon}
                  </div>
                  <span style={{ backgroundColor: course.badgeColor, color: "#ffffff", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", padding: "4px 12px", borderRadius: "9999px", letterSpacing: "0.05em" }}>
                    {course.badge}
                  </span>
                </div>

                {/* CARD BODY */}
                <div style={{ padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#9E8984", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                      {course.category}
                    </div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 10px 0", lineHeight: 1.3 }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#6b5a56", lineHeight: 1.5, margin: "0 0 16px 0", minHeight: "42px" }}>
                      {course.tagline}
                    </p>

                    {/* METRICS ROW */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12.5px", color: "#6b5a56", paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid rgba(122, 31, 43, 0.08)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, color: "#C99A3D" }}>
                        <Star style={{ width: 14, height: 14, fill: "#C99A3D" }} />
                        <span>{course.rating}</span>
                        <span style={{ color: "#9E8984", fontWeight: 500 }}>({course.reviewsCount})</span>
                      </div>
                      <div>•</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock style={{ width: 14, height: 14, color: "#7A1F2B" }} />
                        <span>{course.duration}</span>
                      </div>
                      <div>•</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Layers style={{ width: 14, height: 14, color: "#7A1F2B" }} />
                        <span>{course.modulesCount} Modules</span>
                      </div>
                    </div>
                  </div>

                  {/* PRICE & ACTION BUTTONS */}
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "18px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E8984", textTransform: "uppercase", display: "block" }}>Course Fee</span>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, color: "#7A1F2B" }}>
                          ${course.priceUSD}
                        </span>
                        <span style={{ fontSize: "12px", color: "#9E8984", marginLeft: "6px" }}>({course.priceAED} AED)</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700, backgroundColor: "rgba(22, 163, 74, 0.1)", padding: "3px 10px", borderRadius: "8px" }}>
                        Full Access
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <button
                        onClick={() => setActiveCourseModal(course)}
                        style={{
                          backgroundColor: "#FAF2E8",
                          color: "#7A1F2B",
                          border: "1px solid rgba(122, 31, 43, 0.2)",
                          borderRadius: "12px",
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        Full Description
                      </button>
                      <button
                        onClick={() => handleRegisterCourse(course)}
                        style={{
                          backgroundColor: "#7A1F2B",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "12px",
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(122, 31, 43, 0.2)",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px"
                        }}
                      >
                        Add to Cart <ArrowRight style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL COURSE DESCRIPTION MODAL */}
      {activeCourseModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(36, 20, 23, 0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "28px", maxWidth: "750px", width: "100%", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(122, 31, 43, 0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", position: "relative" }}>
            
            {/* MODAL HEADER */}
            <div style={{ padding: "32px 32px 24px", backgroundColor: "#FAF2E8", borderBottom: "1px solid rgba(122, 31, 43, 0.12)", position: "relative" }}>
              <button
                onClick={() => setActiveCourseModal(null)}
                style={{ position: "absolute", right: "24px", top: "24px", backgroundColor: "#ffffff", border: "1px solid rgba(122,31,43,0.2)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#7A1F2B" }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(122, 31, 43, 0.1)", color: "#7A1F2B", borderRadius: "9999px", padding: "4px 14px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                {activeCourseModal.category}
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 10px 0" }}>
                {activeCourseModal.title}
              </h2>
              <p style={{ fontSize: "15px", color: "#6b5a56", margin: 0, lineHeight: 1.5 }}>
                {activeCourseModal.tagline}
              </p>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: "32px" }}>
              {/* COURSE OVERVIEW */}
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 10px 0" }}>
                  Course Overview &amp; Objectives
                </h4>
                <p style={{ fontSize: "14.5px", lineHeight: 1.7, color: "#3D2B2E", margin: 0 }}>
                  {activeCourseModal.overview}
                </p>
              </div>

              {/* INSTRUCTOR & DURATION INFO */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", backgroundColor: "#FAF2E8", padding: "20px", borderRadius: "18px", border: "1px solid rgba(122,31,43,0.1)", marginBottom: "28px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E8984", textTransform: "uppercase" }}>Instructor</span>
                  <div style={{ fontSize: "14.5px", fontWeight: 800, color: "#7A1F2B" }}>{activeCourseModal.instructor}</div>
                  <div style={{ fontSize: "12px", color: "#6b5a56" }}>{activeCourseModal.instructorRole}</div>
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E8984", textTransform: "uppercase" }}>Duration &amp; Level</span>
                  <div style={{ fontSize: "14.5px", fontWeight: 800, color: "#7A1F2B" }}>{activeCourseModal.duration} ({activeCourseModal.modulesCount} Modules)</div>
                  <div style={{ fontSize: "12px", color: "#6b5a56" }}>{activeCourseModal.level}</div>
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E8984", textTransform: "uppercase" }}>Course Fee</span>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#7A1F2B" }}>${activeCourseModal.priceUSD} <span style={{ fontSize: "12px", color: "#6b5a56" }}>({activeCourseModal.priceAED} AED)</span></div>
                </div>
              </div>

              {/* WHAT YOU WILL LEARN */}
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 14px 0" }}>
                  What You Will Master
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
                  {activeCourseModal.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "#3D2B2E", lineHeight: 1.5 }}>
                      <CheckCircle style={{ width: 16, height: 16, color: "#C99A3D", flexShrink: 0, marginTop: "2px" }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CURRICULUM SYLLABUS */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 14px 0" }}>
                  Curriculum Syllabus ({activeCourseModal.curriculum.length} Modules)
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {activeCourseModal.curriculum.map((mod, idx) => (
                    <div key={idx} style={{ padding: "14px 18px", backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid rgba(122, 31, 43, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                      <span style={{ fontWeight: 700, color: "#241417" }}>{mod.title}</span>
                      <span style={{ fontSize: "12px", color: "#9E8984", fontWeight: 600 }}>{mod.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER REGISTER ACTION */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(122,31,43,0.12)", paddingTop: "20px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#9E8984" }}>Ready to enroll?</span>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#7A1F2B" }}>
                    ${activeCourseModal.priceUSD} USD
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveCourseModal(null);
                    handleRegisterCourse(activeCourseModal);
                  }}
                  style={{
                    backgroundColor: "#7A1F2B",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "12px 32px",
                    fontSize: "15px",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(122, 31, 43, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  Add to Cart <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="ld-footer" style={{ padding: "60px 24px 30px", backgroundColor: "#ffffff", borderTop: "1px solid rgba(122, 31, 43, 0.12)" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "24px", fontSize: "13px", color: "#6b5a56" }}>
          <div>
            <strong style={{ color: "#7A1F2B" }}>Coursera Education</strong> © {new Date().getFullYear()}. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/courses" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>Courses</Link>
            <Link to="/refund-policy" style={{ color: "#6b5a56", textDecoration: "none" }}>Return &amp; Refund Policy</Link>
            <Link to="/pricing" style={{ color: "#6b5a56", textDecoration: "none" }}>Pricing</Link>
            <Link to="/login" style={{ color: "#6b5a56", textDecoration: "none" }}>Login</Link>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
