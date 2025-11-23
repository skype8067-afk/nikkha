
import React, { useState, useEffect, useMemo, useRef } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzu1YEV84l1okk_SQDJJcqil1sW9pqlPC6ph895-AV-skxVRWlwL_DSJguCtUBn6RVS/exec';

type TrackingStatus = 'idle' | 'sending' | 'success' | 'error';

/**
 * Tracks a single unique click per user using localStorage.
 * Sends a request to a Google Apps Script to log the click.
 */
const trackUniqueClick = (setTrackingStatus: React.Dispatch<React.SetStateAction<TrackingStatus>>) => {
  if (localStorage.getItem('invitationClicked')) {
    console.log('Click already tracked for this user.');
    setTrackingStatus('success');
    return;
  }

  localStorage.setItem('invitationClicked', 'true');
  console.log('Attempting to track unique click via fetch...');
  setTrackingStatus('sending');
  
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event: 'Envelope Opened' }),
  })
  .then(() => {
    console.log('Tracking request sent successfully.');
    setTrackingStatus('success');
  })
  .catch((error) => {
    console.error('Failed to send tracking request.');
    setTrackingStatus('error');
  });
};


const Invitation: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('idle');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<any>(null);

  const handleReveal = async () => {
    if (!isRevealed) {
      trackUniqueClick(setTrackingStatus);
      setIsRevealed(true);
      
      // Stop any ongoing fade-out
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      
      // Play music
      if (audioRef.current) {
        audioRef.current.volume = 1.0; // Ensure full volume
        
        try {
            // Force load to pick up sources and play
            audioRef.current.load();
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                await playPromise;
            }
        } catch (error: any) {
            // Ignore AbortError which happens if playback is interrupted (e.g. by pausing)
            // This fixes the "The play() request was interrupted by a call to pause()" error.
            if (error.name !== 'AbortError') {
                console.error("Audio play failed:", error);
            }
        }
      }
    }
  };

  const handleClose = () => {
    setIsCardVisible(false);
    
    // Clear any existing interval
    if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
    }

    // Fade out audio
    if (audioRef.current) {
        fadeIntervalRef.current = setInterval(() => {
            if (audioRef.current) {
                if (audioRef.current.volume > 0.05) {
                    audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05);
                } else {
                    if (fadeIntervalRef.current) {
                        clearInterval(fadeIntervalRef.current);
                        fadeIntervalRef.current = null;
                    }
                    audioRef.current.pause();
                    if (audioRef.current.readyState >= 1) {
                        audioRef.current.currentTime = 0;
                    }
                }
            } else {
                if (fadeIntervalRef.current) {
                    clearInterval(fadeIntervalRef.current);
                    fadeIntervalRef.current = null;
                }
            }
        }, 50);
    }

    setTimeout(() => {
        setIsRevealed(false);
    }, 1000);
  };
  
  useEffect(() => {
    if (isRevealed) {
      const cardTimer = setTimeout(() => {
        setIsCardVisible(true);
      }, 300);
      return () => clearTimeout(cardTimer);
    }
  }, [isRevealed]);

  useEffect(() => {
    if (trackingStatus === 'success' || trackingStatus === 'error') {
      const timer = setTimeout(() => {
        setTrackingStatus('idle');
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [trackingStatus]);

  const particles = useMemo(() => {
    if (!isRevealed) return [];
    const count = 75;
    const colors = ['#FFFFFF', '#FFD700', '#ADD8E6', '#E6E6FA'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      style: {
        '--tx': `${(Math.random() - 0.5) * 600}px`,
        '--ty': `${(Math.random() - 0.5) * 600}px`,
        animationDelay: `${Math.random() * 0.3}s`,
        background: colors[Math.floor(Math.random() * colors.length)],
      },
    }));
  }, [isRevealed]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center [perspective:1200px]">
      
      {/* 
          Audio Player using Native HTML5 Fallback.
          Prioritizing the 'audio/music.mp3' path as specified by the user.
      */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
      >
          {/* Priority 1: GitHub 'audio/music.mp3' (User specified path) via CDN */}
          <source src="https://cdn.jsdelivr.net/gh/skype8067-afk/muixcsaqwwd@main/audio/music.mp3" type="audio/mpeg" />
          <source src="https://cdn.jsdelivr.net/gh/skype8067-afk/muixcsaqwwd@master/audio/music.mp3" type="audio/mpeg" />
          
          {/* Priority 2: Raw GitHub Links (Backup for CDN) */}
          <source src="https://raw.githubusercontent.com/skype8067-afk/muixcsaqwwd/main/audio/music.mp3" type="audio/mpeg" />
          <source src="https://raw.githubusercontent.com/skype8067-afk/muixcsaqwwd/master/audio/music.mp3" type="audio/mpeg" />

          {/* Priority 3: Root folder checks (Just in case) */}
          <source src="https://cdn.jsdelivr.net/gh/skype8067-afk/muixcsaqwwd@main/music.mp3" type="audio/mpeg" />
          <source src="https://cdn.jsdelivr.net/gh/skype8067-afk/muixcsaqwwd@master/music.mp3" type="audio/mpeg" />
          
          {/* Priority 4: Google Drive Backup */}
          <source src="https://drive.google.com/uc?export=download&id=1jysi8M6PWEe9PGZpH1tFhbHYwCqgFrqY&confirm=t" />

          {/* Fallback: Classical */}
          <source src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Classical_Sampler/Kevin_MacLeod_-_Gymnopedie_No_1.mp3" type="audio/mp3" />
      </audio>

       <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
         <button
           onClick={handleReveal}
           aria-label="Open invitation"
           disabled={isRevealed}
           className="flex flex-col items-center justify-center cursor-pointer group animate-pulse"
         >
           <img
             src="https://i.postimg.cc/0QmHKt82/Generated-Image-November-17-2025-7-08PM.png"
             alt="Invitation Seal"
             className="w-48 h-48 object-cover rounded-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
           />
         </button>
       </div>

      {isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full w-2 h-2 animate-cosmic-explode"
                    style={p.style}
                />
            ))}
        </div>
      )}

      <div
        className={`relative w-full max-w-md bg-transparent rounded-lg shadow-2xl transition-all duration-1000 ease-out ${
          isCardVisible
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <img 
            src="https://i.postimg.cc/ZRjqrLYD/sa.jpg"
            alt="Wedding Invitation"
            className="w-full h-auto object-contain rounded-lg"
        />
        {isCardVisible && (
            <button
              onClick={handleClose}
              aria-label="Close invitation"
              className="absolute top-4 right-4 text-gray-800 bg-white/70 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
        )}
      </div>

      <div
        aria-live="polite"
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-50 ${
          trackingStatus === 'success' || trackingStatus === 'error'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-5 pointer-events-none'
        }`}
      >
        {trackingStatus === 'success' && (
          <div className="flex items-center gap-3 bg-green-100 text-green-800 text-sm font-semibold px-4 py-3 rounded-lg shadow-md border border-green-200">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Response has been recorded. Thank you!</span>
          </div>
        )}
        {trackingStatus === 'error' && (
           <div className="flex items-center gap-3 bg-red-100 text-red-800 text-sm font-semibold px-4 py-3 rounded-lg shadow-md border border-red-200">
             <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <span>Could not record visit. A client-side error occurred.</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default Invitation;
