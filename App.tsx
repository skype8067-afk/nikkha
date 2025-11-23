
import React from 'react';
import Invitation from './components/Invitation';
import Starfield from './components/Starfield';

const App: React.FC = () => {
  return (
    <main
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('https://i.postimg.cc/ydr20JR9/nmn.avif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Starfield />
      <Invitation />
    </main>
  );
};

export default App;
