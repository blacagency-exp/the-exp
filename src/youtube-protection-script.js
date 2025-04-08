// This script adds additional protection against YouTube controls
// It should be loaded after the YouTube player is initialized

function applyYouTubeProtection() {
    // Find the YouTube iframe
    const iframe = document.querySelector("#youtube-player iframe")
    if (!iframe) return
  
    // Try to access the iframe content (may be blocked by CORS)
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  
      // Add style to hide controls in the iframe
      const style = document.createElement("style")
      style.textContent = `
        .ytp-chrome-top, 
        .ytp-chrome-bottom, 
        .ytp-share-button, 
        .ytp-copylink-button {
          display: none !important;
          visibility: hidden !important;
        }
      `
  
      iframeDoc.head.appendChild(style)
  
      // Add click interceptor
      const interceptor = document.createElement("div")
      interceptor.style.cssText = "position:absolute;top:0;left:0;width:100%;height:40px;z-index:9999;"
      iframeDoc.body.appendChild(interceptor)
    } catch (e) {
      console.log("Cannot access iframe content due to same-origin policy")
    }
  
    // Add overlay divs to block controls
    const playerContainer = document.getElementById("youtube-player")
    if (playerContainer) {
      // Top control blocker
      const topBlocker = document.createElement("div")
      topBlocker.className = "yt-control-blocker"
      playerContainer.appendChild(topBlocker)
  
      // Bottom control blocker
      const bottomBlocker = document.createElement("div")
      bottomBlocker.className = "yt-bottom-control-blocker"
      playerContainer.appendChild(bottomBlocker)
    }
  }
  
  // Run protection after a delay to ensure player is loaded
  setTimeout(applyYouTubeProtection, 2000)
  
  // Also run protection when the player state changes
  window.addEventListener("message", (event) => {
    // Check if this is a YouTube player state change event
    if (event.data && typeof event.data === "object" && event.data.event === "onStateChange") {
      setTimeout(applyYouTubeProtection, 500)
    }
  })
  