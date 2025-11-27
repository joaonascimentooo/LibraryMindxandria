'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface PDFViewerProps {
  url: string;
}

function PDFViewerComponent({ url }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);

  // Load PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const pdfjsLib = await import('pdfjs-dist');
        
        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
          ).toString();
        }
        
        const loadingTask = pdfjsLib.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Não foi possível carregar o PDF. Verifique se o arquivo existe.');
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [url]);

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      try {
        const page = await pdf.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        setError('Erro ao renderizar a página.');
      }
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8b6f47] border-t-[#c9a961] mb-4"></div>
          <p className="text-[#c9a961] text-lg">Carregando PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3 p-3 bg-[#1a120a] border-b border-[#8b6f47]">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="bg-[#8b6f47] text-[#e8dcc8] px-4 py-2 rounded hover:bg-[#c9a961] hover:text-[#1a1108] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Página anterior"
          >
            ←
          </button>
          <span className="text-[#c9a961] font-semibold min-w-[100px] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="bg-[#8b6f47] text-[#e8dcc8] px-4 py-2 rounded hover:bg-[#c9a961] hover:text-[#1a1108] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Próxima página"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="bg-[#8b6f47] text-[#e8dcc8] px-3 py-2 rounded hover:bg-[#c9a961] hover:text-[#1a1108] transition-all"
            title="Reduzir"
          >
            −
          </button>
          <span className="text-[#c9a961] text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="bg-[#8b6f47] text-[#e8dcc8] px-3 py-2 rounded hover:bg-[#c9a961] hover:text-[#1a1108] transition-all"
            title="Ampliar"
          >
            +
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-[#2a2018] p-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="shadow-2xl"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PDFViewerComponent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#2a1515] flex items-center justify-center">
      <div className="text-[#c9a961] text-xl">Carregando visualizador...</div>
    </div>
  ),
});
