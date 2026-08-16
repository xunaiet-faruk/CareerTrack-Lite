import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';

// CDN থেকে মডেল লোড করুন (Render-এ কাজ করবে)
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://career-track-lite-omz9.onrender.com';

const EXPERIENCE_LEVELS = ['Fresher', 'Junior', 'Mid', 'Senior'];
const INTERVIEW_TYPES = ['Technical', 'HR', 'Behavioral', 'Mixed'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// Predefined job roles for dropdown
const JOB_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'ML Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Mobile Developer',
  'QA Engineer',
  'Other'
];

const MockInterview = ({ userEmail = "test@test.com" }) => {
  const [step, setStep] = useState('setup');
  const [form, setForm] = useState({
    jobRole: '',
    customJobRole: '',
    experienceLevel: 'Mid',
    interviewType: 'Mixed',
    difficulty: 'Medium',
    questionCount: 6
  });
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [suggested, setSuggested] = useState(null);

  const [mediaReady, setMediaReady] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [brightnessWarning, setBrightnessWarning] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);
  const [analyzingCount, setAnalyzingCount] = useState(0);
  const [finalReport, setFinalReport] = useState(null);
  const [modelLoadError, setModelLoadError] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const sampleIntervalRef = useRef(null);
  const samplesRef = useRef([]);
  const audioAnalyserRef = useRef(null);
  const micRafRef = useRef(null);
  
  // Track if we've already initialized camera
  const initRef = useRef(false);
  // FIX: Ref for analyzingCount to avoid stale closure
  const analyzingCountRef = useRef(0);

  // Sync analyzingCount ref with state
  useEffect(() => {
    analyzingCountRef.current = analyzingCount;
  }, [analyzingCount]);
