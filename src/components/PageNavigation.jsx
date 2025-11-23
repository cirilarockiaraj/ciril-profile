import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PageNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define page order based on navigation
  const pages = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/resume', label: 'Resume' },
    { path: '/chat', label: 'Chat me With AI' },
    { path: '/contact', label: 'Contact' },
  ];

  // Find current page index
  const currentIndex = pages.findIndex(page => page.path === location.pathname);
  
  // Don't show navigation on NotFound page or if current page not found
  if (currentIndex === -1) {
    return null;
  }

  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevPage) {
      navigate(prevPage.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (nextPage) {
      navigate(nextPage.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop arrows intentionally hidden (mobile-only navigation requested) */}
      <div className="hidden" />
      <div className="hidden" />

      {/* Mobile Navigation - Bottom fixed bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            onClick={handlePrev}
            disabled={!prevPage}
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 text-white ${
              !prevPage ? 'opacity-30 cursor-not-allowed' : 'hover:text-blue-400'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
            <span className="text-xs">Prev</span>
          </Button>

          <span className="text-xs text-gray-400 px-2">
            {currentIndex + 1} / {pages.length}
          </span>

          <Button
            onClick={handleNext}
            disabled={!nextPage}
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 text-white ${
              !nextPage ? 'opacity-30 cursor-not-allowed' : 'hover:text-blue-400'
            }`}
            aria-label="Next page"
          >
            <span className="text-xs">Next</span>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default PageNavigation;

