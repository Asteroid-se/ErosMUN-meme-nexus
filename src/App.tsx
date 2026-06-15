import { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import type { Question } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

type GameState = 'start' | 'playing' | 'result';

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMemes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      const data = await response.json();
      if (data.success) {
        setMemes(data.data.memes);
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const generateQuestions = () => {
    if (memes.length < 10) return;

    const shuffledMemes = shuffleArray(memes);
    const selectedMemes = shuffledMemes.slice(0, 10);

    const generatedQuestions: Question[] = selectedMemes.map(meme => {
      const wrongOptions = memes
        .filter(m => m.id !== meme.id)
        .map(m => m.name);
        
      const shuffledWrong = shuffleArray(wrongOptions).slice(0, 3);
      
      const options = shuffleArray([meme.name, ...shuffledWrong]);

      return {
        image: meme.url,
        correctAnswer: meme.name,
        options
      };
    });

    setQuestions(generatedQuestions);
  };

  const handleStart = () => {
    generateQuestions();
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameState('playing');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 1);

    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('result');
    }
  };

  const handleRestart = () => {
    generateQuestions();
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameState('playing');
  };

  return (
    <>
      {gameState === 'start' && (
        <StartScreen onStart={handleStart} isLoading={isLoading || memes.length === 0} />
      )}
      
      {gameState === 'playing' && questions.length > 0 && (
        <QuizScreen 
          question={questions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          totalQuestions={10}
          onAnswer={handleAnswer}
        />
      )}

      {gameState === 'result' && (
        <ResultScreen 
          score={score} 
          totalQuestions={10} 
          onRestart={handleRestart} 
        />
      )}
    </>
  );
}

export default App;
