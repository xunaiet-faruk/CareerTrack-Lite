import Banner from "../component/Homecomponent/Banner";
import Features from "../component/Homecomponent/Features";
import HowItWorks from "../component/Homecomponent/Howitworks ";
import RecentActivity from "../component/Homecomponent/RecentActivity";
import Testimonials from "../component/Homecomponent/Testimonials";

const Home = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50/50">
            
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-[30%] -left-20 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-[60%] -right-40 w-[600px] h-[600px] bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 opacity-25" style={{
                    backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10">
                <section id="banner">
                    <Banner />
                </section>
                <section id="features">
                    <Features />
                </section>
                <section id="recent-activity">
                    <RecentActivity />
                </section>
                <section id="how-it-works">
                    <HowItWorks />
                </section>
                <section id="testimonials">
                    <Testimonials />
                </section>
            </div>
        </div>
    );
};

export default Home;