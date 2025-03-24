import React, { useState, useEffect } from "react";
import Three360Viewer from "../Components/Virtual-tour/Three360Viewer";
import { useParams, useNavigate } from "react-router-dom";
import { tourData } from "../Components/Virtual-tour/FeaturedTours";

const SingleVirtualTourPage: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  
  // Initialize state from localStorage or params
  const [currentTourId, setCurrentTourId] = useState<number>(() => {
    const saved = localStorage.getItem('currentTour');
    return saved ? parseInt(saved) : parseInt(tourId || "1");
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('currentTour', currentTourId.toString());
  }, [currentTourId]);

  const currentTour = tourData.find((tour) => tour.id === currentTourId);
  console.log("Hotspot icon path:", currentTour?.hotspots?.[0]?.icon);

  if (!currentTour) {
    return <div>Tour not found.</div>;
  }

  const handleHotspotClick = (targetTourId: number) => {
    setCurrentTourId(targetTourId);
    // Update URL without page reload
    navigate(`/virtual-tour/${targetTourId}`, { replace: true });
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ 
          position: "absolute", 
          top: "20px", 
          left: "20px", 
          zIndex: 10, 
          padding: "10px", 
          backgroundColor: "#5A8E00", 
          color: "white", 
          border: "none", 
          borderRadius: "5px", 
          cursor: "pointer" 
        }}
      >
        Back
      </button>

      <Three360Viewer
        videoUrl={currentTour.videoUrl}
        hotspots={currentTour.hotspots?.map(hotspot => ({
          ...hotspot,
          tooltip: `Go to ${tourData.find(t => t.id === hotspot.targetTourId)?.title}`,
          icon: "/hotspot-icon.png" // Path to your custom icon
        }))}
        onHotspotClick={handleHotspotClick}
      />
    </div>
  );
};

export default SingleVirtualTourPage;