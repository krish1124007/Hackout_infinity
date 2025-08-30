import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SolarPanel = ({ solarPanelCount = 1, electrolysisCount = 1, showControls = false }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameId = useRef(null);
  const facilitiesRef = useRef({});
  const particleSystemsRef = useRef({});
  const prevSolarCountRef = useRef(solarPanelCount);
  const prevElectrolysisCountRef = useRef(electrolysisCount);

  // Custom OrbitControls implementation
  const createOrbitControls = (camera, domElement) => {
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    const spherical = new THREE.Spherical();
    const target = new THREE.Vector3(0, 2, 0);
    
    spherical.setFromVector3(camera.position.clone().sub(target));
    
    const update = () => {
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    };

    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      domElement.style.cursor = 'grabbing';
    };

    const onMouseMove = (event) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      spherical.theta -= deltaX * 0.01;
      spherical.phi -= deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      mouseX = event.clientX;
      mouseY = event.clientY;
      update();
    };

    const onMouseUp = () => {
      isMouseDown = false;
      domElement.style.cursor = 'grab';
    };

    const onWheel = (event) => {
      event.preventDefault();
      spherical.radius *= event.deltaY > 0 ? 1.1 : 0.9;
      spherical.radius = Math.max(5, Math.min(80, spherical.radius));
      update();
    };

    // Touch support
    const onTouchStart = (event) => {
      if (event.touches.length === 1) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
        isMouseDown = true;
      }
    };

    const onTouchMove = (event) => {
      if (!isMouseDown || event.touches.length !== 1) return;
      event.preventDefault();
      
      const deltaX = event.touches[0].clientX - mouseX;
      const deltaY = event.touches[0].clientY - mouseY;
      
      spherical.theta -= deltaX * 0.01;
      spherical.phi -= deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      mouseX = event.touches[0].clientX;
      mouseY = event.touches[0].clientY;
      update();
    };

    const onTouchEnd = () => {
      isMouseDown = false;
    };

    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });
    domElement.addEventListener('touchstart', onTouchStart);
    domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    domElement.addEventListener('touchend', onTouchEnd);

    update();

    return {
      dispose: () => {
        domElement.removeEventListener('mousedown', onMouseDown);
        domElement.removeEventListener('mousemove', onMouseMove);
        domElement.removeEventListener('mouseup', onMouseUp);
        domElement.removeEventListener('wheel', onWheel);
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchmove', onTouchMove);
        domElement.removeEventListener('touchend', onTouchEnd);
      }
    };
  };

  const rebuildScene = () => {
    if (!sceneRef.current) return;

    // Clear existing facilities
    Object.values(facilitiesRef.current).forEach(facility => {
      if (facility && facility.parent) {
        facility.parent.remove(facility);
      }
    });

    // Clear existing particle systems
    Object.values(particleSystemsRef.current).forEach(system => {
      if (system.group && system.group.parent) {
        system.group.parent.remove(system.group);
      }
    });

    facilitiesRef.current = {};
    particleSystemsRef.current = {};

    const scene = sceneRef.current;

    // Materials
    const materials = {
      solarPanel: new THREE.MeshPhysicalMaterial({
        color: 0x1a4488,
        metalness: 0.1,
        roughness: 0.05,
        reflectivity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      }),
      frame: new THREE.MeshPhysicalMaterial({
        color: 0x2a2a2a,
        metalness: 0.95,
        roughness: 0.1
      }),
      metal: new THREE.MeshPhysicalMaterial({
        color: 0x666666,
        metalness: 0.8,
        roughness: 0.2
      }),
      tank: new THREE.MeshPhysicalMaterial({
        color: 0x4a90e2,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 0.8
      }),
      pipe: new THREE.MeshPhysicalMaterial({
        color: 0x708090,
        metalness: 0.7,
        roughness: 0.3
      }),
      concrete: new THREE.MeshLambertMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.7
      })
    };

    // 1. Solar Panel Farm (dynamic count)
    const createSolarFarm = () => {
      const farm = new THREE.Group();
      
      // Ensure at least 1 solar panel
      const actualSolarCount = Math.max(1, solarPanelCount);
      
      for (let i = 0; i < actualSolarCount; i++) {
        const panel = new THREE.Group();
        
        // Panel surface
        const panelGeo = new THREE.BoxGeometry(1.5, 0.06, 0.8);
        const panelMesh = new THREE.Mesh(panelGeo, materials.solarPanel);
        panelMesh.position.y = 0.8;
        panelMesh.castShadow = true;
        panel.add(panelMesh);
        
        // Frame
        const frameGeo = new THREE.BoxGeometry(1.6, 0.1, 0.9);
        const frame = new THREE.Mesh(frameGeo, materials.frame);
        frame.position.y = 0.8;
        frame.castShadow = true;
        panel.add(frame);
        
        // Stand
        const standGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 12);
        const stand = new THREE.Mesh(standGeo, materials.metal);
        stand.position.y = 0.4;
        stand.castShadow = true;
        panel.add(stand);
        
        // Base
        const baseGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.1, 12);
        const base = new THREE.Mesh(baseGeo, materials.metal);
        base.position.y = 0.05;
        base.castShadow = true;
        panel.add(base);
        
        panel.rotation.x = -Math.PI / 8;
        
        // Arrange panels in a line for small counts, grid for larger
        if (actualSolarCount <= 5) {
          panel.position.set(i * 2.5 - 15, 0, -8);
        } else {
          const cols = Math.ceil(Math.sqrt(actualSolarCount));
          const row = Math.floor(i / cols);
          const col = i % cols;
          panel.position.set(
            (col - cols/2) * 2.5 - 15,
            0,
            (row - Math.ceil(actualSolarCount/cols)/2) * 2.2 - 8
          );
        }
        
        farm.add(panel);
      }
      
      facilitiesRef.current.solarFarm = farm;
      scene.add(farm);
      return farm;
    };

    // 2. Power Grid Node (Substation)
    const createPowerGrid = () => {
      const grid = new THREE.Group();
      
      // Main transformer building
      const buildingGeo = new THREE.BoxGeometry(3, 4, 2);
      const building = new THREE.Mesh(buildingGeo, materials.concrete);
      building.position.set(-5, 2, 0);
      building.castShadow = true;
      building.receiveShadow = true;
      grid.add(building);
      
      // Electrical equipment
      const equipGeo = new THREE.BoxGeometry(1, 1.5, 0.8);
      const equip1 = new THREE.Mesh(equipGeo, materials.metal);
      equip1.position.set(-4, 0.75, 1.5);
      equip1.castShadow = true;
      grid.add(equip1);
      
      const equip2 = new THREE.Mesh(equipGeo, materials.metal);
      equip2.position.set(-4, 0.75, -1.5);
      equip2.castShadow = true;
      grid.add(equip2);
      
      // Power lines support tower
      const towerGeo = new THREE.CylinderGeometry(0.1, 0.15, 8, 8);
      const tower = new THREE.Mesh(towerGeo, materials.metal);
      tower.position.set(-5, 4, 0);
      tower.castShadow = true;
      grid.add(tower);
      
      facilitiesRef.current.powerGrid = grid;
      scene.add(grid);
      return grid;
    };

    // 3. Electrolysis Units (dynamic count)
    const createElectrolysisUnits = () => {
      const unitsGroup = new THREE.Group();
      
      // Ensure at least 1 electrolysis unit
      const actualElectrolysisCount = Math.max(1, electrolysisCount);
      
      for (let i = 0; i < actualElectrolysisCount; i++) {
        const unit = new THREE.Group();
        
        // Main electrolysis tank
        const tankGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
        const tank = new THREE.Mesh(tankGeo, materials.tank);
        tank.position.set(0, 1.5, 0);
        tank.castShadow = true;
        tank.receiveShadow = true;
        unit.add(tank);
        
        // Water input pipes
        const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 12);
        const waterPipe = new THREE.Mesh(pipeGeo, materials.pipe);
        waterPipe.position.set(-2, 1.5, 0);
        waterPipe.rotation.z = Math.PI / 2;
        waterPipe.castShadow = true;
        unit.add(waterPipe);
        
        // Control panel
        const controlGeo = new THREE.BoxGeometry(0.8, 1.2, 0.3);
        const controlMat = new THREE.MeshPhysicalMaterial({
          color: 0x1a1a1a,
          metalness: 0.8,
          roughness: 0.2
        });
        const control = new THREE.Mesh(controlGeo, controlMat);
        control.position.set(1.5, 1.5, 0);
        control.castShadow = true;
        unit.add(control);
        
        // Output pipes for H2 and O2
        const h2Pipe = new THREE.Mesh(pipeGeo, materials.pipe);
        h2Pipe.position.set(1.5, 2.8, 0.5);
        h2Pipe.rotation.z = Math.PI / 4;
        h2Pipe.castShadow = true;
        unit.add(h2Pipe);
        
        const o2Pipe = new THREE.Mesh(pipeGeo, materials.pipe);
        o2Pipe.position.set(1.5, 2.8, -0.5);
        o2Pipe.rotation.z = Math.PI / 4;
        o2Pipe.castShadow = true;
        unit.add(o2Pipe);
        
        // Position units
        const spacing = 6;
        unit.position.set(5 + (i - (actualElectrolysisCount - 1) / 2) * spacing, 0, 0);
        unitsGroup.add(unit);
      }
      
      facilitiesRef.current.electrolysis = unitsGroup;
      scene.add(unitsGroup);
      return unitsGroup;
    };

    // 4. Hydrogen Storage Tanks
    const createStorageTanks = () => {
      const storage = new THREE.Group();
      
      for (let i = 0; i < 3; i++) {
        const tankGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 16);
        const tank = new THREE.Mesh(tankGeo, materials.tank);
        tank.position.set(18, 2, (i - 1) * 3);
        tank.castShadow = true;
        tank.receiveShadow = true;
        storage.add(tank);
        
        // Tank caps
        const capGeo = new THREE.SphereGeometry(1.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const topCap = new THREE.Mesh(capGeo, materials.tank);
        topCap.position.set(18, 4, (i - 1) * 3);
        storage.add(topCap);
        
        const bottomCap = new THREE.Mesh(capGeo, materials.tank);
        bottomCap.rotation.x = Math.PI;
        bottomCap.position.set(18, 0, (i - 1) * 3);
        storage.add(bottomCap);
        
        // Tank labels
        const labelGeo = new THREE.PlaneGeometry(1, 0.3);
        const labelMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9
        });
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.set(19.3, 2.5, (i - 1) * 3);
        label.rotation.y = -Math.PI / 2;
        storage.add(label);
      }
      
      facilitiesRef.current.storage = storage;
      scene.add(storage);
      return storage;
    };

    // 5. Distribution Network
    const createDistribution = () => {
      const distribution = new THREE.Group();
      
      // Distribution center building
      const buildingGeo = new THREE.BoxGeometry(4, 3, 3);
      const building = new THREE.Mesh(buildingGeo, materials.concrete);
      building.position.set(28, 1.5, 0);
      building.castShadow = true;
      building.receiveShadow = true;
      distribution.add(building);
      
      // Loading bay
      const bayGeo = new THREE.BoxGeometry(2, 2.5, 1);
      const bay = new THREE.Mesh(bayGeo, materials.metal);
      bay.position.set(26, 1.25, 2.5);
      bay.castShadow = true;
      distribution.add(bay);
      
      // Hydrogen trucks
      for (let i = 0; i < 2; i++) {
        const truck = new THREE.Group();
        
        // Truck body
        const bodyGeo = new THREE.BoxGeometry(3, 1.5, 1.2);
        const body = new THREE.Mesh(bodyGeo, materials.metal);
        body.position.y = 0.75;
        body.castShadow = true;
        truck.add(body);
        
        // Hydrogen tank on truck
        const truckTankGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 12);
        const truckTank = new THREE.Mesh(truckTankGeo, materials.tank);
        truckTank.rotation.z = Math.PI / 2;
        truckTank.position.set(0, 1.2, 0);
        truckTank.castShadow = true;
        truck.add(truckTank);
        
        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
        const wheelMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, roughness: 0.8 });
        
        [-1, 1].forEach(side => {
          [0.8, -0.8].forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos, 0.3, side * 0.7);
            wheel.castShadow = true;
            truck.add(wheel);
          });
        });
        
        truck.position.set(28 + i * 4, 0, 5);
        distribution.add(truck);
      }
      
      facilitiesRef.current.distribution = distribution;
      scene.add(distribution);
      return distribution;
    };

    // Create particle systems
    const createParticleSystem = (start, end, color, count = 100) => {
      const particles = new THREE.Group();
      const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.5
      });

      const particleData = [];
      
      for (let i = 0; i < count; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        const progress = i / count;
        
        // Position along path
        particle.position.lerpVectors(start, end, progress);
        particle.position.y += Math.sin(progress * Math.PI * 4) * 0.2;
        
        particles.add(particle);
        particleData.push({
          mesh: particle,
          progress: progress,
          speed: 0.005 + Math.random() * 0.005
        });
      }
      
      return { group: particles, data: particleData, start, end };
    };

    // Create properly connected power lines
    const createPowerLines = () => {
      const lines = new THREE.Group();
      
      // Calculate average solar farm position
      const actualSolarCount = Math.max(1, solarPanelCount);
      const avgSolarPos = new THREE.Vector3();
      if (actualSolarCount === 1) {
        avgSolarPos.set(-15, 3, -8);
      } else if (actualSolarCount <= 5) {
        avgSolarPos.set(-15 + (actualSolarCount - 1) * 1.25, 3, -8);
      } else {
        avgSolarPos.set(-15, 3, -8);
      }
      
      // From solar farm to grid
      const curve1 = new THREE.CatmullRomCurve3([
        avgSolarPos,
        new THREE.Vector3(-10, 4, -4),
        new THREE.Vector3(-5, 4, 0)
      ]);
      
      const lineGeo1 = new THREE.TubeGeometry(curve1, 20, 0.02, 8, false);
      const lineMat = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.3
      });
      const line1 = new THREE.Mesh(lineGeo1, lineMat);
      lines.add(line1);
      
      // From grid to electrolysis units
      const actualElectrolysisCount = Math.max(1, electrolysisCount);
      for (let i = 0; i < actualElectrolysisCount; i++) {
        const unitX = 5 + (i - (actualElectrolysisCount - 1) / 2) * 6;
        const curve2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-3, 4, 0),
          new THREE.Vector3(1, 3.5, 0),
          new THREE.Vector3(unitX, 3, 0)
        ]);
        
        const lineGeo2 = new THREE.TubeGeometry(curve2, 20, 0.02, 8, false);
        const line2 = new THREE.Mesh(lineGeo2, lineMat);
        lines.add(line2);
      }
      
      scene.add(lines);
      return lines;
    };

    // Create hydrogen pipes
    const createHydrogenPipes = () => {
      const pipes = new THREE.Group();
      
      // From each electrolysis unit to storage
      const actualElectrolysisCount = Math.max(1, electrolysisCount);
      for (let i = 0; i < actualElectrolysisCount; i++) {
        const unitX = 5 + (i - (actualElectrolysisCount - 1) / 2) * 6;
        
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(unitX + 2, 2.5, 0),
          new THREE.Vector3(unitX + 5, 2.8, 0),
          new THREE.Vector3(15, 2.5, 0),
          new THREE.Vector3(18, 2.5, 0)
        ]);
        
        const pipeGeo = new THREE.TubeGeometry(curve, 30, 0.08, 12, false);
        const pipe = new THREE.Mesh(pipeGeo, materials.pipe);
        pipe.castShadow = true;
        pipes.add(pipe);
      }
      
      // From storage to distribution
      const curve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(19.5, 2, 0),
        new THREE.Vector3(23, 1.8, 0),
        new THREE.Vector3(26, 1.5, 0)
      ]);
      
      const pipeGeo2 = new THREE.TubeGeometry(curve2, 20, 0.06, 12, false);
      const pipe2 = new THREE.Mesh(pipeGeo2, materials.pipe);
      pipe2.castShadow = true;
      pipes.add(pipe2);
      
      scene.add(pipes);
      return pipes;
    };

    // Build facilities
    createSolarFarm();
    createPowerGrid();
    createElectrolysisUnits();
    createStorageTanks();
    createDistribution();
    createPowerLines();
    createHydrogenPipes();

    // Create energy flow particles with proper connections
    const actualSolarCount = Math.max(1, solarPanelCount);
    const avgSolarPos = new THREE.Vector3();
    if (actualSolarCount === 1) {
      avgSolarPos.set(-15, 3, -8);
    } else if (actualSolarCount <= 5) {
      avgSolarPos.set(-15 + (actualSolarCount - 1) * 1.25, 3, -8);
    } else {
      avgSolarPos.set(-15, 3, -8);
    }

    particleSystemsRef.current = {
      solarToGrid: createParticleSystem(
        avgSolarPos,
        new THREE.Vector3(-5, 4, 0),
        0xffff00,
        30
      )
    };

    // Create particles from grid to each electrolysis unit
    const actualElectrolysisCount = Math.max(1, electrolysisCount);
    for (let i = 0; i < actualElectrolysisCount; i++) {
      const unitX = 5 + (i - (actualElectrolysisCount - 1) / 2) * 6;
      particleSystemsRef.current[`gridToElectrolysis${i}`] = createParticleSystem(
        new THREE.Vector3(-3, 4, 0),
        new THREE.Vector3(unitX, 3, 0),
        0x00ff00,
        25
      );
      
      // Hydrogen flow from each unit to storage
      particleSystemsRef.current[`hydrogenFlow${i}`] = createParticleSystem(
        new THREE.Vector3(unitX + 2, 2.5, 0),
        new THREE.Vector3(18, 2.5, 0),
        0x4a90e2,
        30
      );
    }

    // Distribution flow
    particleSystemsRef.current.distribution = createParticleSystem(
      new THREE.Vector3(19.5, 2, 0),
      new THREE.Vector3(26, 1.5, 0),
      0x0080ff,
      20
    );

    // Add particle systems to scene
    Object.values(particleSystemsRef.current).forEach(system => {
      scene.add(system.group);
    });

    // Electrolysis bubbles for each unit
    const createBubbles = () => {
      const allBubbles = new THREE.Group();
      
      const actualElectrolysisCount = Math.max(1, electrolysisCount);
      for (let unitIndex = 0; unitIndex < actualElectrolysisCount; unitIndex++) {
        const unitX = 5 + (unitIndex - (actualElectrolysisCount - 1) / 2) * 6;
        
        for (let i = 0; i < 30; i++) {
          const bubbleGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 8, 8);
          const bubbleMat = new THREE.MeshPhysicalMaterial({
            color: i % 2 === 0 ? 0x4a90e2 : 0xff6b6b,
            transparent: true,
            opacity: 0.7,
            transmission: 0.9,
            roughness: 0.1
          });
          
          const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
          bubble.position.set(
            unitX + (Math.random() - 0.5) * 2,
            0.5 + Math.random() * 2,
            (Math.random() - 0.5) * 2
          );
          
          bubble.userData = {
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 0.01,
              0.01 + Math.random() * 0.02,
              (Math.random() - 0.5) * 0.01
            ),
            life: Math.random() * 300,
            unitX: unitX
          };
          
          allBubbles.add(bubble);
        }
      }
      
      facilitiesRef.current.bubbles = allBubbles;
      scene.add(allBubbles);
      return allBubbles;
    };

    createBubbles();
  };

  useEffect(() => {
    if (sceneRef.current) return;

    const init = () => {
      // Scene
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;
      
      // Camera
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(25, 15, 25);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      rendererRef.current = renderer;
      
      if (mountRef.current) {
        while (mountRef.current.firstChild) {
          mountRef.current.removeChild(mountRef.current.firstChild);
        }
        mountRef.current.appendChild(renderer.domElement);
      }

      // Controls
      const controls = createOrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;

      // Advanced lighting
      const sunLight = new THREE.DirectionalLight(0xfff4e6, 4.0);
      sunLight.position.set(30, 25, 20);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 4096;
      sunLight.shadow.mapSize.height = 4096;
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 100;
      sunLight.shadow.camera.left = -40;
      sunLight.shadow.camera.right = 40;
      sunLight.shadow.camera.top = 40;
      sunLight.shadow.camera.bottom = -40;
      scene.add(sunLight);

      const fillLight = new THREE.DirectionalLight(0x87ceeb, 1.5);
      fillLight.position.set(-20, 15, -15);
      scene.add(fillLight);

      const ambientLight = new THREE.AmbientLight(0x404854, 0.4);
      scene.add(ambientLight);

      rebuildScene();
    };

    init();

    // Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        const time = Date.now() * 0.001;
        
        // Animate energy flow particles
        Object.values(particleSystemsRef.current).forEach(system => {
          system.data.forEach(particleData => {
            particleData.progress += particleData.speed;
            if (particleData.progress > 1) particleData.progress = 0;
            
            particleData.mesh.position.lerpVectors(
              system.start, 
              system.end, 
              particleData.progress
            );
            
            // Add wave motion
            particleData.mesh.position.y += Math.sin(particleData.progress * Math.PI * 4 + time) * 0.2;
            
            // Pulsing glow effect
            particleData.mesh.material.emissiveIntensity = 
              0.3 + Math.sin(time * 5 + particleData.progress * 10) * 0.2;
          });
        });
        
        // Animate bubbles in electrolysis units
        if (facilitiesRef.current.bubbles) {
          facilitiesRef.current.bubbles.children.forEach(bubble => {
            bubble.position.add(bubble.userData.velocity);
            bubble.userData.life--;
            
            if (bubble.userData.life <= 0 || bubble.position.y > 4) {
              bubble.position.set(
                bubble.userData.unitX + (Math.random() - 0.5) * 2,
                0.5,
                (Math.random() - 0.5) * 2
              );
              bubble.userData.life = 200 + Math.random() * 100;
            }
            
            // Bubble opacity animation
            bubble.material.opacity = Math.max(0.2, 
              0.7 - (4 - bubble.position.y) / 4 * 0.5
            );
          });
        }
        
        // Solar panel micro-rotations (tracking sun)
        if (facilitiesRef.current.solarFarm) {
          facilitiesRef.current.solarFarm.children.forEach((panel, index) => {
            const offset = index * 0.1;
            panel.rotation.y = Math.sin(time * 0.1 + offset) * 0.05;
          });
        }
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      
      if (rendererRef.current && mountRef.current) {
        if (mountRef.current.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  // Rebuild scene when counts change
  useEffect(() => {
    if (sceneRef.current && 
        (prevSolarCountRef.current !== solarPanelCount || 
         prevElectrolysisCountRef.current !== electrolysisCount)) {
      
      prevSolarCountRef.current = solarPanelCount;
      prevElectrolysisCountRef.current = electrolysisCount;
      
      rebuildScene();
    }
  }, [solarPanelCount, electrolysisCount]);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {showControls && (
        <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md rounded-lg p-4 text-white z-10">
          <h3 className="text-lg font-bold mb-4">Solar Hydrogen Facility</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Solar Panels: {solarPanelCount}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Electrolysis Units: {electrolysisCount}
              </label>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-300">
            <p>• Drag to rotate view</p>
            <p>• Scroll to zoom</p>
          </div>
        </div>
      )}
      <div 
        ref={mountRef} 
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

export default SolarPanel;