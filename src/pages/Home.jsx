import Banner from "../component/Homecomponent/Banner";
import Features from "../component/Homecomponent/Features";
import HowItWorks from "../component/Homecomponent/Howitworks ";
import RecentActivity from "../component/Homecomponent/RecentActivity";
import Testimonials from "../component/Homecomponent/Testimonials";

const Home = () => {
    return (
        // মেইন কন্টেনারকে relative এবং overflow-hidden করা হয়েছে
        <div className="relative min-h-screen overflow-hidden bg-slate-50/50">
            
            {/* SaaS গ্লোবাল ব্যাকগ্রাউন্ড ডিজাইন - যা সব কম্পোনেন্টের নিচে থাকবে (z-0) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* টপ-রাইট গ্লো বাবল */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse" />
                
                {/* বটম-লেফট গ্লো বাבל */}
                <div className="absolute top-[30%] -left-20 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
                
                {/* মিডল লার্জ গ্লো বাবল */}
                <div className="absolute top-[60%] -right-40 w-[600px] h-[600px] bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full blur-3xl" />
                
                {/* ডট গ্রিড লাইন - যা পুরো পেজ জুড়ে থাকবে */}
                <div className="absolute inset-0 opacity-25" style={{
                    backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* আসল কন্টেন্টগুলো z-10 দিয়ে ব্যাকগ্রাউন্ডের উপরে রাখা হয়েছে */}
            <div className="relative z-10">
                <Banner/>
                <Features/>
                <RecentActivity/>
                <HowItWorks/>
                <Testimonials/>
            </div>
        </div>
    );
};

export default Home;