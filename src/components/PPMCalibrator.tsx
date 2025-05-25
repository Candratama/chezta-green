import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

interface PPMCalibratorProps {
  onCalibrate: (value: number) => void;
}

const PPMCalibrator: React.FC<PPMCalibratorProps> = ({ onCalibrate }) => {
  const { ppmCalibrator, setPPMPreset, setPPMValue, setPPMStatus, setPPMWaiting } = useStore();
  const { selectedPreset, ppmValue, status, waiting } = ppmCalibrator;

  const presets = ['LETTUCE', 'TOMATOES', 'HERBS', 'CUSTOM'];
  const ppmRanges = {
    'LETTUCE': '500 - 1000 PPM',
    'TOMATOES': '1000 - 1500 PPM',
    'HERBS': '700 - 1200 PPM',
    'CUSTOM': 'Custom Range'
  };

  const handleCalibrate = () => {
    setPPMWaiting(true);
    setTimeout(() => {
      setPPMWaiting(false);
      onCalibrate(ppmValue);
    }, 10000);
  };

  const handlePrevPreset = () => {
    const currentIndex = presets.indexOf(selectedPreset);
    setPPMPreset(presets[(currentIndex - 1 + presets.length) % presets.length]);
  };

  const handleNextPreset = () => {
    const currentIndex = presets.indexOf(selectedPreset);
    setPPMPreset(presets[(currentIndex + 1) % presets.length]);
  };

  return (
    <div className="neumorphic p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-600">PPM Calibrator</h3>
      </div>

      <div className="neumorphic-inset p-3">
        <div className="flex items-center justify-between">
          <ChevronLeft 
            className="w-5 h-5 text-neutral-500 cursor-pointer" 
            onClick={handlePrevPreset}
          />
          <span className="text-sm font-medium text-neutral-700">{selectedPreset}</span>
          <ChevronRight 
            className="w-5 h-5 text-neutral-500 cursor-pointer"
            onClick={handleNextPreset}
          />
        </div>
        <div className="text-xs text-neutral-500 text-center mt-1">
          {ppmRanges[selectedPreset]}
        </div>
      </div>

      <div className="space-y-2">
        <div className="neumorphic-inset p-3 flex justify-between items-center">
          <span className="text-xs text-neutral-600">PPM Set</span>
          <div className="seven-segment text-lg text-neutral-700">{ppmValue}</div>
        </div>

        <div className="neumorphic-inset p-3 flex justify-between items-center">
          <span className="text-xs text-neutral-600">Status</span>
          <div className="seven-segment text-lg text-primary-500">{status}</div>
        </div>
      </div>

      <div className="neumorphic-inset p-3">
        <div className="seven-segment text-3xl text-center text-neutral-800">
          {ppmValue}
        </div>
        <div className="text-xs text-neutral-500 text-center mt-1">PPM</div>
      </div>

      <button
        onClick={handleCalibrate}
        disabled={waiting}
        className={`w-full neumorphic-button p-3 text-sm ${
          waiting ? 'text-amber-500' : 'text-primary-600'
        } text-center`}
      >
        {waiting ? 'Wait for stable (0:10 sec)' : 'Calibrate'}
      </button>
    </div>
  );
};

export default PPMCalibrator;