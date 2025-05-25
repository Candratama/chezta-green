import React from 'react';
import { Link } from 'react-router-dom';

const Onboarding = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(45deg, var(--neutral-800) 1px, transparent 1px), linear-gradient(135deg, var(--neutral-800) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          animation: 'wave 20s linear infinite',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'center top'
        }}
      ></div>

      {/* Floating boxes */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-20
              ${i % 3 === 0 ? 'bg-primary-500' : 'bg-neutral-300'}`}
            style={{
              width: '20px',
              height: '20px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="text-center z-10">
        <div className="inline-block mb-8">
          <div className="w-28 h-28 relative">
            <div className="grid grid-cols-2 grid-rows-2 h-full">
              <div className="bg-neutral-700"></div>
              <div className="bg-primary-500"></div>
              <div className="bg-neutral-700"></div>
              <div className="bg-neutral-700"></div>
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-8 tracking-wide">
          Welcome to
          <div className="mt-2">
            <span className="text-primary-500">Chezta</span>{' '}
            <span className="text-neutral-700">Green</span>
          </div>
        </h1>
        <Link 
          to="/"
          className="neumorphic-button inline-block px-12 py-4 text-lg font-medium text-primary-500 hover:scale-105 transition-all duration-300"
        >
          Mulai
        </Link>
      </div>
    </div>
  );
};

export default Onboarding;