import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import img from "../../assets/hotspot-icon.png"

interface Hotspot {
  id: string;
  position: { x: number; y: number };
  targetTourId: number;
  icon?: string;
  tooltip?: string;
}

interface Three360ViewerProps {
  videoUrl: string;
  hotspots?: Hotspot[];
  onHotspotClick: (targetTourId: number) => void;
}

const Three360Viewer: React.FC<Three360ViewerProps> = ({ videoUrl, hotspots = [], onHotspotClick }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsVideoReady(false);
    const timer = setTimeout(() => setIsLoading(false), 2000); // Minimum loading time

    return () => clearTimeout(timer);
  }, [videoUrl]);

  const handleVideoReady = () => {
    setIsVideoReady(true);
    setIsLoading(false);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              zIndex: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="spinner"></div>
            <style>{`
              .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #5A8E00;
                animation: spin 1s ease-in-out infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {hasError && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, color: "white", textAlign: "center" }}>
          Failed to load video. Please try again later.
        </div>
      )}

      {/* Video Player with Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={videoUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoReady ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", height: "100%" }}
        >
          {videoUrl.includes("youtube.com") ? (
            <iframe
              src={`${videoUrl}?autoplay=1&mute=1`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoReady}
              onError={() => setHasError(true)}
              style={{ border: "none" }}
            />
          ) : (
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onCanPlayThrough={handleVideoReady}
              onError={() => setHasError(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Hotspots with Tooltips */}
      {hotspots.map((hotspot) => (
        <React.Fragment key={hotspot.id}>
          <motion.div
            data-tooltip-id={`hotspot-${hotspot.id}`}
            data-tooltip-content={hotspot.tooltip || `Go to ${hotspot.targetTourId}`}
            style={{
              position: "absolute",
              left: `${hotspot.position.x}%`,
              top: `${hotspot.position.y}%`,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              zIndex: 10,
              transform: "translate(-50%, -50%)",
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onHotspotClick(hotspot.targetTourId)}
          >
            {hotspot.icon ? (
              <img 
                src={img}
                alt="Hotspot" 
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <div style={{ 
                width: "100%", 
                height: "100%", 
                backgroundColor: "rgba(255, 0, 0, 0.5)" 
              }} />
            )}
          </motion.div>
          <Tooltip id={`hotspot-${hotspot.id}`} place="top" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Three360Viewer;