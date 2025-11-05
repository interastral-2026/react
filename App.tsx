import React from 'react';
import ImageEditor from './components/ImageEditor';
import { GithubIcon } from './components/Icons';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="py-4 px-6 sm:px-8 border-b border-gray-700/50 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Visualizador Jardin Maison
        </h1>
        <a href="https://github.com/google/gemini-api" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          <GithubIcon className="w-6 h-6" />
        </a>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">Visualize a Sua Casa Sustentável de Sonho</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Carregue uma foto do seu jardim, descreva a sua visão e deixe o Gemini dar vida à sua casa sustentável.
            </p>
          </div>
          <ImageEditor />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500">
        Desenvolvido com Gemini 2.5 Flash Image
      </footer>
    </div>
  );
};

export default App;