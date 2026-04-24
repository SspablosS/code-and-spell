import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export default function LandingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<{ id: number; left: number; animationDelay: number; animationDuration: number }[]>([]);

  useEffect(() => {
    if (user) {
      navigate('/levels');
    }
  }, [user, navigate]);

  // Three.js Golem Animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth < 1024 ? window.innerWidth * 0.9 : window.innerWidth * 0.5, 700);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Golem Group
    const golemGroup = new THREE.Group();

    // Body (Crystal Core)
    const bodyGeometry = new THREE.OctahedronGeometry(1.5, 0);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x6c63ff,
      emissive: 0x4c44d6,
      emissiveIntensity: 0.5,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    golemGroup.add(body);

    // Inner Glow
    const innerGeometry = new THREE.OctahedronGeometry(1, 0);
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    golemGroup.add(inner);

    // Floating Stones (Arms)
    const stoneGeometry = new THREE.DodecahedronGeometry(0.4, 0);
    const stoneMaterial = new THREE.MeshPhongMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.3
    });

    const leftArm = new THREE.Mesh(stoneGeometry, stoneMaterial);
    leftArm.position.set(-2.5, 0.5, 0);
    golemGroup.add(leftArm);

    const rightArm = new THREE.Mesh(stoneGeometry, stoneMaterial);
    rightArm.position.set(2.5, 0.5, 0);
    golemGroup.add(rightArm);

    // Eyes (Code Symbols)
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 1
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.5, 0.3, 1.3);
    golemGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.5, 0.3, 1.3);
    golemGroup.add(rightEye);

    // Floating Particles around Golem
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 8;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    golemGroup.add(particlesMesh);

    scene.add(golemGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6c63ff, 2, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xfbbf24, 1.5, 50);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

    camera.position.z = 6;

    // Animation
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate golem
      golemGroup.rotation.y += 0.005;

      // Float animation
      golemGroup.position.y = Math.sin(time) * 0.2;

      // Arms floating
      leftArm.position.y = 0.5 + Math.sin(time * 2) * 0.2;
      leftArm.position.x = -2.5 + Math.cos(time * 1.5) * 0.2;

      rightArm.position.y = 0.5 + Math.sin(time * 2 + Math.PI) * 0.2;
      rightArm.position.x = 2.5 + Math.cos(time * 1.5 + Math.PI) * 0.2;

      // Rotate particles
      particlesMesh.rotation.y += 0.002;

      // Pulse inner core
      const scale = 1 + Math.sin(time * 3) * 0.1;
      inner.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    const handleResize = () => {
      const width = window.innerWidth < 1024 ? window.innerWidth * 0.9 : window.innerWidth * 0.5;
      camera.aspect = width / 700;
      camera.updateProjectionMatrix();
      renderer.setSize(width, 700);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Create background particles
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 10,
        animationDuration: Math.random() * 10 + 10,
      }));
      setParticles(newParticles);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #080810;
          color: #e0e7ff;
          overflow-x: hidden;
        }

        .landing-header {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 20px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          background: rgba(15, 15, 26, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(108, 99, 255, 0.2);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 700;
          color: #fbbf24;
          text-decoration: none;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 0 20px rgba(108, 99, 255, 0.5);
        }

        .header-buttons {
          display: flex;
          gap: 15px;
        }

        .btn {
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          text-decoration: none;
          display: inline-block;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #6c63ff;
          color: #6c63ff;
        }

        .btn-outline:hover {
          background: #6c63ff;
          color: white;
          box-shadow: 0 0 30px rgba(108, 99, 255, 0.5);
        }

        .btn-primary {
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: white;
          box-shadow: 0 4px 20px rgba(108, 99, 255, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(108, 99, 255, 0.6);
        }

        .btn-magic {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 15px 40px;
          font-size: 16px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(245, 158, 11, 0.8);
          }
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 150px 60px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(108, 99, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          flex: 1;
          max-width: 600px;
          z-index: 2;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(108, 99, 255, 0.1);
          border: 1px solid rgba(108, 99, 255, 0.3);
          border-radius: 20px;
          font-size: 14px;
          color: #fbbf24;
          margin-bottom: 30px;
        }

        .badge::before {
          content: '✨';
        }

        .hero h1 {
          font-family: 'Cinzel', serif;
          font-size: 64px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #fff 0%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 18px;
          line-height: 1.8;
          color: #94a3b8;
          margin-bottom: 40px;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          margin-bottom: 60px;
        }

        .stats {
          display: flex;
          gap: 40px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 800;
          color: #fbbf24;
          font-family: 'Cinzel', serif;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
        }

        .hero-visual {
          flex: 1;
          height: 700px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #golem-canvas {
          width: 100%;
          height: 100%;
        }

        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .code-orb {
          position: absolute;
          padding: 15px 25px;
          background: rgba(15, 15, 26, 0.9);
          border: 2px solid #6c63ff;
          border-radius: 12px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #fbbf24;
          box-shadow: 0 0 30px rgba(108, 99, 255, 0.3);
          animation: float 6s ease-in-out infinite;
        }

        .code-orb:nth-child(1) {
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .code-orb:nth-child(2) {
          bottom: 20%;
          right: 5%;
          animation-delay: 2s;
        }

        .code-orb:nth-child(3) {
          top: 30%;
          right: 0%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }

        .features {
          padding: 100px 60px;
          background: #0f0f1a;
          position: relative;
        }

        .section-title {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title h2 {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          margin-bottom: 16px;
          color: #fbbf24;
        }

        .section-title p {
          color: #64748b;
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 40px;
          background: rgba(108, 99, 255, 0.05);
          border: 1px solid rgba(108, 99, 255, 0.2);
          border-radius: 16px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #6c63ff, #a855f7);
          transform: scaleX(0);
          transition: transform 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: #6c63ff;
          box-shadow: 0 10px 40px rgba(108, 99, 255, 0.2);
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 22px;
          margin-bottom: 12px;
          color: #e0e7ff;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
        }

        .cta {
          padding: 120px 60px;
          text-align: center;
          background: linear-gradient(180deg, #0f0f1a 0%, #080810 100%);
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(108, 99, 255, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta h2 {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          margin-bottom: 24px;
          color: #fbbf24;
        }

        .cta p {
          font-size: 20px;
          color: #64748b;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fbbf24;
          border-radius: 50%;
          opacity: 0;
          animation: particle-float 10s infinite;
        }

        @keyframes particle-float {
          0% {
            opacity: 0;
            transform: translateY(100vh) scale(0);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(1.5);
          }
        }

        @media (max-width: 1024px) {
          .hero {
            flex-direction: column;
            padding: 120px 30px 60px;
          }

          .hero-content {
            text-align: center;
          }

          .hero h1 {
            font-size: 42px;
          }

          .hero-visual {
            height: 500px;
            width: 100%;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .landing-header {
            padding: 15px 30px;
          }
        }
      `}</style>

      {/* Particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="landing-header">
        <a href="/" className="logo">
          <div className="logo-icon">🔮</div>
          <span>Code & Spell</span>
        </a>

        <div className="header-buttons">
          <button className="btn btn-outline" onClick={() => navigate('/login')}>
            Войти
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Начать обучение
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Новый сезон 2026</div>

          <h1>Оживи Код Магией</h1>

          <p className="hero-description">
            Погрузись в мир, где программирование встречается с древними заклинаниями.
            Создавай големов, управляй стихиями кода и стань архимагом программирования.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-magic" onClick={() => navigate('/register')}>
              🎮 Начать Приключение
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/register')}>
              Узнать больше
            </button>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-value">5</div>
              <div className="stat-label">Уровней</div>
            </div>
            <div className="stat">
              <div className="stat-value">3</div>
              <div className="stat-label">Команды</div>
            </div>
            <div className="stat">
              <div className="stat-value">1</div>
              <div className="stat-label">Цель</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <canvas ref={canvasRef} id="golem-canvas" />

          <div className="floating-elements">
            <div className="code-orb">function cast()</div>
            <div className="code-orb">if (magic) {}</div>
            <div className="code-orb">while(true)</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-title">
          <h2>Магические Возможности</h2>
          <p>Изучай программирование через призму древних искусств</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧙</div>
            <h3>Пиши заклинания</h3>
            <p>Управляй големом псевдокодом похожим на Python</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Запускай голема</h3>
            <p>Смотри как твой код оживает на игровом поле</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Собирай кристаллы</h3>
            <p>Реши головоломку и собери кристалл</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Готов Стать Архимагом Кода?</h2>
        <p>Присоединяйся к тысячам учеников, которые уже открыли для себя магию программирования</p>
        <button
          className="btn btn-magic"
          onClick={() => navigate('/register')}
          style={{ fontSize: '18px', padding: '20px 50px' }}
        >
          Начать Бесплатно →
        </button>
      </section>
    </>
  );
}
