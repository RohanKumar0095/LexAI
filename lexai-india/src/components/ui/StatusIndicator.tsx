import React from 'react';

export type StatusType = 'ai-active' | 'verified' | 'emergency' | 'saffron';

export interface StatusIndicatorProps {
  type?: StatusType;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type = 'ai-active',
  label,
  className = '',
}) => {
  const configs: Record<StatusType, { color: string; ring: string; defaultLabel: string }> = {
    'ai-active': {
      color: 'bg-electric',
      ring: 'bg-electric',
      defaultLabel: 'LexAI Processing',
    },
    verified: {
      color: 'bg-emerald',
      ring: 'bg-emerald',
      defaultLabel: 'Verified Legal Source',
    },
    emergency: {
      color: 'bg-crimson',
      ring: 'bg-crimson',
      defaultLabel: 'SOS Emergency Mode Active',
    },
    saffron: {
      color: 'bg-saffron',
      ring: 'bg-saffron',
      defaultLabel: 'Daily Legal Insight',
    },
  };

  const config = configs[type];
  const displayLabel = label || config.defaultLabel;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-midnight-surface/60 border border-midnight-border ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.ring}`}></span>
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color}`}></span>
      </span>
      {displayLabel && (
        <span className="text-xs font-medium text-text-secondary tracking-tight">{displayLabel}</span>
      )}
    </div>
  );
};
