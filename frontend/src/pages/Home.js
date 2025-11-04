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

import { FaSuitcaseRolling, FaMapMarkedAlt, FaImages, FaPenFancy, FaInfoCircle, FaEnvelope, FaCarSide, FaHandsHelping, FaMapSigns } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const navCards = [
  { text: <><FaSuitcaseRolling className="mr-2" /> Tour Packages</>, label: 'Explore Tours', link: '/tours' },
  { text: <><FaMapMarkedAlt className="mr-2" /> Destinations</>, label: 'Travel Spots', link: '/destinations' },
  { text: <><FaMapSigns className="mr-2" /> Experiences</>, label: 'Unique Experiences', link: '/experiences' },
  { text: <><FaCarSide className="mr-2" /> Transport</>, label: 'Vehicle & Driver Hire', link: '/transport' },
  { text: <><FaImages className="mr-2" /> Gallery</>, label: 'Our Memories', link: '/gallery' },
  { text: <><FaPenFancy className="mr-2" /> Blog</>, label: 'Travel Stories', link: '/blog' },
  { text: <><FaInfoCircle className="mr-2" /> About</>, label: 'Our Journey', link: '/about' },
  { text: <><FaHandsHelping className="mr-2" /> Support</>, label: 'Customer Support', link: '/support' },
  { text: <><FaEnvelope className="mr-2" /> Contact</>, label: 'Get Connected', link: '/contact' },
];

const images = [
  '/images/home1.PNG',
  '/images/home2.PNG',
  '/images/home3.PNG',
  '/images/home4.PNG',
  '/images/home5.PNG',
  '/images/home6.PNG',
  '/images/home7.PNG',
  '/images/home8.PNG'
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
