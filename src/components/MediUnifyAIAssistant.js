import React, { useState, useEffect, useRef } from 'react';
import './MediUnifyAIAssistant.css';
import mediunifyLogo from '../assets/logo.png';

/**
 * MediUnifyAIAssistant - Polished Healthcare AI Assistant Animation
 * 
 * Features:
 * - 100% visually consistent with MediUnify dual-figure + medical cross emblem identity
 * - Initial state with subtle teal aura
 * - Gentle activation transition (scale 0.96 -> 1.0)
 * - Calming floating/breathing animation
 * - Soft pulsing glowing eyes with natural blinking cycles
 * - Elegant friendly waving hand motion with gentle motion ripple
 * - Healthcare-themed speech bubble with smooth typing effect: "Hi! How can I assist you?"
 * - Responsive design (desktop & mobile friendly)
 * - Interactive click/tap handler invoking onAssistantOpen callback
 */
export default function MediUnifyAIAssistant({
  onAssistantOpen,
  greetingText = "Hi! How can I assist you?",
  showSpeechBubble = true,
  variant = 'compact', // 'compact' | 'hero' | 'floating' | 'card'
  className = '',
  logoSrc = mediunifyLogo,
  useVectorRobot = true, // uses animated SVG robot for fine-grained eye blinking & waving hand
  autoGreet = true
}) {
  const [isActive, setIsActive] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const typingTimeoutRef = useRef(null);
  const blinkIntervalRef = useRef(null);

  // Animation timeline progression
  useEffect(() => {
    if (!autoGreet) {
      setIsActive(true);
      return;
    }

    // 1. Robot activation after brief delay (400ms)
    const activateTimer = setTimeout(() => {
      setIsActive(true);
    }, 400);

    // 2. Greeting hand wave + Speech bubble reveal (1000ms)
    const waveTimer = setTimeout(() => {
      setIsWaving(true);
      if (showSpeechBubble) {
        setBubbleVisible(true);
        startTypingAnimation(greetingText);
      }
    }, 1100);

    // Stop waving gesture after greeting cycle (2800ms)
    const stopWaveTimer = setTimeout(() => {
      setIsWaving(false);
    }, 3200);

    return () => {
      clearTimeout(activateTimer);
      clearTimeout(waveTimer);
      clearTimeout(stopWaveTimer);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [autoGreet, showSpeechBubble, greetingText]);

  // Occasional natural blinking cycle (every 4.5 - 6 seconds)
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    };

    blinkIntervalRef.current = setInterval(() => {
      triggerBlink();
      // Optional double blink occasionally
      if (Math.random() > 0.6) {
        setTimeout(triggerBlink, 320);
      }
    }, 4800);

    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    };
  }, []);

  // Smooth typing effect for speech bubble
  const startTypingAnimation = (text) => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        // Natural varied typing cadence
        const char = text[index - 1];
        const delay = char === '!' || char === ',' || char === '?' ? 180 : 38;
        typingTimeoutRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();
  };

  // User interaction (click/tap)
  const handleClick = (e) => {
    e.stopPropagation();
    setIsClicked(true);
    setIsWaving(true);

    setTimeout(() => {
      setIsClicked(false);
      setIsWaving(false);
    }, 1200);

    if (showSpeechBubble && !bubbleVisible) {
      setBubbleVisible(true);
      startTypingAnimation(greetingText);
    } else if (showSpeechBubble && !isTyping) {
      startTypingAnimation(greetingText);
    }

    if (typeof onAssistantOpen === 'function') {
      onAssistantOpen();
    }
  };

  return (
    <div 
      className={`mediunify-ai-container ${variant} ${isActive ? 'is-active' : ''} ${className}`}
      data-testid="mediunify-ai-assistant"
    >
      {/* Interactive Robot Avatar wrapper */}
      <div 
        className={`mediunify-ai-robot-wrapper ${isClicked ? 'is-clicked' : ''}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="MediUnify AI Assistant - Click to chat"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e);
          }
        }}
      >
        {/* Soft Ambient Teal Glow Aura */}
        <div className="mediunify-ai-glow-ring" />

        {/* Vector Robot (Maintains exact MediUnify Identity with animated eyes and waving gesture) */}
        {useVectorRobot ? (
          <div className="mediunify-robot-svg-container">
            <svg
              viewBox="0 0 120 110"
              className={`mediunify-robot-svg ${isWaving ? 'is-waving' : ''}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Brand Teal Gradient */}
                <linearGradient id="aiTealGrad" x1="20" y1="15" x2="60" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00D2C4" />
                  <stop offset="50%" stopColor="#00A896" />
                  <stop offset="100%" stopColor="#028090" />
                </linearGradient>

                {/* Brand Navy Gradient */}
                <linearGradient id="aiNavyGrad" x1="60" y1="15" x2="100" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="50%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>

                {/* Eye Glow Filter */}
                <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Cross Glow Filter */}
                <filter id="crossGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* === RIGHT FIGURE (Navy Body) === */}
              <path
                d="M60 52L67 41C69 36 74 32 80 32C88 32 94 38 94 46V85C94 88 92 90 89 90C86 90 84 88 84 85V48C84 44 81 41 77 41C74 41 71 43 70 46L60 68L50 46C49 43 46 41 43 41C39 41 36 44 36 48V85C36 88 34 90 31 90C28 90 26 88 26 85V46C26 38 32 32 40 32C46 32 51 36 53 41L60 52Z"
                fill="url(#aiNavyGrad)"
                className="mediunify-torso-navy"
              />

              {/* === LEFT FIGURE (Teal Body) === */}
              <path
                d="M26 85V46C26 38 32 32 40 32C44 32 47 34 49 37L40 43V85C40 88 38 90 35 90C32 90 26 88 26 85Z"
                fill="url(#aiTealGrad)"
                className="mediunify-torso-teal"
              />

              {/* === LEFT HEAD (Teal with glowing friendly AI eyes) === */}
              <g className="mediunify-head-teal">
                <circle cx="34" cy="18" r="9.5" fill="#00D2C4" />
                {/* Glowing AI Visor / Eyes on left head */}
                <g className={`mediunify-ai-eyes ${isBlinking ? 'is-blinking' : ''}`} filter="url(#eyeGlow)">
                  <ellipse cx="32" cy="17.5" rx="1.5" ry={isBlinking ? "0.2" : "1.8"} fill="#FFFFFF" />
                  <ellipse cx="36.5" cy="17.5" rx="1.5" ry={isBlinking ? "0.2" : "1.8"} fill="#FFFFFF" />
                </g>
              </g>

              {/* === RIGHT HEAD (Navy with glowing friendly AI eyes) === */}
              <g className="mediunify-head-navy">
                <circle cx="86" cy="18" r="9.5" fill="#1E3A8A" />
                {/* Glowing AI Visor / Eyes on right head */}
                <g className={`mediunify-ai-eyes ${isBlinking ? 'is-blinking' : ''}`} filter="url(#eyeGlow)">
                  <ellipse cx="83.5" cy="17.5" rx="1.5" ry={isBlinking ? "0.2" : "1.8"} fill="#60A5FA" />
                  <ellipse cx="88" cy="17.5" rx="1.5" ry={isBlinking ? "0.2" : "1.8"} fill="#60A5FA" />
                </g>
              </g>

              {/* === WAVING ARM / HAND (Left arm gentle greeting gesture) === */}
              <g className={`mediunify-waving-arm ${isWaving ? 'animate-wave' : ''}`}>
                {/* Greeting hand wave motion rings */}
                {isWaving && (
                  <g className="mediunify-wave-sparkles">
                    <path
                      d="M12 28 C10 24, 10 18, 14 14"
                      stroke="#00D2C4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <path
                      d="M8 32 C6 24, 6 16, 12 10"
                      stroke="#00D2C4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </g>
                )}
                {/* Raised wave indicator on the left figure */}
                <circle cx="20" cy="30" r="4.5" fill="#00D2C4" opacity={isWaving ? "1" : "0.7"} />
              </g>

              {/* === MEDICAL CROSS EMBLEM (Center heart of MediUnify) === */}
              <g className="mediunify-center-cross">
                <circle cx="60" cy="74" r="14" fill="#FFFFFF" className="mediunify-cross-plate" />
                <g filter="url(#crossGlow)">
                  <rect x="57" y="66" width="6" height="16" rx="3" fill="#00C49F" />
                  <rect x="52" y="71" width="16" height="6" rx="3" fill="#00C49F" />
                </g>
              </g>
            </svg>
          </div>
        ) : (
          /* Fallback / Direct Image mode if specified */
          <div className="mediunify-image-robot-container">
            <img 
              src={logoSrc} 
              alt="MediUnify AI Assistant" 
              className="mediunify-image-robot"
              onError={(e) => {
                // If static logo asset fails, fallback gracefully
                e.target.style.display = 'none';
              }}
            />
            {/* Overlay pulsing eyes */}
            <div className={`mediunify-image-eye-overlay ${isBlinking ? 'is-blinking' : ''}`} />
          </div>
        )}

        {/* Live Status Badge */}
        <div className="mediunify-status-indicator" title="MediUnify AI Assistant Active">
          <span className="mediunify-status-dot" />
          <span className="mediunify-status-pulse" />
        </div>
      </div>

      {/* Modern Healthcare Speech Bubble */}
      {showSpeechBubble && bubbleVisible && (
        <div 
          className="mediunify-speech-bubble"
          role="region"
          aria-live="polite"
          onClick={handleClick}
        >
          {/* Healthcare AI badge */}
          <div className="mediunify-bubble-header">
            <div className="mediunify-bubble-tag">
              <span className="mediunify-bubble-sparkle">✦</span> MediUnify AI
            </div>
            <span className="mediunify-bubble-time">Now</span>
          </div>

          {/* Typing Text Content */}
          <div className="mediunify-bubble-text">
            {displayedText}
            {isTyping && <span className="mediunify-typing-cursor">|</span>}
          </div>

          {/* Speech Bubble Arrow Tail pointing towards robot */}
          <div className="mediunify-bubble-arrow" />
        </div>
      )}
    </div>
  );
}
