"use client";

import { useState } from "react";
import { createBook, uploadBookCover, uploadBookPdf, type BookRequestDTO } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { ALL_GENRES, type GenreType } from "@/lib/genres";
import ScrollReveal from "@/components/ScrollReveal";
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from "lucide-react";

type BookMetadata = {
  fileName: string;
  coverFileName: string;
  title: string;
  author: string;
  shortDescription: string;
  longDescription: string;
  genres: string;
};

type UploadStatus = {
  fileName: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
  progress?: number;
};

export default function BulkUploadPage() {
  const { isAuthenticated, isLoading } = useAuth();

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<BookMetadata[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplate = () => {
    const template = `nome_arquivo,nome_capa,titulo,autor,descricao_curta,descricao_longa,generos
exemplo.pdf,exemplo.jpg,Meu Livro,João Silva,Uma breve descrição,Uma descrição mais longa do livro,FICCAO_CIENTIFICA;FANTASIA
outro_livro.pdf,outro.png,Outro Título,Maria Santos,Descrição curta aqui,Descrição longa aqui,ROMANCE;DRAMA`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_livros.csv';
    link.click();
  };

  const handleCsvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV');
      return;
    }

    setCsvFile(file);
    setError(null);

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      setError('CSV vazio ou inválido');
      return;
    }

    const dataLines = lines.slice(1);
    const parsedData: BookMetadata[] = [];

    for (const line of dataLines) {
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!matches || matches.length < 7) continue;

      const [fileName, coverFileName, title, author, shortDesc, longDesc, genres] = matches.map(m => 
        m.replace(/^"|"$/g, '').trim()
      );

      parsedData.push({
        fileName,
        coverFileName,
        title,
        author,
        shortDescription: shortDesc,
        longDescription: longDesc,
        genres,
      });
    }

    setMetadata(parsedData);
    setUploadStatuses(parsedData.map(m => ({ 
      fileName: m.fileName, 
      status: 'pending' 
    })));
  };

  const handlePdfFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 100 * 1024 * 1024;
    
    const tooLargeFiles = files.filter(f => f.size > maxSize);
    if (tooLargeFiles.length > 0) {
      setError(`Os seguintes PDFs excedem 100MB: ${tooLargeFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    const validFiles = files.filter(f => f.type === 'application/pdf');
    
    if (validFiles.length !== files.length) {
      setError('Apenas arquivos PDF são permitidos');
      return;
    }

    setPdfFiles(validFiles);
    setError(null);
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Apenas arquivos de imagem são permitidos');
    }

    setImageFiles(validFiles);
    setError(null);
  };

  const processUpload = async () => {
    if (!csvFile || pdfFiles.length === 0) {
      setError('Selecione o CSV e os arquivos PDF');
      return;
    }

    setIsProcessing(true);
    setError(null);

    for (let i = 0; i < metadata.length; i++) {
      const meta = metadata[i];
      const pdfFile = pdfFiles.find(f => f.name === meta.fileName);

      if (!pdfFile) {
        setUploadStatuses(prev => prev.map(s => 
          s.fileName === meta.fileName 
            ? { ...s, status: 'error', message: 'PDF não encontrado' }
            : s
        ));
        continue;
      }

      try {
        setUploadStatuses(prev => prev.map(s => 
          s.fileName === meta.fileName 
            ? { ...s, status: 'uploading', progress: 0 }
            : s
        ));

        const genreTypes = meta.genres
          .split(';')
          .map(g => g.trim())
          .filter(g => ALL_GENRES.includes(g as GenreType)) as GenreType[];

        const bookData: BookRequestDTO = {
          name: meta.title,
          author: meta.author,
          shortDescription: meta.shortDescription,
          longDescription: meta.longDescription,
          genreType: genreTypes,
        };

        const createdBook = await createBook(bookData);

        if (createdBook.id) {
          const coverFile = imageFiles.find(f => f.name === meta.coverFileName);
          if (coverFile) {
            await uploadBookCover(createdBook.id, coverFile);
          }
          
          await uploadBookPdf(createdBook.id, pdfFile);
        }

        setUploadStatuses(prev => prev.map(s => 
          s.fileName === meta.fileName 
            ? { ...s, status: 'success', message: 'Upload concluído' }
            : s
        ));

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao fazer upload';
        setUploadStatuses(prev => prev.map(s => 
          s.fileName === meta.fileName 
            ? { ...s, status: 'error', message }
            : s
        ));
      }
    }

    setIsProcessing(false);
  };

  const resetForm = () => {
    setCsvFile(null);
    setPdfFiles([]);
    setImageFiles([]);
    setMetadata([]);
    setUploadStatuses([]);
    setError(null);
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#2a1515] text-[#f4e8d0]">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-xl">
            <h1 className="text-3xl font-bold text-[#c9a961] mb-4 text-center">Upload em Lote</h1>
            <div className="bg-[#3d1f1f] border border-[#5a3030] text-[#f4e8d0] p-6 rounded-lg text-center">
              Você precisa estar logado para fazer upload.
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2a1515] text-[#f4e8d0] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#c9a961] mb-4">Upload em Lote</h1>
            <p className="text-[#f4e8d0] mb-6">
              Faça upload de múltiplos livros usando um arquivo CSV com os metadados
            </p>
            
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 bg-[#4a2525] text-[#c9a961] px-6 py-3 rounded-lg hover:bg-[#5a3030] transition-all"
            >
              <Download size={20} />
              Baixar Template CSV
            </button>
          </div>
        </ScrollReveal>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Upload CSV */}
          <ScrollReveal delay={0.1}>
            <div className="bg-[#3d1f1f] border border-[#5a3030] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#c9a961] mb-4 flex items-center gap-2">
                <FileText size={24} />
                1. Arquivo CSV
              </h2>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvChange}
                className="hidden"
                id="csv-upload"
                disabled={isProcessing}
              />
              
              <label
                htmlFor="csv-upload"
                className={`block w-full border-2 border-dashed border-[#5a3030] rounded-lg p-8 text-center cursor-pointer hover:border-[#c9a961] transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {csvFile ? (
                  <div>
                    <FileText className="mx-auto mb-2 text-[#c9a961]" size={32} />
                    <p className="text-[#c9a961] font-semibold">{csvFile.name}</p>
                    <p className="text-sm text-[#f4e8d0] mt-2">{metadata.length} livros encontrados</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto mb-2 text-[#5a3030]" size={32} />
                    <p className="text-[#f4e8d0]">Clique para selecionar o CSV</p>
                  </div>
                )}
              </label>
            </div>
          </ScrollReveal>

          {/* Upload PDFs */}
          <ScrollReveal delay={0.2}>
            <div className="bg-[#3d1f1f] border border-[#5a3030] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#c9a961] mb-4 flex items-center gap-2">
                <Upload size={24} />
                2. Arquivos PDF
              </h2>
              
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handlePdfFilesChange}
                className="hidden"
                id="pdf-upload"
                disabled={isProcessing}
              />
              
              <label
                htmlFor="pdf-upload"
                className={`block w-full border-2 border-dashed border-[#5a3030] rounded-lg p-8 text-center cursor-pointer hover:border-[#c9a961] transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {pdfFiles.length > 0 ? (
                  <div>
                    <FileText className="mx-auto mb-2 text-[#c9a961]" size={32} />
                    <p className="text-[#c9a961] font-semibold">{pdfFiles.length} arquivos selecionados</p>
                    <p className="text-sm text-[#f4e8d0] mt-2">
                      {pdfFiles.map(f => f.name).join(', ')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto mb-2 text-[#5a3030]" size={32} />
                    <p className="text-[#f4e8d0]">Clique para selecionar os PDFs</p>
                  </div>
                )}
              </label>
            </div>
          </ScrollReveal>

          {/* Upload Imagens */}
          <ScrollReveal delay={0.25}>
            <div className="bg-[#3d1f1f] border border-[#5a3030] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#c9a961] mb-4 flex items-center gap-2">
                <Upload size={24} />
                3. Imagens de Capa (opcional)
              </h2>
              
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFilesChange}
                className="hidden"
                id="image-upload"
                disabled={isProcessing}
              />
              
              <label
                htmlFor="image-upload"
                className={`block w-full border-2 border-dashed border-[#5a3030] rounded-lg p-8 text-center cursor-pointer hover:border-[#c9a961] transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {imageFiles.length > 0 ? (
                  <div>
                    <FileText className="mx-auto mb-2 text-[#c9a961]" size={32} />
                    <p className="text-[#c9a961] font-semibold">{imageFiles.length} imagens selecionadas</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto mb-2 text-[#5a3030]" size={32} />
                    <p className="text-[#f4e8d0]">Clique para selecionar imagens</p>
                  </div>
                )}
              </label>
            </div>
          </ScrollReveal>
        </div>

        {/* Status dos uploads */}
        {uploadStatuses.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="bg-[#3d1f1f] border border-[#5a3030] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#c9a961] mb-4">Status dos Uploads</h2>
              
              <div className="space-y-3">
                {uploadStatuses.map((status, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-[#4a2525] p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {status.status === 'pending' && <FileText size={20} className="text-[#5a3030]" />}
                      {status.status === 'uploading' && <Upload size={20} className="text-[#c9a961] animate-pulse" />}
                      {status.status === 'success' && <CheckCircle size={20} className="text-green-500" />}
                      {status.status === 'error' && <AlertCircle size={20} className="text-red-500" />}
                      
                      <div className="flex-1">
                        <p className="text-[#f4e8d0] font-medium">{status.fileName}</p>
                        {status.message && (
                          <p className={`text-sm ${status.status === 'error' ? 'text-red-400' : 'text-[#c9a961]'}`}>
                            {status.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <span className={`text-sm font-semibold ${
                      status.status === 'success' ? 'text-green-500' :
                      status.status === 'error' ? 'text-red-500' :
                      status.status === 'uploading' ? 'text-[#c9a961]' :
                      'text-[#5a3030]'
                    }`}>
                      {status.status === 'pending' && 'Aguardando'}
                      {status.status === 'uploading' && 'Enviando...'}
                      {status.status === 'success' && 'Concluído'}
                      {status.status === 'error' && 'Erro'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Botões de ação */}
        <ScrollReveal delay={0.4}>
          <div className="flex justify-center gap-4">
            <button
              onClick={processUpload}
              disabled={!csvFile || pdfFiles.length === 0 || isProcessing}
              className="bg-[#c9a961] text-[#3d1f1f] px-8 py-3 rounded-lg font-semibold hover:bg-[#d4b574] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Upload size={20} />
              {isProcessing ? 'Processando...' : 'Iniciar Upload'}
            </button>
            
            <button
              onClick={resetForm}
              disabled={isProcessing}
              className="bg-[#4a2525] text-[#f4e8d0] px-8 py-3 rounded-lg font-semibold hover:bg-[#5a3030] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X size={20} />
              Limpar
            </button>
          </div>
        </ScrollReveal>

        {/* Instruções */}
        <ScrollReveal delay={0.5}>
          <div className="mt-12 bg-[#3d1f1f] border border-[#5a3030] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#c9a961] mb-3">📋 Instruções</h3>
            <ol className="list-decimal list-inside space-y-2 text-[#f4e8d0]">
              <li>Baixe o template CSV e preencha com os dados dos seus livros</li>
              <li>A coluna <code className="bg-[#4a2525] px-2 py-1 rounded">nome_arquivo</code> deve corresponder exatamente ao nome do PDF</li>
              <li>A coluna <code className="bg-[#4a2525] px-2 py-1 rounded">nome_capa</code> deve corresponder ao nome da imagem (opcional)</li>
              <li>Gêneros devem ser separados por ponto e vírgula (;) ex: FICCAO_CIENTIFICA;FANTASIA</li>
              <li>Faça upload do CSV, PDFs e imagens correspondentes</li>
              <li>Clique em &quot;Iniciar Upload&quot; e aguarde o processamento</li>
            </ol>
            
            <h3 className="text-lg font-semibold text-[#c9a961] mt-6 mb-3">📚 Gêneros Disponíveis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-[#f4e8d0]">
              {ALL_GENRES.map(genre => (
                <code key={genre} className="bg-[#4a2525] px-2 py-1 rounded text-xs">
                  {genre}
                </code>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
