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
    priceUSD: 249,
    priceAED: 915,
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
    priceUSD: 399,
    priceAED: 1465,
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
    priceUSD: 499,
    priceAED: 1830,
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
    priceUSD: 349,
    priceAED: 1280,
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
    priceUSD: 599,
    priceAED: 2199,
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
    priceUSD: 299,
    priceAED: 1098,
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
          <p style={{ fontSize: "16px", color: "rgba(253, 246, 238, 0.85)", margin: "0 0 28px 0", lineHeight: 1.6 }}>
            Master production-grade AI engineering, RAG pipelines, agentic orchestration, fine-tuning, and safety frameworks taught by industry experts.
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
                        Register Now <ArrowRight style={{ width: 14, height: 14 }} />
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
                  Register Now <ArrowRight style={{ width: 16, height: 16 }} />
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
