import React from 'react';
import { Play } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  return (
    <div className="card">
      <div style={{ marginBottom: '2rem' }}>
        <h1>ErosMUN</h1>
        <h2>Meme Ultimate Nexus</h2>
        <p>M.U.N. Meme Quiz'e Hoş Geldin! İnternet kültürüne ne kadar hakim olduğunu kanıtla.</p>
      </div>
      
      <button 
        className="btn" 
        onClick={onStart}
        disabled={isLoading}
      >
        <Play size={24} />
        {isLoading ? 'Yükleniyor...' : 'Oyuna Başla'}
      </button>
    </div>
  );
};
