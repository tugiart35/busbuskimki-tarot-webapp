'use client';

import { useState, useEffect } from 'react';
import { getFingerprint } from '@/lib/fingerprint';

interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}

interface CardCommentsProps {
  cardId: string;
  locale: 'tr' | 'en' | 'sr';
}

export function CardComments({ cardId, locale }: CardCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Get fingerprint on mount
  useEffect(() => {
    getFingerprint().then(fp => {
      setFingerprint(fp);
    });
  }, []);

  // Load comments from API
  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetch(
          `/api/engagement/cards/${cardId}/comments?locale=${locale}`
        );
        const result = await response.json();

        if (result.success) {
          // Transform API response to match Comment interface
          const transformedComments = result.data.comments.map((c: any) => ({
            id: c.id,
            author: c.author_name,
            date: new Date(c.created_at).toLocaleDateString(
              locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'sr-RS'
            ),
            text: c.comment,
          }));
          setComments(transformedComments);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    };

    loadComments();
  }, [cardId, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !authorName.trim() || !fingerprint) return;

    // Validation
    if (authorName.trim().length < 2 || authorName.trim().length > 50) {
      setSuccessMessage(
        locale === 'tr'
          ? 'İsim 2-50 karakter arasında olmalıdır.'
          : locale === 'en'
            ? 'Name must be between 2-50 characters.'
            : 'Ime mora biti između 2-50 karaktera.'
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    if (newComment.trim().length < 10 || newComment.trim().length > 500) {
      setSuccessMessage(
        locale === 'tr'
          ? 'Yorum 10-500 karakter arasında olmalıdır.'
          : locale === 'en'
            ? 'Comment must be between 10-500 characters.'
            : 'Komentar mora biti između 10-500 karaktera.'
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/engagement/cards/${cardId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName.trim(),
          comment: newComment.trim(),
          fingerprint,
          locale,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setNewComment('');
        setAuthorName('');
        
        // Show success message
        setSuccessMessage(
          locale === 'tr'
            ? '✅ Yorumunuz gönderildi! Onaylandıktan sonra görünecektir.'
            : locale === 'en'
              ? '✅ Comment submitted! It will appear after approval.'
              : '✅ Komentar poslat! Pojaviće se nakon odobrenja.'
        );
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setSuccessMessage(
          result.error || (locale === 'tr' ? 'Bir hata oluştu.' : locale === 'en' ? 'An error occurred.' : 'Došlo je do greške.')
        );
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setSuccessMessage(
        locale === 'tr' ? 'Yorum gönderilemedi.' : locale === 'en' ? 'Failed to submit comment.' : 'Komentar nije poslat.'
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (locale === 'tr') return 'Yorumlar';
    if (locale === 'en') return 'Comments';
    return 'Komentari';
  };

  const getPlaceholder = () => {
    if (locale === 'tr') return 'Düşüncelerinizi paylaşın...';
    if (locale === 'en') return 'Share your thoughts...';
    return 'Podelite svoja razmišljanja...';
  };

  const getNamePlaceholder = () => {
    if (locale === 'tr') return 'Adınız';
    if (locale === 'en') return 'Your Name';
    return 'Vaše Ime';
  };

  const getSubmitText = () => {
    if (locale === 'tr') return 'Yorum Gönder';
    if (locale === 'en') return 'Submit Comment';
    return 'Pošalji Komentar';
  };

  const getNoCommentsText = () => {
    if (locale === 'tr')
      return 'Henüz yorum yok. İlk yorumu siz yapın!';
    if (locale === 'en') return 'No comments yet. Be the first to comment!';
    return 'Još nema komentara. Budite prvi koji će komentarisati!';
  };

  const getInfoText = () => {
    if (locale === 'tr')
      return 'Tüm yorumlar moderasyon onayından sonra yayınlanır.';
    if (locale === 'en')
      return 'All comments are published after moderation approval.';
    return 'Svi komentari se objavljuju nakon odobrenja moderacije.';
  };

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h3 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
            💬 {getTitle()}
          </h3>
          <p className='text-sm text-gray-500'>{getInfoText()}</p>
        </div>

        {/* Comment Form */}
        <div className='bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-200'>
          {/* Success/Error Message */}
          {successMessage && (
            <div className={`mb-4 p-3 rounded-lg ${
              successMessage.startsWith('✅') 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Name Input */}
            <div>
              <label
                htmlFor='author-name'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                {getNamePlaceholder()} <span className='text-red-500'>*</span>
              </label>
              <input
                id='author-name'
                type='text'
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200'
                placeholder={getNamePlaceholder()}
                required
                maxLength={50}
              />
            </div>

            {/* Comment Textarea */}
            <div>
              <label
                htmlFor='comment-text'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                {locale === 'tr' ? 'Yorumunuz' : locale === 'en' ? 'Your Comment' : 'Vaš Komentar'}{' '}
                <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='comment-text'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none'
                placeholder={getPlaceholder()}
                required
                maxLength={500}
              />
              <p className='text-xs text-gray-500 mt-1'>
                {newComment.length}/500
              </p>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting || !newComment.trim() || !authorName.trim()}
              className='w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg
                    className='animate-spin h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  {locale === 'tr' ? 'Gönderiliyor...' : locale === 'en' ? 'Submitting...' : 'Slanje...'}
                </span>
              ) : (
                getSubmitText()
              )}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className='space-y-4'>
          {comments.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-xl'>
              <svg
                className='w-16 h-16 mx-auto text-gray-300 mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
              <p className='text-gray-500 text-lg font-medium'>
                {getNoCommentsText()}
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <article
                key={comment.id}
                className='bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-purple-300 transition-colors duration-200'
              >
                <header className='flex items-center gap-3 mb-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold'>
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900'>
                      {comment.author}
                    </h4>
                    <time className='text-xs text-gray-500'>
                      {new Date(comment.date).toLocaleDateString(
                        locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'sr-RS'
                      )}
                    </time>
                  </div>
                </header>
                <p className='text-gray-700 leading-relaxed'>{comment.text}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

