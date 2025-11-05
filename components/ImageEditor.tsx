import React, { useState, useCallback, ChangeEvent } from 'react';
import { editImageWithPrompt } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { UploadIcon, SparklesIcon, XCircleIcon } from './Icons';

const ImageEditor: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Adicione uma casa de papel moderna e sustentável a este jardim.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalImageFile(file);
      setOriginalImagePreview(URL.createObjectURL(file));
      setGeneratedImage(null);
      setError(null);
    } else {
      setError('Por favor, selecione um ficheiro de imagem válido.');
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Por favor, carregue uma imagem e insira um prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImageFile);
      const generatedBase64 = await editImageWithPrompt(base64, mimeType, prompt);
      setGeneratedImage(`data:image/png;base64,${generatedBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt]);

  const resetState = () => {
    setOriginalImageFile(null);
    setOriginalImagePreview(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };
  
  const examplePrompts = [
    "Adicione uma 'Casa Caracol' biónica, uma escultura habitacional, neste jardim.",
    "Construa um muro que imita pedra natural com um jardim vertical integrado.",
    "Visualize uma piscina biológica com tratamento de água por plantas e areia.",
    "Insira um módulo de cozinha exterior com acabamentos em cimento reciclado e madeira.",
    "Imagine um alpendre com um guarda-corpos artístico e painéis solares discretos no telhado.",
    "Crie um espaço de lounge com mobiliário feito de paletes e ferro reciclado.",
    "Instale um sistema de captação de águas pluviais com um design moderno.",
    "Desenhe um caminho iluminado que leva a um estúdio de arte feito de materiais reaproveitados.",
    "Adicione um aerogerador silencioso e elegante no canto do terreno.",
    "Transforme a parede do fundo numa fachada viva com um sistema de irrigação gota a gota."
  ];

  if (!originalImageFile) {
    return (
      <div className="w-full p-8 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:border-purple-500 hover:bg-gray-800">
        <label htmlFor="file-upload" className="cursor-pointer p-8">
          <UploadIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white">Carregue a Foto do seu Jardim</h3>
          <p className="text-gray-400 mt-2">Arraste e solte ou clique para selecionar uma imagem</p>
          <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
         {error && (
            <div className="mt-4 flex items-center text-red-400">
                <XCircleIcon className="w-5 h-5 mr-2" />
                <p>{error}</p>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800/50 flex items-center justify-center">
            <img src={originalImagePreview || ''} alt="Jardim Original" className="object-contain w-full h-full" />
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">ORIGINAL</div>
            <button onClick={resetState} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-gray-300 hover:text-white hover:bg-black/70 transition-all">
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800/50 flex items-center justify-center">
            {isLoading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                    <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg">O Gemini está a visualizar...</p>
                </div>
            )}
            {generatedImage ? (
                <img src={generatedImage} alt="Casa Gerada" className="object-contain w-full h-full" />
            ) : !isLoading && (
                 <div className="text-center text-gray-500">
                    <SparklesIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>A sua imagem gerada aparecerá aqui.</p>
                 </div>
            )}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">GERADO</div>
        </div>
      </div>

       {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center text-red-300">
                <XCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}

      <div className="bg-gray-800/50 p-4 rounded-xl space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Descreva a sua visão
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ex: Adicione uma casa caracol de madeira neste jardim"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
            rows={2}
          />
        </div>
        <div className="flex flex-wrap gap-2">
            {examplePrompts.map((p) => (
                <button 
                    key={p} 
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors"
                >
                    {p}
                </button>
            ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
            onClick={handleGenerateClick}
            disabled={isLoading || !prompt}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300"
        >
            <SparklesIcon className="w-6 h-6 mr-3" />
            {isLoading ? 'A gerar...' : 'Visualizar a Minha Casa'}
        </button>
      </div>
    </div>
  );
};

export default ImageEditor;