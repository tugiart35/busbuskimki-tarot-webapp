export function NumerologyPageSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
      {/* Background - same structure to prevent CLS */}
      <div
        className='absolute inset-0 overflow-hidden'
        style={{ willChange: 'transform' }}
      >
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-xl'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full opacity-10 blur-xl'></div>
      </div>

      <div className='container mx-auto px-4 py-8 relative z-10'>
        {/* Hero Skeleton */}
        <div className='text-center mb-12'>
          <div className='h-16 w-96 bg-white/10 rounded-xl mx-auto mb-6 animate-pulse'></div>
          <div className='h-6 w-128 bg-white/5 rounded-lg mx-auto animate-pulse'></div>
        </div>

        {/* Tabs Skeleton */}
        <div className='flex gap-3 justify-center mb-8'>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className='h-12 w-32 bg-white/10 rounded-2xl animate-pulse'
            />
          ))}
        </div>

        {/* Form Skeleton */}
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white/5 backdrop-blur-xl rounded-3xl p-8'>
            <div className='h-64 bg-white/5 rounded-2xl animate-pulse'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
