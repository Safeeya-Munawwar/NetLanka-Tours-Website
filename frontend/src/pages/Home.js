import React, { useState, useEffect } from "react";
import axios from "axios";
import Slideshow from "../components/Slideshow";
import InfoCard from "../components/InfoCard";
import DestinationCard from "../components/DestinationCard";
import Transportation from "../components/Transportation";
import AboutCard from "../components/AboutCard";
import TourCard from "../components/TourCard";
import ChooseCard from "../components/ChooseCard";
import OurTours from "../components/OurTours";
import BlogCard from "../components/BlogCard";
import CategoryButtons from "../components/CategoryButtons";
import CommentsGrid from "../components/TestimonialCard";
import ContactForm from "../components/ContactForm";

import { FaHome, FaSuitcaseRolling, FaMapMarkedAlt, FaImages, FaPenFancy, FaInfoCircle, FaEnvelope } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const navCards = [
  { text: <><FaHome className="mr-2" /> Home</>, label: 'Welcome Home', link: '/' },
  { text: <><FaSuitcaseRolling className="mr-2" /> Tour Packages</>, label: 'Explore Tours', link: '/Tours' },
  { text: <><FaMapMarkedAlt className="mr-2" /> Destinations</>, label: 'Travel Spots', link: '/Destinations' },
  { text: <><FaImages className="mr-2" /> Gallery</>, label: 'Our Memories', link: '/Gallery' },
  { text: <><FaPenFancy className="mr-2" /> Blog</>, label: 'Travel Stories', link: '/Blog' },
  { text: <><FaInfoCircle className="mr-2" /> About</>, label: 'Our Journey', link: '/About' },
  { text: <><FaEnvelope className="mr-2" /> Contact</>, label: 'Get Connected', link: '/Contact' },
];

const images = [
  '/images/sigiriya1.jpg',
  '/images/yala7.jpg',
  '/images/ella1.jpg',
  '/images/galle5.jpg',
  '/images/adam.PNG',
  '/images/sigiriya2.jpg',
  '/images/yala1.jpg',
  '/images/ella2.jpg',
  '/images/yala3.jpg'
];

const Home = () => {
  const [homeContent, setHomeContent] = useState({});
  const [popularTours, setPopularTours] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [category, setCategory] = useState("Beaches");
  const [loadingContent, setLoadingContent] = useState(true);
  const [errorContent, setErrorContent] = useState("");

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/home-content`);
        const data = res.data || {};
        setHomeContent(data);
        setStats(Array.isArray(data.stats) ? data.stats : []);
        setLoadingContent(false);
      } catch (err) {
        console.error("Failed to load home content:", err);
        setErrorContent("Failed to load home content");
        setLoadingContent(false);
      }
    };

    const fetchTours = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/tours`);
        setPopularTours(res.data.filter(t => t.isSpecial).slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/blogs`);
        setLatestBlogs(res.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchHomeContent();
    fetchTours();
    fetchBlogs();
  }, []);


  

  if (loadingContent) return <p>Loading content...</p>;
  if (errorContent) return <p className="text-red-600">{errorContent}</p>;

  return (
    <div className="font-serif min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 transition-all duration-400">

      {/* Slideshow */}
      <Slideshow
        title={homeContent.title}
        images={images}
        navCards={navCards}
        stats={stats}
      />

      {/* Info Section */}
      <section>
        <InfoCard intro={homeContent.intro || ""} content={homeContent.description || ""} />
      </section>

      {/* Destinations */}
      <section>
        <DestinationCard />
      </section>

      {/* Transportation Section */}
      <section>
        <Transportation transport={homeContent.transport || []} />
      </section>

      {/* About */}
      <section>
        <AboutCard />
      </section>

      {/* Tours Section */}
      <section>
        <TourCard popularTours={popularTours} />
      </section>

      {/* Why Choose Us */}
      <section>
        <ChooseCard />
      </section>

      {/* Our Tours */}
      <section>
        <OurTours />
      </section>

      {/* Blogs Section */}
      <section>
        <BlogCard latestBlogs={latestBlogs} />
      </section>

      {/* Map Categories */}
      <section>
        <CategoryButtons category={category} setCategory={setCategory} />
      </section>

      {/* Testimonials*/}
      <section>
        <CommentsGrid />
      </section>

      {/* Contact */}
      <section>
        <ContactForm contact={homeContent.contact || ""} />
      </section>

    </div>
  );
};

export default Home;
