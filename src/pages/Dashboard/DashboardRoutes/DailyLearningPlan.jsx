import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FiBookOpen, 
    FiCheckCircle, 
    FiTrendingUp,
    FiAward,
    FiStar,
    FiCalendar,
    FiClock,
    FiTarget,
    FiBarChart2,
    FiChevronRight,
    FiCheck,
    FiX,
    FiLoader
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Authcontext } from '../../../context/Authprovider';
import Useaxios from '../../../hooks/Useaxios';
import LoadingSpinner from '../../../component/shared/LoadingSpinner';


const DailyLearningPlan = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState(null);
    const [todayLesson, setTodayLesson] = useState(null);
    const [progress, setProgress] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showOverview, setShowOverview] = useState(false);

    useEffect(() => {
        if (user?.email) {
            fetchLearningPlan();
        }
    }, [user]);

    const fetchLearningPlan = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/learning-plan/today/${user.email}`);
            
            if (res.data.success) {
                const data = res.data.data;
                setPlan(data.plan);
                setTodayLesson(data.plan.todayLesson);
                setProgress(data.plan.progress);
            }
        } catch (error) {
            console.error('Error fetching learning plan:', error);
            if (error.response?.status === 404) {
                // No plan exists, offer to create one
                toast.info('No learning plan found. Create one to get started!');
            } else {
                toast.error('Failed to load learning plan');
            }
        } finally {
            setLoading(false);
        }
    };

    const createLearningPlan = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/api/learning-plan/create', {
                userEmail: user.email,
                jobRole: 'Full Stack Developer', // You can make this dynamic
                totalDays: 30
            });

            if (res.data.success) {
                toast.success('🎉 Learning plan created!');
                await fetchLearningPlan();
            }
        } catch (error) {
            console.error('Error creating plan:', error);
            toast.error('Failed to create learning plan');
        } finally {
            setLoading(false);
        }
    };

    const handleQuizAnswer = (questionIndex, optionIndex) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleCompleteLesson = async () => {
        // Check if quiz is attempted
        if (todayLesson?.quiz && Object.keys(quizAnswers).length < todayLesson.quiz.length) {
            toast.warning('Please answer all quiz questions before completing');
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post('/api/learning-plan/complete-lesson', {
                userEmail: user.email,
                lessonDay: todayLesson.day,
                quizAnswers: Object.values(quizAnswers),
                notes: ''
            });

            if (res.data.success) {
                toast.success(res.data.data.message);
                await fetchLearningPlan();
                setQuizAnswers({});
                setShowQuiz(false);
            }
        } catch (error) {
            console.error('Error completing lesson:', error);
            toast.error('Failed to complete lesson');
        } finally {
            setSubmitting(false);
        }
    };

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/learning-plan/overview/${user.email}`);
            if (res.data.success) {
                setPlan(res.data.data.plan);
                setProgress(res.data.data.progress);
                setShowOverview(true);
            }
        } catch (error) {
            console.error('Error fetching overview:', error);
            toast.error('Failed to load overview');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Start Your Learning Journey</h2>
                    <p className="text-gray-500 mb-6">
                        Create a personalized daily learning plan to master your skills and ace your interviews.
                    </p>
                    <button
                        onClick={createLearningPlan}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        🚀 Create Learning Plan
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen px-4 sm:px-6 py-8 bg-gray-50/30">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <FiBookOpen className="text-indigo-600" />
                            Daily Learning Plan
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Day {plan.currentDay} of {plan.totalDays} • {plan.jobRole}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchOverview}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm"
                        >
                            <FiBarChart2 className="w-4 h-4" />
                            Overview
                        </button>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                            <FiTarget className="text-indigo-500" />
                            <span className="text-sm font-medium text-gray-700">
                                {progress?.streak || 0} Day Streak
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-indigo-600">
                            {Math.round((progress?.completedDays || 0) / plan.totalDays * 100)}%
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((progress?.completedDays || 0) / plan.totalDays * 100)}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                        <span>{progress?.completedDays || 0} days completed</span>
                        <span>{plan.totalDays - (progress?.completedDays || 0)} days remaining</span>
                    </div>
                </div>

                {/* Today's Lesson */}
                {todayLesson && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Day {todayLesson.day}: {todayLesson.title}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FiCalendar className="text-gray-400 w-4 h-4" />
                                        <span className="text-sm text-gray-500">
                                            {new Date().toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                </div>
                                {todayLesson.completed ? (
                                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                                        <FiCheckCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Completed</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                        <FiClock className="w-4 h-4" />
                                        <span className="text-sm font-medium">Today's Lesson</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Learning Objectives */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FiTarget className="text-indigo-500" />
                                    Learning Objectives
                                </h3>
                                <ul className="space-y-2">
                                    {todayLesson.objectives?.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-indigo-400 mt-0.5">▸</span>
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Main Topic */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3">📖 Main Topic</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {todayLesson.mainTopic}
                                </p>
                            </div>

                            {/* Key Concepts */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3">🔑 Key Concepts</h3>
                                <div className="flex flex-wrap gap-2">
                                    {todayLesson.keyConcepts?.map((concept, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                            {concept}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Practical Exercise */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <h3 className="font-semibold text-blue-800 mb-2">💻 Practical Exercise</h3>
                                <p className="text-sm text-blue-700">{todayLesson.practicalExercise}</p>
                            </div>

                            {/* Daily Challenge */}
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <h3 className="font-semibold text-amber-800 mb-2">⭐ Daily Challenge</h3>
                                <p className="text-sm text-amber-700">{todayLesson.dailyChallenge}</p>
                            </div>

                            {/* Resources */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3">📚 Resources</h3>
                                <ul className="space-y-1">
                                    {todayLesson.resources?.map((resource, i) => (
                                        <li key={i} className="text-sm text-indigo-600 flex items-center gap-2">
                                            <span className="text-gray-300">•</span>
                                            {resource}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quiz Section */}
                            {todayLesson.quiz && !todayLesson.completed && (
                                <div className="border-t border-gray-200 pt-6">
                                    <button
                                        onClick={() => setShowQuiz(!showQuiz)}
                                        className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
                                    >
                                        <FiStar className="w-4 h-4" />
                                        {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
                                        <FiChevronRight className={`w-4 h-4 transition-transform ${showQuiz ? 'rotate-90' : ''}`} />
                                    </button>

                                    {showQuiz && (
                                        <div className="mt-4 space-y-4">
                                            {todayLesson.quiz.map((q, qIndex) => (
                                                <div key={qIndex} className="bg-gray-50 rounded-xl p-4">
                                                    <p className="font-medium text-gray-700 mb-3">
                                                        {qIndex + 1}. {q.question}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {q.options.map((option, oIndex) => (
                                                            <label
                                                                key={oIndex}
                                                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                                                    quizAnswers[qIndex] === oIndex
                                                                        ? 'bg-indigo-100 border-2 border-indigo-500'
                                                                        : 'hover:bg-gray-100 border-2 border-transparent'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`quiz-${qIndex}`}
                                                                    value={oIndex}
                                                                    checked={quizAnswers[qIndex] === oIndex}
                                                                    onChange={() => handleQuizAnswer(qIndex, oIndex)}
                                                                    className="w-4 h-4 text-indigo-600"
                                                                />
                                                                <span className="text-sm text-gray-700">{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                onClick={handleCompleteLesson}
                                                disabled={submitting}
                                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <FiLoader className="w-4 h-4 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCheck className="w-4 h-4" />
                                                        Complete Lesson & Submit Quiz
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {todayLesson.completed && (
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
                                    <FiCheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-emerald-700 font-medium">✅ Lesson Completed!</p>
                                    {todayLesson.quizScore !== null && (
                                        <p className="text-sm text-emerald-600 mt-1">
                                            Quiz Score: {todayLesson.quizScore}%
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Overview Modal */}
            {showOverview && progress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FiBarChart2 className="text-indigo-600" />
                                Learning Overview
                            </h2>
                            <button
                                onClick={() => setShowOverview(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-indigo-600">{progress.completedDays}</p>
                                <p className="text-xs text-gray-600">Days Completed</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-emerald-600">{progress.streak}</p>
                                <p className="text-xs text-gray-600">Day Streak</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-amber-600">{progress.averageScore}%</p>
                                <p className="text-xs text-gray-600">Average Score</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-purple-600">{progress.totalQuizzesPassed}</p>
                                <p className="text-xs text-gray-600">Quizzes Passed</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Recent Lessons</h3>
                            <div className="space-y-2">
                                {plan?.lessons?.slice(-5).reverse().map((lesson, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                Day {lesson.day}: {lesson.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {lesson.completed ? '✅ Completed' : '⏳ Pending'}
                                            </p>
                                        </div>
                                        {lesson.quizScore !== null && (
                                            <span className={`text-sm font-bold ${
                                                lesson.quizScore >= 70 ? 'text-emerald-600' : 'text-amber-600'
                                            }`}>
                                                {lesson.quizScore}%
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowOverview(false)}
                            className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Close Overview
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DailyLearningPlan;