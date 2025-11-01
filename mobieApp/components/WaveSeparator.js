import React from 'react';
import Svg, { Path } from 'react-native-svg';

const WaveSeparator = ({ color = '#FFFFFF' }) => {
  return (
    <Svg
      width="100%"
      height="60"
      viewBox="0 0 375 60"
      style={{ position: 'absolute', bottom: 0 }}
      preserveAspectRatio="none"
    >
      <Path
        d="M0,30 Q93.75,10 187.5,30 T375,30 L375,60 L0,60 Z"
        fill={color}
      />
    </Svg>
  );
};

export default WaveSeparator;