// ==================== FETCH SUGGESTED ROLE ====================
useEffect(() => {
  const fetchSuggestion = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/mock-interview/suggested-role/${userEmail}`);
      
      // Handle non-JSON responses
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ Non-JSON response from server');
        return;
      }
      
      if (!res.ok) {
        console.warn(`⚠️ Server responded with ${res.status}`);
        return;
      }
      
      const json = await res.json();
      if (json.success && json.data) {
        setSuggested(json.data);
        const role = json.data.jobRole || '';
        const isKnownRole = JOB_ROLES.includes(role);
        setForm(prev => ({
          ...prev,
          jobRole: isKnownRole ? role : 'Other',
          customJobRole: isKnownRole ? '' : role,
          interviewType: 'Technical'
        }));
      }
    } catch (err) {
      console.warn('Suggested role fetch failed:', err);
    }
  };
  fetchSuggestion();
}, [userEmail]);

  const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const getFinalJobRole = () => {
    if (form.jobRole === 'Other' && form.customJobRole.trim()) {
      return form.customJobRole.trim();
    }
    return form.jobRole;
  };

  const handleStartSetup = async (e) => {
    e.preventDefault();
    const finalRole = getFinalJobRole();
    if (!finalRole) {
      setError('Please select or enter a job title.');
      return;
    }
    setError('');
    setStep('permissions');
  };

  // ==================== CAMERA + MIC + MODELS SETUP ====================
  useEffect(() => {
    if (step !== 'permissions') return;
    if (initRef.current) return; // Don't redo setup on re-renders
    initRef.current = true;

    let cancelled = false;
    let modelLoadAttempted = false;

    const setup = async () => {
      // 1. Load face-api models
      if (!modelLoadAttempted) {
        modelLoadAttempted = true;
        try {
          console.log('🔄 Loading face-api models from CDN...');
          console.log('📁 Model URL:', MODEL_URL);
          
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          console.log('✅ TinyFaceDetector loaded');
          
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          console.log('✅ FaceLandmark68 loaded');
          
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
          console.log('✅ FaceExpression loaded');
          
          if (!cancelled) {
            setModelsReady(true);
            setModelLoadError(false);
            console.log('✅ All AI models loaded successfully!');
          }
        } catch (err) {
          console.error('❌ Model load error:', err);
          if (!cancelled) {
            setModelLoadError(true);
            setError('AI models failed to load. Please check your internet connection and try again. Error: ' + err.message);
          }
        }
      }

      try {
        console.log('🎥 Requesting camera and microphone access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log('✅ Video stream playing');
        }
        setMediaReady(true);

        // 3. Mic level meter
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          audioAnalyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const tickMic = () => {
            if (!cancelled) {
              analyser.getByteFrequencyData(dataArray);
              const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
              setMicLevel(Math.min(100, Math.round((avg / 255) * 100 * 3)));
              micRafRef.current = requestAnimationFrame(tickMic);
            }
          };
          tickMic();
        } catch (audioErr) {
          console.warn('⚠️ Audio context error:', audioErr);
        }

        // 4. Brightness check
        const canvas = canvasRef.current;
        const checkBrightness = () => {
          if (!videoRef.current || !canvas || videoRef.current.readyState < 2) return;
          try {
            canvas.width = 80;
            canvas.height = 60;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(videoRef.current, 0, 0, 80, 60);
            const frame = ctx.getImageData(0, 0, 80, 60).data;
            let total = 0;
            for (let i = 0; i < frame.length; i += 4) {
              total += (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
            }
            const brightness = total / (frame.length / 4);
            setBrightnessWarning(brightness < 60);
          } catch (err) {
            console.warn('⚠️ Brightness check error:', err);
          }
        };
        sampleIntervalRef.current = setInterval(checkBrightness, 1500);
        setTimeout(checkBrightness, 500);
        
      } catch (err) {
        console.error('❌ Camera/mic setup error:', err);
        if (!cancelled) {
          setError('Could not access camera/microphone. Please allow permissions and refresh. Error: ' + err.message);
        }
      }
    };

    setup();

    // FIX: Don't stop the stream here - let it survive to interview step
    return () => {
      cancelled = true;
      if (sampleIntervalRef.current) clearInterval(sampleIntervalRef.current);
      if (micRafRef.current) cancelAnimationFrame(micRafRef.current);
    };
  }, [step]);

  // Stop the camera/mic stream ONLY when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        console.log('🛑 Stopping camera/mic tracks on component unmount');
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Re-attach the live stream to whichever video element is currently mounted
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      console.log('📹 Re-attaching stream to video element');
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.warn('⚠️ Could not play video:', err);
      });
    }
  }, [step]);

  // ==================== FACE SAMPLING WHILE ANSWERING ====================
  const startFaceSampling = useCallback(() => {
    samplesRef.current = [];
    if (sampleIntervalRef.current) {
      clearInterval(sampleIntervalRef.current);
    }
    sampleIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.5
          }))
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detection) {
          const box = detection.detection.box;
          const videoW = videoRef.current.videoWidth;
          const videoH = videoRef.current.videoHeight;
          const centerX = box.x + box.width / 2;
          const centerY = box.y + box.height / 2;
          const offsetX = Math.abs(centerX - videoW / 2) / (videoW / 2);
          const offsetY = Math.abs(centerY - videoH / 2) / (videoH / 2);
          const centeredScore = Math.max(0, 100 - (offsetX + offsetY) * 60);

          const expressions = detection.expressions;
          const positiveExpr = (expressions.happy || 0) + (expressions.neutral || 0) * 0.6;

          samplesRef.current.push({
            eyeContact: centeredScore,
            facialExpression: Math.round(positiveExpr * 100),
            faceDetected: true
          });
        } else {
          samplesRef.current.push({ eyeContact: 0, facialExpression: 0, faceDetected: false });
        }
      } catch (err) {
        console.warn('⚠️ Face detection error:', err);
        samplesRef.current.push({ eyeContact: 0, facialExpression: 0, faceDetected: false });
      }
    }, 800);
  }, []);

  const stopFaceSampling = useCallback(() => {
    if (sampleIntervalRef.current) {
      clearInterval(sampleIntervalRef.current);
      sampleIntervalRef.current = null;
    }
  }, []);

  function summarizeHeuristics() {
    const samples = samplesRef.current;
    if (!samples.length) {
      return { eyeContactScore: 60, facialExpressionScore: 60, bodyLanguageScore: 60 };
    }
    const detected = samples.filter(s => s.faceDetected);
    const detectionRate = detected.length / samples.length;
    const avg = (key) =>
      detected.length ? detected.reduce((a, s) => a + s[key], 0) / detected.length : 50;

    return {
      eyeContactScore: Math.round(avg('eyeContact')),
      facialExpressionScore: Math.round(avg('facialExpression')),
      bodyLanguageScore: Math.round(detectionRate * 100)
    };
  }

  // ==================== RECORDING FUNCTIONS ====================
  const startRecording = () => {
    if (!streamRef.current) {
      console.error('❌ No stream available');
      setError('Camera/Microphone not ready. Please refresh.');
      return;
    }

    const videoTracks = streamRef.current.getVideoTracks();
    const audioTracks = streamRef.current.getAudioTracks();
    
    if (videoTracks.length === 0) {
      console.error('❌ No video track in stream');
      setError('Camera not available. Please check permissions.');
      return;
    }

    if (audioTracks.length === 0) {
      console.error('❌ No audio track in stream');
      setError('Microphone not available. Please check permissions.');
      return;
    }

    if (videoTracks[0].readyState === 'ended') {
      console.error('❌ Video track has ended');
      setError('Camera stream was closed. Please refresh and try again.');
      return;
    }

    if (audioTracks[0].readyState === 'ended') {
      console.error('❌ Audio track has ended');
      setError('Microphone stream was closed. Please refresh and try again.');
      return;
    }

    chunksRef.current = [];

    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4'
    ];

    let selectedMimeType = null;
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        break;
      }
    }

    if (!selectedMimeType) {
      console.error('❌ No supported MIME type found');
      setError('Your browser does not support video recording. Please use Chrome or Firefox.');
      return;
    }

    console.log(`✅ Using MIME type: ${selectedMimeType}`);

    try {
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        setError('Recording error occurred. Please try again.');
        setIsRecording(false);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      
      startFaceSampling();

      const suggested = interview?.questions[currentIndex]?.suggestedTimeSeconds || 120;
      setTimeLeft(suggested);
      
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('❌ Recording start error:', err);
      setError(`Recording error: ${err.message || 'Unknown error'}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) {
      console.warn('⚠️ No media recorder to stop');
      setIsRecording(false);
      return;
    }

    if (mediaRecorderRef.current.state === 'inactive') {
      console.warn('⚠️ Media recorder already inactive');
      setIsRecording(false);
      return;
    }

    clearInterval(timerRef.current);
    stopFaceSampling();
    setIsRecording(false);

    const heuristics = summarizeHeuristics();
    const idx = currentIndex;

    mediaRecorderRef.current.onstop = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const blob = new Blob(chunksRef.current, { 
          type: mediaRecorderRef.current.mimeType || 'video/webm' 
        });
        
        if (blob.size === 0) {
          console.warn('⚠️ No data recorded');
          setError('No video data was recorded. Please try again.');
          return;
        }
        
        console.log(`📹 Recording size: ${(blob.size / 1024).toFixed(2)} KB`);
        await submitAnswer(blob, idx, heuristics);
      } catch (err) {
        console.error('❌ Submit answer error:', err);
        setError('Failed to submit answer. Please try again.');
      }
    };

    try {
      mediaRecorderRef.current.stop();
    } catch (err) {
      console.error('❌ Stop recording error:', err);
      setError('Failed to stop recording.');
    }
  };

  const submitAnswer = async (blob, idx, heuristics) => {
    setAnalyzingCount(c => c + 1);
    try {
      const formData = new FormData();
      formData.append('video', blob, `answer-${idx}.webm`);
      formData.append('questionIndex', String(idx));
      formData.append('clientHeuristics', JSON.stringify(heuristics));

      const res = await fetch(`${API_BASE}/api/mock-interview/${interview._id}/analyze-answer`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        setQuestionResults(prev => [...prev, json.data]);
      } else {
        console.error('❌ Analysis failed:', json.message);
      }
    } catch (err) {
      console.error('❌ Answer analysis failed:', err);
    } finally {
      setAnalyzingCount(c => Math.max(0, c - 1));
    }
  };

  // ==================== NAVIGATION - FIXED ====================
  const advanceOrFinish = async () => {
    const isLast = currentIndex >= interview.questions.length - 1;
    if (isLast) {
      setStep('submitting');
      
      // FIX: Use ref instead of state to avoid stale closure
      const waitForAnalysis = () =>
        new Promise(resolve => {
          const check = () => {
            if (analyzingCountRef.current === 0) resolve();
            else setTimeout(check, 400);
          };
          check();
        });
      await waitForAnalysis();

      try {
        const res = await fetch(`${API_BASE}/api/mock-interview/${interview._id}/finish`, {
          method: 'POST'
        });
        const json = await res.json();
        if (json.success) {
          setFinalReport(json.data);
        } else {
          setError('Could not generate your final report.');
        }
      } catch (err) {
        console.error(err);
        setError('Could not generate your final report.');
      }
      setStep('results');
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleNextQuestion = () => {
    advanceOrFinish();
  };

  const handleSkipQuestion = () => {
    if (isRecording) stopRecording();
    advanceOrFinish();
  };

  const handleBeginInterview = async () => {
    try {
      setError('');
      const finalRole = getFinalJobRole();
      if (!finalRole) {
        setError('Please select or enter a job title.');
        return;
      }
      
      console.log('🚀 Starting interview for:', finalRole);
      const res = await fetch(`${API_BASE}/api/mock-interview/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, ...form, jobRole: finalRole })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to start interview');
      setInterview(json.data);
      setCurrentIndex(0);
      setQuestionResults([]);
      setStep('interview');
    } catch (err) {
      console.error('❌ Interview setup error:', err);
      setError('Could not start the interview. Please try again.');
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen text-white font-sans p-6 md:p-8">
      {step === 'setup' && (
        <SetupScreen
          form={form}
          onChange={handleFormChange}
          onSubmit={handleStartSetup}
          error={error}
          jobRoles={JOB_ROLES}
          suggested={suggested}
        />
      )}

      {step === 'permissions' && (
        <PermissionsScreen
          videoRef={videoRef}
          canvasRef={canvasRef}
          mediaReady={mediaReady}
          modelsReady={modelsReady}
          micLevel={micLevel}
          brightnessWarning={brightnessWarning}
          error={error}
          onBegin={handleBeginInterview}
        />
      )}

      {step === 'interview' && interview && (
        <InterviewScreen
          videoRef={videoRef}
          question={interview.questions[currentIndex]}
          index={currentIndex}
          total={interview.questions.length}
          timeLeft={timeLeft}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onNext={handleNextQuestion}
          onSkip={handleSkipQuestion}
          analyzingCount={analyzingCount}
        />
      )}

      {step === 'submitting' && (
        <div className="text-center py-20">
          <div className="w-9 h-9 mx-auto mb-5 border-4 border-gray-700 border-t-indigo-600 rounded-full animate-spin" />
          <h2 className="text-xl font-semibold">Wrapping up your session…</h2>
          <p className="text-gray-500 mt-2">Finishing analysis on your last answer(s) and building your report.</p>
        </div>
      )}

      {step === 'results' && (
        <ResultsScreen report={finalReport} questionResults={questionResults} interview={interview} error={error} />
      )}
    </div>
  );
};

// ==================== UPDATED SETUP SCREEN WITH SUGGESTED ROLE ====================
function SetupScreen({ form, onChange, onSubmit, error, jobRoles, suggested }) {
  const isOther = form.jobRole === 'Other';

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
      <div className="inline-block bg-indigo-600/20 text-indigo-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
        Mock Interview
      </div>
      <h1 className="text-2xl font-bold mb-2 text-black">Practice like it's the real thing</h1>
      <p className="text-gray-500 text-sm mb-6">
        Set up your session — AI will tailor questions to the role and grade your delivery on camera.
      </p>

      {suggested && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm px-4 py-3 rounded-xl mb-4">
          📌 আপনার <b>{suggested.companyName}</b>-এ <b>{suggested.jobRole}</b> ইন্টারভিউ {suggested.daysLeft} দিন পরে —
          এই role অনুযায়ী প্রশ্ন সাজানো হয়েছে। চাইলে নিচে থেকে পরিবর্তন করতে পারেন।
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Job Role</label>
          <select
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black cursor-pointer focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition"
            value={form.jobRole}
            onChange={e => onChange('jobRole', e.target.value)}
          >
            <option value="">Select a role...</option>
            {jobRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {isOther && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Enter Your Role</label>
            <input
              type="text"
              placeholder="e.g. Blockchain Developer"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition"
              value={form.customJobRole}
              onChange={e => onChange('customJobRole', e.target.value)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Experience Level</label>
            <select
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.experienceLevel}
              onChange={e => onChange('experienceLevel', e.target.value)}
            >
              {EXPERIENCE_LEVELS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Interview Type</label>
            <select
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.interviewType}
              onChange={e => onChange('interviewType', e.target.value)}
            >
              {INTERVIEW_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Difficulty</label>
            <select
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.difficulty}
              onChange={e => onChange('difficulty', e.target.value)}
            >
              {DIFFICULTIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Number of Questions</label>
            <input
              type="number"
              min="3"
              max="12"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.questionCount}
              onChange={e => onChange('questionCount', e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
        >
          Continue to camera check →
        </button>
      </form>
    </div>
  );
}

// ==================== PERMISSIONS SCREEN ====================
function PermissionsScreen({ videoRef, canvasRef, mediaReady, modelsReady, micLevel, brightnessWarning, error, onBegin }) {
  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-2xl p-8 shadow-xl">
      <div className="inline-block bg-indigo-600/20 text-indigo-600 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
        Step 2 of 3
      </div>
      <h1 className="text-2xl font-bold mb-2 text-black">Camera &amp; mic check</h1>
      <p className="text-gray-500 text-sm mb-6">
        Make sure you're well-lit and your voice registers clearly before we begin.
      </p>

      <div className="flex justify-center mb-6">
        <div className={`relative rounded-2xl p-1 transition-all ${
          mediaReady ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'bg-gray-300'
        }`}>
          <video
            ref={videoRef}
            muted
            playsInline
            className="w-[260px] h-[195px] md:w-[420px] md:h-[370px] object-cover rounded-xl bg-black scale-x-[-1]"
          />
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="space-y-2.5 mb-5">
        <div className={`flex items-center gap-2.5 text-sm ${mediaReady ? 'text-black' : 'text-gray-400'}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${mediaReady ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          Camera & microphone connected
        </div>
        <div className={`flex items-center gap-2.5 text-sm ${modelsReady ? 'text-black' : 'text-gray-400'}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${modelsReady ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          AI analysis models loaded
        </div>
        <div className={`flex items-center gap-2.5 text-sm ${!brightnessWarning && mediaReady ? 'text-black' : 'text-gray-400'}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!brightnessWarning && mediaReady ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {brightnessWarning ? '⚠️ Lighting looks low — face a light source' : '✅ Lighting looks good'}
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <span>Mic level</span>
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-100" style={{ width: `${micLevel}%` }} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!mediaReady || !modelsReady}
        onClick={onBegin}
      >
        Start Interview →
      </button>
    </div>
  );
}

// ==================== INTERVIEW SCREEN ====================
function InterviewScreen({ videoRef, question, index, total, timeLeft, isRecording, onStartRecording, onStopRecording, onNext, onSkip, analyzingCount }) {
  const pct = ((index) / total) * 100;

  const getTagColor = (category) => {
    const cat = (category || 'Behavioral').toLowerCase();
    if (cat === 'technical') return 'bg-emerald-500/20 text-emerald-400';
    if (cat === 'situational') return 'bg-blue-500/20 text-blue-400';
    return 'bg-indigo-500/20 text-indigo-400';
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#0d0d0d] rounded-2xl p-6 md:p-8 border border-gray-800">
      <div className="mb-6">
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-gray-500 mt-2 block">
          Question {index + 1} of {total}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        <div>
          <span className={`inline-block text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${getTagColor(question.category)}`}>
            {question.category}
          </span>
          <h2 className="text-xl md:text-2xl font-semibold mt-3 leading-relaxed text-white">
            {question.question}
          </h2>
          {analyzingCount > 0 && (
            <p className="text-gray-500 text-sm mt-4">
              Analyzing {analyzingCount} previous answer(s) in the background…
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className={`relative rounded-2xl p-1 transition-all ${
            isRecording
              ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.3)]'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(79,70,229,0.15)]'
          }`}>
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-[260px] h-[195px] md:w-[300px] md:h-[225px] object-cover rounded-xl bg-black scale-x-[-1]"
            />
            {isRecording && (
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                REC
              </div>
            )}
          </div>
          <div className="font-mono text-2xl font-semibold tracking-wider text-white">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
        {!isRecording ? (
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition duration-200 shadow-lg shadow-indigo-600/20"
            onClick={onStartRecording}
          >
            ● Start Answer
          </button>
        ) : (
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition duration-200 shadow-lg shadow-red-600/20"
            onClick={onStopRecording}
          >
            ■ Stop &amp; Submit
          </button>
        )}
        <button
          className="bg-transparent hover:bg-white/5 text-gray-400 border border-gray-700 px-6 py-3 rounded-full transition duration-200"
          onClick={onSkip}
        >
          Skip question
        </button>
      </div>
    </div>
  );
}

// ==================== RESULTS SCREEN ====================
function ResultsScreen({ report, questionResults, interview, error }) {
  const scores = report?.overallScores;
  const summary = report?.summary;

  const categories = scores ? [
    { label: 'Communication', value: scores.communication },
    { label: 'Speaking Clarity', value: scores.speakingClarity },
    { label: 'Answer Quality', value: scores.answerQuality },
    { label: 'Eye Contact', value: scores.eyeContact },
    { label: 'Facial Expression', value: scores.facialExpression },
    { label: 'Body Language', value: scores.bodyLanguage },
    { label: 'Confidence', value: scores.confidence }
  ] : [];

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (scores?.overall || 0) / 100 * circumference;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="inline-block bg-indigo-600/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
          Session complete — {interview?.jobRole}
        </div>

        <div className="relative w-[140px] h-[140px] mx-auto my-2">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="52" className="fill-none stroke-gray-700 stroke-[10]" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="fill-none stroke-indigo-500 stroke-[10] stroke-linecap-round transition-all duration-700"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-bold text-white">{scores?.overall ?? '—'}</span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>

        {summary?.recommendation && (
          <p className="text-sm max-w-md mx-auto mt-2 text-gray-300">{summary.recommendation}</p>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-xl mt-4">
            {error}
          </div>
        )}
      </div>

      {scores && (
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-white">Score Breakdown</h3>
          <div className="space-y-3">
            {categories.map(c => (
              <div key={c.label} className="grid grid-cols-[130px_1fr_32px] items-center gap-2.5">
                <span className="text-sm text-gray-400">{c.label}</span>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-semibold text-right text-white">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary && (
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-xl">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-indigo-400">Strengths</h4>
            <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-5">
              {(summary.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2 text-orange-400">Areas to improve</h4>
            <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-5">
              {(summary.weaknesses || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-white">Question-by-question</h3>
        {questionResults.map((qr, i) => (
          <div key={i} className="border-t border-gray-800 py-4 first:border-0 relative">
            <p className="font-semibold text-sm pr-16 mb-1 text-white">Q{i + 1}: {qr.question}</p>
            <p className="text-sm text-gray-400 mb-2.5">{qr.scores?.transcriptSummary}</p>
            <div className="flex flex-wrap gap-2">
              {(qr.scores?.feedback || []).map((f, j) => (
                <span key={j} className="text-xs bg-gray-800 border border-gray-700 px-2.5 py-1 rounded-full text-gray-300">
                  {f}
                </span>
              ))}
            </div>
            <span className="absolute top-4 right-0 font-mono font-bold text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-full">
              {qr.scores?.overall}/100
            </span>
          </div>
        ))}
      </div>

      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
        onClick={() => window.location.reload()}
      >
        Start another session
      </button>
    </div>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default MockInterview;