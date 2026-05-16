import { Quiz } from '@/components/quiz/Quiz';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';

export const metadata = {
  title: 'Find your motion — The Motions quiz',
  description:
    'Nine questions to surface which motion is showing up loudest for you right now.'
};

export default function QuizPage() {
  return (
    <div className="bg-paper px-5 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
      <Quiz questions={QUIZ_QUESTIONS} />
    </div>
  );
}
