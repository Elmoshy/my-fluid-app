(function () {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Function to resize the canvas and maintain high resolution on Retina/HiDPI displays
  function resizeCanvas() {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const { clientWidth, clientHeight } = canvas;
    canvas.width = Math.floor(clientWidth * dpr);
    canvas.height = Math.floor(clientHeight * dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Check if the WebGLFluid library is loaded
  if (typeof WebGLFluid !== 'function') {
    console.error('WebGLFluid library not loaded');
    return;
  }

  // --- Main Simulation Configuration ---
  const fluid = WebGLFluid(canvas, {
    // Interaction settings
    TRIGGER: 'hover', // The fluid reacts to mouse hover
    IMMEDIATE: true,  // Show a single splat on load for an initial visual
    AUTO: false,      // IMPORTANT: This is set to false to stop automatic splats
    
    // Simulation quality
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 1.0,
    VELOCITY_DISSIPATION: 0.3,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,         // You can change this starting value (e.g., 10, 50)
    
    // Splat (the effect created by mouse) settings
    SPLAT_RADIUS: 0.23,
    SPLAT_FORCE: 6000,
    SPLAT_COUNT: Math.floor(Math.random() * 20) + 5,
    
    // Visuals and effects
    SHADING: true,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 9,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.6,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: true,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
  });


  // --- Control Button Functionality ---
  
  // Wait for the page to fully load before attaching event listeners
  window.addEventListener('load', function() {
    
    // "Randomize Colors" button
    const randomizeButton = document.getElementById('randomize-colors');
    if (randomizeButton) {
      randomizeButton.addEventListener('click', () => {
        // Simulate multiple mouse moves at random positions to create new splats
        for (let i = 0; i < 15; i++) {
          fluid.splat({
            x: Math.random(), // Position from 0.0 to 1.0
            y: Math.random(), // Position from 0.0 to 1.0
            dx: (Math.random() - 0.5) * 1000, // Random horizontal force
            dy: (Math.random() - 0.5) * 1000  // Random vertical force
          });
        }
      });
    }

    // "Increase/Decrease Curl" buttons
    const increaseCurlButton = document.getElementById('increase-curl');
    const decreaseCurlButton = document.getElementById('decrease-curl');

    const curlAlert = () => {
      alert(
        'The "Curl" property cannot be changed after the simulation has started.\n\n' +
        'To change the starting curl value, you must edit the "CURL" property inside the script.js file and then reload the page.'
      );
    };

    if (increaseCurlButton) {
      increaseCurlButton.addEventListener('click', curlAlert);
    }
    if (decreaseCurlButton) {
      decreaseCurlButton.addEventListener('click', curlAlert);
    }
  });

})();
