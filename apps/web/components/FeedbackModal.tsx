import React, { useState } from 'react';
import { useTranslation } from '../../../packages/core/i18n';

interface FeedbackModalProps {
  isOpen: boolean;
  onSubmit: (rating: number, comments: string) => void;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert(t('ratingRequired'));
      return;
    }
    onSubmit(rating, comments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative transform transition-all scale-95 duration-300 ease-out" style={{ animation: 'scaleUp 0.3s forwards' }}>
        <h2 id="feedback-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">{t('feedbackTitle')}</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">{t('feedbackPrompt')}</p>

        <div className="flex justify-center items-center mb-6" dir="ltr">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="text-4xl transition-transform duration-200 transform hover:scale-125 focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <span className={(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}>★</span>
            </button>
          ))}
        </div>

        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder={t('feedbackPlaceholder')}
          rows={4}
          className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {t('send')}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition shadow-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            {t('later')}
          </button>
        </div>
      </div>
       <style>{`
          @keyframes scaleUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
       `}</style>
    </div>
  );
};

export default FeedbackModal;
