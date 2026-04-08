import React from 'react';
import { Paper } from '../types';

interface SummaryViewProps {
  paper: Paper;
}

export function SummaryView({ paper }: SummaryViewProps) {
  // Mock content for different sections
  const sections = [
    {
      title: 'Background',
      content: 'Medical imaging protocols often require the synthesis of missing modalities to improve diagnostic quality and protocol diversity. Traditional methods, particularly those using generative adversarial networks, have been successfully applied to this task, but they tend to suffer from training instabilities and are typically unable to capture the full fidelity and implicit modeling of the target image distribution. The study introduces adversarial diffusion modeling as an alternative approach to address these challenges.'
    },
    {
      title: 'Task',
      content: 'The primary objective of the research is to develop a novel adversarial diffusion model, named SynDiff to improve the performance of unsupervised medical image translation. Specifically, the task involves efficiently synthesizing high-fidelity target images from source images, which is critical when paired training data is not available.'
    },
    {
      title: 'Theory',
      content: 'The paper builds on recent advances in both GAN-based and diffusion-based image synthesis. GANs offer a one-shot mapping between modalities but can be limited due to issues like mode collapse and training instabilities. On the other hand, diffusion models provide more stable training and better likelihood estimation, but are typically computationally expensive. The proposed SynDiff model incorporates adversarial components into the diffusion framework, leveraging conditional diffusion processes, adversarial projectors, and cycle-consistency to combine the strengths of both approaches while mitigating their weaknesses.'
    },
    {
      title: 'Methods',
      content: 'SynDiff is constructed with two interconnected modules: a diffusive module and a non-diffusive module. The diffusive module employs a source-conditional adversarial projector to enable fast reverse diffusion over large steps, thereby accelerating the synthesis process. The non-diffusive module employs initial source-image estimator, which are used to guide the synthesis toward realistic target images during inference. The model utilizes self-ensembling mechanisms and includes comprehensive evaluation on three medical imaging datasets.'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-6">
        {/* AI Generated Summary Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-900">AI Generated Summary</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Generated summary ready</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="p-1.5 hover:bg-blue-100 rounded transition-colors">
              <svg className="w-4 h-4 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/>
              </svg>
            </button>
            <button className="p-1.5 hover:bg-blue-100 rounded transition-colors">
              <svg className="w-4 h-4 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Paper Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-sm text-gray-800 leading-relaxed">{section.content}</p>
            </div>
          ))}

          {/* More content sections */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Experiments</h2>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">
              The model was evaluated on three benchmark medical imaging datasets: IXI, BraTS, and Duke MRI-CT. 
              Performance metrics included structural similarity index (SSIM), peak signal-to-noise ratio (PSNR), 
              and Fréchet Inception Distance (FID). Results demonstrate that SynDiff outperforms existing state-of-the-art 
              methods across all datasets while requiring significantly fewer diffusion steps during inference.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Results</h2>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">
              Quantitative analysis shows that SynDiff achieves superior image quality metrics compared to baseline methods. 
              The model demonstrates particularly strong performance in preserving anatomical structures while generating 
              realistic texture details. Ablation studies confirm the importance of each component in the proposed framework.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Conclusion</h2>
            <p className="text-sm text-gray-800 leading-relaxed">
              This work introduces SynDiff, a novel adversarial diffusion model for unsupervised medical image translation. 
              By combining the strengths of both adversarial and diffusion-based approaches, the method achieves 
              state-of-the-art performance while maintaining computational efficiency. Future work will explore 
              extensions to multi-modal synthesis and clinical deployment scenarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
