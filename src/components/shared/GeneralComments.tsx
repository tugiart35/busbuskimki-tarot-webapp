'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}

interface GeneralCommentsProps {
  pageId: string;
  locale: 'tr' | 'en' | 'sr';
  title?: string;
}

export function GeneralComments({
  pageId: _pageId,
  locale,
  title,
}: GeneralCommentsProps) {
  const [comments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !authorName.trim()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: Gelecekte Supabase'e kayıt edilecek
    // await supabase.from('general_comments').insert({
    //   page_id: pageId,
    //   author: authorName,
    //   text: newComment,
    //   created_at: new Date().toISOString()
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setNewComment('');
    setAuthorName('');
    setIsSubmitting(false);

    // Show success message (placeholder)
    alert(
      locale === 'tr'
        ? 'Yorumunuz moderasyona gönderildi. Onaylandıktan sonra görünecektir. 🎉'
        : locale === 'en'
          ? 'Your comment has been submitted for moderation. It will appear after approval. 🎉'
          : 'Vaš komentar je poslat na moderaciju. Pojaviće se nakon odobrenja. 🎉'
    );

    console.log('📊 [General Comment Submitted]', {
      authorName,
      commentLength: newComment.length,
    });
  };

  const getDefaultTitle = () => {
    if (locale === 'tr') {
      return 'Tarot Kartları Hakkında Düşünceleriniz';
    }
    if (locale === 'en') {
      return 'Your Thoughts About Tarot Cards';
    }
    return 'Vaša Mišljenja o Tarot Kartama';
  };

  const getPlaceholder = () => {
    if (locale === 'tr') {
      return 'Tarot kartları hakkında düşüncelerinizi paylaşın...';
    }
    if (locale === 'en') {
      return 'Share your thoughts about tarot cards...';
    }
    return 'Podelite svoja razmišljanja o tarot kartama...';
  };

  const getNamePlaceholder = () => {
    if (locale === 'tr') {
      return 'Adınız';
    }
    if (locale === 'en') {
      return 'Your Name';
    }
    return 'Vaše Ime';
  };

  const getSubmitText = () => {
    if (locale === 'tr') {
      return 'Yorum Gönder';
    }
    if (locale === 'en') {
      return 'Submit Comment';
    }
    return 'Pošalji Komentar';
  };

  const getNoCommentsText = () => {
    if (locale === 'tr') {
      return 'Henüz yorum yok. Tarot deneyimlerinizi ilk paylaşan siz olun!';
    }
    if (locale === 'en') {
      return 'No comments yet. Be the first to share your tarot experience!';
    }
    return 'Još nema komentara. Budite prvi koji će podeliti svoje tarot iskustvo!';
  };

  const getInfoText = () => {
    if (locale === 'tr') {
      return 'Tüm yorumlar moderasyon onayından sonra yayınlanır. Saygılı ve yapıcı yorumlar bekliyoruz.';
    }
    if (locale === 'en') {
      return 'All comments are published after moderation approval. We expect respectful and constructive comments.';
    }
    return 'Svi komentari se objavljuju nakon odobrenja moderacije. Očekujemo poštovane i konstruktivne komentare.';
  };

  const displayTitle = title || getDefaultTitle();

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-purple-50 to-indigo-50'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl'>💬</span>
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-3'>
            {displayTitle}
          </h2>
          <p className='text-sm text-gray-600 max-w-2xl mx-auto'>
            {getInfoText()}
          </p>
        </div>

        {/* Comment Form */}
        <div className='bg-white rounded-2xl p-8 mb-10 border-2 border-purple-200 shadow-xl'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Name Input */}
            <div>
              <label
                htmlFor='author-name-general'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                {getNamePlaceholder()} <span className='text-red-500'>*</span>
              </label>
              <input
                id='author-name-general'
                type='text'
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className='w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200'
                placeholder={getNamePlaceholder()}
                required
                maxLength={50}
              />
            </div>

            {/* Comment Textarea */}
            <div>
              <label
                htmlFor='comment-text-general'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                {locale === 'tr'
                  ? 'Yorumunuz'
                  : locale === 'en'
                    ? 'Your Comment'
                    : 'Vaš Komentar'}{' '}
                <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='comment-text-general'
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                rows={5}
                className='w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none'
                placeholder={getPlaceholder()}
                required
                maxLength={1000}
              />
              <div className='flex justify-between mt-2'>
                <p className='text-xs text-gray-500'>
                  {newComment.length}/1000
                </p>
                <p className='text-xs text-gray-400'>
                  {locale === 'tr'
                    ? 'Maksimum 1000 karakter'
                    : locale === 'en'
                      ? 'Maximum 1000 characters'
                      : 'Maksimalno 1000 karaktera'}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={
                isSubmitting || !newComment.trim() || !authorName.trim()
              }
              className='w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1'
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center gap-3'>
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
                  {locale === 'tr'
                    ? 'Gönderiliyor...'
                    : locale === 'en'
                      ? 'Submitting...'
                      : 'Slanje...'}
                </span>
              ) : (
                <span className='flex items-center justify-center gap-2'>
                  {getSubmitText()}
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14 5l7 7m0 0l-7 7m7-7H3'
                    />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className='space-y-5'>
          {comments.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl border-2 border-dashed border-purple-200'>
              <svg
                className='w-20 h-20 mx-auto text-purple-300 mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
              <p className='text-gray-500 text-lg font-semibold mb-2'>
                {getNoCommentsText()}
              </p>
              <p className='text-sm text-gray-400'>
                {locale === 'tr'
                  ? 'Tarot deneyimlerinizi, sorularınızı veya önerilerinizi paylaşabilirsiniz.'
                  : locale === 'en'
                    ? 'You can share your tarot experiences, questions or suggestions.'
                    : 'Možete podeliti svoja tarot iskustva, pitanja ili predloge.'}
              </p>
            </div>
          ) : (
            comments.map(comment => (
              <article
                key={comment.id}
                className='bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-purple-300 transition-all duration-200'
              >
                <header className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md'>
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className='font-bold text-gray-900 text-lg'>
                      {comment.author}
                    </h4>
                    <time className='text-xs text-gray-500'>
                      {new Date(comment.date).toLocaleDateString(
                        locale === 'tr'
                          ? 'tr-TR'
                          : locale === 'en'
                            ? 'en-US'
                            : 'sr-RS',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </time>
                  </div>
                </header>
                <p className='text-gray-700 leading-relaxed text-base'>
                  {comment.text}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// Default export for dynamic import
export default GeneralComments;
