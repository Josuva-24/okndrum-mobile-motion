import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import animalsSet from '@/assets/animals-set.jpg';
import vehiclesSet from '@/assets/vehicles-set.jpg';
import shapesSet from '@/assets/shapes-set.jpg';
import spaceSet from '@/assets/space-set.jpg';
import foodSet from '@/assets/food-set.jpg';
import musicSet from '@/assets/music-set.jpg';

interface OKNDrumProps {
  speed: number;
  stripColor: string;
  stripSize: number;
  pattern: 'strips' | 'animals' | 'vehicles' | 'shapes' | 'space' | 'food' | 'music' | 'custom';
  customImages?: string[];
  direction: 'horizontal' | 'vertical';
  isRunning: boolean;
}

const imagePatterns = {
  animals: animalsSet,
  vehicles: vehiclesSet,
  shapes: shapesSet,
  space: spaceSet,
  food: foodSet,
  music: musicSet
};

const OKNDrum: React.FC<OKNDrumProps> = ({
  speed,
  stripColor,
  stripSize,
  pattern,
  customImages = [],
  direction,
  isRunning
}) => {
  const [animationOffset, setAnimationOffset] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimeRef.current) {
        const deltaTime = timestamp - lastTimeRef.current;
        const movement = (speed * deltaTime) / 16.67; // Normalize to 60fps
        setAnimationOffset(prev => (prev + movement) % (stripSize * 2));
      }
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, speed, stripSize]);

  const renderStrips = () => {
    const strips = [];
    const numStrips = direction === 'horizontal' ? 
      Math.ceil(window.innerWidth / stripSize) + 2 : 
      Math.ceil(window.innerHeight / stripSize) + 2;

    for (let i = 0; i < numStrips; i++) {
      const offset = direction === 'horizontal' ? 
        `translateX(${(i * stripSize * 2) - animationOffset}px)` :
        `translateY(${(i * stripSize * 2) - animationOffset}px)`;

      strips.push(
        <div
          key={i}
          className="absolute"
          style={{
            transform: offset,
            [direction === 'horizontal' ? 'width' : 'height']: `${stripSize}px`,
            [direction === 'horizontal' ? 'height' : 'width']: '100%',
            backgroundColor: i % 2 === 0 ? stripColor : 'transparent',
            borderRight: direction === 'horizontal' && i % 2 === 1 ? `${stripSize}px solid ${stripColor}` : 'none',
            borderBottom: direction === 'vertical' && i % 2 === 1 ? `${stripSize}px solid ${stripColor}` : 'none'
          }}
        />
      );
    }
    return strips;
  };

  const renderImagePattern = () => {
    const patternImage = imagePatterns[pattern as keyof typeof imagePatterns];
    if (!patternImage) return null;

    const numTiles = direction === 'horizontal' ? 
      Math.ceil(window.innerWidth / stripSize) + 2 : 
      Math.ceil(window.innerHeight / stripSize) + 2;

    const tiles = [];
    for (let i = 0; i < numTiles; i++) {
      const offset = direction === 'horizontal' ? 
        `translateX(${(i * stripSize) - animationOffset}px)` :
        `translateY(${(i * stripSize) - animationOffset}px)`;

      tiles.push(
        <div
          key={i}
          className="absolute"
          style={{
            transform: offset,
            width: direction === 'horizontal' ? `${stripSize}px` : '100%',
            height: direction === 'vertical' ? `${stripSize}px` : '100%',
            backgroundImage: `url(${patternImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'hsl(var(--background))'
          }}
        />
      );
    }
    return tiles;
  };

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden bg-background",
      "shadow-drum rounded-lg"
    )}>
      <div className="absolute inset-0 bg-gradient-drum opacity-20 pointer-events-none" />
      
      {pattern === 'strips' ? renderStrips() : renderImagePattern()}
      
      {/* Center focus point */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-accent rounded-full shadow-control animate-pulse" />
      </div>
    </div>
  );
};

export default OKNDrum;