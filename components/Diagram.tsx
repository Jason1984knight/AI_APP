
import React, { useEffect, useRef } from 'react';
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, Maximize, MousePointer2 } from 'lucide-react';

interface Props {
  onNodeClick: (id: string, label: string) => void;
}

const Diagram: React.FC<Props> = ({ onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mermaidDefinition = `
    graph TD
        %% Style Definitions
        classDef rootFill fill:#f8fafc,stroke:#1e293b,stroke-width:4px,color:#0f172a,font-weight:bold
        classDef mlFill fill:#e0e7ff,stroke:#4338ca,stroke-width:2px,color:#312e81
        classDef dlFill fill:#ddd6fe,stroke:#7c3aed,stroke-width:2px,color:#4c1d95
        classDef nlpFill fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#701a75
        classDef llmFill fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#881337
        classDef appFill fill:#ecfdf5,stroke:#059669,stroke-width:2px,stroke-dasharray: 5 5,color:#064e3b
        classDef toolFill fill:#fffbeb,stroke:#d97706,stroke-width:1px,color:#78350f
        classDef frameFill fill:#f1f5f9,stroke:#64748b,stroke-width:1px,color:#0f172a

        subgraph AI_ECOSYSTEM ["Artificial Intelligence Ecosystem"]
            direction TB
            
            subgraph FOUNDATIONS ["1. Research & Foundational Science"]
                direction TB
                
                subgraph ML ["Machine Learning (ML)"]
                    direction TB
                    subgraph ML_Classification ["Classification"]
                        direction LR
                        NB[Naive Bayes]:::toolFill
                        AdaB[AdaBoost]:::toolFill
                        CatB[CatBoost]:::toolFill
                        ET[Extra Trees]:::toolFill
                        SVM[SVM]:::toolFill
                    end
                    subgraph ML_Regression ["Regression"]
                        direction LR
                        Ridge[Ridge/Lasso]:::toolFill
                        ENet[ElasticNet]:::toolFill
                        SVR[SVR]:::toolFill
                        Huber[Huber Reg]:::toolFill
                        Poly[Polynomial Reg]:::toolFill
                    end
                    subgraph ML_Clustering ["Clustering"]
                        direction LR
                        Agg[Agglomerative]:::toolFill
                        MS[Mean Shift]:::toolFill
                        OPT[OPTICS]:::toolFill
                        Spec[Spectral]:::toolFill
                        Aff[Affinity Prop]:::toolFill
                    end
                    subgraph ML_DimRed ["Dimensionality Reduction"]
                        direction LR
                        Iso[Isomap]:::toolFill
                        LLE[LLE]:::toolFill
                        MDS[MDS]:::toolFill
                        KPCA[Kernel PCA]:::toolFill
                        FA[Factor Analysis]:::toolFill
                    end
                end

                subgraph DL ["Deep Learning (DL)"]
                    direction TB
                    subgraph Frameworks ["Frameworks & Infrastructure"]
                        direction LR
                        PyTorch[PyTorch]:::frameFill
                        TensorFlow[TensorFlow]:::frameFill
                    end

                    subgraph DL_Arch ["Architectures"]
                        direction LR
                        CNN[CNNs]:::toolFill
                        RNN[RNNs]:::toolFill
                        GAN[GANs]:::toolFill
                    end

                    subgraph NLP ["NLP & Generative Models"]
                        direction TB
                        subgraph NLP_Models ["Encoder/Embeddings"]
                            direction LR
                            BERT[BERT]:::toolFill
                            RoBERTa[RoBERTa]:::toolFill
                            T5[T5]:::toolFill
                        end
                        subgraph LLM ["Large Language Models"]
                            Transformer[Transformers & Attention]:::llmFill
                        end
                    end
                end
            end

            subgraph SYSTEMS ["2. Implementation & Intelligence Systems"]
                direction TB
                
                subgraph DataStack ["Vector Memory"]
                    direction LR
                    Pinecone[Pinecone]:::toolFill
                    Milvus[Milvus]:::toolFill
                    Weaviate[Weaviate]:::toolFill
                    Chroma[ChromaDB]:::toolFill
                    Qdrant[Qdrant]:::toolFill
                end

                subgraph DevTools ["Developer Experience (DX)"]
                    direction TB
                    subgraph AI_IDEs ["Next-Gen IDEs"]
                        direction LR
                        Cursor[Cursor IDE]:::toolFill
                        Windsurf[Windsurf]:::toolFill
                        ZedAI[Zed AI]:::toolFill
                    end
                    subgraph Local_Tools ["Local Runtimes"]
                        direction LR
                        Ollama[Ollama]:::toolFill
                        LMStudio[LM Studio]:::toolFill
                        LocalAI[LocalAI]:::toolFill
                    end
                    subgraph Coding_Assts ["Coding Assistants"]
                        direction LR
                        Copilot[GitHub Copilot]:::toolFill
                        AmazonQ[Amazon Q]:::toolFill
                        Vibe[Vibe Coding]:::appFill
                    end
                end
                
                subgraph Agents ["Orchestration & Autonomous Agents"]
                    direction TB
                    subgraph Agent_Frameworks ["Core Frameworks"]
                        direction LR
                        LangChain[LangChain]:::toolFill
                        LlamaIndex[LlamaIndex]:::toolFill
                        Haystack[Haystack]:::toolFill
                        SemKern[Semantic Kernel]:::toolFill
                    end
                    subgraph Agent_Orchestrators ["Multi-Agent Systems"]
                        direction LR
                        CrewAI[CrewAI]:::toolFill
                        AutoGen[Microsoft AutoGen]:::toolFill
                        BabyAGI[BabyAGI]:::toolFill
                    end
                    subgraph Agent_NoCode ["Visual Workflows"]
                        direction LR
                        n8n[n8n]:::toolFill
                        Flowise[Flowise]:::toolFill
                        LangFlow[LangFlow]:::toolFill
                    end
                    subgraph Agent_RealWorld ["Apps & Agents"]
                        direction LR
                        Manus[Manus AI]:::llmFill
                        Devin[Devin AI]:::llmFill
                        Opal[Google Opal]:::llmFill
                        SearchAgent[Perplexity/Search]:::appFill
                        Agent[Autonomous Agents]:::appFill
                        Flow[Agentic Workflows]:::appFill
                    end
                end

                subgraph Platform ["Ops & Delivery"]
                    direction LR
                    LangSmith[LangSmith]:::toolFill
                    GAI[Google AI Studio]:::toolFill
                    HF[Hugging Face]:::toolFill
                    Genkit[Firebase Genkit]:::toolFill
                    Bento[BentoML]:::toolFill
                    Weights[Weights & Biases]:::toolFill
                end
            end
        end

        %% Strategic Connections
        Frameworks --> |Powers| DL_Arch
        Transformer --> |Enables| Agent
        Transformer --> |Foundation for| Vibe
        Cursor -.-> |Enables| Vibe
        LangChain -.-> |Constructs| Agent
        Manus -.-> |State-of-the-Art| Agent
        Opal -.-> |State-of-the-Art| Agent
        n8n -.-> |Automates| Flow
        n8n -.-> |Orchestrates| Opal
        GAI --> |Deploy| Transformer
        GAI -.-> |Powers| Opal
        Pinecone -.-> |Memory for| Agent

        ML_Classification ~~~ DL
        FOUNDATIONS ~~~ SYSTEMS
        
        %% Apply Styles
        class AI_ECOSYSTEM rootFill
        class ML,ML_Classification,ML_Regression,ML_Clustering,ML_DimRed mlFill
        class DL,DL_Arch dlFill; class NLP,NLP_Models nlpFill; class LLM llmFill
        class DataStack,DevTools,AI_IDEs,Local_Tools,Coding_Assts,Agents,Agent_Frameworks,Agent_Orchestrators,Agent_NoCode,Agent_RealWorld,Platform appFill; class Frameworks frameFill
  `;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        padding: 50,
      },
    });

    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          // Clear previous
          containerRef.current.innerHTML = '';
          const { svg } = await mermaid.render('mermaid-svg', mermaidDefinition);
          containerRef.current.innerHTML = svg;

          // Re-attach listeners to new SVG nodes
          const nodes = containerRef.current.querySelectorAll('.node');
          nodes.forEach((node) => {
            node.addEventListener('click', (e) => {
              e.stopPropagation();
              const label = node.querySelector('.nodeLabel')?.textContent || node.id;
              onNodeClick(node.id, label);
            });
          });
        } catch (err) {
          console.error("Mermaid Render Error:", err);
        }
      }
    };

    renderDiagram();
  }, [onNodeClick, mermaidDefinition]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-white border border-slate-200 overflow-hidden rounded-xl shadow-inner group">
      <TransformWrapper
        initialScale={0.6}
        minScale={0.1}
        maxScale={3}
        centerOnInit={true}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur border border-slate-200 rounded-full shadow-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <MousePointer2 size={12} />
                Hold Space or Drag to Pan
              </div>
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
              <button 
                onClick={() => zoomIn()}
                className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur border border-slate-200 rounded-lg shadow-lg hover:bg-white text-slate-600 transition-all hover:scale-110 active:scale-95"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <button 
                onClick={() => zoomOut()}
                className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur border border-slate-200 rounded-lg shadow-lg hover:bg-white text-slate-600 transition-all hover:scale-110 active:scale-95"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <button 
                onClick={() => resetTransform()}
                className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur border border-slate-200 rounded-lg shadow-lg hover:bg-white text-slate-600 transition-all hover:scale-110 active:scale-95"
                title="Reset View"
              >
                <Maximize size={20} />
              </button>
            </div>

            <TransformComponent wrapperClass="!w-full !h-full cursor-grab active:cursor-grabbing">
              <div 
                ref={containerRef} 
                className="mermaid flex justify-center items-center min-w-max min-h-max p-20"
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Diagram;
