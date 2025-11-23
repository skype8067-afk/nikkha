
import React from 'react';

interface WaxSealIconProps extends React.SVGProps<SVGSVGElement> {}

const WaxSealIcon: React.FC<WaxSealIconProps> = (props) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <filter id="wax-seal-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#wax-seal-shadow)">
      <path
        d="M85.2,50c0,19.4-15.7,35.2-35.2,35.2S14.8,69.4,14.8,50S30.6,14.8,50,14.8S85.2,30.6,85.2,50z"
        fill="#c53030"
      />
      <path
        d="M82.3,57.1c-2.8,4.6-6.4,8.5-10.6,11.5c-4.5,3.2-9.8,5.1-15.4,5.1c-6.1,0-11.8-2.3-16.3-6.4c-3.5-3.2-6.3-7.3-8.1-12.1 c-0.6-1.5-1-3.1-1.2-4.7c-0.2-1.7-0.2-3.5,0-5.2c0.5-4,2.1-7.8,4.6-10.9c3.1-3.8,7.2-6.6,11.9-8.1c1.7-0.5,3.4-0.8,5.2-1 c1.8-0.1,3.6-0.1,5.4,0.1c4.8,0.5,9.3,2.5,13.1,5.7c3.1,2.6,5.6,5.9,7.2,9.6c0.5,1.1,0.9,2.3,1.2,3.5c0.6,2.6,0.6,5.3,0,7.9 C83.2,53.8,82.8,55.5,82.3,57.1z"
        fill="#e53e3e"
      />
      {/* Heart in the middle */}
      <path
        d="M50 42.2C50 42.2 45 37 45 37c-3.3-3.3-8.7-3.3-12 0c-3.3 3.3-3.3 8.7 0 12L50 66l17-17c3.3-3.3 3.3-8.7 0-12 c-3.3-3.3-8.7-3.3-12 0L50 42.2z"
        fill="#c53030"
        stroke="#a02c2c"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

export default WaxSealIcon;
