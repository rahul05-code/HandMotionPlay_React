import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Sparkles, Activity, Target, BrainCircuit, TrendingUp, ShieldCheck, Zap, Camera, Gamepad2, LineChart, Hand, CheckCircle2, Heart, PenTool, Loader2 } from "lucide-react";
import Button from "../../components/common/Button";
import GameCard from "../../components/user/GameCard";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const Home = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const requestRef = useRef(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);

  const lastTimeRef = useRef(-1);

  useEffect(() => {
    let active = true;
    let mediaStream = null;

    const initializeMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("/wasm");
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `/wasm/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2 // Detect both hands
        });

        if (!active) return;
        handLandmarkerRef.current = handLandmarker;

        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: "user" }
          });

          if (!active) {
            mediaStream.getTracks().forEach(t => t.stop());
            return;
          }

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.addEventListener("loadeddata", () => {
              setIsModelLoaded(true);
              predictWebcam();
            });
          }
        } catch (cameraErr) {
          console.error("Camera access denied or unavailabe:", cameraErr);
          setHasCameraError(true);
        }
      } catch (err) {
        console.error("Error initializing MediaPipe:", err);
        setHasCameraError(true);
      }
    };

    initializeMediaPipe();

    return () => {
      active = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (handLandmarkerRef.current) handLandmarkerRef.current.close();
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      } else if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const drawConnectors = (ctx, landmarks, color) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm bridge
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      ctx.beginPath();
      // Mirror X axis
      ctx.moveTo((1 - start.x) * ctx.canvas.width, start.y * ctx.canvas.height);
      ctx.lineTo((1 - end.x) * ctx.canvas.width, end.y * ctx.canvas.height);
      ctx.stroke();
    });
  };

  const predictWebcam = () => {
    if (!videoRef.current || !canvasRef.current || !handLandmarkerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const container = canvas.parentElement;
    if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    let startTimeMs = performance.now();

    // Draw Mirrored Video
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    const vRatio = canvas.width / video.videoWidth;
    const hRatio = canvas.height / video.videoHeight;
    const ratio = Math.max(vRatio, hRatio);
    const centerShift_x = (canvas.width - video.videoWidth * ratio) / 2;
    const centerShift_y = (canvas.height - video.videoHeight * ratio) / 2;

    // Clear bright, no opacity for clear camera preview
    ctx.globalAlpha = 1.0;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
      centerShift_x, centerShift_y, video.videoWidth * ratio, video.videoHeight * ratio);
    ctx.restore();

    // Run ML Hand Detection
    if (lastTimeRef.current !== video.currentTime) {
      lastTimeRef.current = video.currentTime;
      let results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        // Get standard theme-aware blue color
        // A vibrant blue that works nicely on both light/dark feeds
        const themePrimary = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#2563eb';

        results.landmarks.forEach((landmarks) => {
          // Draw connections
          drawConnectors(ctx, landmarks, themePrimary);

          // Draw landmarks
          ctx.fillStyle = themePrimary;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;

          landmarks.forEach((point) => {
            ctx.beginPath();
            // Mirror X
            const x = (1 - point.x) * canvas.width;
            const y = point.y * canvas.height;
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          });
        });
      }
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <>
      {/* 
        HERO SECTION
        Centered styling with heavy margins matching the screenshot
      */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: "center",
        padding: "4rem 2rem",
        position: "relative"
      }}>

        {/* Top Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '50px',
          background: 'rgba(0, 136, 255, 0.1)',
          border: '1px solid rgba(0, 136, 255, 0.2)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: '500',
          marginBottom: '2rem'
        }}>
          <Sparkles size={14} /> AI - Powered Hand Rehabilitation
        </div>

        {/* Main Heading */}
        <h1 style={{ marginBottom: "1rem", maxWidth: "800px" }}>
          Play Your Way to<br />
          <span className="text-gradient-pink" style={{ fontWeight: '800' }}>Better Hand Health</span>
        </h1>

        <p style={{
          color: "var(--text-muted)",
          fontSize: "1.1rem",
          maxWidth: "600px",
          marginBottom: "2.5rem"
        }}>
          Interactive games using webcam hand-tracking technology to improve finger flexibility, coordination, and motor skills. Perfect for physiotherapy and rehabilitation.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '5rem' }}>
          <Link to="/games">
            <button className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>
              <Play size={20} /> Start Playing
            </button>
          </Link>
          <button className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>
            Learn More
          </button>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4rem',
          marginBottom: '5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BrainCircuit color="var(--primary)" size={24} style={{ marginBottom: '0.5rem' }} />
            <h2 style={{ marginBottom: '0.2rem' }}>10K+</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Active Users</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Target color="var(--primary)" size={24} style={{ marginBottom: '0.5rem' }} />
            <h2 style={{ marginBottom: '0.2rem' }}>500K+</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Games Played</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TrendingUp color="var(--primary)" size={24} style={{ marginBottom: '0.5rem' }} />
            <h2 style={{ marginBottom: '0.2rem' }}>94%</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Improvement Rate</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Sparkles color="var(--primary)" size={24} style={{ marginBottom: '0.5rem' }} />
            <h2 style={{ marginBottom: '0.2rem' }}>12+</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Exercise Types</div>
          </div>
        </div>

        {/* Decorative Hand Placeholder Component */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          height: '400px',
          background: 'linear-gradient(180deg, rgba(10, 14, 23, 0) 0%, rgba(0, 136, 255, 0.05) 100%)',
          border: '1px solid var(--card-border)',
          borderRadius: '24px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 100px -20px rgba(0, 136, 255, 0.15)'
        }}>
          {/* Mock Hand Shape */}
          <div style={{
            width: '150px',
            height: '250px',
            background: 'linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%)',
            clipPath: 'polygon(20% 100%, 0 40%, 10% 20%, 30% 35%, 35% 0, 50% 0, 55% 35%, 65% 5%, 80% 5%, 75% 40%, 90% 20%, 100% 30%, 80% 100%)',
            opacity: 0.8,
            filter: 'drop-shadow(0 0 20px var(--accent))',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: '20%', left: '10%', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
            <div style={{ position: 'absolute', top: '10%', left: '45%', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
            <div style={{ position: 'absolute', top: '15%', left: '80%', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
            <div style={{ position: 'absolute', top: '60%', left: '25%', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
            <div style={{ position: 'absolute', top: '55%', left: '75%', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            background: 'rgba(0, 230, 118, 0.1)',
            color: 'var(--success)',
            padding: '0.4rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
            Hand Detected
          </div>
        </div>

      </section>

      {/* GAMES SECTION */}
      <section style={{
        padding: "4rem 2rem",
        background: "rgba(10, 14, 23, 0.5)",
        borderTop: "1px solid var(--card-border)",
        borderBottom: "1px solid var(--card-border)"
      }}>
        <div className="page-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>
              Interactive Games for<br />
              <span className="text-gradient-pink" style={{ fontWeight: '800' }}>Hand Rehabilitation</span>
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
              Choose from a variety of engaging games designed by physiotherapy experts to improve different aspects of hand functionality.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <GameCard
              title="Canvas Drawing"
              description="Express creativity while improving fine motor control by drawing with your fingertips in the air."
              icon={<Sparkles size={24} color="var(--primary)" />}
            />
            <GameCard
              title="Shape Tracing"
              description="Follow outlines of various shapes to enhance hand-eye coordination and precision movements."
              icon={<PenTool size={24} color="var(--accent)" />}
            />
            <GameCard
              title="Target Shooting"
              description="Aim and shoot targets to develop quick reflexes and improve finger pointing accuracy."
              icon={<Target size={24} color="var(--success)" />}
            />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <div className="page-container">
          <h2 style={{ marginBottom: "0.5rem" }}>Why Choose HandMotion Play?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "4rem" }}>Built with cutting-edge technology and designed with patient care in mind.</p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            textAlign: "center"
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 136, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Activity size={24} />
              </div>
              <h4>Real-time Tracking</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Advanced AI-powered hand tracking using MediaPipe for accurate gesture recognition.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 136, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <TrendingUp size={24} />
              </div>
              <h4>Progress Analytics</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Track your improvement over time with detailed performance metrics and insights.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 136, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h4>Safe & Accessible</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No special equipment needed. Just your webcam and hands to start exercising.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 136, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h4>Instant Feedback</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Get immediate visual feedback on your movements to optimize your exercise routine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{ padding: "2rem 2rem 5rem 2rem" }}>
        <div className="page-container" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>How It Works</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 4rem auto" }}>
            Get started in minutes with our simple four-step process. No downloads, no installations, just your browser and hands.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            position: "relative"
          }}>
            {/* Steps */}
            {[
              { id: '01', title: 'Enable Camera', desc: 'Allow webcam access in your browser. No downloads or special equipment required.', icon: <Camera size={20} /> },
              { id: '02', title: 'Position Your Hand', desc: 'Place your hand in view of the camera. Our AI will detect and track your movements.', icon: <Hand size={20} /> },
              { id: '03', title: 'Play & Exercise', desc: 'Choose a game and start playing. Each game targets specific hand movements and skills.', icon: <Gamepad2 size={20} /> },
              { id: '04', title: 'Track Progress', desc: 'Monitor your improvement over time with detailed analytics and performance metrics.', icon: <LineChart size={20} /> },
            ].map((step, index) => (
              <div key={index} style={{
                border: "1px solid var(--card-border)",
                borderRadius: "16px",
                padding: "2rem 1.5rem",
                textAlign: "left",
                background: "var(--card-bg)",
                position: "relative"
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '1.5rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50px',
                  padding: '0.2rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {step.id}
                </div>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%', background: 'rgba(0, 136, 255, 0.1)',
                  color: 'var(--primary)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '1.5rem', marginTop: '0.5rem'
                }}>
                  {step.icon}
                </div>
                <h4 style={{ marginBottom: "0.5rem" }}>{step.title}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.6" }}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Camera Preview Live Box */}
          <div style={{
            marginTop: '4rem',
            background: '#000', // Solid black background behind video for clarity
            border: '2px solid var(--primary)',
            borderRadius: '24px',
            position: 'relative',
            height: '600px',
            width: '100%',
            maxWidth: '1000px',
            margin: '4rem auto 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0, 136, 255, 0.2)',
            overflow: 'hidden'
          }}>
            {!isModelLoaded && !hasCameraError && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                <Loader2 size={40} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Initializing AI Camera...</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Please allow camera permissions if prompted</p>
              </div>
            )}

            {hasCameraError && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Camera size={30} />
                </div>
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Camera Access Denied</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>We need camera access to track your hand movements.</p>
              </div>
            )}

            <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline muted></video>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, objectFit: 'cover' }} />

            {/* Top badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0, 230, 118, 0.2)', color: '#00e676', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 5, backdropFilter: 'blur(4px)' }}>
              <div style={{ width: '8px', height: '8px', background: '#00e676', borderRadius: '50%' }}></div> Live Tracking
            </div>

            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem', zIndex: 5, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Move both hands to test
            </div>

            {/* Bottom Overlay text */}
            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '3rem 2rem 1.5rem 2rem', zIndex: 5, textAlign: 'center' }}>
              <h3 style={{ color: 'white', marginBottom: '0.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Try Hand Tracking</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Wave your hands in front of the camera to see the AI landmarks in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section style={{ padding: "0 2rem 5rem 2rem" }}>
        <div className="page-container">
          <div style={{
            background: "linear-gradient(180deg, rgba(0, 136, 255, 0.1) 0%, rgba(10, 14, 23, 1) 100%)",
            border: "1px solid var(--card-border)",
            borderRadius: "24px",
            padding: "5rem 2rem",
            textAlign: "center"
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Heart size={24} />
            </div>
            <h1 style={{ marginBottom: "1rem" }}>Start Your Recovery Journey<br />Today</h1>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 2.5rem auto" }}>
              Join thousands of users who have improved their hand mobility and strength through our engaging exercise games. Free to use, no registration required.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <Link to="/login"><button className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>Get Started →</button></Link>
              <Link to="/Progress"><button className="btn btn-outline" style={{ padding: '0.875rem 2rem' }}>View Demo Progress</button></Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="var(--success)" size={16} /> No download required
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="var(--success)" size={16} /> Works in browser
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="var(--success)" size={16} /> Privacy-focused
              </span>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;