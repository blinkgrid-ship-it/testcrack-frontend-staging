import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  Cloud,
  RefreshCw,
  WifiOff,
  Target,
  Zap
} from 'lucide-react';
import { MCQContent as MCQContentType } from '../../types';
import { cn } from '@/shared/utils/utils';
import { quizPersistence } from '@/shared/utils/quizPersistence';

interface MCQContentProps {
  mcq: MCQContentType;
  onComplete?: () => void;
  isAlreadyCompleted?: boolean;
  onContinue?: () => void;
  courseId: string;
  // NEW: Focus Mode Props
  isFocusMode?: boolean;
  onToggleFocus?: () => void;
}

export function MCQContent({ 
  mcq, 
  onComplete, 
  isAlreadyCompleted = false, 
  onContinue, 
  courseId,
  isFocusMode = false,
  onToggleFocus 
}: MCQContentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasCalledComplete, setHasCalledComplete] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'syncing' | 'offline'>('saved');

  useEffect(() => {
    const draft = quizPersistence.getAnswer(courseId, mcq.id);
    
    if (isAlreadyCompleted) {
      setSelectedAnswer(null); 
      setIsSubmitted(true);
      setHasCalledComplete(true);
    } else {
      setSelectedAnswer(draft);
      setIsSubmitted(false);
      setHasCalledComplete(false);
    }
  }, [mcq.id, isAlreadyCompleted, courseId]);

  const isCorrect = isSubmitted && selectedAnswer === mcq.correct_answer;

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(optionId);
    setSyncStatus('syncing');
    quizPersistence.saveAnswer(courseId, mcq.id, optionId);
    
    setTimeout(() => {
        setSyncStatus(navigator.onLine ? 'saved' : 'offline');
    }, 600);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
    
    if (!hasCalledComplete && onComplete) {
      setHasCalledComplete(true);
      onComplete();
      quizPersistence.markSynced(courseId, mcq.id);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setSyncStatus('saved');
  };

  const SyncIndicator = (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50/10 border border-white/20 backdrop-blur-md transition-all">
      {syncStatus === 'syncing' && (
        <><RefreshCw className="h-3 w-3 animate-spin text-white" /> <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Saving</span></>
      )}
      {syncStatus === 'saved' && (
        <><Cloud className="h-3 w-3 text-emerald-300" /> <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Saved</span></>
      )}
      {syncStatus === 'offline' && (
        <><WifiOff className="h-3 w-3 text-amber-300" /> <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Offline</span></>
      )}
    </div>
  );

  return (
    <div className={cn(
      "transition-all duration-700 ease-in-out",
      isFocusMode ? "max-w-3xl mx-auto py-12" : "w-full"
    )}>
      <Card className={cn(
        "border-2 transition-all duration-500 overflow-hidden relative z-20",
        isFocusMode 
          ? "border-purple-500 shadow-[0_0_50px_-12px_rgba(147,51,234,0.4)] scale-[1.02] bg-white" 
          : "border-purple-100 bg-gradient-to-br from-white to-purple-50/30"
      )}>
        <CardContent className="p-0">
          <div className={cn(
            "p-6 text-white transition-all duration-500",
            isFocusMode ? "bg-slate-900" : "bg-gradient-to-r from-purple-600 to-indigo-600"
          )}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium leading-relaxed">{mcq.question}</p>
                    {mcq.difficulty && (
                        <span className="inline-block mt-3 text-xs px-2 py-1 bg-white/20 rounded font-bold uppercase tracking-widest">{mcq.difficulty} Level</span>
                    )}
                  </div>
              </div>
              
              {/* Focus Mode Toggle Button */}
              <div className="flex flex-col items-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFocus}
                  className={cn(
                    "gap-2 border-white/20 border hover:bg-white/20 text-white transition-all",
                    isFocusMode && "bg-purple-600 border-purple-400 hover:bg-purple-500"
                  )}
                >
                  {isFocusMode ? <Zap className="h-4 w-4 fill-current text-amber-300" /> : <Target className="h-4 w-4" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isFocusMode ? 'Focus On' : 'Focus Mode'}
                  </span>
                </Button>
                {SyncIndicator}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {mcq.options.map((option, index) => {
                const optionLabel = String.fromCharCode(65 + index);
                const isThisCorrect = option.id === mcq.correct_answer;
                const isThisSelected = selectedAnswer === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300',
                      isSubmitted ? 'cursor-default' : 'cursor-pointer',
                      !isSubmitted && selectedAnswer === option.id ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/30',
                      isSubmitted && isThisCorrect && 'border-green-500 bg-green-50',
                      isSubmitted && isThisSelected && !isThisCorrect && 'border-red-500 bg-red-50',
                      isSubmitted && !isThisCorrect && !isThisSelected && 'opacity-50'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                      !isSubmitted && selectedAnswer === option.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600',
                      isSubmitted && isThisCorrect && 'bg-green-600 text-white',
                      isSubmitted && isThisSelected && !isThisCorrect && 'bg-red-600 text-white'
                    )}>
                      {isSubmitted && isThisCorrect ? <CheckCircle className="h-5 w-5" /> : isSubmitted && isThisSelected && !isThisCorrect ? <XCircle className="h-5 w-5" /> : optionLabel}
                    </div>
                    <span className={cn('flex-1 text-base', isSubmitted && isThisCorrect ? 'text-green-800 font-semibold' : 'text-gray-700')}>
                      {option.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {isSubmitted && (
              <div className={cn(
                'mt-6 p-5 rounded-xl border-2 animate-in fade-in slide-in-from-top-2 duration-500',
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
              )}>
                <div className="flex items-center gap-3 mb-3">
                  {isCorrect ? (
                    <><CheckCircle className="h-6 w-6 text-green-600" /><span className="font-bold text-green-800">Correct! 🎉</span></>
                  ) : (
                    <><XCircle className="h-6 w-6 text-amber-600" /><span className="font-bold text-amber-800">Review Required</span></>
                  )}
                </div>
                {mcq.explanation && (
                  <div className="mt-2 text-sm text-gray-600 leading-relaxed border-t pt-3 border-gray-200">
                    <p className="font-bold text-gray-700 mb-1 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-purple-600"/> Explanation:</p>
                    {mcq.explanation}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button variant="ghost" onClick={handleRetry} disabled={!isSubmitted} className="text-xs text-gray-500 hover:text-purple-600">
                <RotateCcw className="h-3 w-3 mr-2" /> Reset Question
              </Button>

              {!isSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className={cn('px-10 font-bold', selectedAnswer ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' : 'bg-gray-200')}
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                  <CheckCircle className="h-4 w-4" /> MODULE SAVED
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}