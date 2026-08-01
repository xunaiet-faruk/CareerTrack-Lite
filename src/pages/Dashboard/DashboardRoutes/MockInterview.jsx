import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

const MockInterview = ({ userEmail }) => {
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

  const [mediaReady, setMediaReady] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [brightnessWarning, setBrightnessWarning] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);
  const [analyzingCount, setAnalyzingCount] = useState(0);
  const [finalReport, setFinalReport] = useState(null);

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

  // ... (baki sob hook & function same thakbe, shudhu handleBeginInterview e jobRole pathanor somoy getFinalJobRole() use korben)

  const handleBeginInterview = async () => {
    try {
      setError('');
      const finalRole = getFinalJobRole();
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
      console.error(err);
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

function SetupScreen({ form, onChange, onSubmit, error, jobRoles }) {
  const isOther = form.jobRole === 'Other';

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
      <div className="inline-block bg-indigo-600/20 text-indigo-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
        Mock Interview
      </div>
      <h1 className="text-2xl font-bold mb-2">Practice like it's the real thing</h1>
      <p className="text-gray-400 text-sm mb-6">
        Set up your session — AI will tailor questions to the role and grade your delivery on camera.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Job Role - Dropdown */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Job Role</label>
          <select
            className="w-full bg-white border border-gray-700 rounded-xl px-4 py-3 text-sm text-black cursor-pointer focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition"
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
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Enter Your Role</label>
            <input
              type="text"
              placeholder="e.g. Blockchain Developer"
              className="w-full bg-white border border-gray-700 rounded-xl px-4 py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition"
              value={form.customJobRole}
              onChange={e => onChange('customJobRole', e.target.value)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Experience Level</label>
            <select
              className="w-full bg-white border border-gray-700 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.experienceLevel}
              onChange={e => onChange('experienceLevel', e.target.value)}
            >
              {EXPERIENCE_LEVELS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Interview Type</label>
            <select
              className="w-full bg-white border border-gray-700 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.interviewType}
              onChange={e => onChange('interviewType', e.target.value)}
            >
              {INTERVIEW_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Difficulty</label>
            <select
              className="w-full bg-white border border-gray-700 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.difficulty}
              onChange={e => onChange('difficulty', e.target.value)}
            >
              {DIFFICULTIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Number of Questions</label>
            <input
              type="number"
              min="3"
              max="12"
              className="w-full bg-white border border-gray-700 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-indigo-600"
              value={form.questionCount}
              onChange={e => onChange('questionCount', e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-xl">
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
    <div className="max-w-2xl mx-auto bg-white  border border-gray-300 rounded-2xl p-8 shadow-xl">
      <div className="inline-block bg-indigo-600/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
        Step 2 of 3
      </div>
      <h1 className="text-2xl font-bold mb-2">Camera &amp; mic check</h1>
      <p className="text-gray-400 text-sm mb-6">
        Make sure you're well-lit and your voice registers clearly before we begin.
      </p>

      <div className="flex justify-center mb-6">
        <div className={`relative rounded-2xl p-1 transition-all ${
          mediaReady ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'bg-gray-700'
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
        <div className={`flex items-center gap-2.5 text-sm ${mediaReady ? 'text-white' : 'text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${mediaReady ? 'bg-emerald-500' : 'bg-gray-600'}`} />
          Camera & microphone connected
        </div>
        <div className={`flex items-center gap-2.5 text-sm ${modelsReady ? 'text-white' : 'text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${modelsReady ? 'bg-emerald-500' : 'bg-gray-600'}`} />
          AI analysis models loaded
        </div>
        <div className={`flex items-center gap-2.5 text-sm ${!brightnessWarning && mediaReady ? 'text-white' : 'text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!brightnessWarning && mediaReady ? 'bg-emerald-500' : 'bg-gray-600'}`} />
          {brightnessWarning ? 'Lighting looks low — face a light source' : 'Lighting looks good'}
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-400">
          <span>Mic level</span>
          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-100" style={{ width: `${micLevel}%` }} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold mt-3 leading-relaxed">
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
          <div className="font-mono text-2xl font-semibold tracking-wider">
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
            <span className="font-mono text-3xl font-bold">{scores?.overall ?? '—'}</span>
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
          <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
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
        <h3 className="text-lg font-semibold mb-4">Question-by-question</h3>
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