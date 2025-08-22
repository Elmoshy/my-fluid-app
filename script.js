// script.js - الكود الجديد

(function () {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // دالة لتغيير حجم الـ canvas
  function resizeCanvas() {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const { clientWidth, clientHeight } = canvas;
    canvas.width = Math.floor(clientWidth * dpr);
    canvas.height = Math.floor(clientHeight * dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  if (typeof WebGLFluid !== 'function') {
    console.error('WebGLFluid library not loaded');
    return;
  }

  let fluid = null;
  let config = {
    // قيم أولية للمحاكاة
    TRIGGER: 'hover',
    IMMEDIATE: true,
    AUTO: false,
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 1.0,
    VELOCITY_DISSIPATION: 0.3,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.23,
    SPLAT_FORCE: 6000,
    SPLAT_COUNT: Math.floor(Math.random() * 20) + 5,
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
  };

  // دالة لإعادة تشغيل المحاكاة مع القيم الجديدة
  function startFluidSimulation() {
    if (fluid) {
      fluid.destroy();
    }
    fluid = WebGLFluid(canvas, config);
  }

  // أول مرة تبدأ فيها المحاكاة
  startFluidSimulation();

  // --- التحكم في القائمة والإعدادات ---
  window.addEventListener('load', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleArrows = document.querySelector('.toggle-arrows');
    
    // زرار الفتح والإغلاق
    if (toggleArrows) {
      toggleArrows.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // ربط الـ inputs و الـ checkboxes بالـ config
    const simResInput = document.getElementById('sim-res');
    const dyeResInput = document.getElementById('dye-res');
    const applySimResBtn = document.getElementById('apply-sim-res');
    const applyDyeResBtn = document.getElementById('apply-dye-res');
    const densityDissipationInput = document.getElementById('density-dissipation');
    const velocityDissipationInput = document.getElementById('velocity-dissipation');
    const pressureIterInput = document.getElementById('pressure-iter');
    const applyPressureIterBtn = document.getElementById('apply-pressure-iter');
    const splatRadiusInput = document.getElementById('splat-radius');
    const splatForceInput = document.getElementById('splat-force');
    const curlInput = document.getElementById('curl-value');
    const updateCurlBtn = document.getElementById('update-curl');
    const shadingToggle = document.getElementById('shading-toggle');
    const colorfulToggle = document.getElementById('colorful-toggle');
    const bloomToggle = document.getElementById('bloom-toggle');
    const sunraysToggle = document.getElementById('sunrays-toggle');
    const randomSplatsBtn = document.getElementById('random-splats-btn');
    const resetBtn = document.getElementById('reset-btn');

    // دالة لتحديث قيم الـ inputs بناءً على الـ config
    function syncUI() {
      simResInput.value = config.SIM_RESOLUTION;
      dyeResInput.value = config.DYE_RESOLUTION;
      densityDissipationInput.value = config.DENSITY_DISSIPATION;
      velocityDissipationInput.value = config.VELOCITY_DISSIPATION;
      pressureIterInput.value = config.PRESSURE_ITERATIONS;
      splatRadiusInput.value = config.SPLAT_RADIUS;
      splatForceInput.value = config.SPLAT_FORCE;
      curlInput.value = config.CURL;
      shadingToggle.checked = config.SHADING;
      colorfulToggle.checked = config.COLORFUL;
      bloomToggle.checked = config.BLOOM;
      sunraysToggle.checked = config.SUNRAYS;
    }
    syncUI();

    // دالة لتحديث قيم الـ fluid مع فحص وجودها
    function updateFluid(key, value) {
      if (fluid) {
        fluid.set(key, value);
        // تحديث الـ config أيضاً للحفاظ على التزامن
        config[key] = value;
      }
    }

    // تحديث قيم المحاكاة لما المستخدم يغير حاجة
    // القيم اللي بتتغير على طول
    densityDissipationInput.addEventListener('input', (e) => updateFluid('DENSITY_DISSIPATION', parseFloat(e.target.value)));
    velocityDissipationInput.addEventListener('input', (e) => updateFluid('VELOCITY_DISSIPATION', parseFloat(e.target.value)));
    splatRadiusInput.addEventListener('input', (e) => updateFluid('SPLAT_RADIUS', parseFloat(e.target.value)));
    splatForceInput.addEventListener('input', (e) => updateFluid('SPLAT_FORCE', parseFloat(e.target.value)));
    
    shadingToggle.addEventListener('change', (e) => updateFluid('SHADING', e.target.checked));
    colorfulToggle.addEventListener('change', (e) => updateFluid('COLORFUL', e.target.checked));
    bloomToggle.addEventListener('change', (e) => updateFluid('BLOOM', e.target.checked));
    sunraysToggle.addEventListener('change', (e) => updateFluid('SUNRAYS', e.target.checked));
    
    // القيم اللي بتحتاج إعادة تشغيل، بنحدث الـ config بس
    simResInput.addEventListener('input', (e) => config.SIM_RESOLUTION = parseFloat(e.target.value));
    dyeResInput.addEventListener('input', (e) => config.DYE_RESOLUTION = parseFloat(e.target.value));
    pressureIterInput.addEventListener('input', (e) => config.PRESSURE_ITERATIONS = parseFloat(e.target.value));
    curlInput.addEventListener('input', (e) => config.CURL = parseFloat(e.target.value));

    // الزراير اللي بتعمل إعادة تشغيل
    if (applySimResBtn) {
      applySimResBtn.addEventListener('click', () => startFluidSimulation());
    }
    if (applyDyeResBtn) {
      applyDyeResBtn.addEventListener('click', () => startFluidSimulation());
    }
    if (applyPressureIterBtn) {
      applyPressureIterBtn.addEventListener('click', () => startFluidSimulation());
    }
    if (updateCurlBtn) {
      updateCurlBtn.addEventListener('click', () => startFluidSimulation());
    }

    // زرار "Random Splats"
    if (randomSplatsBtn) {
      randomSplatsBtn.addEventListener('click', () => {
        if (fluid) {
          for (let i = 0; i < 15; i++) {
            fluid.splat({
              x: Math.random(),
              y: Math.random(),
              dx: (Math.random() - 0.5) * 1000,
              dy: (Math.random() - 0.5) * 1000
            });
          }
        }
      });
    }

    // زرار "Reset"
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // التحكم في أزرار الزيادة والنقصان
    document.querySelectorAll('.adjust-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const action = button.dataset.action;
            const input = document.getElementById(targetId);
            
            if (input) {
                let currentValue = parseFloat(input.value);
                const step = parseFloat(input.step);
                
                if (action === 'plus') {
                    currentValue += step;
                } else {
                    currentValue -= step;
                }
                
                input.value = currentValue.toFixed(1);
                
                // إطلاق حدث "input" عشان الـ fluid يتحدث
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            }
        });
    });
  });
})();
