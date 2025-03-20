import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRef, useState, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/carousel.css';

// Define video URLs directly - no need to import video files as modules
// In Vite, files in the public directory are served at the root path
const videoUrls = [
  {
    before:'Robot Vacuums',
    title:'Dreame X50 Ultra',
    tip:'Rise up, clean beneath',
    shopUrl:'#',
    learnMoreUrl:'#',
    url:'https://customer-vakdb8epsc9sg2sp.cloudflarestream.com/ad4fd1b08d18bc66b2e87b1faffd0a7e/downloads/default.mp4'
  },
  {
    before:'Robot Vacuums',
    title:'Dreame X50 Ultra',
    shopUrl:'#',
    learnMoreUrl:'#',
    tip:'Rise up, clean beneath',
    url:'https://customer-vakdb8epsc9sg2sp.cloudflarestream.com/5d034946bef7720a88399ed88951ec49/downloads/default.mp4'
  },
  {
    before:'Robot Vacuums',
    title:'Dreame X50 Ultra',
    shopUrl:'#',
    learnMoreUrl:'#',
    tip:'Rise up, clean beneath',
    url:'https://customer-vakdb8epsc9sg2sp.cloudflarestream.com/be7d02b867dbac2eb39c6afa8c2bb8f7/downloads/default.mp4'
  },
  {
    before:'Robot Vacuums',
    title:'Dreame X50 Ultra',
    shopUrl:'#',
    learnMoreUrl:'#',
    tip:'Rise up, clean beneath',
    url:'https://customer-vakdb8epsc9sg2sp.cloudflarestream.com/22f51eca06479bf7c4c63b29a6024f1b/downloads/default.mp4'
  },
];

const Carousel = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  // Set up refs array for videos
  if (videoRefs.current.length !== videoUrls.length) {
    videoRefs.current = Array(videoUrls.length).fill(null);
  }

  // Reset all progress bars to 0%
  const resetAllProgressBars = () => {
    if (paginationRef.current) {
      const bullets = paginationRef.current.querySelectorAll('.custom-bullet');
      bullets.forEach((bullet) => {
        const progressBar = bullet.querySelector('.progress-bar');
        if (progressBar) {
          (progressBar as HTMLElement).style.width = '0%';
        }
      });
    }
  };

  // Update video progress
  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo) return;

    const updateProgress = () => {
      const progress = (activeVideo.currentTime / activeVideo.duration) * 100;
      
      // Update the active bullet's background
      if (paginationRef.current) {
        const bullets = paginationRef.current.querySelectorAll('.custom-bullet');
        const activeBullet = bullets[activeIndex];
        
        if (activeBullet) {
          // Update the progress bar width inside the active bullet
          const progressBar = activeBullet.querySelector('.progress-bar');
          if (progressBar) {
            (progressBar as HTMLElement).style.width = `${progress}%`;
          }
        }
      }
    };

    // Handle video end
    const handleVideoEnd = () => {
      // Move to the next slide when video ends
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    };

    // Add event listeners to the active video
    activeVideo.addEventListener('timeupdate', updateProgress);
    activeVideo.addEventListener('ended', handleVideoEnd);

    // Clean up
    return () => {
      activeVideo.removeEventListener('timeupdate', updateProgress);
      activeVideo.removeEventListener('ended', handleVideoEnd);
    };
  }, [activeIndex, isPlaying]);

  // Play the first video automatically when component mounts
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.play().catch(error => {
        console.error("Error playing first video:", error);
      });
      setIsPlaying(true);
      setActiveIndex(0);
    }
  }, []);

  const handleSlideChange = (swiper: SwiperType) => {
    // Pause all videos
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) {
        videoRef.pause();
      }
    });

    // Reset all progress bars
    resetAllProgressBars();

    // Get the active index
    const index = swiper.realIndex;
    setActiveIndex(index);

    // Automatically play the active video
    const activeVideo = videoRefs.current[index];
    if (activeVideo) {
      activeVideo.currentTime = 0;
      // Auto-play the video when slide changes
      activeVideo.play().catch(error => {
        console.error("Error playing video:", error);
      });
      setIsPlaying(true);
    }
  };

  const setVideoRef = (el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el;
    
    // Auto-play the first video when its ref is set
    if (index === 0 && el && !isPlaying) {
      el.play().catch(error => {
        console.error("Error playing first video on ref set:", error);
      });
      setIsPlaying(true);
      setActiveIndex(0);
    }
  };

  // Custom bullet render function
  const renderBullet = (index: number, className: string) => {
    return `
      <span class="${className}">
        <div class="progress-bar ${index === activeIndex ? 'active' : ''}"></div>
      </span>
    `;
  };

  return (
    <div className="carousel-container">
      {/* Custom previous button */}
      <div ref={navigationPrevRef} className="custom-swiper-button-prev" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        speed={1500} // Slow transition speed
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: paginationRef.current,
          bulletClass: 'custom-bullet',
          bulletActiveClass: 'custom-bullet-active',
          renderBullet: renderBullet,
        }}
        loop={true}
        onSlideChange={handleSlideChange}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onSwiper={(swiper) => {
          // Store swiper instance
          swiperRef.current = swiper;
          // Initialize and auto-play the first video when component mounts
          setTimeout(() => {
            handleSlideChange(swiper);
          }, 300);
        }}
        className="mySwiper"
      >
        {videoUrls.map((video, index) => (
          <SwiperSlide key={index} className="creative-slide">
            <div className="video-container">
              <div className="video-info">
                <span className="video-before">{video.before}</span>
                <h3 className="video-title">{video.title}</h3>
                <p className="video-tip">{video.tip}</p>
                <div className="video-buttons">
                  <a className="shop-button" href={video.shopUrl}>Shop Now</a>
                  <a className="learn-more-button" href={video.learnMoreUrl}>Learn More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg></a>
                </div>
              </div>
              <video
                ref={(el) => setVideoRef(el, index)}
                src={video.url}
                muted={true}
                playsInline
                loop={false}
                controls={false}
                className="video-element"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom next button */}
      <div ref={navigationNextRef} className="custom-swiper-button-next">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>

      {/* Custom pagination container */}
      <div ref={paginationRef} className="custom-pagination"></div>
    </div>
  );
};

export default Carousel;
