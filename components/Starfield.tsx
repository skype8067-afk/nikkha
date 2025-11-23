
import React, { useMemo } from 'react';

const Starfield: React.FC = () => {
  const stars = useMemo(() => {
    const starArray = [];
    const starCount = 100; // Number of stars
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          animationDuration: `${2 + Math.random() * 3}s`,
          animationDelay: `${Math.random() * 5}s`,
        },
      });
    }
    return starArray;
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={star.style}
        />
      ))}
    </div>
  );
};

export default Starfield;
