import { motion } from 'framer-motion';

export default function CaseFileCard({ children }) {
  return (
    <motion.div
      className="case-card-wrapper"
      initial={{ opacity: 0, y: 60, rotateZ: -1 }}
      animate={{ opacity: 1, y: 0, rotateZ: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Distorted Paper Background */}
      <div className="case-card-paper case-card--burnt">
        {/* Damage & Texture Overlays (inside distorted container) */}
        <div className="card-damage-container">
          <div className="card-crumple" />
        </div>
        
        {/* Subtle Charred Edges shadow (pseudoelement in CSS) */}
      </div>

      {/* Clear Content (Not Distorted) */}
      <div className="case-card-content">
        {/* Pin */}
        <div className="case-card__pin" />

        {/* Red margin line */}
        <div className="case-card__margin" />

        {/* CONFIDENTIAL stamp */}
        <motion.img
          src="/stamp.png"
          alt="Top Secret — Confidential"
          className="stamp-img"
          initial={{ opacity: 0, scale: 1.5, rotate: 20 }}
          animate={{ opacity: 0.85, scale: 1, rotate: 12 }}
          transition={{ duration: 0.4, delay: 1.2, ease: 'easeOut' }}
        />

        {children}
      </div>
      
      {/* SVG filter definitions */}
      <svg style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="crumpleFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="8" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="5">
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
          
          <filter id="tearFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" result="noise" seed="5" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}
