'use client';

import React, { useState } from 'react';
import {
  FaEnvelope,
  FaPaperPlane,
  FaUser,
  FaComment,
  FaCheckCircle,
  FaSpinner,
} from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='min-h-screen bg-cosmic-black'>
      {/* ... mevcut başlık kodları ... */}

      <main className='relative z-10 max-w-4xl mx-auto px-4 py-12'>
        {/* ... İletişim Bilgileri bölümü aynı kalır ... */}

        {/* Contact Form */}
        <section className='card p-6 hover-lift'>
          <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
              <FaPaperPlane className='w-5 h-5 text-purple-300' />
            </div>
            <h2 className='text-2xl font-bold text-golden-300'>
              İletişim Formu
            </h2>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20 mb-6'>
              <div className='flex items-center space-x-2 text-green-300'>
                <FaCheckCircle className='w-5 h-5' />
                <span className='font-semibold'>
                  Mesajınız başarıyla gönderildi!
                </span>
              </div>
              <p className='text-cosmic-200 text-sm mt-1'>
                En kısa sürede size dönüş yapacağız.
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20 mb-6'>
              <p className='text-red-300 text-sm'>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='relative'>
              <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-400 w-4 h-4' />
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Adınız Soyadınız'
                className='form-input pl-10'
                required
                disabled={isSubmitting}
              />
            </div>

            <div className='relative'>
              <FaEnvelope className='absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-400 w-4 h-4' />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='E-posta Adresiniz'
                className='form-input pl-10'
                required
                disabled={isSubmitting}
              />
            </div>

            <div className='relative'>
              <FaComment className='absolute left-3 top-3 text-cosmic-400 w-4 h-4' />
              <textarea
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Mesajınız'
                className='form-input pl-10'
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg p-3 transition-all duration-300 flex items-center justify-center space-x-2'
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className='w-4 h-4 animate-spin' />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className='w-4 h-4' />
                  <span>Gönder</span>
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
