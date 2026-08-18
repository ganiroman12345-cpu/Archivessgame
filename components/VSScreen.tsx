import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store';
import { GameState, ActionType } from '../types';
import { motion } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { Fighter3D } from './Fighter3D';
import { AnimatedBattleBackground } from './AnimatedBattleBackground';
import { Swords, Zap, Shield, Sparkles } from 'lucide-react';

const noEvents = () => ({
  enabled: false,
  priority: 0,
  compute: () => {},
  connect: () => {},
  disconnect: () => {},
});

export const VSScreen: React.FC = () => {
  const player = useGameStore(s => s.player);
  const enemy = useGameStore(s => s.enemy);
  const setGameState = useGameStore(s => s.setGameState);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      setGameState(GameState.CINEMATIC_INTRO);
    }
  }, [countdown, setGameState]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const playerPreviewState = {
    name: player.name,
    modelType: player.modelType,
    color: player.color,
    subColor: player.subColor,
    action: ActionType.IDLE,
    direction: 1,
    hp: player.hp,
    maxHp: player.maxHp,
    energy: player.energy,
    maxEnergy: player.maxEnergy
  };

  const enemyPreviewState = {
    name: enemy.name,
    modelType: enemy.modelType,
    color: enemy.color,
    subColor: enemy.subColor,
    action: ActionType.IDLE,
    direction: -1,
    hp: enemy.hp,
    maxHp: enemy.maxHp,
    energy: enemy.energy,
    maxEnergy: enemy.maxEnergy
  };

  return (
    <div id="vs-screen-container" className="absolute inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-hidden font-sans">
      {/* Dynamic Animated Battle Background */}
      <AnimatedBattleBackground theme="versus" />

      {/* Top Banner with Countdown & Match Info */}
      <div className="w-full flex justify-between items-center px-4 sm:px-8 md:px-12 py-3 bg-gradient-to-b from-black/95 via-black/70 to-transparent z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            IRON FIST ARENA
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono tracking-widest uppercase">MATCH IN</div>
          <motion.div 
            key={countdown}
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(250,204,21,0.9)]"
          >
            {countdown}
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            ROUND 1
          </span>
        </div>
      </div>

      {/* Main VS Arena showing BOTH boxes on screen simultaneously side-by-side */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-row items-center justify-center gap-2 sm:gap-6 md:gap-10 px-2 sm:px-6 py-2">
        
        {/* PLAYER 1 BOX */}
        <motion.div 
          initial={{ x: -80, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.05 }}
          className="flex-1 max-w-[280px] sm:max-w-[340px] flex flex-col items-center"
        >
          {/* Header Tag */}
          <div className="flex items-center gap-1.5 mb-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] sm:text-xs font-mono font-black text-cyan-300 uppercase tracking-widest">
              PLAYER 1 (YOU)
            </span>
          </div>

          {/* Square Viewport for Player 1 - Full Body Preview like Character Selector */}
          <div 
            className="w-full aspect-square max-h-[38vh] sm:max-h-[46vh] rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black border-3 sm:border-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] overflow-hidden relative"
            style={{ borderColor: player.color || '#38bdf8' }}
          >
            {/* Background energy radial glow */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 40%, ${player.color || '#38bdf8'} 0%, transparent 75%)` }}
            />

            {/* 3D Character Viewport exactly framed like FighterPreviewCard */}
            <Canvas 
              shadows 
              events={noEvents}
              dpr={1}
              gl={{ powerPreference: 'high-performance', antialias: false, precision: 'mediump' }}
              className="w-full h-full"
            >
              <PerspectiveCamera makeDefault position={[0, 0.35, 2.3]} fov={38} />
              <ambientLight intensity={1.2} />
              <directionalLight position={[3, 5, 3]} intensity={1.8} />
              <directionalLight position={[-3, 2, -2]} intensity={0.8} color={player.color || '#00ffff'} />
              
              <group position={[0, -0.65, 0]}>
                <Fighter3D who="preview" previewState={playerPreviewState} />
              </group>
              
              <ContactShadows position={[0, -0.7, 0]} opacity={0.7} scale={3.8} blur={2} far={2} color="#000000" />
            </Canvas>

            {/* Corner Tech Accents */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
          </div>

          {/* Name & Title */}
          <div className="mt-2 text-center w-full">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_8px_rgba(6,182,212,0.8)] truncate">
              {player.name}
            </h2>
            <div 
              className="text-[9px] sm:text-xs font-mono font-bold tracking-widest uppercase mt-0.5"
              style={{ color: player.color || '#38bdf8' }}
            >
              {player.modelType === 'FOX' ? 'STRIKER • SPEED' : 'BRUISER • HEAVY'}
            </div>
          </div>
        </motion.div>

        {/* CENTER VS EMBLEM */}
        <div className="flex flex-col items-center justify-center shrink-0 z-20 px-1">
          <motion.div 
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.2 }}
            className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 flex items-center justify-center border-3 sm:border-4 border-black shadow-[0_0_40px_rgba(250,204,21,0.95)] transform rotate-45"
          >
            <span className="text-black font-black text-2xl sm:text-4xl md:text-5xl italic tracking-tighter transform -rotate-45 drop-shadow-md">
              VS
            </span>
          </motion.div>
          <div className="mt-2 text-[8px] sm:text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-bold animate-pulse text-center">
            DUEL
          </div>
        </div>

        {/* PLAYER 2 / RIVAL BOX */}
        <motion.div 
          initial={{ x: 80, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          className="flex-1 max-w-[280px] sm:max-w-[340px] flex flex-col items-center"
        >
          {/* Header Tag */}
          <div className="flex items-center gap-1.5 mb-1.5 px-3 py-0.5 rounded-full bg-red-500/20 border border-red-400/80 shadow-[0_0_12px_rgba(239,68,68,0.4)]">
            <Swords className="w-3 h-3 text-red-400" />
            <span className="text-[9px] sm:text-xs font-mono font-black text-red-300 uppercase tracking-widest">
              OPPONENT (CPU)
            </span>
          </div>

          {/* Square Viewport for Enemy - Full Body Preview like Character Selector */}
          <div 
            className="w-full aspect-square max-h-[38vh] sm:max-h-[46vh] rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black border-3 sm:border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] overflow-hidden relative"
            style={{ borderColor: enemy.color || '#ef4444' }}
          >
            {/* Background energy radial glow */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 40%, ${enemy.color || '#ef4444'} 0%, transparent 75%)` }}
            />

            {/* 3D Character Viewport exactly framed like FighterPreviewCard */}
            <Canvas 
              shadows 
              events={noEvents}
              dpr={1}
              gl={{ powerPreference: 'high-performance', antialias: false, precision: 'mediump' }}
              className="w-full h-full"
            >
              <PerspectiveCamera makeDefault position={[0, 0.35, 2.3]} fov={38} />
              <ambientLight intensity={1.2} />
              <directionalLight position={[-3, 5, 3]} intensity={1.8} />
              <directionalLight position={[3, 2, -2]} intensity={0.8} color={enemy.color || '#ff0055'} />
              
              <group position={[0, -0.65, 0]}>
                <Fighter3D who="preview" previewState={enemyPreviewState} />
              </group>
              
              <ContactShadows position={[0, -0.7, 0]} opacity={0.7} scale={3.8} blur={2} far={2} color="#000000" />
            </Canvas>

            {/* Corner Tech Accents */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-red-400 pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-red-400 pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-red-400 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-red-400 pointer-events-none" />
          </div>

          {/* Name & Title */}
          <div className="mt-2 text-center w-full">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)] truncate">
              {enemy.name}
            </h2>
            <div 
              className="text-[9px] sm:text-xs font-mono font-bold tracking-widest uppercase mt-0.5"
              style={{ color: enemy.color || '#ef4444' }}
            >
              {enemy.modelType === 'FOX' ? 'STRIKER • SPEED' : 'BRUISER • HEAVY'}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Status Bar */}
      <div className="w-full py-2.5 bg-gradient-to-t from-black/95 to-transparent flex justify-center items-center z-10 px-4">
        <div className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-widest uppercase flex items-center gap-2 sm:gap-4 text-center">
          <span>⚔️ FIRST TO KNOCKOUT WINS</span>
          <span>•</span>
          <span>⚡ PRESS S FOR ULTRA ATTACK</span>
        </div>
      </div>
    </div>
  );
};

