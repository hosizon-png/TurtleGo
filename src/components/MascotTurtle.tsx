import React from 'react';

interface MascotTurtleProps {
  pose: 'walking' | 'waving' | 'confused' | 'joy' | 'avatar' | 'hologram';
  className?: string;
  size?: number;
}

export default function MascotTurtle({ pose, className = '', size = 180 }: MascotTurtleProps) {
  // Brand Color Palette from Handbook (aligned with user's customized high-contrast palette)
  const colors = {
    green: '#76E212',      // Primary Lime Green
    blue: '#008BE3',       // Secondary Vibrant Sky Blue
    yellow: '#FFD13B',     // Explorer Bright Mustard Yellow
    teal: '#2CD5C4',       // Tech Highlights (Teal/Cyan)
    darkGreen: '#1F7E2F',  // Outline & Shadow Green
    outline: '#0A521A',    // Deep Forest Green for clean outlines
    bodyShadow: '#5DBE1A', // Saturated shade for head/body depth
    blush: '#FF95A3',      // Rosy cute blushes
  };

  // Helper Elements to avoid code duplication and maintain premium details
  const renderExplorerHat = (offsetY = 0, scale = 1, tiltAngle = 0) => {
    // Renders the yellow explorer dome + brim + blue GPS Pin Scout Badge
    return (
      <g transform={`translate(0, ${offsetY}) scale(${scale}) rotate(${tiltAngle}, 100, 68)`} id="explorer-hat">
        {/* Hat shadow underneath */}
        <path d="M 60 75 Q 100 87 140 75" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" opacity="0.15" fill="none" />
        
        {/* Yellow Dome */}
        <path d="M 64 71 C 64 26, 136 26, 136 71 Z" fill={colors.yellow} stroke={colors.outline} strokeWidth="5.5" strokeLinejoin="round" />
        
        {/* Hat Ribbon (Teal Band) */}
        <path d="M 64.5 63 C 78 69, 122 69, 135.5 63 L 136.2 71 C 122 76, 78 76, 63.8 71 Z" fill={colors.teal} stroke={colors.outline} strokeWidth="2.5" />
        
        {/* Yellow Brim (Rounded pill shape) */}
        <path 
          d="M 46 68 Q 100 85 154 68 Q 156 75 142 77 Q 100 90 58 77 Q 44 75 46 68 Z" 
          fill={colors.yellow} 
          stroke={colors.outline} 
          strokeWidth="5.5" 
          strokeLinejoin="round" 
        />
        
        {/* Blue Pin / Badge on Left-Front side of standard hat */}
        <g transform="translate(80, 48) scale(1.15)">
          {/* Badge Outline */}
          <path d="M 0 -7 C -4.5 -7, -4.5 -1, 0 6 C 4.5 -1, 4.5 -7, 0 -7 Z" fill="#FFFFFF" stroke={colors.outline} strokeWidth="2.5" />
          {/* Badge Blue Fill */}
          <path d="M 0 -6 C -3.5 -6, -3.5 -1, 0 5 C 3.5 -1, 3.5 -6, 0 -6 Z" fill={colors.blue} />
          {/* White inner GPS Dot */}
          <circle cx="0" cy="-2.5" r="1.3" fill="#FFFFFF" />
        </g>
      </g>
    );
  };

  const renderCuteFace = (eyeExpression: 'normal' | 'happy' | 'wink' | 'closed' | 'confused' = 'normal', mouthExpression: 'smile' | 'wink' | 'unsure' | 'joy' = 'smile') => {
    return (
      <g id="turtle-face">
        {/* Eyebrows */}
        {eyeExpression === 'confused' ? (
          <>
            <path d="M 70 86 Q 77 82 83 89" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 117 92 Q 124 95 130 87" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M 68 86 Q 77 81 86 86" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 114 86 Q 123 81 132 86" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Eye Sockets / Blush circles */}
        <ellipse cx="64" cy="116" rx="8.5" ry="5.5" fill={colors.blush} opacity="0.35" />
        <ellipse cx="136" cy="116" rx="8.5" ry="5.5" fill={colors.blush} opacity="0.35" />

        {/* Eyes Group */}
        {eyeExpression === 'normal' && (
          <>
            {/* Left Eye */}
            <g transform="translate(78, 104)">
              <circle cx="0" cy="0" r="10.5" fill="#22252A" stroke={colors.outline} strokeWidth="1" />
              <circle cx="3.5" cy="-3.5" r="3.5" fill="#FFFFFF" />
              <circle cx="-3" cy="4" r="1.5" fill="#FFFFFF" />
            </g>
            {/* Right Eye */}
            <g transform="translate(122, 104)">
              <circle cx="0" cy="0" r="10.5" fill="#22252A" stroke={colors.outline} strokeWidth="1" />
              <circle cx="3.5" cy="-3.5" r="3.5" fill="#FFFFFF" />
              <circle cx="-3" cy="4" r="1.5" fill="#FFFFFF" />
            </g>
          </>
        )}

        {eyeExpression === 'happy' && (
          <>
            {/* Left Arch Eye */}
            <path d="M 68 107 Q 78 95 88 107" stroke={colors.outline} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Right Arch Eye */}
            <path d="M 112 107 Q 122 95 132 107" stroke={colors.outline} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {eyeExpression === 'wink' && (
          <>
            {/* Left Glossy Eye */}
            <g transform="translate(78, 104)">
              <circle cx="0" cy="0" r="10.5" fill="#22252A" />
              <circle cx="3.5" cy="-3.5" r="3.5" fill="#FFFFFF" />
              <circle cx="-3" cy="4" r="1.5" fill="#FFFFFF" />
            </g>
            {/* Right Wink Arch */}
            <path d="M 113 105 Q 122 113 131 105" stroke={colors.outline} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {eyeExpression === 'closed' && (
          <>
            {/* Left Closed Arch Eye */}
            <path d="M 68 105 Q 78 113 88 105" stroke={colors.outline} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Right Closed Arch Eye */}
            <path d="M 112 105 Q 122 113 132 105" stroke={colors.outline} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {eyeExpression === 'confused' && (
          <>
            {/* Left Confused Wide-Oval Eye */}
            <g transform="translate(78, 104)">
              <ellipse cx="0" cy="0" rx="9.5" ry="10.5" fill="#22252A" stroke={colors.outline} strokeWidth="1" />
              {/* Pupils Dilated Upwards */}
              <circle cx="1.5" cy="-2.5" r="3" fill="#FFFFFF" />
              <circle cx="-1.5" cy="3.5" r="1.2" fill="#FFFFFF" />
            </g>
            {/* Right Confused Oval Eye */}
            <g transform="translate(122, 104)">
              <ellipse cx="0" cy="0" rx="9.5" ry="10.5" fill="#22252A" stroke={colors.outline} strokeWidth="1" />
              {/* Pupils Dilated Upwards */}
              <circle cx="1.5" cy="-2.5" r="3" fill="#FFFFFF" />
              <circle cx="-1.5" cy="3.5" r="1.2" fill="#FFFFFF" />
            </g>
          </>
        )}

        {/* Nostrils (Small subtle dots as in high fidelity characters) */}
        <circle cx="97" cy="111" r="1.2" fill={colors.outline} opacity="0.5" />
        <circle cx="103" cy="111" r="1.2" fill={colors.outline} opacity="0.5" />

        {/* Mouth Expressions */}
        {mouthExpression === 'smile' && (
          <path d="M 92 115 Q 100 122 108 115" stroke={colors.outline} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}
        {mouthExpression === 'joy' && (
          <path d="M 91 114 C 91 114, 93 127, 100 127 C 107 127, 109 114, 109 114 Z" fill="#C53030" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {mouthExpression === 'unsure' && (
          <path d="M 93 118 Q 100 114 107 117" stroke={colors.outline} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}
        {mouthExpression === 'wink' && (
          <path d="M 91 115 Q 100 124 109 115" stroke={colors.outline} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}
      </g>
    );
  };

  const renderCamera = (x = 100, y = 148, sizeScale = 1) => {
    // Renders the camera hanging on a black strap
    return (
      <g id="camera-hanging" transform={`translate(${x - 100}, ${y - 148}) scale(${sizeScale})`}>
        {/* Strap around the neck */}
        <path d="M 74 133 C 74 133, 76 150, 100 150 C 124 150, 126 133, 126 133" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" fill="none" />
        
        {/* Camera body block */}
        <rect x="85" y="142" width="30" height="20" rx="4" fill="#3A3C42" stroke={colors.outline} strokeWidth="3" strokeLinejoin="round" />
        <rect x="91" y="140" width="8" height="3" fill={colors.teal} stroke={colors.outline} strokeWidth="1.5" />
        <circle cx="111" cy="145" r="1.5" fill="#FF5E5E" />

        {/* Beautiful Camera lens ring */}
        <circle cx="100" cy="152" r="7" fill={colors.outline} />
        <circle cx="100" cy="152" r="5" fill="#696D76" />
        <circle cx="102" cy="150" r="2.2" fill="#9AE6FF" />
        <circle cx="98.5" cy="153.5" r="0.8" fill="#FFFFFF" />
      </g>
    );
  };

  const renderBackpack = (x = 65, y = 138, sizeScale = 1) => {
    return (
      <g id="yellow-backpack" transform={`translate(${x - 65}, ${y - 138}) scale(${sizeScale})`}>
        {/* Round Yellow backpack bulk protruding from back */}
        <circle cx="62" cy="144" r="20" fill={colors.yellow} stroke={colors.outline} strokeWidth="3.5" />
        {/* Backpack pocket/zipper pocket */}
        <path d="M 44 140 A 18 18 0 0 0 68 160" stroke={colors.outline} strokeWidth="3" fill="none" />
        <circle cx="50" cy="136" r="3" fill={colors.blue} stroke={colors.outline} strokeWidth="1.5" />
      </g>
    );
  };

  const renderBlueBackpack = (x = 65, y = 138, sizeScale = 1) => {
    return (
      <g id="blue-backpack" transform={`translate(${x - 65}, ${y - 138}) scale(${sizeScale})`}>
        {/* Blue backpack body */}
        <circle cx="62" cy="144" r="22" fill={colors.blue} stroke={colors.outline} strokeWidth="3.5" />
        
        {/* Yellow bedroll on top of backpack */}
        <g transform="translate(68, 116) rotate(10)">
          <rect x="-10" y="-12" width="20" height="24" rx="4" fill={colors.yellow} stroke={colors.outline} strokeWidth="3.5" />
          {/* Roll lines */}
          <circle cx="0" cy="0" r="3" fill="none" stroke={colors.outline} strokeWidth="1.5" />
          <line x1="-10" y1="5" x2="10" y2="5" stroke={colors.outline} strokeWidth="2" />
          <line x1="-10" y1="-5" x2="10" y2="-5" stroke={colors.outline} strokeWidth="2" />
        </g>
        
        {/* Paper maps sticking out from side pocket */}
        <path d="M 45 130 C 40 120, 36 102, 42 100 C 44 99, 48 111, 48 115" stroke={colors.outline} strokeWidth="2.5" fill="#FFFFFF" />
        <path d="M 52 132 C 48 122, 44 105, 50 103 C 52 102, 56 114, 56 118" stroke={colors.outline} strokeWidth="2.5" fill="#E4F7D4" />
      </g>
    );
  };

  // Base SVG structure container centered on 200x200 canvas
  return (
    <svg 
      className={`select-none shrink-0 ${className} transition-all duration-300`} 
      width={size} 
      height={size} 
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`TurtleGo Mascot - ${pose}`}
    >
      <defs>
        <linearGradient id="hologram-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4DE0F4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2D8BFF" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="shine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Dynamic Render according to selected user pose */}
      {pose === 'avatar' && (
        <g id="avatar-pose">
          {/* Circular badge background frame for pristine profile integration */}
          <circle cx="100" cy="100" r="94" fill="none" />
          
          {/* Turtle head background contour shadow */}
          <ellipse cx="100" cy="114" rx="46" ry="41" fill={colors.bodyShadow} opacity="0.3" transform="translate(0, 4)" />
          
          {/* Main head outline */}
          <ellipse cx="100" cy="115" rx="45" ry="40" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" />
          
          {/* Cheesy cheeks and details */}
          {renderCuteFace('normal', 'smile')}
          
          {/* Explorer Hat layered perfectly on top */}
          {renderExplorerHat(42, 1.05, 0)}
        </g>
      )}

      {pose === 'walking' && (
        <g id="walking-traveler-pose">
          {/* Ground shadow beneath feet */}
          <ellipse cx="100" cy="188" rx="55" ry="10" fill="#2E7E59" opacity="0.18" />

          {/* Yellow Backpack visible behind body */}
          {renderBackpack(56, 134, 1.05)}

          {/* Left Foot walking backwards */}
          <path d="M 75 174 L 66 186 C 66 186, 68 191, 76 188 C 84 185, 87 176, 87 176" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinejoin="round" />
          
          {/* Right Foot stepping forward */}
          <path d="M 112 174 L 118 189 C 118 189, 126 191, 129 184 C 132 177, 123 172, 123 172" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

          {/* Turtle Shell Body background contour */}
          <path d="M 72 135 C 64 150, 70 178, 100 178 C 130 178, 136 150, 128 135 Z" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" strokeLinejoin="round" />
          {/* Belly armor plate (light yellow-green segment) */}
          <path d="M 82 144 C 80 152, 85 172, 100 172 C 115 172, 120 152, 118 144 C 118 144, 100 148, 82 144 Z" fill="#E4F7D4" stroke={colors.outline} strokeWidth="2.5" />

          {/* Left hand swinging / relaxed */}
          <path d="M 66 142 L 52 158 C 50 162, 54 167, 58 163 L 70 148" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinecap="round" />

          {/* Right arm holding a mini GPS Map */}
          <g id="traveler-map" transform="translate(118, 140)">
            {/* Green arm stretching to map */}
            <path d="M 0 10 L 22 17 C 24 13, 22 2, 18 2 L 0 5" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* The Paper Trip Map */}
            <path d="M 12 -4 L 14 26 L 36 21 L 33 -9 Z" fill="#FFFFFF" stroke={colors.outline} strokeWidth="3" strokeLinejoin="round" />
            {/* Fold lines and blue trail dots on map */}
            <path d="M 13 11 C 18 12, 22 4, 28 12 Q 33 2, 35 12" stroke={colors.blue} strokeWidth="2" strokeDasharray="3 1.5" strokeLinecap="round" fill="none" />
            {/* Tiny blue pin on map */}
            <circle cx="28" cy="12" r="2.5" fill="#FF5E5E" />
          </g>

          {/* Cute Camera around Neck */}
          {renderCamera(100, 158, 1)}

          {/* Head group (Tilted slightly forward) */}
          <g transform="translate(0, 6) rotate(1, 100, 115)">
            <ellipse cx="100" cy="112" rx="41" ry="36" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" />
            {renderCuteFace('normal', 'wink')}
            {renderExplorerHat(40, 0.98, 1)}
          </g>
        </g>
      )}

      {pose === 'waving' && (
        <g id="waving-greeting-pose">
          {/* Ground shadow */}
          <ellipse cx="100" cy="188" rx="55" ry="10" fill="#2E7E59" opacity="0.18" />

          {/* Left backpack visible */}
          {renderBackpack(64, 134, 1)}

          {/* Feet grounded static */}
          <ellipse cx="80" cy="182" rx="10" ry="7" fill={colors.bodyShadow} opacity="0.5" />
          <ellipse cx="120" cy="182" rx="10" ry="7" fill={colors.bodyShadow} opacity="0.5" />
          <path d="M 72 176 L 70 186 C 70 188, 86 188, 84 176" fill={colors.green} stroke={colors.outline} strokeWidth="4" />
          <path d="M 128 176 L 130 186 C 130 188, 114 188, 116 176" fill={colors.green} stroke={colors.outline} strokeWidth="4" />

          {/* Rounded Body shell */}
          <path d="M 73 133 C 65 148, 71 176, 100 176 C 129 176, 135 148, 127 133 Z" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M 83 142 C 81 149, 85 169, 100 169 C 115 169, 119 149, 117 142" fill="#E4F7D4" stroke={colors.outline} strokeWidth="2.5" />

          {/* Left Hand resting down */}
          <path d="M 71 138 L 56 156 L 62 161 L 74 144" fill={colors.green} stroke={colors.outline} strokeWidth="3.5" strokeLinejoin="round" />

          {/* Right Hand up high waving happily! */}
          <path d="M 126 138 Q 148 116 152 108 C 154 104, 146 95, 140 102 L 126 130" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinecap="round" />
          
          {/* Motion marks near waving hand */}
          <path d="M 152 98 Q 158 98 160 104" stroke={colors.blue} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 148 91 Q 156 94 156 100" stroke={colors.blue} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />

          {/* Hanging camera details */}
          {renderCamera(100, 155, 1)}

          {/* Head looking straight up at viewer with waving big smile */}
          <g transform="translate(0, 3)">
            <ellipse cx="100" cy="110" rx="42" ry="37" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" />
            {renderCuteFace('happy', 'joy')}
            {renderExplorerHat(36, 1.0, 0)}
          </g>
        </g>
      )}

      {pose === 'confused' && (
        <g id="confused-thinking-pose">
          {/* Ground shadow */}
          <ellipse cx="100" cy="188" rx="55" ry="10" fill="#2E7E59" opacity="0.18" />

          {/* Feet */}
          <path d="M 73 176 L 71 185 C 71 187, 85 187, 84 176" fill={colors.green} stroke={colors.outline} strokeWidth="4" />
          <path d="M 127 176 L 129 185 C 129 187, 115 187, 116 176" fill={colors.green} stroke={colors.outline} strokeWidth="4" />

          {/* Body */}
          <path d="M 73 133 C 65 148, 71 176, 100 176 C 129 176, 135 148, 127 133 Z" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M 83 142 C 81 149, 85 169, 100 169 C 115 169, 119 149, 117 142" fill="#E4F7D4" stroke={colors.outline} strokeWidth="2.5" />

          {/* Left hand scratching chin / face */}
          <path d="M 74 140 Q 62 130 55 125 C 51 121, 57 114, 61 119 L 75 132" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinecap="round" />

          {/* Right hand pointing down with standard map paper layout */}
          <path d="M 126 138 L 138 158 C 141 162, 133 166, 129 161 L 118 145" fill={colors.green} stroke={colors.outline} strokeWidth="3.5" strokeLinecap="round" />

          {renderCamera(100, 155, 0.95)}

          {/* Confused Question Mark bubbles float next to head */}
          <g transform="translate(155, 78) scale(1.1)">
            {/* Circle chatlet bubble */}
            <ellipse cx="0" cy="0" rx="14" ry="14" fill="#FFFFFF" stroke={colors.outline} strokeWidth="2.5" />
            <path d="M -5 10 L -12 18 L -1 12" fill="#FFFFFF" stroke={colors.outline} strokeWidth="2.5" strokeLinejoin="round" />
            <ellipse cx="0" cy="0" rx="13" ry="13" fill="#FFFFFF" />
            {/* Question Mark in matching brand layout */}
            <text x="-4.5" y="4.5" fill={colors.blue} fontSize="14" fontWeight="900" fontFamily="sans-serif">?</text>
          </g>

          {/* Head Tilted slightly with confused thinking eyebrows */}
          <g transform="translate(0, 4) rotate(-3.5, 100, 112)">
            <ellipse cx="100" cy="110" rx="42" ry="37" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" />
            {renderCuteFace('confused', 'unsure')}
            {renderExplorerHat(36, 1.0, -3)}
          </g>
        </g>
      )}

      {pose === 'joy' && (
        <g id="joy-celebrating-pose">
          {/* Dynamic jumping ground shadow shrinking */}
          <ellipse cx="100" cy="192" rx="38" ry="8" fill="#2E7E59" opacity="0.12" />

          {/* Backpack */}
          {renderBackpack(60, 134, 1.05)}

          {/* Airborne Feet jumping */}
          <path d="M 72 165 C 67 172, 60 178, 64 182 C 68 186, 76 182, 80 174" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinecap="round" />
          <path d="M 128 165 C 133 172, 140 178, 136 182 C 132 186, 124 182, 120 174" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinecap="round" />

          {/* Body high */}
          <path d="M 73 125 C 65 140, 71 168, 100 168 C 129 168, 135 140, 127 125 Z" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" strokeLinejoin="round" />
          <path d="M 83 134 C 81 141, 85 161, 100 161 C 115 161, 119 141, 117 134" fill="#E4F7D4" stroke={colors.outline} strokeWidth="2.5" />

          {/* Both Arms Thrown up high to the sky */}
          <path d="M 72 130 Q 50 102 46 95 C 42 89, 52 82, 57 89 L 76 118" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinecap="round" />
          <path d="M 128 130 Q 150 102 154 95 C 158 89, 148 82, 143 89 L 124 118" fill={colors.green} stroke={colors.outline} strokeWidth="4" strokeLinecap="round" />

          {/* Sparkles of excitement floating around */}
          <g transform="translate(42, 65) scale(0.95)" className="animate-pulse">
            <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#FFC727" />
          </g>
          <g transform="translate(156, 60) scale(0.85)" className="animate-pulse">
            <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#FFC727" />
          </g>

          {renderCamera(100, 148, 1)}

          {/* Smiling highly happy head */}
          <g transform="translate(0, -3)">
            <ellipse cx="100" cy="110" rx="42" ry="37" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" />
            {renderCuteFace('happy', 'joy')}
            {renderExplorerHat(36, 1.0, 0)}
          </g>
        </g>
      )}

      {pose === 'hologram' && (
        <g id="hologram-traveler-pose">
          {/* Ground shadow beneath feet */}
          <ellipse cx="100" cy="188" rx="60" ry="10" fill="#2E7E59" opacity="0.18" />

          {/* Blue Backpack on back with yellow bedroll and documents */}
          {renderBlueBackpack(56, 134, 1.05)}

          {/* Left Foot grounded */}
          <path d="M 75 174 L 66 186 C 66 186, 68 191, 76 188 C 84 185, 87 176, 87 176" fill={colors.green} stroke={colors.outline} strokeWidth="4.5" strokeLinejoin="round" />
          
          {/* Right Foot grounded */}
          <path d="M 112 174 L 118 189 C 118 189, 126 191, 129 184 C 132 177, 123 172, 123 172" fill={colors.green} stroke={colors.outline} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Cute yellow toenails */}
          <ellipse cx="70" cy="186" rx="2.5" ry="1.5" fill={colors.yellow} />
          <ellipse cx="123" cy="187" rx="2.5" ry="1.5" fill={colors.yellow} />

          {/* Turtle Shell Body background contour */}
          <path d="M 72 135 C 64 150, 70 178, 100 178 C 130 178, 136 150, 128 135 Z" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" strokeLinejoin="round" />
          {/* Belly armor plate (light yellow-green segment) */}
          <path d="M 82 144 C 80 152, 85 172, 100 172 C 115 172, 120 152, 118 144 C 118 144, 100 148, 82 144 Z" fill="#FFEAA7" stroke={colors.outline} strokeWidth="2.5" />

          {/* Belly shell segmented lines */}
          <path d="M 100 146 L 100 172" stroke={colors.outline} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 85 154 Q 100 158 115 154" stroke={colors.outline} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 88 163 Q 100 167 112 163" stroke={colors.outline} strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Left Hand: gesturing with welcome / spark lines */}
          <path d="M 124 144 Q 142 148 152 140 C 155 137, 151 129, 143 134 L 122 149" fill={colors.green} stroke={colors.outline} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="151" cy="139" r="2.5" fill={colors.green} stroke={colors.outline} strokeWidth="1.2" />

          {/* Sparkles of excitement near hand */}
          <g transform="translate(156, 128) scale(0.7)" className="animate-pulse">
            <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill={colors.blue} />
          </g>

          {/* Right Arm holding/touching the holographic transparent panel */}
          <path d="M 72 142 Q 45 144 32 138 C 28 136, 26 144, 32 148 L 70 152" fill={colors.green} stroke={colors.outline} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="31" cy="139" r="3" fill={colors.green} stroke={colors.outline} strokeWidth="1.5" />
          <circle cx="33" cy="145" r="3" fill={colors.green} stroke={colors.outline} strokeWidth="1.5" />

          {/* Dynamic glowing Hologram Tablet (AI ITINERARY hologram) */}
          <g transform="translate(6, 85)">
            {/* Soft cyan filter glow behind */}
            <rect x="0" y="0" width="85" height="65" rx="8" fill="#2D8BFF" opacity="0.25" />
            {/* Fully scalable glass prism body with blue border */}
            <rect x="0" y="0" width="85" height="65" rx="8" fill="url(#hologram-grad)" stroke="#2D8BFF" strokeWidth="2.5" opacity="0.9" />
            <path d="M 2 2 L 83 2 L 55 63 L 2 63 Z" fill="url(#shine-grad)" opacity="0.25" />

            {/* AI ITINERARY Text content */}
            <text x="6" y="11" fill="#FFFFFF" fontSize="6.8" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">AI ITINERARY</text>
            
            {/* Row 1: Pin icon + bar */}
            <circle cx="11" cy="22" r="2.5" fill="#FFFFFF" opacity="0.6" />
            <circle cx="11" cy="22" r="1.2" fill={colors.blue} />
            <rect x="18" y="20" width="35" height="3" rx="1.5" fill="#FFFFFF" opacity="0.85" />
            
            {/* Row 2: Mountain landscape + bar */}
            <path d="M 9 35 L 12 30 L 15 35 Z" fill="#FFFFFF" opacity="0.9" />
            <rect x="18" y="32" width="45" height="3" rx="1.5" fill="#FFFFFF" opacity="0.85" />
            
            {/* Row 3: Calendar date check icon + bar */}
            <rect x="9" y="43" width="5" height="5" rx="1.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="11.5" cy="45.5" r="1" fill={colors.teal} />
            <rect x="18" y="44" width="30" height="3" rx="1.5" fill="#FFFFFF" opacity="0.85" />

            {/* Glowing route line with gps nodes */}
            <path d="M 60 20 Q 48 35, 68 45 T 48 58" fill="none" stroke={colors.yellow} strokeWidth="1.8" strokeDasharray="3 2" strokeLinecap="round" />
            <g transform="translate(68, 45) scale(0.6)">
              <path d="M 0 -7 C -4.5 -7, -4.5 -1, 0 6 C 4.5 -1, 4.5 -7, 0 -7 Z" fill="#FF5E5E" />
              <circle cx="0" cy="-2.5" r="1.3" fill="#FFFFFF" />
            </g>
          </g>

          {/* Cute Head looking happy and focused */}
          <g transform="translate(0, 3) rotate(1, 100, 115)">
            <ellipse cx="100" cy="112" rx="41" ry="36" fill={colors.green} stroke={colors.outline} strokeWidth="5.5" />
            {renderCuteFace('normal', 'joy')}
            {renderExplorerHat(40, 0.98, 1)}
          </g>
        </g>
      )}
    </svg>
  );
}
