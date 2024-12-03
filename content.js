document.addEventListener("mouseover", async (event) => {
    if (event.target.tagName === "VIDEO") {
      const videoElement = event.target;
      const videoUrl = window.location.href;
  
      // Fetch video summary
      const response = await fetch("http://localhost:3000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ videoUrl })
      });
      const data = await response.json();
  
      // Show the summary
      const tooltip = document.createElement("div");
      tooltip.innerText = data.summary || "Summary not available";
      tooltip.style.position = "absolute";
      tooltip.style.background = "#333";
      tooltip.style.color = "#fff";
      tooltip.style.padding = "10px";
      tooltip.style.borderRadius = "5px";
      tooltip.style.zIndex = 1000;
  
      document.body.appendChild(tooltip);
  
      const moveTooltip = (e) => {
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.left = `${e.pageX + 10}px`;
      };
  
      videoElement.addEventListener("mousemove", moveTooltip);
  
      videoElement.addEventListener("mouseleave", () => {
        videoElement.removeEventListener("mousemove", moveTooltip);
        tooltip.remove();
      });
    }
  });
  