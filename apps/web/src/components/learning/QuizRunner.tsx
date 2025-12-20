// ═══════════════════════════════════════════════════════════════════════════
// QUIZ RUNNER COMPONENT
// Interactive quiz with MCQ, True/False, Scenario questions, timer, and scoring
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  RotateCcw,
  Target,
  Zap,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import type { Quiz, QuizQuestion } from '../../lib/learning/quizzes';
import { calculateScore, shuffleQuestions } from '../../lib/learning/quizzes';

interface QuizRunnerProps {
  quiz: Quiz;
  questionCount?: number; // Optional: limit number of questions
  onClose: () => void;
  onComplete?: (score: number, total: number, passed: boolean) => void;
}

type QuizState = 'intro' | 'running' | 'review' | 'results';

export function QuizRunner({ quiz, questionCount, onClose, onComplete }: QuizRunnerProps) {
  const [state, setState] = useState<QuizState>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = selectedAnswer !== undefined;

  // Initialize quiz
  const startQuiz = useCallback(() => {
    const shuffled = shuffleQuestions(quiz.questions);
    const selected = questionCount 
      ? shuffled.slice(0, Math.min(questionCount, shuffled.length))
      : shuffled;
    
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setShowExplanation(false);
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
    setStartTime(new Date());
    setState('running');
  }, [quiz, questionCount]);

  // Timer
  useEffect(() => {
    if (state !== 'running' || !quiz.timeLimit) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setState('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, quiz.timeLimit]);

  const handleSelectAnswer = useCallback((optionId: string) => {
    if (!currentQuestion || showExplanation) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  }, [currentQuestion, showExplanation]);

  const handleShowExplanation = useCallback(() => {
    setShowExplanation(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setState('results');
    }
  }, [currentIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  }, [currentIndex]);

  const handleReview = useCallback(() => {
    setCurrentIndex(0);
    setShowExplanation(true);
    setState('review');
  }, []);

  const handleRetry = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const result = state === 'results' || state === 'review' 
    ? calculateScore(answers, questions)
    : null;

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq': return <Target className="w-4 h-4" />;
      case 'true-false': return <HelpCircle className="w-4 h-4" />;
      case 'scenario': return <Zap className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'true-false': return 'True or False';
      case 'scenario': return 'Scenario';
      default: return 'Question';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hard': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // INTRO SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (state === 'intro') {
    const mcqCount = quiz.questions.filter(q => q.type === 'mcq').length;
    const tfCount = quiz.questions.filter(q => q.type === 'true-false').length;
    const scenarioCount = quiz.questions.filter(q => q.type === 'scenario').length;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-teal-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{quiz.pathName} Quiz</h2>
                <p className="text-sm text-slate-400">{quiz.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Quiz Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">
                    {questionCount || quiz.questions.length} questions
                  </span>
                </div>
                {quiz.timeLimit && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">{quiz.timeLimit} minutes</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{quiz.passingScore}% to pass</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Question Types</h3>
              <div className="flex flex-wrap gap-2">
                {mcqCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {mcqCount} MCQ
                  </span>
                )}
                {tfCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-teal-500/20 text-teal-400 rounded flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    {tfCount} True/False
                  </span>
                )}
                {scenarioCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {scenarioCount} Scenario
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={startQuiz}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RESULTS SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (state === 'results' && result) {
    const timeTaken = startTime 
      ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      : 0;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
          <div className="text-center mb-6">
            <div className={`inline-flex p-4 rounded-full mb-4 ${
              result.passed 
                ? 'bg-emerald-500/20' 
                : 'bg-rose-500/20'
            }`}>
              {result.passed 
                ? <Trophy className="w-12 h-12 text-emerald-400" />
                : <AlertCircle className="w-12 h-12 text-rose-400" />
              }
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {result.passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-slate-400">
              {result.passed 
                ? 'You passed the quiz!' 
                : `You need ${result.passingScore}% to pass. Try again!`
              }
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-white">{result.percentage}%</div>
                <div className="text-xs text-slate-400">Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {result.score}/{result.total}
                </div>
                <div className="text-xs text-slate-400">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{formatTime(timeTaken)}</div>
                <div className="text-xs text-slate-400">Time</div>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    result.passed 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>0%</span>
                <span className="text-indigo-400">{result.passingScore}% passing</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReview}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Review Answers
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>

          <button
            onClick={() => {
              onComplete?.(result.score, result.total, result.passed);
              onClose();
            }}
            className="w-full mt-3 py-3 text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // QUIZ / REVIEW SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  const isCorrectAnswer = (optionId: string) => {
    return currentQuestion?.options.find(o => o.id === optionId)?.isCorrect;
  };

  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedAnswer === optionId;
    const showResult = showExplanation || state === 'review';
    const isCorrect = isCorrectAnswer(optionId);

    if (!showResult) {
      return isSelected
        ? 'border-indigo-500 bg-indigo-500/20 text-white'
        : 'border-slate-600 hover:border-slate-500 text-slate-300';
    }

    if (isCorrect) {
      return 'border-emerald-500 bg-emerald-500/20 text-emerald-400';
    }
    
    if (isSelected && !isCorrect) {
      return 'border-rose-500 bg-rose-500/20 text-rose-400';
    }

    return 'border-slate-700 text-slate-500';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {state === 'review' && (
              <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded">
                Review Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {quiz.timeLimit && state === 'running' && (
              <div className={`flex items-center gap-1 text-sm ${
                timeRemaining < 60 ? 'text-rose-400' : 'text-slate-400'
              }`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeRemaining)}
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pt-4">
          <div className="flex gap-1">
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined;
              const isCorrect = state === 'review' && answered && 
                q.options.find(o => o.id === answers[q.id])?.isCorrect;
              
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    if (state !== 'review') setShowExplanation(false);
                  }}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'bg-indigo-500' 
                      : state === 'review' && answered
                        ? isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                        : answered 
                          ? 'bg-teal-500' 
                          : 'bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-auto p-6">
          {currentQuestion && (
            <>
              {/* Question header */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
                  currentQuestion.type === 'mcq' 
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    : currentQuestion.type === 'true-false'
                      ? 'bg-teal-500/20 text-teal-400 border-teal-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {getQuestionTypeIcon(currentQuestion.type)}
                  {getQuestionTypeLabel(currentQuestion.type)}
                </span>
                <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question text */}
              <h3 className="text-xl font-semibold text-white mb-6">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(option.id)}
                    disabled={showExplanation || state === 'review'}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${getOptionStyle(option.id)}`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${
                      (showExplanation || state === 'review') && isCorrectAnswer(option.id)
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : selectedAnswer === option.id
                          ? 'border-current bg-current/20'
                          : 'border-current/50'
                    }`}>
                      {(showExplanation || state === 'review') ? (
                        isCorrectAnswer(option.id) 
                          ? <CheckCircle2 className="w-4 h-4" />
                          : selectedAnswer === option.id 
                            ? <XCircle className="w-4 h-4" />
                            : String.fromCharCode(65 + idx)
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {(showExplanation || state === 'review') && currentQuestion.explanation && (
                <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-400">Explanation</span>
                  </div>
                  <p className="text-slate-300">{currentQuestion.explanation}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {state === 'running' && isAnswered && !showExplanation && (
              <button
                onClick={handleShowExplanation}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Check Answer
              </button>
            )}
            
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={() => setState('results')}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                {state === 'review' ? 'See Results' : 'Finish Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ PREVIEW CARD
// ─────────────────────────────────────────────────────────────────────────────

interface QuizPreviewProps {
  quiz: Quiz;
  onStart: () => void;
  bestScore?: number;
}

export function QuizPreview({ quiz, onStart, bestScore }: QuizPreviewProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-teal-500/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Trophy className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h4 className="font-medium text-white">{quiz.pathName}</h4>
            <p className="text-xs text-slate-400">{quiz.questions.length} questions</p>
          </div>
        </div>
        {bestScore !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded ${
            bestScore >= quiz.passingScore 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            Best: {bestScore}%
          </span>
        )}
      </div>
      
      <p className="text-sm text-slate-400 mb-3">{quiz.description}</p>
      
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        {quiz.timeLimit && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {quiz.timeLimit} min
          </span>
        )}
        <span className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {quiz.passingScore}% to pass
        </span>
      </div>
      
      <button
        onClick={onStart}
        className="w-full py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg transition-colors text-sm font-medium"
      >
        Take Quiz
      </button>
    </div>
  );
}
