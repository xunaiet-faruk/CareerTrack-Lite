import { useContext, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Authcontext } from '../../../context/Authprovider';

/* =========================================================================
   STATIC CONTENT BANKS
   (No AI / no backend call needed — instant load, zero cost, zero downtime)
========================================================================= */

const DAILY_TIPS = [
    'Maintain eye contact during interviews — it signals confidence.',
    'Research the company before the interview: mission, products, recent news.',
    'Prepare 2–3 smart questions to ask the interviewer at the end.',
    'Use the STAR method (Situation, Task, Action, Result) for behavioral answers.',
    'Arrive (or log in) 10 minutes early — never late, never too early.',
    'Bring/keep printed or digital copies of your resume handy.',
    'Practice your "Tell me about yourself" answer out loud, not just in your head.',
    'Avoid speaking negatively about previous employers or teammates.',
    'Match your tone and energy to the interviewer — don\'t sound rehearsed.',
    'Follow up with a thank-you email within 24 hours of the interview.',
    'Quantify your achievements: "improved load time by 40%" beats "improved performance".',
    'For online interviews, test your camera, mic, and internet 30 minutes before.',
    'Dress one level more formal than the company\'s everyday dress code.',
    'Turn weaknesses into growth stories — show what you learned, not just the flaw.',
    'Silence is okay. Pause and think before answering a tough question.',
    'Know your resume inside-out — be ready to explain any line on it.',
    'Ask about team structure and day-to-day work to show genuine interest.',
    'Keep a notebook and pen ready to jot down important details during the call.',
    'Smile — even on a phone/video interview, it changes your tone of voice.',
    'Don\'t just say you\'re a "team player" — give one specific example of it.',
    'Review the job description again right before the interview and match your answers to it.',
    'If you don\'t know an answer, say so honestly and explain how you\'d find out.',
];

const CAREER_ADVICE = {
    cv: {
        label: 'CV / Resume Tips',
        icon: '📄',
        items: [
            'Keep your resume to 1 page (2 max if 8+ years of experience).',
            'Start bullet points with strong action verbs: Built, Led, Optimized, Reduced.',
            'Add measurable impact wherever possible (%, time saved, users, revenue).',
            'Tailor your resume for each job — mirror keywords from the job description.',
            'Put your most relevant/recent experience at the top.',
            'Avoid generic objective statements — use a short, specific summary instead.',
            'List tech stack clearly (languages, frameworks, tools) in a dedicated section.',
            'Proofread twice — typos are one of the fastest ways to get rejected.',
        ],
    },
    linkedin: {
        label: 'LinkedIn Tips',
        icon: '🔗',
        items: [
            'Use a clear, professional headshot — profiles with photos get far more views.',
            'Write a headline that states what you do + your specialty, not just your job title.',
            'Turn on "Open to Work" (visible to recruiters only, if you prefer privacy).',
            'Post or comment on industry content weekly to stay visible in your network.',
            'Ask former managers/colleagues for 2–3 short recommendations.',
            'List projects with links (GitHub, live demo) directly on your profile.',
            'Personalize every connection request — never send it blank.',
            'Keep your "About" section conversational, not a copy of your resume.',
        ],
    },
    jobApply: {
        label: 'Job Apply Tips',
        icon: '📮',
        items: [
            'Apply within 48 hours of a job posting — early applicants get more attention.',
            'Always write a short, tailored cover note even if it\'s "optional".',
            'Track every application (company, date, status) so nothing falls through.',
            'Don\'t mass-apply blindly — quality applications beat quantity.',
            'Use the exact job title language from the posting in your resume/cover note.',
            'Follow the company on LinkedIn and engage before/after applying.',
            'If there\'s a referral option, always try to find someone at the company first.',
            'Apply directly on the company website when possible, not only via job boards.',
        ],
    },
    communication: {
        label: 'Communication Tips',
        icon: '💬',
        items: [
            'Structure spoken answers: short summary first, then supporting details.',
            'Practice active listening — repeat back what you understood before answering.',
            'Avoid filler words ("um", "like") by pausing briefly instead.',
            'In written communication (email/Slack), lead with the ask or conclusion first.',
            'Match communication style to the audience — technical depth for engineers, outcomes for managers.',
            'Ask clarifying questions rather than guessing what someone means.',
            'When giving feedback, be specific and pair it with a suggestion.',
            'Record yourself doing a mock interview once — you\'ll spot habits you didn\'t know you had.',
        ],
    },
};

