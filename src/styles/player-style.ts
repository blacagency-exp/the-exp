export const playerStyles = `
  /* Player container styles */
  #youtube-player-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #000;
  }
  
  #youtube-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  #youtube-player iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  }
  
  /* Hide YouTube controls */
  .ytp-chrome-top,
  .ytp-chrome-bottom,
  .ytp-gradient-top,
  .ytp-gradient-bottom,
  .ytp-youtube-button,
  .ytp-share-button,
  .ytp-watch-later-button,
  .ytp-embed-button,
  .ytp-playlist-menu-button,
  .ytp-overflow-menu-button,
  .ytp-copylink-button,
  .ytp-contextmenu,
  .ytp-settings-button,
  .ytp-fullscreen-button,
  .ytp-size-button,
  .ytp-volume-panel,
  .ytp-time-display,
  .ytp-chapter-container,
  .ytp-iv-drawer-open,
  .ytp-pause-overlay,
  .ytp-related-on-show,
  .ytp-spinner,
  .ytp-bezel,
  .ytp-paid-content-overlay,
  .ytp-player-content,
  .ytp-iv-player-content {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
  }

  /* Hide YouTube context menu and URL copy options */
  .ytp-contextmenu, 
  .ytp-copy-url-button, 
  .ytp-contextmenu-link,
  .ytp-copylink-button,
  .ytp-contextmenu-menu {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  /* Prevent selection of text */
  #youtube-player-container {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
  }

  /* Hide right-click context menu */
  #youtube-player-container::-webkit-context-menu,
  #youtube-player iframe::-webkit-context-menu {
    display: none !important;
  }
  
  /* Animation for ping effect */
  @keyframes ping {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    70% {
      transform: scale(1.5);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  
  .animate-ping {
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  /* Transition animation */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
  }

  /* Scale in animation */
  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out forwards;
  }

  /* Slide down animation */
  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .animate-slideDown {
    animation: slideDown 0.5s ease-out forwards;
  }
  
  /* Progress animation */
  @keyframes progress {
    from { width: 0%; }
    to { width: 100%; }
  }
  
  .animate-progress {
    animation: progress 1.5s linear forwards;
  }
  
  /* Hotspot fade-in animation */
  @keyframes hotspotFadeIn {
    from { 
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to { 
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  .hotspot-fade-in {
    animation: hotspotFadeIn 0.5s ease-out forwards;
  }
  
  /* Pulse animation for buttons */
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  
  /* Floating animation */
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  /* Glow animation */
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(151, 225, 43, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(151, 225, 43, 0.8);
    }
  }
  
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
`
