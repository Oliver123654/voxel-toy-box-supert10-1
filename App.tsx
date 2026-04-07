/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useRef, useState } from 'react';
import { VoxelEngine } from './services/VoxelEngine';
import { UIOverlay } from './components/UIOverlay';
import { JsonModal } from './components/JsonModal';
import { PromptModal } from './components/PromptModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Generators } from './utils/voxelGenerators';
import { AppState, VoxelData, SavedModel, LegoApiCallRequest } from './types';
import callOpenrouter from './model/openrouter';
import callOpenAIClient, { callLlamaClient } from '@/model/openai';
import api from './services/endpoints/api';
import { stream } from '@openrouter/sdk/lib/matchers.js';
import { json } from 'stream/consumers';


const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VoxelEngine | null>(null);

  const [appState, setAppState] = useState<AppState>(AppState.STABLE);
  const [voxelCount, setVoxelCount] = useState<number>(0);

  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonModalMode, setJsonModalMode] = useState<'view' | 'import'>('view');

  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptMode, setPromptMode] = useState<'create' | 'morph'>('create');

  const [showWelcome, setShowWelcome] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [jsonData, setJsonData] = useState('');
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // --- State for Custom Models ---
  const [currentBaseModel, setCurrentBaseModel] = useState<string>('Eagle');
  const [customBuilds, setCustomBuilds] = useState<SavedModel[]>([]);
  const [customRebuilds, setCustomRebuilds] = useState<SavedModel[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Engine
    const engine = new VoxelEngine(
      containerRef.current,
      (newState) => setAppState(newState),
      (count) => setVoxelCount(count)
    );

    engineRef.current = engine;

    // Initial Model Load
    engine.loadInitialModel(Generators.Eagle());

    // Resize Listener
    const handleResize = () => engine.handleResize();
    window.addEventListener('resize', handleResize);

    // Auto-hide welcome screen after interaction (optional, but sticking to simple toggle for now)
    // For now, just auto-hide after 5s or user dismiss
    const timer = setTimeout(() => setShowWelcome(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      engine.cleanup();
    };
  }, []);

  const handleDismantle = () => {
    engineRef.current?.dismantle();
  };

  const handleNewScene = (type: 'Eagle') => {
    const generator = Generators[type];
    if (generator && engineRef.current) {
      engineRef.current.loadInitialModel(generator());
      setCurrentBaseModel('Eagle');
    }
  };

  const handleSelectCustomBuild = (model: SavedModel) => {
    if (engineRef.current) {
      engineRef.current.loadInitialModel(model.data);
      setCurrentBaseModel(model.name);
    }
  };

  const handleRebuild = (type: 'Eagle' | 'Cat' | 'Rabbit' | 'Twins') => {
    const generator = Generators[type];
    if (generator && engineRef.current) {
      engineRef.current.rebuild(generator());
    }
  };

  const handleSelectCustomRebuild = (model: SavedModel) => {
    if (engineRef.current) {
      engineRef.current.rebuild(model.data);
    }
  };

  const handleShowJson = () => {
    if (engineRef.current) {
      setJsonData(engineRef.current.getJsonData());
      setJsonModalMode('view');
      setIsJsonModalOpen(true);
    }
  };

  const handleImportClick = () => {
    setJsonModalMode('import');
    setIsJsonModalOpen(true);
  };

  const handleJsonImport = (jsonStr: string) => {
    try {
      const rawData = JSON.parse(jsonStr);
      if (!Array.isArray(rawData)) throw new Error("JSON must be an array");

      const voxelData: VoxelData[] = rawData.map((v: any) => {
        let colorVal = v.c || v.color;
        let colorInt = 0xCCCCCC;

        if (typeof colorVal === 'string') {
          if (colorVal.startsWith('#')) colorVal = colorVal.substring(1);
          colorInt = parseInt(colorVal, 16);
        } else if (typeof colorVal === 'number') {
          colorInt = colorVal;
        }

        return {
          x: Number(v.x) || 0,
          y: Number(v.y) || 0,
          z: Number(v.z) || 0,
          color: isNaN(colorInt) ? 0xCCCCCC : colorInt
        };
      });

      if (engineRef.current) {
        engineRef.current.loadInitialModel(voxelData);
        setCurrentBaseModel('Imported Build');
      }
    } catch (e) {
      console.error("Failed to import JSON", e);
      alert("Failed to import JSON. Please ensure the format is correct.");
    }
  };

  const openPrompt = (mode: 'create' | 'morph') => {
    setPromptMode(mode);
    setIsPromptModalOpen(true);
  }

  const handleToggleRotation = () => {
    const newState = !isAutoRotate;
    setIsAutoRotate(newState);
    if (engineRef.current) {
      engineRef.current.setAutoRotate(newState);
    }
  }

  const handlePromptSubmit = async (prompt: string) => {
    /*API key check should be on Netlify Edge Functions */

    setIsGenerating(true);
    // Close modal immediately so we can show the main loading indicator
    setIsPromptModalOpen(false);

    try {


      const streaming = true;
      let systemContext = "";
      if (promptMode === 'morph' && engineRef.current) {
        const availableColors = engineRef.current.getUniqueColors().join(', ');
        systemContext = `
                CONTEXT: You are re-assembling an existing pile of lego-like voxels.
                The current pile consists of these colors: [${availableColors}].
                TRY TO USE THESE COLORS if they fit the requested shape.
                If the requested shape absolutely requires different colors, you may use them, but prefer the existing palette to create a "rebuilding" effect.
                The model should be roughly the same volume as the previous one.
            `;
      } else {
        systemContext = `
                CONTEXT: You are creating a brand new voxel art scene from scratch.
                Be creative with colors.
            `;
      }

      // const response = await callOpenrouter(systemContext);
      // const rawResponse = response?.text;
      // const rawData = JSON.parse(rawResponse);



      // const rawData = JSON.parse(rawResponse);
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          systemContext, prompt,

          stream: streaming
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }

      // const endpoint = "lego-openrouter";
      // const endpoint = "lego-gemini";
      const endpoint = "lego-openai-github";
      // const endpoint = "lego-llama-github";
      let rawResponse;
      if (streaming) {
        const NETLIFY_URL = "/.netlify/functions/"; //or config "/api/"
        const streamResponse = await fetch(NETLIFY_URL + endpoint, requestOptions)

        const reader = streamResponse.body.getReader();
        let completeResponse = ''
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            const jsonResponse = JSON.parse(completeResponse);
      
            rawResponse = jsonResponse?.voxel_model_array??jsonResponse;
            console.log('The stream is done.', rawResponse);
            break;
          }
          const decoder = new TextDecoder();
          const decodedValue = decoder.decode(value);
          // console.log('Just read a chunk:', decodedValue);

          completeResponse += decodedValue;

        }
      }
      else {
        rawResponse = await fetch("/api/" + endpoint, requestOptions);

      }




      if (rawResponse) {
        const rawData = streaming
          ? rawResponse
          : await rawResponse.json();
        
        // Validate and transform to VoxelData
        const voxelData: VoxelData[] = rawData.map((v: any) => {
          let colorStr = v.color;
          if (colorStr.startsWith('#')) colorStr = colorStr.substring(1);
          const colorInt = parseInt(colorStr, 16);

          return {
            x: v.x,
            y: v.y,
            z: v.z,
            color: isNaN(colorInt) ? 0xCCCCCC : colorInt
          };
        });

        if (engineRef.current) {
          if (promptMode === 'create') {
            engineRef.current.loadInitialModel(voxelData);
            setCustomBuilds(prev => [...prev, { name: prompt, data: voxelData }]);
            setCurrentBaseModel(prompt);
          } else {
            engineRef.current.rebuild(voxelData);
            // Store baseModel to scope this rebuild to the current scene
            setCustomRebuilds(prev => [...prev, {
              name: prompt,
              data: voxelData,
              baseModel: currentBaseModel
            }]);
          }
        }
      }
    } catch (err) {
      console.error("Generation failed", err);
      alert("Oops! Something went wrong generating the model.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter rebuilds to only show those relevant to the current base model
  const relevantRebuilds = customRebuilds.filter(
    r => r.baseModel === currentBaseModel
  );

  return (
    <div className="relative w-full h-screen bg-[#f0f2f5] overflow-hidden">
      {/* 3D Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* UI Overlay */}
      <UIOverlay
        voxelCount={voxelCount}
        appState={appState}
        currentBaseModel={currentBaseModel}
        customBuilds={customBuilds}
        customRebuilds={relevantRebuilds}
        isAutoRotate={isAutoRotate}
        isInfoVisible={showWelcome}
        isGenerating={isGenerating}
        onDismantle={handleDismantle}
        onRebuild={handleRebuild}
        onNewScene={handleNewScene}
        onSelectCustomBuild={handleSelectCustomBuild}
        onSelectCustomRebuild={handleSelectCustomRebuild}
        onPromptCreate={() => openPrompt('create')}
        onPromptMorph={() => openPrompt('morph')}
        onShowJson={handleShowJson}
        onImportJson={handleImportClick}
        onToggleRotation={handleToggleRotation}
        onToggleInfo={() => setShowWelcome(!showWelcome)}
      />

      {/* Modals & Screens */}

      <WelcomeScreen visible={showWelcome} />

      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        data={jsonData}
        isImport={jsonModalMode === 'import'}
        onImport={handleJsonImport}
      />

      <PromptModal
        isOpen={isPromptModalOpen}
        mode={promptMode}
        onClose={() => setIsPromptModalOpen(false)}
        onSubmit={handlePromptSubmit}
      />
    </div>
  );
};

export default App;
