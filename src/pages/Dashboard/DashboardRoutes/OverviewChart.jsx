import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { FiActivity, FiTrendingUp, FiLayers, FiPieChart } from 'react-icons/fi';
import Useaxios from '../../../hooks/Useaxios';
import { Authcontext } from '../../../context/Authprovider';
import { useContext } from 'react';

const OverviewChart = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    const [chartType, setChartType] = useState('area');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/application?email=${user?.email}`);
            setApplications(res.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = months.map(month => ({
            name: month,
            applied: 0,
            interviews: 0,
            offers: 0,
            rejected: 0
        }));

        applications.forEach(app => {
            if (app.appDate) {
                const date = new Date(app.appDate);
                const monthIndex = date.getMonth();
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthlyData[monthIndex].applied++;
                    if (app.status === 'Interview') {
                        monthlyData[monthIndex].interviews++;
                    } else if (app.status === 'Offered') {
                        monthlyData[monthIndex].offers++;
                    } else if (app.status === 'Rejected') {
                        monthlyData[monthIndex].rejected++;
                    }
                }
            }
        });

        return monthlyData;
    };

    const getStatusData = () => {
        const statusCounts = {
            'Saved': 0,
            'Applied': 0,
            'Assessment': 0,
            'Interview': 0,
            'Offered': 0,
            'Rejected': 0
        };

        applications.forEach(app => {
            if (statusCounts.hasOwnProperty(app.status)) {
                statusCounts[app.status]++;
            }
        });

        return Object.keys(statusCounts).map(key => ({
            name: key,
            value: statusCounts[key]
        })).filter(item => item.value > 0);
    };

    const data = getMonthlyData();
    const statusData = getStatusData();

    const COLORS = ['#f472b6', '#818cf8', '#f59e0b', '#06b6d4', '#10b981', '#ef4444'];

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

    if (loading) {
        return (
            <div className="w-full bg-white/80 backdrop-blur-md border border-indigo-50 rounded-3xl p-6 shadow-sm shadow-indigo-600/5 mt-6">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm font-medium">Loading chart data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="w-full bg-white/80 backdrop-blur-md border border-indigo-50 rounded-3xl p-6 shadow-sm shadow-indigo-600/5 mt-6">
                <div className="flex flex-col items-center justify-center h-[400px]">
                    <FiPieChart className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-400 text-sm font-medium">No data to display</p>
                    <p className="text-gray-300 text-xs mt-1">Start adding applications to see analytics</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
            className="w-full bg-white/80 backdrop-blur-md border border-indigo-50 rounded-3xl p-6 shadow-sm shadow-indigo-600/5 mt-6"
        >
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

                <div className="flex bg-indigo-50/50 p-1 rounded-xl self-start sm:self-center">
                    <button 
                        onClick={() => setChartType('area')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartType === 'area' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}
                    >
                        <FiTrendingUp className="w-3.5 h-3.5" /> Area
                    </button>
                    <button 
                        onClick={() => setChartType('bar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartType === 'bar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}
                    >
                        <FiLayers className="w-3.5 h-3.5" /> Bar
                    </button>
                    <button 
                        onClick={() => setChartType('pie')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartType === 'pie' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}
                    >
                        <FiPieChart className="w-3.5 h-3.5" /> Pie
                    </button>
                </div>
            </div>

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
                                <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#EEF2F6', strokeWidth: 1 }} />
                            <Area type="monotone" name="Applied" dataKey="applied" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorApplied)" />
                            <Area type="monotone" name="Interviews" dataKey="interviews" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorInterviews)" />
                            <Area type="monotone" name="Offers" dataKey="offers" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorOffers)" />
                        </AreaChart>
                    ) : chartType === 'bar' ? (
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.02)' }} />
                            <Legend />
                            <Bar name="Applied" dataKey="applied" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={30} />
                            <Bar name="Interviews" dataKey="interviews" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={30} />
                            <Bar name="Offers" dataKey="offers" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={30} />
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default OverviewChart;