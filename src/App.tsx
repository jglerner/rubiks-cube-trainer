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
  const [solveTimes, setSolveTimes] = useState<Array<{time: number, type: 'normal' | 'dnf', penalty?: number}>>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [allTimeSolveTimes, setAllTimeSolveTimes] = useState<Array<{time: number, type: 'normal' | 'dnf', penalty?: number}>>([]);
  const [statsPosition, setStatsPosition] = useState({ x: 16, y: Math.max(20, window.innerHeight - 670) });  
  const [isDraggingStats, setIsDraggingStats] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [timerPosition, setTimerPosition] = useState({ x: 220, y: Math.max(20, window.innerHeight - 280) });
  const [isDraggingTimer, setIsDraggingTimer] = useState(false);
  const [timerDragOffset, setTimerDragOffset] = useState({ x: 0, y: 0 });

  const moves = [
    { label: 'U', desc: 'Top clockwise', face: 'U', turns: 1 },
    { label: "U'", desc: 'Top counter-clockwise', face: 'U', turns: -1 },
    { label: 'U2', desc: 'Top 180°', face: 'U', turns: 2 },
    { label: 'D', desc: 'Bottom clockwise', face: 'D', turns: 1 },
    { label: "D'", desc: 'Bottom counter-clockwise', face: 'D', turns: -1 },
    { label: 'D2', desc: 'Bottom 180°', face: 'D', turns: 2 },
    { label: 'R', desc: 'Right clockwise', face: 'R', turns: 1 },
    { label: "R'", desc: 'Right counter-clockwise', face: 'R', turns: -1 },
    { label: 'R2', desc: 'Right 180°', face: 'R', turns: 2 },
    { label: 'L', desc: 'Left clockwise', face: 'L', turns: 1 },
    { label: "L'", desc: 'Left counter-clockwise', face: 'L', turns: -1 },
    { label: 'L2', desc: 'Left 180°', face: 'L', turns: 2 },
    { label: 'F', desc: 'Front clockwise', face: 'F', turns: 1 },
    { label: "F'", desc: 'Front counter-clockwise', face: 'F', turns: -1 },
    { label: 'F2', desc: 'Front 180°', face: 'F', turns: 2 },
    { label: 'B', desc: 'Back clockwise', face: 'B', turns: 1 },
    { label: "B'", desc: 'Back counter-clockwise', face: 'B', turns: -1 },
    { label: 'B2', desc: 'Back 180°', face: 'B', turns: 2 },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a3e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 600 / 600, 0.1, 1000);
    camera.position.set(7, 7, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    //renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.outputEncoding = 3001; // sRGB encoding
    renderer.setSize(600, 600);
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
  0xCC0000,  // Right - Red (slightly darker)
  0xFF8800,  // Left - Orange (more natural orange)
  0xF5F5F5,  // Top - White (slightly off-white)
  0xFFD700,  // Bottom - Yellow (gold yellow)
  0x00AA00,  // Front - Green (brighter, more natural)
  0x0000CC   // Back - Blue (true blue, not lavender)
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
    let previousMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;

      cubeGroup.rotation.y += deltaX * 0.01;
      cubeGroup.rotation.x += deltaY * 0.01;

      previousMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);

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
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

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
      alert('Please enter a valid hex ID (0x000000000000 to 0xFFFFFFFFFFFF)');
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
        console.log('No previous history found or error loading:', error);
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
    if (confirm('Are you sure you want to clear all solve history? This cannot be undone.')) {
      setSolveTimes([]);
      try {
        localStorage.removeItem('cube-solve-times');
      } catch (error) {
        console.error('Error clearing history:', error);
      }
    }
  };

  const addPenalty = () => {
    if (solveTimes.length === 0) return;
    setSolveTimes(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = { ...updated[lastIndex], penalty: (updated[lastIndex].penalty || 0) + 2 };
      return updated;
    });
    setAllTimeSolveTimes(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (lastIndex >= 0) {
        updated[lastIndex] = { ...updated[lastIndex], penalty: (updated[lastIndex].penalty || 0) + 2 };
      }
      return updated;
    });
  };

  const getTodayMean = () => {
    const normalSolves = solveTimes.filter(s => s.type === 'normal');
    if (normalSolves.length === 0) return null;
    const total = normalSolves.reduce((sum, s) => sum + s.time + (s.penalty || 0), 0);
    return total / normalSolves.length;
  };

  const getAllTimeMean = () => {
    const normalSolves = allTimeSolveTimes.filter(s => s.type === 'normal');
    if (normalSolves.length === 0) return null;
    const total = normalSolves.reduce((sum, s) => sum + s.time + (s.penalty || 0), 0);
    return total / normalSolves.length;
  };

  const resetToday = () => {
    if (confirm('Reset today\'s session?')) {
      setSolveTimes([]);
      setSessionStartTime(Date.now());
    }
  };

  const resetAllTime = () => {
    if (confirm('Reset all-time statistics?')) {
      setAllTimeSolveTimes([]);
      localStorage.removeItem('cube-all-time-solve-times');
    }
  };

  const resetAll = () => {
    if (confirm('Reset EVERYTHING?')) {
      setSolveTimes([]);
      setAllTimeSolveTimes([]);
      setSessionStartTime(Date.now());
      localStorage.removeItem('cube-solve-times');
      localStorage.removeItem('cube-all-time-solve-times');
    }
  };

  const handleStatsMouseDown = (e: React.MouseEvent) => {
    setIsDraggingStats(true);
    setDragOffset({
      x: e.clientX - statsPosition.x,
      y: e.clientY - statsPosition.y
    });
  };

  const handleTimerMouseDown = (e: React.MouseEvent) => {
    setIsDraggingTimer(true);
    setTimerDragOffset({
      x: e.clientX - timerPosition.x,
      y: e.clientY - timerPosition.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingStats) {
        setStatsPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
      if (isDraggingTimer) {
        setTimerPosition({
          x: e.clientX - timerDragOffset.x,
          y: e.clientY - timerDragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStats(false);
      setIsDraggingTimer(false);
    };

    if (isDraggingStats || isDraggingTimer) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingStats, isDraggingTimer, dragOffset, timerDragOffset]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 relative">
      <div className="max-w-5xl w-full">
        <h1 className="text-5xl font-bold text-white mb-3 text-center">
          Rubik's Cube Scrambler
        </h1>
        <p className="text-gray-300 text-center mb-8 text-lg">
          Practice move sequences step by step
        </p>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl mb-6">
          <div className="flex justify-center mb-4">
            <div 
              ref={mountRef} 
              className="rounded-xl shadow-2xl bg-slate-900" 
              style={{ cursor: 'grab' }}
            />
          </div>
          <div className="flex justify-center gap-4">
            <p className="text-gray-400 text-center text-sm">
              🖱️ Drag to rotate
            </p>
            <button
              onClick={resetCube}
              className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all"
            >
              Reset Cube
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Sequence Practice
          </h2>
          
          <div className="mb-6">
            <label className="block text-white text-center mb-3 font-semibold">
              Number of moves:
            </label>
            <div className="flex justify-center gap-3">
              {[2, 5, 10, 15, 18, 20, 25].map(num => (
                <button
                  key={num}
                  onClick={() => setNumMoves(num)}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    numMoves === num
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={generateTwoMoves}
              disabled={!isReady}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl shadow-xl transition-all transform hover:scale-105 text-lg"
            >
              Generate Random {numMoves}-Move Sequence
            </button>
          </div>

          {scrambleId !== null && (
            <div className="bg-slate-700 p-4 rounded-xl mb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-gray-300 font-semibold">Scramble ID:</span>
                <code className="bg-slate-900 px-4 py-2 rounded-lg text-green-400 font-mono text-lg">
                  0x{scrambleId.toString(16).toUpperCase().padStart(12, '0')}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('0x' + scrambleId.toString(16).toUpperCase().padStart(12, '0'));
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-400 text-xs text-center">
                Save this ID to reproduce this exact scramble later
              </p>
            </div>
          )}

          <div className="bg-slate-700 p-4 rounded-xl mb-6">
            <label className="block text-white text-center mb-2 font-semibold text-sm">
              Load Scramble by ID:
            </label>
            <div className="flex gap-2 justify-center">
              <input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="0x000000000000"
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-mono w-56 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={loadScrambleById}
                disabled={!isReady}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all"
              >
                Load
              </button>
            </div>
            <p className="text-gray-400 text-xs text-center mt-2">
              Enter hex ID (0x000000000000 to 0xFFFFFFFFFFFF) - 281,474,976,710,656 unique scrambles (281 trillion)
            </p>
          </div>

          {twoMoveSequence.length > 0 && (
            <div>
              <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-xl mb-4">
                <div className="text-center mb-4">
                  <div className="text-gray-300 text-lg mb-2">
                    {currentMoveIndex === -1 ? 'Ready to execute' : 
                     currentMoveIndex < twoMoveSequence.length - 1 ? `Move ${currentMoveIndex + 2}/${twoMoveSequence.length}` : 
                     'Sequence Complete!'}
                  </div>
                  {currentMoveIndex === -1 ? (
                    <div className="bg-white rounded-2xl shadow-2xl px-12 py-6 inline-block">
                      <span className="text-3xl text-gray-600 font-bold">Click to start</span>
                    </div>
                  ) : currentMoveIndex < twoMoveSequence.length - 1 ? (
                    <div className="bg-white rounded-2xl shadow-2xl px-12 py-6 inline-block min-w-[120px]">
                      <span className="text-6xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {twoMoveSequence[currentMoveIndex + 1]}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-2xl px-12 py-6 inline-block">
                      <span className="text-4xl text-green-600 font-bold">✓ Done!</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={executeAllMoves}
                    disabled={currentMoveIndex !== -1}
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:bg-slate-700 disabled:opacity-40 text-white font-bold rounded-lg transition-all text-lg shadow-xl"
                  >
                    Execute All Moves at Once
                  </button>
                  <button
                    onClick={nextMove}
                    disabled={currentMoveIndex >= twoMoveSequence.length - 1}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:opacity-40 text-white font-bold rounded-lg transition-all text-lg"
                  >
                    Execute Next Move →
                  </button>
                </div>
              </div>

              {currentMoveIndex >= 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Progress</span>
                    <span>{currentMoveIndex + 1} / {twoMoveSequence.length}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((currentMoveIndex + 1) / twoMoveSequence.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 p-6 rounded-xl">
                <h3 className="text-white font-semibold mb-3 text-center">Full Sequence:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {twoMoveSequence.map((move, index) => (
                    <span 
                      key={index}
                      className={`inline-flex items-center justify-center font-bold px-4 py-2 rounded-lg shadow-lg min-w-[3rem] transition-all ${
                        currentMoveIndex === twoMoveSequence.length - 1
                          ? 'bg-gradient-to-br from-green-600 to-green-700 text-white'
                          : index <= currentMoveIndex 
                          ? 'bg-gradient-to-br from-green-600 to-green-700 text-white opacity-60' 
                          : index === currentMoveIndex + 1
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110 ring-4 ring-yellow-400'
                          : 'bg-gradient-to-br from-slate-600 to-slate-700 text-gray-300'
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

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Single Move Testing
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moves.map((move, index) => (
              <button
                key={index}
                onClick={() => executeMove(move.face, move.turns)}
                disabled={!isReady}
                className="bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white p-4 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed"
              >
                <div className="text-3xl font-bold mb-1">{move.label}</div>
                <div className="text-sm opacity-90">{move.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-slate-700 to-slate-600 p-5 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Color Reference:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border-2 border-gray-400 rounded"></div>
                <span><span className="font-bold">U</span> = Top (White)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-gray-400 rounded"></div>
                <span><span className="font-bold">D</span> = Bottom (Yellow)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 border-2 border-gray-400 rounded"></div>
                <span><span className="font-bold">F</span> = Front (Green)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 border-2 border-gray-400 rounded"></div>
                <span><span className="font-bold">B</span> = Back (Blue)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 border-2 border-gray-400 rounded"></div>
                <span><span className="font-bold">L</span> = Left (Orange)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 border-2 border-gray-400 rounded"></div>
                <span><span className="font-bold">R</span> = Right (Red)</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-500 text-sm text-gray-200">
              <p><span className="font-bold">Move notation:</span> No mark = 90° clockwise, ' = 90° counter-clockwise, 2 = 180°</p>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="fixed bg-slate-800 p-4 rounded-xl shadow-2xl border-2 border-slate-600 cursor-move hover:border-blue-500 transition-colors"
        style={{ 
          left: `${timerPosition.x}px`, 
          top: `${timerPosition.y}px`,
          userSelect: 'none'
        }}
        onMouseDown={handleTimerMouseDown}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <div className="text-white text-xs font-semibold text-center">Timer</div>
        </div>
        <div className="bg-slate-900 px-6 py-3 rounded-lg">
          <div className="text-5xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-xs text-gray-400 text-center mt-2">seconds</div>
        </div>
        <div className="flex gap-2 mt-3">
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
            className={`flex-1 px-3 py-1 text-sm font-semibold rounded-lg transition-all ${
              timerRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {timerRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-all"
          >
            Reset
          </button>
        </div>
        <button
          onClick={recordDNF}
          disabled={timerRunning}
          className="w-full mt-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-40 text-white text-sm font-bold rounded-lg transition-all"
        >
          DNF
        </button>
        <div className="text-xs text-gray-400 text-center mt-2">
          Press <kbd className="bg-slate-700 px-2 py-1 rounded text-white">Space</kbd> to start/stop, <kbd className="bg-slate-700 px-2 py-1 rounded text-white">R</kbd> to reset
        </div>
      </div>

      <div 
        className="fixed bg-slate-800 p-4 rounded-xl shadow-2xl border-2 border-slate-600 cursor-move hover:border-blue-500 transition-colors"
        style={{ 
          left: `${statsPosition.x}px`, 
          top: `${statsPosition.y}px`,
          userSelect: 'none'
        }}
        onMouseDown={handleStatsMouseDown}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <div className="text-white text-xs font-semibold text-center">Statistics</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900 px-6 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">Last</div>
            <div className="text-2xl font-bold text-white font-mono">
              {getLastSolve() === 'DNF' ? 'DNF' : getLastSolve() ? formatTime(getLastSolve() as number) : '--:---'}
            </div>
          </div>
          <div className="bg-slate-900 px-6 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">Best</div>
            <div className="text-2xl font-bold text-yellow-400 font-mono">
              {getBestSolve() ? formatTime(getBestSolve()!) : '--:---'}
            </div>
          </div>
          <div className="bg-slate-900 px-6 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">Worst</div>
            <div className="text-2xl font-bold text-red-400 font-mono">
              {getWorstSolve() ? formatTime(getWorstSolve()!) : '--:---'}
            </div>
          </div>
          <div className="bg-slate-900 px-6 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">DNF</div>
            <div className="text-2xl font-bold text-orange-400 font-mono">
              {getDNFCount()}
            </div>
          </div>
          <div className="bg-slate-900 px-6 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">ao5</div>
            <div className="text-2xl font-bold text-green-400 font-mono">
              {getAo5() ? formatTime(getAo5()!) : '--:---'}
            </div>
          </div>
          <div className="bg-slate-900 px-6 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">ao12</div>
            <div className="text-2xl font-bold text-blue-400 font-mono">
              {getAo12() ? formatTime(getAo12()!) : '--:---'}
            </div>
          </div>
          <div className="bg-slate-900 px-6 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">ao100</div>
            <div className="text-2xl font-bold text-purple-400 font-mono">
              {getAo100() ? formatTime(getAo100()!) : '--:---'}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-center mt-3">
                    {/* Session Stats */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-slate-700 p-2 rounded text-center">
              <div className="text-xs text-gray-400">Today's Mean</div>
              <div className="text-sm font-bold text-yellow-400 font-mono">
                {getTodayMean() ? formatTime(getTodayMean()!) : '--'}
              </div>
            </div>
            <div className="bg-slate-700 p-2 rounded text-center">
              <div className="text-xs text-gray-400">All-Time Mean</div>
              <div className="text-sm font-bold text-purple-400 font-mono">
                {getAllTimeMean() ? formatTime(getAllTimeMean()!) : '--'}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 text-center mb-2">
            Today: {solveTimes.length} | All-Time: {allTimeSolveTimes.length} ({getDNFCount()} DNF)
          </div>
          <button
            onClick={addPenalty}
            disabled={solveTimes.length === 0}
            className="w-full mb-2 px-3 py-2 bg-orange-600 disabled:bg-gray-600 text-white text-sm font-semibold rounded transition-all"
          >
            +2s Penalty
          </button>
          <div className="grid grid-cols-3 gap-1 mb-2">
            <button onClick={resetToday} className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
              Reset Today
            </button>
            <button onClick={resetAllTime} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
              Reset All-Time
            </button>
            <button onClick={resetAll} className="px-2 py-1 bg-red-600 text-white text-xs rounded">
              Reset All
            </button>
          </div>

        </div>
        <button
          onClick={clearHistory}
          className="w-full mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all"
        >
          Clear History
        </button>
      </div>

      <div className="fixed bottom-4 right-4 bg-slate-800 p-4 rounded-xl shadow-2xl border-2 border-slate-600">
        <div className="text-white text-xs font-semibold mb-2 text-center">Scramble</div>
        {cubeState && (
          <svg width="240" height="180" viewBox="0 0 240 180">
            {(() => {
              const cellSize = 20;
              const gap = 1;
              
              const colorFill = (colorCode: string) => {
                const colors: {[key: string]: string} = {
                  'U': '#ffffff',
                  'D': '#ffff00',
                  'L': '#ff6600',
                  'R': '#ff0000',
                  'F': '#00dd00',
                  'B': '#0000ff'
                };
                return colors[colorCode] || '#888888';
              };

              const renderFace = (face: string, offsetX: number, offsetY: number) => {
                const faceData = cubeState[face];
                if (!faceData) return null;
                
                return (
                  <g key={face}>
                    {faceData.map((color: string, idx: number) => {
                      let row = Math.floor(idx / 3);
                      let col = idx % 3;
                      
                      if (face === 'U' || face === 'D') {
                        row = 2 - row;
                        col = 2 - col;
                      }
                      
                      const x = offsetX + col * (cellSize + gap);
                      const y = offsetY + row * (cellSize + gap);
                      
                      return (
                        <rect
                          key={idx}
                          x={x}
                          y={y}
                          width={cellSize}
                          height={cellSize}
                          fill={colorFill(color)}
                          stroke="black"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </g>
                );
              };

              return (
                <>
                  {renderFace('U', 60, 0)}
                  {renderFace('L', 0, 60)}
                  {renderFace('F', 60, 60)}
                  {renderFace('R', 120, 60)}
                  {renderFace('B', 180, 60)}
                  {renderFace('D', 60, 120)}
                </>
              );
            })()}
          </svg>
        )}
      </div>
    </div>
  );
};

export default App;
