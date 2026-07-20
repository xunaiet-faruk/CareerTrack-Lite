import Banner from "../component/Homecomponent/Banner";
import Features from "../component/Homecomponent/Features";
import HowItWorks from "../component/Homecomponent/Howitworks ";
import RecentActivity from "../component/Homecomponent/RecentActivity";
import Testimonials from "../component/Homecomponent/Testimonials";

const Home = () => {
    return (
        <div>
           <Banner/>
           <Features/>
           <RecentActivity/>
           <HowItWorks/>
           <Testimonials/>
        </div>
    );
};

export default Home;