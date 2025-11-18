'use client';

import { useState, useEffect, useRef } from 'react';
import { KokolojiTest } from '@/features/psychological-tests';
import { KaynakBilgisiAccordion } from './KaynakBilgisiAccordion';

export function TestlerPageClient() {
  const [showSourceInfo, setShowSourceInfo] = useState(true);
  const testContainerRef = useRef<HTMLDivElement>(null);

  // Test seçildiğinde kaynak bilgisini gizle
  useEffect(() => {
    const checkTestState = () => {
      if (testContainerRef.current) {
        const hasTestList = testContainerRef.current.querySelector(
          '[data-test-list]'
        );
        const hasTestContent = testContainerRef.current.querySelector(
          '[data-test-content]'
        );

        if (hasTestContent && !hasTestList) {
          // Test seçildi, kaynak bilgisini gizle
          setShowSourceInfo(false);
        } else if (hasTestList) {
          // Test listesi görünüyor, kaynak bilgisini göster
          setShowSourceInfo(true);
        }
      }
    };

    // İlk kontrol
    checkTestState();

    // MutationObserver ile değişiklikleri izle
    const observer = new MutationObserver(checkTestState);

    if (testContainerRef.current) {
      observer.observe(testContainerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={testContainerRef}>
        <KokolojiTest />
      </div>
      {showSourceInfo && <KaynakBilgisiAccordion />}
    </>
  );
}

