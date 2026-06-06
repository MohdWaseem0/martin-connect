'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', iconOnly = false, light = false, size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: { width: 110, height: 45 },
    md: { width: 160, height: 65 },
    lg: { width: 220, height: 90 },
    xl: { width: 300, height: 120 },
  };

  const dimensions = sizeMap[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      <Image
        src="/logo.png"
        alt="Martin Connect"
        width={dimensions.width}
        height={dimensions.height}
        priority
        style={{ width: 'auto', height: 'auto' }}
      />
    </div>
  );
}
