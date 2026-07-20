import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { FiActivity, FiTrendingUp, FiLayers } from 'react-icons/fi';

const OverviewChart = () => {
    const [chartType, setChartType] = useState('area');

    const data = [
        { name: 'Jan', applied: 10, interviews: 2, offers: 0 },
        { name: 'Feb', applied: 25, interviews: 5, offers: 1 },
        { name: 'Mar', applied: 45, interviews: 12, offers: 1 },
        { name: 'Apr', applied: 30, interviews: 8, offers: 0 },
        { name: 'May', applied: 65, interviews: 18, offers: 2 },
        { name: 'Jun', applied: 86, interviews: 24, offers: 3 },
    ];

    // কাস্টম টুলটিপ ডিজাইন (ইউজার ফ্রেন্ডলি করার জন্য)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs">
                    <p className="font-bold mb-2 text-gray-400">{label} Analytics</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-4 my-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="capitalize text-gray-300">{entry.name}:</span>
                            <span className="font-bold ml-auto text-sm">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
            className="w-full bg-white/80 backdrop-blur-md border border-indigo-50 rounded-3xl p-6 shadow-sm shadow-indigo-600/5 mt-6"
        >
            {/* ===== চার্ট হেডার ও ফিল্টার কন্ট্রোল ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <FiActivity className="w-4 h-4" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Application Analytics Trend</h2>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Visualizing your career funnel, interview ratios, and success rate.</p>
                </div>

                {/* চার্ট টাইপ সুইচ করার প্রিমিয়াম বাটন */}
                <div className="flex bg-indigo-50/50 p-1 rounded-xl self-start sm:self-center">
                    <button 
                        onClick={() => setChartType('area')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartType === 'area' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}
                    >
                        <FiTrendingUp className="w-3.5 h-3.5" /> Area View
                    </button>
                    <button 
                        onClick={() => setChartType('bar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartType === 'bar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}
                    >
                        <FiLayers className="w-3.5 h-3.5" /> Bar View
                    </button>
                </div>
            </div>

            {/* ===== মেইন চার্ট কন্টেনার ===== */}
            <div className="w-full h-[400px] sm:h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'area' ? (
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#EEF2F6', strokeWidth: 1 }} />
                            
                            {/* ব্র্যান্ড কালার ম্যাচিং লাইনস */}
                            <Area type="monotone" name="Applied" dataKey="applied" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorApplied)" />
                            <Area type="monotone" name="Interviews" dataKey="interviews" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorInterviews)" />
                        </AreaChart>
                    ) : (
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.02)' }} />
                            
                            <Bar name="Applied" dataKey="applied" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={30} />
                            <Bar name="Interviews" dataKey="interviews" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={30} />
                            <Bar name="Offers" dataKey="offers" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={30} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default OverviewChart;