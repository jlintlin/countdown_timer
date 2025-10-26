import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Volume2, VolumeX, Check, Play } from 'lucide-react';
import { 
  SOUND_OPTIONS, 
  SoundPlayer, 
  getSoundPreference, 
  setSoundPreference,
  getVolumePreference,
  setVolumePreference,
} from '../utils/soundUtils';

interface SoundPickerProps {
  onSoundChange?: (soundId: string) => void;
  onVolumeChange?: (volume: number) => void;
}

export function SoundPicker({ onSoundChange, onVolumeChange }: SoundPickerProps) {
  const [selectedSound, setSelectedSound] = useState(() => getSoundPreference());
  const [volume, setVolume] = useState(() => getVolumePreference());
  const [soundPlayer] = useState(() => new SoundPlayer());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      soundPlayer.cleanup();
    };
  }, [soundPlayer]);

  const handleSoundSelect = (soundId: string) => {
    setSelectedSound(soundId);
    setSoundPreference(soundId);
    onSoundChange?.(soundId);
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    setVolumePreference(newVolume);
    onVolumeChange?.(newVolume);
  };

  const handlePreview = (soundId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundPlayer.playSound(soundId, volume);
  };

  const selectedSoundOption = SOUND_OPTIONS.find(s => s.id === selectedSound);
  const isMuted = volume === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isMuted ? 'Unmute and configure sound' : 'Configure sound'}
          title={selectedSoundOption?.name || 'Sound settings'}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Completion Sound</Label>
            <div className="grid gap-2">
              {SOUND_OPTIONS.map((sound) => (
                <div
                  key={sound.id}
                  className={`
                    flex items-center justify-between p-3 rounded-md border transition-colors
                    ${selectedSound === sound.id 
                      ? 'border-primary bg-accent' 
                      : 'border-border hover:bg-accent/50'
                    }
                  `}
                >
                  <button
                    onClick={() => handleSoundSelect(sound.id)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sound.name}</span>
                      {selectedSound === sound.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{sound.description}</p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-2 flex-shrink-0"
                    onClick={(e) => handlePreview(sound.id, e)}
                    aria-label={`Preview ${sound.name}`}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label>Volume</Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
