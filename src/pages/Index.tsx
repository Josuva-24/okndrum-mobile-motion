import React, { useState, useEffect } from 'react';
import OKNDrum from '@/components/OKNDrum';
import ControlPanel from '@/components/ControlPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [speed, setSpeed] = useState(1.0);
  const [stripColor, setStripColor] = useState('#000000');
  const [stripSize, setStripSize] = useState(60);
  const [pattern, setPattern] = useState('strips');
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isRunning, setIsRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Mobile detection and orientation handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        const isLandscape = window.innerWidth > window.innerHeight;
        const newDirection = isLandscape ? 'horizontal' : 'vertical';
        
        if (isMobile && direction !== newDirection) {
          setDirection(newDirection);
          toast({
            title: "Orientation Changed",
            description: `Direction switched to ${newDirection} for mobile viewing`,
          });
        }
      }, 100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile, direction, toast]);

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? "OKN Drum Stopped" : "OKN Drum Started",
      description: isRunning ? "Animation paused" : "Eye tracking pattern activated",
    });
  };

  const handleReset = () => {
    setSpeed(1.0);
    setStripColor('#000000');
    setStripSize(60);
    setPattern('strips');
    setDirection('horizontal');
    setIsRunning(false);
    toast({
      title: "Settings Reset",
      description: "All controls returned to default values",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-medical p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            OKN Drum
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Optokinetic Nystagmus Testing Tool - Professional Eye Movement Assessment
          </p>
        </div>

        {/* Main Layout */}
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
          {/* Control Panel */}
          <div className={`${isMobile ? 'order-2' : 'lg:col-span-1'}`}>
            <ControlPanel
              speed={speed}
              onSpeedChange={setSpeed}
              stripColor={stripColor}
              onStripColorChange={setStripColor}
              stripSize={stripSize}
              onStripSizeChange={setStripSize}
              pattern={pattern}
              onPatternChange={setPattern}
              direction={direction}
              onDirectionChange={setDirection}
              isRunning={isRunning}
              onToggleRunning={handleToggleRunning}
              onReset={handleReset}
            />
          </div>

          {/* OKN Drum Display */}
          <div className={`${isMobile ? 'order-1' : 'lg:col-span-3'}`}>
            <div 
              className="w-full bg-card rounded-lg shadow-drum"
              style={{ 
                height: isMobile ? '60vh' : '80vh',
                minHeight: '400px'
              }}
            >
              <OKNDrum
                speed={speed}
                stripColor={stripColor}
                stripSize={stripSize}
                pattern={pattern as any}
                direction={direction}
                isRunning={isRunning}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {isMobile 
              ? "Rotate device to change strip direction • Use controls below to customize" 
              : "Professional OKN testing tool • Adjust settings and press Start to begin"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;