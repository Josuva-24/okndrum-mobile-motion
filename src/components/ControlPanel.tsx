import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  stripColor: string;
  onStripColorChange: (color: string) => void;
  stripSize: number;
  onStripSizeChange: (size: number) => void;
  pattern: string;
  onPatternChange: (pattern: string) => void;
  direction: 'horizontal' | 'vertical';
  onDirectionChange: (direction: 'horizontal' | 'vertical') => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
}

const colorPresets = [
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f97316' }
];

const patternOptions = [
  { name: 'Classic Strips', value: 'strips' },
  { name: 'Animals', value: 'animals' },
  { name: 'Vehicles', value: 'vehicles' },
  { name: 'Shapes', value: 'shapes' },
  { name: 'Space', value: 'space' },
  { name: 'Food', value: 'food' },
  { name: 'Music', value: 'music' }
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  speed,
  onSpeedChange,
  stripColor,
  onStripColorChange,
  stripSize,
  onStripSizeChange,
  pattern,
  onPatternChange,
  direction,
  onDirectionChange,
  isRunning,
  onToggleRunning,
  onReset
}) => {
  return (
    <Card className="bg-gradient-medical shadow-medical border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
          OKN Drum Controls
          <Badge variant="secondary" className="text-xs">
            {direction === 'horizontal' ? 'Horizontal' : 'Vertical'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Playback Controls */}
        <div className="flex gap-2">
          <Button
            onClick={onToggleRunning}
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2 shadow-control"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 shadow-control"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Speed: {speed}x
          </label>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={0.1}
            max={5}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Strip Size Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Strip Size: {stripSize}px
          </label>
          <Slider
            value={[stripSize]}
            onValueChange={(value) => onStripSizeChange(value[0])}
            min={20}
            max={200}
            step={10}
            className="w-full"
          />
        </div>

        {/* Pattern Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Pattern</label>
          <Select value={pattern} onValueChange={onPatternChange}>
            <SelectTrigger className="shadow-control">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {patternOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Selection (only for strips) */}
        {pattern === 'strips' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colorPresets.map((color) => (
                <Button
                  key={color.value}
                  onClick={() => onStripColorChange(color.value)}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 shadow-control",
                    stripColor === color.value && "ring-2 ring-primary"
                  )}
                  style={{ backgroundColor: color.value, color: color.value === '#000000' ? 'white' : 'inherit' }}
                >
                  {color.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Direction Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onDirectionChange('horizontal')}
              variant={direction === 'horizontal' ? 'default' : 'outline'}
              size="sm"
              className="shadow-control"
            >
              Horizontal
            </Button>
            <Button
              onClick={() => onDirectionChange('vertical')}
              variant={direction === 'vertical' ? 'default' : 'outline'}
              size="sm"
              className="shadow-control"
            >
              Vertical
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;