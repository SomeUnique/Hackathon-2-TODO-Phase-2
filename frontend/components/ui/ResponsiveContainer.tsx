import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default ResponsiveContainer;