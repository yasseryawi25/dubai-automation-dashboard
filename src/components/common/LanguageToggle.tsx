import React from 'react';

interface LanguageToggleProps {
  value?: 'en' | 'ar';
  onChange?: (lang: 'en' | 'ar') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ value = 'en', onChange }) => {
  return (
    <button
      className="px-3 py-1 rounded border border-neutral-300 bg-white text-sm font-medium hover:bg-neutral-100"
      onClick={() => onChange?.(value === 'en' ? 'ar' : 'en')}
      aria-label="Toggle language"
    >
      {value === 'en' ? 'EN' : 'AR'}
    </button>
  );
};

export default LanguageToggle; 