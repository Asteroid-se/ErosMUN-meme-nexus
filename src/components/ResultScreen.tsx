import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Download } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  onRestart
}) => {
  const isPerfect = score === totalQuestions;
  const isWasted = score === 0;

  useEffect(() => {
    if (isPerfect) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFB6C1', '#FF9EAB', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFB6C1', '#FF9EAB', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }

    if (isWasted) {
      document.body.classList.add('wasted-effect');
    }

    return () => {
      document.body.classList.remove('wasted-effect');
    };
  }, [isPerfect, isWasted]);

  return (
    <div className="card">
      {isPerfect && (
        <>
          <h1>🏆 EROSMUN KÜLTÜR BAKANI! 🏆</h1>
          <img 
            src="/sertifika.png" 
            alt="ErosMUN Sertifikası" 
            style={{
              display: 'block',
              margin: '1.5rem auto',
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '12px',
              border: '4px solid var(--primary-pink)',
              boxShadow: '0 20px 25px -5px rgba(255, 182, 193, 0.4), 0 8px 10px -6px rgba(255, 182, 193, 0.4)'
            }}
          />
          <a 
            href="/sertifika.png" 
            download="ErosMUN_Sertifika.png" 
            className="btn" 
            style={{ 
              margin: '0 auto 1.5rem auto', 
              display: 'inline-flex',
              textDecoration: 'none'
            }}
          >
            <Download size={20} />
            Sertifikayı İndir
          </a>
          <h2>Mükemmel Skor: {score} / {totalQuestions}</h2>
          <p>Tebrikler! İnternet kültürünün zirvesindesin. Git ve fiziki ödülünü (Çikolata/Hediye) talep et!</p>
        </>
      )}

      {isWasted && (
        <>
          <h1>💀 İNANILMAZ BİR BAŞARISIZLIK! 💀</h1>
          <h2>Skor: {score} / {totalQuestions}</h2>
          <p>Acı sos veya kötü karışım cezası seni bekliyor... Bari 1 tane bilseydin!</p>
        </>
      )}

      {!isPerfect && !isWasted && (
        <>
          <h1>Oyun Bitti!</h1>
          <h2>Skorun: {score} / {totalQuestions}</h2>
          <p>{score >= 5 ? 'Fena değil! Ama daha iyisini yapabilirsin.' : 'Biraz daha çalışman lazım!'}</p>
        </>
      )}

      <button className="btn" onClick={onRestart} style={{ marginTop: '1rem' }}>
        <RefreshCw size={24} />
        Tekrar Oyna
      </button>
    </div>
  );
};
