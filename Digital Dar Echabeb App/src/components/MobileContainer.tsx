import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <div className={`w-full max-w-md bg-background min-h-screen relative overflow-x-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
}
