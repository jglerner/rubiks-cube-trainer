import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

const App = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubesRef = useRef<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [twoMoveSequence, setTwoMoveSequence] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [numMoves, setNumMoves] = useState(2);
  const [scrambleId, setScrambleId] = useState<number | null>(null);
  const [customId, setCustomId] = useState('');
  const [cubeState, setCubeState] = useState<any>(null);
  const animationRef = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const [solveTimes, setSolveTimes] = useState<Array<{time: number, type: 'normal' | 'dnf'}>>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [cubeSize, setCubeSize] = useState(300);

  // Detect mobile and set cube size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Responsive cube sizing
      const size = Math.min(window.innerWidth - 40, window.innerHeight * 0.35, 600);
      setCubeSize(Math.max(size, 250)); // Minimum 250px
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const moves = [
    { label: 'U', desc: 'Top ↻', face: 'U', turns: 1 },
    { label: "U'", desc: 'Top ↺', face: 'U', turns: -1 },
    { label: 'U2', desc: 'Top 180°', face: 'U', turns: 2 },
    { label: 'D', desc: 'Bottom ↻', face: 'D', turns: 1 },
    { label: "D'", desc: 'Bottom ↺', face: 'D', turns: -1 },
    { label: 'D2', desc: 'Bottom 180°', face: 'D', turns: 2 },
    { label: 'R', desc: 'Right ↻', face: 'R', turns: 1 },
    { label: "R'", desc: 'Right ↺', face: 'R', turns: -1 },
    { label: 'R2', desc: 'Right 180°', face: 'R', turns: 2 },
    { label: 'L', desc: 'Left ↻', face: 'L', turns: 1 },
    { label: "L'", desc: 'Left ↺', face: 'L', turns: -1 },
    { label: 'L2', desc: 'Left 180°', face: 'L', turns: 2 },
    { label: 'F', desc: 'Front ↻', face: 'F', turns: 1 },
    { label: "F'", desc: 'Front ↺', face: 'F', turns: -1 },
    { label: 'F2', desc: 'Front 180°', face: 'F', turns: 2 },
    { label: 'B', desc: 'Back ↻', face: 'B', turns: 1 },
    { label: "B'", desc: 'Back ↺', face: 'B', turns: -1 },
    { label: 'B2', desc: 'Back 180°', face: 'B', turns: 2 },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a3e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(7, 7, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputEncoding = 3001;
    renderer.setSize(cubeSize, cubeSize);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);

    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    groupRef.current = cubeGroup;

    const faceColors = [
      0xCC0000, 0xFF8800, 0xF5F5F5, 0xFFD700, 0x00AA00, 0x0000CC
    ];
    
    const cubes: any[] = [];
    const size = 0.96;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(size, size, size);
          const materials = faceColors.map(color => 
            new THREE.MeshStandardMaterial({ 
              color,
              metalness: 0.1,
              roughness: 0.5
            })
          );
          const cube = new THREE.Mesh(geometry, materials);
          cube.position.set(x, y, z);
          
          const edges = new THREE.EdgesGeometry(geometry);
          const line = new THREE.LineSegments(
            edges, 
            new THREE.LineBasicMaterial({ color: 0x1a1a1a, linewidth: 2 })
          );
          cube.add(line);
          
          cubeGroup.add(cube);
          cubes.push({ 
            mesh: cube, 
            pos: { x, y, z },
            originalPos: { x, y, z }
          });
        }
      }
    }
    cubesRef.current = cubes;

    updateCubeState();

    let isDragging = false;
    let previousTouch = { x: 0, y: 0 };

    const onStart = (clientX: number, clientY: number) => {
      isDragging = true;
      previousTouch = { x: clientX, y: clientY };
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      
      const deltaX = clientX - previousTouch.x;
      const deltaY = clientY - previousTouch.y;

      cubeGroup.rotation.y += deltaX * 0.01;
      cubeGroup.rotation.x += deltaY * 0.01;

      previousTouch = { x: clientX, y: clientY };
    };

    const onEnd = () => {
      isDragging = false;
    };

    // Mouse events
    const onMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('mouseleave', onEnd);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    setIsReady(true);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onEnd);
      canvas.removeEventListener('mouseleave', onEnd);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onEnd);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [cubeSize]);

  const rotateFace = (face: string, turns: number) => {
    const cubes = cubesRef.current;
    const angle = turns * Math.PI / 2;

    cubes.forEach(({ mesh, pos }) => {
      let shouldRotate = false;
      let axis = new THREE.Vector3();

      switch(face) {
        case 'U': shouldRotate = pos.y === 1; axis.set(0, -1, 0); break;
        case 'D': shouldRotate = pos.y === -1; axis.set(0, 1, 0); break;
        case 'L': shouldRotate = pos.x === -1; axis.set(1, 0, 0); break;
        case 'R': shouldRotate = pos.x === 1; axis.set(-1, 0, 0); break;
        case 'F': shouldRotate = pos.z === 1; axis.set(0, 0, -1); break;
        case 'B': shouldRotate = pos.z === -1; axis.set(0, 0, 1); break;
      }

      if (shouldRotate) {
        const rotMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
        const localPos = new THREE.Vector3(pos.x, pos.y, pos.z);
        localPos.applyMatrix4(rotMatrix);
        
        pos.x = Math.round(localPos.x);
        pos.y = Math.round(localPos.y);
        pos.z = Math.round(localPos.z);
        mesh.position.set(pos.x, pos.y, pos.z);

        mesh.rotateOnWorldAxis(axis, angle);
      }
    });
    
    updateCubeState();
  };

  const updateCubeState = () => {
    const cubes = cubesRef.current;
    if (!cubes || cubes.length === 0) return;

    const state: any = {
      U: Array(9).fill('?'),
      D: Array(9).fill('?'),
      L: Array(9).fill('?'),
      R: Array(9).fill('?'),
      F: Array(9).fill('?'),
      B: Array(9).fill('?')
    };

    const getColorInDirection = (mesh: any, direction: THREE.Vector3) => {
      const worldQuaternion = new THREE.Quaternion();
      mesh.getWorldQuaternion(worldQuaternion);
      
      const faces = [
        { normal: new THREE.Vector3(1, 0, 0), name: 'R' },
        { normal: new THREE.Vector3(-1, 0, 0), name: 'L' },
        { normal: new THREE.Vector3(0, 1, 0), name: 'U' },
        { normal: new THREE.Vector3(0, -1, 0), name: 'D' },
        { normal: new THREE.Vector3(0, 0, 1), name: 'F' },
        { normal: new THREE.Vector3(0, 0, -1), name: 'B' }
      ];
      
      for (const face of faces) {
        const worldNormal = face.normal.clone().applyQuaternion(worldQuaternion);
        const dot = worldNormal.dot(direction);
        if (dot > 0.99) {
          return face.name;
        }
      }
      return '?';
    };

    cubes.forEach(({ mesh, pos }: any) => {
      if (pos.y === 1) {
        const col = -pos.x + 1;
        const row = -pos.z + 1;
        const idx = row * 3 + col;
        state.U[idx] = getColorInDirection(mesh, new THREE.Vector3(0, 1, 0));
      }
      if (pos.y === -1) {
        const col = -pos.x + 1;
        const row = pos.z + 1;
        const idx = row * 3 + col;
        state.D[idx] = getColorInDirection(mesh, new THREE.Vector3(0, -1, 0));
      }
      if (pos.z === 1) {
        const col = pos.x + 1;
        const row = -pos.y + 1;
        const idx = row * 3 + col;
        state.F[idx] = getColorInDirection(mesh, new THREE.Vector3(0, 0, 1));
      }
      if (pos.z === -1) {
        const col = -pos.x + 1;
        const row = -pos.y + 1;
        const idx = row * 3 + col;
        state.B[idx] = getColorInDirection(mesh, new THREE.Vector3(0, 0, -1));
      }
      if (pos.x === -1) {
        const row = -pos.y + 1;
        const col = pos.z + 1;
        const idx = row * 3 + col;
        state.L[idx] = getColorInDirection(mesh, new THREE.Vector3(-1, 0, 0));
      }
      if (pos.x === 1) {
        const col = -pos.z + 1;
        const row = -pos.y + 1;
        const idx = row * 3 + col;
        state.R[idx] = getColorInDirection(mesh, new THREE.Vector3(1, 0, 0));
      }
    });

    setCubeState(state);
  };

  const executeMove = (face: string, turns: number) => {
    rotateFace(face, turns);
  };

  const resetCube = () => {
    cubesRef.current.forEach(({ mesh, pos, originalPos }) => {
      pos.x = originalPos.x;
      pos.y = originalPos.y;
      pos.z = originalPos.z;
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.rotation.set(0, 0, 0);
    });
    setCurrentMoveIndex(-1);
    updateCubeState();
  };

  const seededRandom = (seed: number) => {
    return () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };

  const generateFromSeed = (seed: number) => {
    resetCube();
    const rng = seededRandom(seed);
    const allMoves = [
      'U', "U'", 'U2', 'D', "D'", 'D2',
      'R', "R'", 'R2', 'L', "L'", 'L2',
      'F', "F'", 'F2', 'B', "B'", 'B2'
    ];
    
    const sequence: string[] = [];
    let lastMove: string | null = null;
    let lastAxis: string | null = null;
    
    for (let i = 0; i < numMoves; i++) {
      let move: string;
      let moveFace: string;
      let moveAxis: string;
      let attempts = 0;
      
      do {
        const index = Math.floor(rng() * allMoves.length);
        move = allMoves[index];
        moveFace = move[0];
        
        if (moveFace === 'U' || moveFace === 'D') moveAxis = 'Y';
        else if (moveFace === 'L' || moveFace === 'R') moveAxis = 'X';
        else moveAxis = 'Z';
        
        attempts++;
        if (attempts > 100) break;
        
      } while (
        moveFace === lastMove || 
        (moveAxis === lastAxis && (
          (moveFace === 'U' && lastMove === 'D') ||
          (moveFace === 'D' && lastMove === 'U') ||
          (moveFace === 'L' && lastMove === 'R') ||
          (moveFace === 'R' && lastMove === 'L') ||
          (moveFace === 'F' && lastMove === 'B') ||
          (moveFace === 'B' && lastMove === 'F')
        ))
      );
      
      sequence.push(move);
      lastMove = moveFace;
      lastAxis = moveAxis;
    }
    
    setTwoMoveSequence(sequence);
    setScrambleId(seed);
    setCurrentMoveIndex(-1);
  };

  const generateTwoMoves = () => {
    const randomId = Math.floor(Math.random() * 0x1000000000000);
    generateFromSeed(randomId);
  };

  const loadScrambleById = () => {
    const id = parseInt(customId, 16);
    if (isNaN(id) || id < 0 || id > 0xFFFFFFFFFFFF) {
      alert('Invalid hex ID');
      return;
    }
    generateFromSeed(id);
  };

  const executeAllMoves = () => {
    twoMoveSequence.forEach(move => {
      const face = move[0];
      let turns = 1;
      if (move.includes('2')) turns = 2;
      else if (move.includes("'")) turns = -1;
      executeMove(face, turns);
    });
    setCurrentMoveIndex(twoMoveSequence.length - 1);
  };

  const nextMove = () => {
    if (currentMoveIndex < twoMoveSequence.length - 1) {
      const nextIndex = currentMoveIndex + 1;
      const move = twoMoveSequence[nextIndex];
      const face = move[0];
      let turns = 1;
      if (move.includes('2')) turns = 2;
      else if (move.includes("'")) turns = -1;
      executeMove(face, turns);
      setCurrentMoveIndex(nextIndex);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (!timerRunning) {
          setTimerRunning(true);
          startTimeRef.current = Date.now() - elapsedTime;
        } else {
          setTimerRunning(false);
          if (elapsedTime > 0) {
            setSolveTimes(prev => [...prev, { time: elapsedTime, type: 'normal' }]);
          }
        }
      }
      if ((e.code === 'KeyR' || e.key === 'r' || e.key === 'R') && !e.repeat) {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timerRunning, elapsedTime]);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - (startTimeRef.current || 0));
      }, 10);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000));
    return `${totalSeconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setElapsedTime(0);
  };

  const recordDNF = () => {
    setSolveTimes(prev => [...prev, { time: 0, type: 'dnf' }]);
    resetTimer();
  };

  const calculateAverage = (solves: Array<{time: number, type: string}>, count: number) => {
    const normalSolves = solves.filter(s => s.type === 'normal').map(s => s.time);
    if (normalSolves.length < count) return null;
    const lastN = normalSolves.slice(-count);
    const sorted = [...lastN].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, -1);
    const avg = trimmed.reduce((sum, time) => sum + time, 0) / trimmed.length;
    return avg;
  };

  const getLastSolve = () => {
    if (solveTimes.length === 0) return null;
    const last = solveTimes[solveTimes.length - 1];
    return last.type === 'dnf' ? 'DNF' : last.time;
  };

  const getBestSolve = () => {
    const normalSolves = solveTimes.filter(s => s.type === 'normal');
    if (normalSolves.length === 0) return null;
    return Math.min(...normalSolves.map(s => s.time));
  };

  const getWorstSolve = () => {
    const normalSolves = solveTimes.filter(s => s.type === 'normal');
    if (normalSolves.length === 0) return null;
    return Math.max(...normalSolves.map(s => s.time));
  };

  const getDNFCount = () => {
    return solveTimes.filter(s => s.type === 'dnf').length;
  };

  const getAo5 = () => calculateAverage(solveTimes, 5);
  const getAo12 = () => calculateAverage(solveTimes, 12);
  const getAo100 = () => calculateAverage(solveTimes, 100);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = localStorage.getItem('cube-solve-times');
        if (stored) {
          const times = JSON.parse(stored);
          if (times.length > 0 && typeof times[0] === 'number') {
            setSolveTimes(times.map((time: number) => ({ time, type: 'normal' })));
          } else {
            setSolveTimes(times);
          }
        }
      } catch (error) {
        console.log('No previous history found');
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (!isLoadingHistory && solveTimes.length > 0) {
      try {
        localStorage.setItem('cube-solve-times', JSON.stringify(solveTimes));
      } catch (error) {
        console.error('Error saving history:', error);
      }
    }
  }, [solveTimes, isLoadingHistory]);

  const clearHistory = () => {
    if (confirm('Clear all solve history?')) {
      setSolveTimes([]);
      try {
        localStorage.removeItem('cube-solve-times');
      } catch (error) {
        console.error('Error clearing history:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-2 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 text-center">
          Rubik's Cube Trainer
        </h1>

        {/* Cube Display */}
        <div className="bg-slate-800 rounded-lg p-3 md:p-6 shadow-2xl mb-3">
          <div className="flex justify-center mb-2">
            <div 
              ref={mountRef} 
              className="rounded-lg shadow-2xl bg-slate-900 touch-none" 
              style={{ cursor: 'grab', width: cubeSize, height: cubeSize }}
            />
          </div>
          <div className="flex justify-center gap-2 text-xs md:text-sm">
            <p className="text-gray-400">👆 Drag to rotate</p>
            <button
              onClick={resetCube}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-semibold rounded transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Scramble Controls */}
        <div className="bg-slate-800 rounded-lg p-3 md:p-6 shadow-2xl mb-3">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-3 text-center">
            Sequence Practice
          </h2>
          
          <div className="mb-4">
            <label className="block text-white text-center mb-2 text-sm font-semibold">
              Moves:
            </label>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {[2, 5, 10, 15, 20, 25].map(num => (
                <button
                  key={num}
                  onClick={() => setNumMoves(num)}
                  className={`px-3 md:px-4 py-1 md:py-2 rounded text-sm md:text-base font-bold transition-all ${
                    numMoves === num
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105'
                      : 'bg-slate-700 text-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mb-4">
            <button
              onClick={generateTwoMoves}
              disabled={!isReady}
              className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white text-sm md:text-base font-bold rounded-lg shadow-xl transition-all"
            >
              Generate {numMoves} Moves
            </button>
          </div>

          {scrambleId !== null && (
            <div className="bg-slate-700 p-2 md:p-3 rounded-lg mb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-gray-300 text-xs md:text-sm font-semibold">ID:</span>
                <code className="bg-slate-900 px-2 py-1 rounded text-green-400 font-mono text-xs md:text-sm">
                  {scrambleId.toString(16).toUpperCase().padStart(12, '0')}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('0x' + scrambleId.toString(16).toUpperCase().padStart(12, '0'));
                  }}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {twoMoveSequence.length > 0 && (
            <div>
              <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-3 md:p-4 rounded-lg mb-3">
                <div className="text-center mb-3">
                  <div className="text-gray-300 text-sm md:text-base mb-2">
                    {currentMoveIndex === -1 ? 'Ready' : 
                     currentMoveIndex < twoMoveSequence.length - 1 ? `Move ${currentMoveIndex + 2}/${twoMoveSequence.length}` : 
                     'Complete!'}
                  </div>
                  {currentMoveIndex === -1 ? (
                    <div className="bg-white rounded-lg px-6 py-3 inline-block">
                      <span className="text-xl md:text-2xl text-gray-600 font-bold">Tap to start</span>
                    </div>
                  ) : currentMoveIndex < twoMoveSequence.length - 1 ? (
                    <div className="bg-white rounded-lg px-8 py-4 inline-block">
                      <span className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {twoMoveSequence[currentMoveIndex + 1]}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg px-6 py-3 inline-block">
                      <span className="text-2xl md:text-3xl text-green-600 font-bold">✓ Done!</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={executeAllMoves}
                    disabled={currentMoveIndex !== -1}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 disabled:bg-slate-700 disabled:opacity-40 text-white text-sm md:text-base font-bold rounded transition-all"
                  >
                    Execute All
                  </button>
                  <button
                    onClick={nextMove}
                    disabled={currentMoveIndex >= twoMoveSequence.length - 1}
                    className="px-4 py-2 bg-blue-600 disabled:bg-slate-700 disabled:opacity-40 text-white text-sm md:text-base font-bold rounded transition-all"
                  >
                    Next Move →
                  </button>
                </div>
              </div>

              {currentMoveIndex >= 0 && (
                <div className="mb-3">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${((currentMoveIndex + 1) / twoMoveSequence.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 p-3 rounded-lg">
                <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                  {twoMoveSequence.map((move, index) => (
                    <span 
                      key={index}
                      className={`inline-flex items-center justify-center font-bold px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm ${
                        currentMoveIndex === twoMoveSequence.length - 1
                          ? 'bg-green-600 text-white'
                          : index <= currentMoveIndex 
                          ? 'bg-green-600 text-white opacity-60' 
                          : index === currentMoveIndex + 1
                          ? 'bg-purple-600 text-white scale-110'
                          : 'bg-slate-600 text-gray-300'
                      }`}
                    >
                      {move}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="bg-slate-800 p-3 md:p-4 rounded-lg shadow-2xl mb-3">
          <div className="text-white text-sm font-semibold mb-2 text-center">Timer</div>
          <div className="bg-slate-900 px-4 py-2 rounded-lg mb-2">
            <div className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
              {formatTime(elapsedTime)}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!timerRunning) {
                  setTimerRunning(true);
                  startTimeRef.current = Date.now() - elapsedTime;
                } else {
                  setTimerRunning(false);
                  if (elapsedTime > 0) {
                    setSolveTimes(prev => [...prev, { time: elapsedTime, type: 'normal' }]);
                  }
                }
              }}
              className={`flex-1 px-3 py-2 text-sm font-semibold rounded transition-all ${
                timerRunning 
                  ? 'bg-red-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}
            >
              {timerRunning ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-3 py-2 bg-slate-600 text-white text-sm font-semibold rounded transition-all"
            >
              Reset
            </button>
            <button
              onClick={recordDNF}
              disabled={timerRunning}
              className="px-3 py-2 bg-orange-600 disabled:bg-gray-600 disabled:opacity-40 text-white text-sm font-bold rounded transition-all"
            >
              DNF
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-slate-800 p-3 md:p-4 rounded-lg shadow-2xl mb-3">
          <div className="text-white text-sm font-semibold mb-2 text-center">Statistics</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-slate-900 p-2 rounded text-center">
              <div className="text-xs text-gray-400">Last</div>
              <div className="text-lg md:text-xl font-bold text-white font-mono">
                {getLastSolve() === 'DNF' ? 'DNF' : getLastSolve() ? formatTime(getLastSolve() as number) : '--'}
              </div>
            </div>
            <div className="bg-slate-900 p-2 rounded text-center">
              <div className="text-xs text-gray-400">Best</div>
              <div className="text-lg md:text-xl font-bold text-yellow-400 font-mono">
                {getBestSolve() ? formatTime(getBestSolve()!) : '--'}
              </div>
            </div>
            <div className="bg-slate-900 p-2 rounded text-center">
              <div className="text-xs text-gray-400">ao5</div>
              <div className="text-lg md:text-xl font-bold text-green-400 font-mono">
                {getAo5() ? formatTime(getAo5()!) : '--'}
              </div>
            </div>
            <div className="bg-slate-900 p-2 rounded text-center">
              <div className="text-xs text-gray-400">ao12</div>
              <div className="text-lg md:text-xl font-bold text-blue-400 font-mono">
                {getAo12() ? formatTime(getAo12()!) : '--'}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 text-center mt-2">
            Total: {solveTimes.length} ({getDNFCount()} DNF)
          </div>
          <button
            onClick={clearHistory}
            className="w-full mt-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded transition-all"
          >
            Clear History
          </button>
        </div>

        {/* Move Controls - Collapsed on mobile */}
        <details className="bg-slate-800 rounded-lg shadow-2xl mb-3">
          <summary className="p-3 md:p-4 text-white text-sm md:text-base font-semibold cursor-pointer">
            Manual Controls (Tap to expand)
          </summary>
          <div className="p-3 md:p-4 grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-2">
            {moves.map((move, index) => (
              <button
                key={index}
                onClick={() => executeMove(move.face, move.turns)}
                disabled={!isReady}
                className="bg-blue-600 disabled:bg-gray-600 text-white p-2 rounded text-xs md:text-sm"
              >
                <div className="font-bold">{move.label}</div>
                <div className="text-xs opacity-90">{move.desc}</div>
              </button>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default App;
