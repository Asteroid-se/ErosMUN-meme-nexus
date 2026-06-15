import { useState, useEffect, useRef } from 'react';

export interface Question {
  image: string;
  options: string[];
  correctAnswer: string;
}

interface QuizScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer
}) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const correctSound = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/ding.ogg'));
  const wrongSound = useRef(new Audio('https://www.myinstants.com/media/sounds/vine-boom.mp3'));

  useEffect(() => {
    setTimeLeft(10);
    setSelectedOption(null);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const handleTimeOut = () => {
    setSelectedOption(''); // represents a timeout
    wrongSound.current.play().catch(() => {});
    setTimeout(() => {
      onAnswer(false);
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    
    clearInterval(timerRef.current!);
    setSelectedOption(option);
    
    const isCorrect = option === question.correctAnswer;
    
    if (isCorrect) {
      correctSound.current.play().catch(() => {});
    } else {
      wrongSound.current.play().catch(() => {});
    }
    
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1000);
  };

  const getOptionClass = (option: string) => {
    if (selectedOption === null) return '';
    if (option === question.correctAnswer) return 'correct';
    if (selectedOption === option) return 'wrong';
    return '';
  };

  return (
    <div className="card">
      <div className="status-header">
        <span>Soru {questionIndex + 1} / {totalQuestions}</span>
        <span style={{ color: timeLeft <= 3 ? 'var(--error-red)' : 'inherit', fontWeight: 'bold' }}>
          {timeLeft}sn
        </span>
      </div>
      
      <div className="timer-bar-container">
        <div 
          className={`timer-bar ${timeLeft <= 3 ? 'warning' : ''}`} 
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        />
      </div>

      <div className="meme-image-container">
        <img src={question.image} alt="Meme" className="meme-image" />
      </div>

      <div className="options-container">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(option)}
            disabled={selectedOption !== null}
            className={`btn-option ${getOptionClass(option)}`}
          >
            {['A', 'B', 'C', 'D'][idx]}) {option}
          </button>
        ))}
      </div>
    </div>
  );
};