const CHECKLIST_ITEMS = [
    { id: 'resume', label: 'Review & update your resume for this role' },
    { id: 'company', label: 'Research the company (mission, products, news)' },
    { id: 'questions', label: 'Practice common interview questions out loud' },
    { id: 'internet', label: 'Test internet, camera & mic (for online interviews)' },
    { id: 'ask', label: 'Prepare 2–3 questions to ask the interviewer' },
    { id: 'star', label: 'Prepare 3–4 STAR stories from past experience' },
    { id: 'outfit', label: 'Plan your outfit / check dress code the night before' },
    { id: 'route', label: 'Confirm interview link/location & travel/login time' },
    { id: 'sleep', label: 'Get a full night\'s sleep before the interview' },
    { id: 'docs', label: 'Keep resume copies, ID, and a notebook + pen ready' },
];

const CODING_CHALLENGES = {
    easy: [
        { title: 'Two Sum', leetcode: 'https://leetcode.com/problems/two-sum/' },
        { title: 'Valid Parentheses', leetcode: 'https://leetcode.com/problems/valid-parentheses/' },
        { title: 'Reverse String', leetcode: 'https://leetcode.com/problems/reverse-string/' },
        { title: 'Merge Two Sorted Lists', leetcode: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
        { title: 'Climbing Stairs', leetcode: 'https://leetcode.com/problems/climbing-stairs/' },
    ],
    medium: [
        { title: 'Longest Substring Without Repeating Characters', leetcode: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
        { title: 'Group Anagrams', leetcode: 'https://leetcode.com/problems/group-anagrams/' },
        { title: 'Merge Intervals', leetcode: 'https://leetcode.com/problems/merge-intervals/' },
        { title: 'Product of Array Except Self', leetcode: 'https://leetcode.com/problems/product-of-array-except-self/' },
        { title: 'Coin Change', leetcode: 'https://leetcode.com/problems/coin-change/' },
    ],
    hard: [
        { title: 'Median of Two Sorted Arrays', leetcode: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
        { title: 'Trapping Rain Water', leetcode: 'https://leetcode.com/problems/trapping-rain-water/' },
        { title: 'N-Queens', leetcode: 'https://leetcode.com/problems/n-queens/' },
        { title: 'Word Ladder', leetcode: 'https://leetcode.com/problems/word-ladder/' },
        { title: 'Regular Expression Matching', leetcode: 'https://leetcode.com/problems/regular-expression-matching/' },
    ],
};
const HACKERRANK_PRACTICE_URL = 'https://www.hackerrank.com/domains/algorithms';

const RESOURCE_CATEGORIES = [
    {
        label: 'HTML, CSS & JavaScript',
        icon: '🎨',
        docs: [
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
            { name: 'JavaScript.info', url: 'https://javascript.info/' },
            { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' },
        ],
        videos: [
            { name: 'freeCodeCamp — Full JS Course', url: 'https://www.youtube.com/@freecodecamp' },
            { name: 'Kevin Powell — CSS specialist', url: 'https://www.youtube.com/@KevinPowell' },
            { name: 'Web Dev Simplified', url: 'https://www.youtube.com/@WebDevSimplified' },
            { name: 'Anisul Islam (বাংলা — HTML/CSS/JS)', url: 'https://www.youtube.com/@anisul-islam' },
        ],
    },
    {
        label: 'TypeScript',
        icon: '🔷',
        docs: [
            { name: 'Official TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' },
        ],
        videos: [
            { name: 'Programming with Mosh — TS Course', url: 'https://www.youtube.com/@programmingwithmosh' },
            { name: 'Web Dev Simplified — TS Simplified', url: 'https://www.youtube.com/@WebDevSimplified' },
        ],
    },
    {
        label: 'React & Next.js',
        icon: '⚛️',
        docs: [
            { name: 'Official React Docs', url: 'https://react.dev/' },
            { name: 'React Router Docs', url: 'https://reactrouter.com/' },
            { name: 'Next.js Docs', url: 'https://nextjs.org/docs' },
        ],
        videos: [
            { name: 'JavaScript Mastery — React/Next projects', url: 'https://www.youtube.com/@javascriptmastery' },
            { name: 'Net Ninja — React playlist', url: 'https://www.youtube.com/@NetNinja' },
            { name: 'Learn with Sumit (বাংলা — Think in a React Way)', url: 'https://www.youtube.com/@LearnwithSumit' },
        ],
    },
    {
        label: 'Backend / Node.js & Express',
        icon: '🖥️',
        docs: [
            { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs' },
            { name: 'Express.js Docs', url: 'https://expressjs.com/' },
        ],
        videos: [
            { name: 'Dave Gray — Node/Express full course', url: 'https://www.youtube.com/@DaveGrayTeachesCode' },
            { name: 'Traversy Media — Node crash courses', url: 'https://www.youtube.com/@TraversyMedia' },
            { name: 'Stack Learner (বাংলা — Node.js series)', url: 'https://www.youtube.com/@StackLearner' },
        ],
    },
    {
        label: 'Database (MongoDB & SQL)',
        icon: '🗄️',
        docs: [
            { name: 'MongoDB Docs', url: 'https://www.mongodb.com/docs/' },
            { name: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/guide.html' },
            { name: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/' },
        ],
        videos: [
            { name: 'freeCodeCamp — MongoDB full course', url: 'https://www.youtube.com/@freecodecamp' },
            { name: 'Academind — SQL/DB fundamentals', url: 'https://www.youtube.com/@academind' },
        ],
    },
    {
        label: 'Styling (Tailwind, SCSS, Bootstrap)',
        icon: '🖌️',
        docs: [
            { name: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs' },
            { name: 'Bootstrap Docs', url: 'https://getbootstrap.com/docs' },
        ],
        videos: [
            { name: 'Traversy Media — Tailwind crash course', url: 'https://www.youtube.com/@TraversyMedia' },
            { name: 'Stack Learner (বাংলা — Web Design Master Class)', url: 'https://www.youtube.com/@StackLearner' },
        ],
    },
    {
        label: 'Data Structures & Algorithms',
        icon: '🧩',
        docs: [
            { name: 'LeetCode', url: 'https://leetcode.com/' },
            { name: 'roadmap.sh — DSA Roadmap', url: 'https://roadmap.sh/datastructures-and-algorithms' },
        ],
        videos: [
            { name: 'freeCodeCamp — DSA in JavaScript', url: 'https://www.youtube.com/@freecodecamp' },
            { name: 'CodeWithHarry — DSA series', url: 'https://www.youtube.com/@CodeWithHarry' },
            { name: 'Anisul Islam (বাংলা — DSA)', url: 'https://www.youtube.com/@anisul-islam' },
        ],
    },
    {
        label: 'System Design',
        icon: '🏗️',
        docs: [
            { name: 'roadmap.sh — System Design', url: 'https://roadmap.sh/system-design' },
        ],
        videos: [
            { name: 'Fireship — quick system design concepts', url: 'https://www.youtube.com/@Fireship' },
        ],
    },
    {
        label: 'Git, GitHub & DevOps',
        icon: '🚀',
        docs: [
            { name: 'Git Docs', url: 'https://git-scm.com/doc' },
            { name: 'GitHub Docs', url: 'https://docs.github.com/' },
            { name: 'Docker Docs', url: 'https://docs.docker.com/' },
        ],
        videos: [
            { name: 'freeCodeCamp — Git & GitHub full course', url: 'https://www.youtube.com/@freecodecamp' },
            { name: 'Fireship — Docker in 100 seconds style', url: 'https://www.youtube.com/@Fireship' },
        ],
    },
    {
        label: 'Testing',
        icon: '🧪',
        docs: [
            { name: 'Jest Docs', url: 'https://jestjs.io/docs/getting-started' },
            { name: 'React Testing Library Docs', url: 'https://testing-library.com/docs/react-testing-library/intro/' },
        ],
        videos: [
            { name: 'Web Dev Simplified — Testing basics', url: 'https://www.youtube.com/@WebDevSimplified' },
        ],
    },
    {
        label: 'রোডম্যাপ / Overall Roadmaps',
        icon: '🗺️',
        docs: [
            { name: 'roadmap.sh — All Dev Roadmaps', url: 'https://roadmap.sh/' },
        ],
        videos: [
            { name: 'Programming Hero (বাংলা — full-stack roadmap)', url: 'https://www.youtube.com/@ProgrammingHero' },
        ],
    },
];

const WEEKLY_GOAL_ITEMS = [
    { id: 'applyJobs', label: 'Apply to 5 jobs' },
    { id: 'solveProblems', label: 'Solve 3 coding problems' },
    { id: 'updateResume', label: 'Update / tailor your resume' },
    { id: 'learnTopic', label: 'Learn one new topic' },
    { id: 'networkLinkedIn', label: 'Connect with 3 new people on LinkedIn' },
    { id: 'mockInterview', label: 'Do 1 mock interview (with a friend/mirror/recording)' },
];

/* =========================================================================
   HELPERS
========================================================================= */

// Returns an ISO-ish "year-week" string so weekly goals auto-reset every week
function getWeekKey(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
}

function getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function useLocalStorageState(key, defaultValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // storage full/unavailable — silently ignore
        }
    }, [key, value]);

    return [value, setValue];
}

const TABS = [
    { id: 'tip', label: 'Daily Tip', icon: '📚' },
    { id: 'advice', label: 'Career Advice', icon: '💼' },
    { id: 'checklist', label: 'Interview Checklist', icon: '✅' },
    { id: 'coding', label: 'Coding Challenge', icon: '🔥' },
    { id: 'resources', label: 'Learning Resources', icon: '📖' },
    { id: 'goals', label: 'Weekly Goals', icon: '📅' },
];

/* =========================================================================
   MAIN COMPONENT
========================================================================= */

const CareerGrowthHub = () => {
    const { user } = useContext(Authcontext);
    const userKey = user?.email || 'guest';

    const [activeTab, setActiveTab] = useState('tip');

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-800">🚀 Career Growth Hub</h2>
                <p className="text-slate-500 text-sm mt-1">
                    Daily tips, career advice, checklists & practice — everything to keep you interview-ready.
                </p>
            </div>

            {/* Tab bar */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition ${
                            activeTab === tab.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'tip' && <DailyTipTab />}
                    {activeTab === 'advice' && <CareerAdviceTab />}
                    {activeTab === 'checklist' && <ChecklistTab userKey={userKey} />}
                    {activeTab === 'coding' && <CodingChallengeTab />}
                    {activeTab === 'resources' && <ResourcesTab />}
                    {activeTab === 'goals' && <WeeklyGoalsTab userKey={userKey} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

/* ---------- Tab 1: Daily Interview Tip ---------- */
function DailyTipTab() {
    // Deterministic "today's tips" — same 6 tips all day, rotates daily, wraps around the bank
    const todaysTips = useMemo(() => {
        const offset = getDayOfYear() % DAILY_TIPS.length;
        const count = 6;
        return Array.from({ length: count }, (_, i) => DAILY_TIPS[(offset + i) % DAILY_TIPS.length]);
    }, []);

    const [shuffleSeed, setShuffleSeed] = useState(0);
    const shuffledTips = useMemo(() => {
        if (shuffleSeed === 0) return todaysTips;
        const start = (getDayOfYear() + shuffleSeed * 6) % DAILY_TIPS.length;
        return Array.from({ length: 6 }, (_, i) => DAILY_TIPS[(start + i) % DAILY_TIPS.length]);
    }, [shuffleSeed, todaysTips]);

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-indigo-700">📚 Today's Interview Tips</h3>
                <button
                    onClick={() => setShuffleSeed((s) => s + 1)}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                >
                    🔀 Show more tips
                </button>
            </div>
            <div className="space-y-3">
                {shuffledTips.map((tip, i) => (
                    <div key={i} className="flex gap-3 bg-indigo-50 rounded-xl p-3">
                        <span className="text-indigo-600 font-bold">{i + 1}.</span>
                        <p className="text-slate-700 text-sm">{tip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- Tab 2: Career Advice ---------- */
function CareerAdviceTab() {
    const categoryKeys = Object.keys(CAREER_ADVICE);
    const [category, setCategory] = useState(categoryKeys[0]);
    const active = CAREER_ADVICE[category];

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">💼 Career Advice</h3>
            <div className="flex flex-wrap gap-2 mb-5">
                {categoryKeys.map((key) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                            category === key
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                        }`}
                    >
                        {CAREER_ADVICE[key].icon} {CAREER_ADVICE[key].label}
                    </button>
                ))}
            </div>
            <ul className="space-y-2.5">
                {active.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-green-500 mt-0.5">●</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ---------- Tab 3: Interview Checklist ---------- */
function ChecklistTab({ userKey }) {
    const [checked, setChecked] = useLocalStorageState(`checklist:${userKey}`, {});

    const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    const doneCount = CHECKLIST_ITEMS.filter((i) => checked[i.id]).length;
    const progress = Math.round((doneCount / CHECKLIST_ITEMS.length) * 100);

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-indigo-700">✅ Interview Prep Checklist</h3>
                <span className="text-sm font-semibold text-slate-500">{doneCount}/{CHECKLIST_ITEMS.length}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full mb-5 overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="space-y-2">
                {CHECKLIST_ITEMS.map((item) => (
                    <label
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition"
                    >
                        <input
                            type="checkbox"
                            checked={!!checked[item.id]}
                            onChange={() => toggle(item.id)}
                            className="w-4 h-4 accent-indigo-600"
                        />
                        <span className={`text-sm ${checked[item.id] ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {item.label}
                        </span>
                    </label>
                ))}
            </div>
            {doneCount === CHECKLIST_ITEMS.length && (
                <p className="mt-4 text-center text-green-600 font-semibold text-sm">🎉 You're fully prepared — good luck!</p>
            )}
        </div>
    );
}

/* ---------- Tab 4: Coding Challenge ---------- */
function CodingChallengeTab() {
    const levels = [
        { id: 'easy', label: 'Easy', color: 'green' },
        { id: 'medium', label: 'Medium', color: 'amber' },
        { id: 'hard', label: 'Hard', color: 'red' },
    ];
    const [level, setLevel] = useState('easy');

    const colorClasses = {
        green: 'bg-green-100 text-green-700 border-green-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        red: 'bg-red-100 text-red-700 border-red-300',
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">🔥 Daily Coding Challenge</h3>
            <div className="flex gap-2 mb-5">
                {levels.map((l) => (
                    <button
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                            level === l.id ? colorClasses[l.color] : 'bg-white text-slate-500 border-slate-200'
                        }`}
                    >
                        {l.label}
                    </button>
                ))}
            </div>
            <div className="space-y-2">
                {CODING_CHALLENGES[level].map((problem, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200"
                    >
                        <span className="text-sm font-medium text-slate-800">{problem.title}</span>
                        <a
                            href={problem.leetcode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:underline whitespace-nowrap ml-3"
                        >
                            LeetCode →
                        </a>
                    </div>
                ))}
            </div>
            <a
                href={HACKERRANK_PRACTICE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:underline"
            >
                🔗 More practice on HackerRank
            </a>
        </div>
    );
}

/* ---------- Tab 5: Tech Learning Resources ---------- */
function ResourcesTab() {
    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-indigo-700 mb-1">📖 Tech Learning Resources</h3>
            <p className="text-xs text-slate-400 mb-4">Official docs for reference + best YouTube channels to actually learn each topic</p>
            <div className="grid sm:grid-cols-2 gap-4">
                {RESOURCE_CATEGORIES.map((cat) => (
                    <div key={cat.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="font-semibold text-slate-800 mb-3">{cat.icon} {cat.label}</p>

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">📘 Official Docs</p>
                        <ul className="space-y-1.5 mb-3">
                            {cat.docs.map((link) => (
                                <li key={link.url}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-indigo-600 hover:underline"
                                    >
                                        {link.name} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">▶️ Best Video Channels</p>
                        <ul className="space-y-1.5">
                            {cat.videos.map((link) => (
                                <li key={link.url}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        {link.name} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- Tab 6: Weekly Career Goals ---------- */
function WeeklyGoalsTab({ userKey }) {
    const weekKey = getWeekKey();
    const [state, setState] = useLocalStorageState(`weeklyGoals:${userKey}`, {});
    const checked = state.weekKey === weekKey ? state.checked || {} : {};

    const toggle = (id) => {
        setState({
            weekKey,
            checked: { ...checked, [id]: !checked[id] },
        });
    };

    const doneCount = WEEKLY_GOAL_ITEMS.filter((g) => checked[g.id]).length;
    const progress = Math.round((doneCount / WEEKLY_GOAL_ITEMS.length) * 100);

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-indigo-700">📅 Weekly Career Goals</h3>
                <span className="text-xs text-slate-400">Week {weekKey.split('-W')[1]}</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Resets automatically every week</p>

            <div className="w-full h-2 bg-slate-100 rounded-full mb-5 overflow-hidden">
                <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-2">
                {WEEKLY_GOAL_ITEMS.map((goal) => (
                    <label
                        key={goal.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition"
                    >
                        <input
                            type="checkbox"
                            checked={!!checked[goal.id]}
                            onChange={() => toggle(goal.id)}
                            className="w-4 h-4 accent-indigo-600"
                        />
                        <span className={`text-sm ${checked[goal.id] ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            ✅ {goal.label}
                        </span>
                    </label>
                ))}
            </div>

            {doneCount === WEEKLY_GOAL_ITEMS.length && (
                <p className="mt-4 text-center text-green-600 font-semibold text-sm">🏆 Weekly goals complete — great momentum!</p>
            )}
        </div>
    );
}

export default CareerGrowthHub;