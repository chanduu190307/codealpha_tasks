import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Generating Authoritative Pulse Social Media Demo Dataset...');

// 1. 70 Realistic Fictional Identities
const USER_PROFILES = [
  // Primary Demo User
  {
    username: 'demo_user',
    display_name: 'Alex Vance',
    bio: 'Pulse Community Ambassador & Full-Stack Lead. Exploring real-time WebSockets, 3D WebGL interfaces, and open-source systems.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'web-developers'
  },
  // Tech / Web Development
  {
    username: 'aarav_codes',
    display_name: 'Aarav Sharma',
    bio: 'Senior Frontend Architect @ CloudNative. Obsessed with high-performance CSS, Vite tooling, and Three.js spatial canvas.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'web-developers'
  },
  {
    username: 'maya_creates',
    display_name: 'Maya Rao',
    bio: 'Product Designer & Creative Technologist. Turning complex SaaS tools into delightful, accessible glassmorphic experiences.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'design-systems'
  },
  {
    username: 'rohan_dev',
    display_name: 'Rohan Mehta',
    bio: 'Full-Stack Developer building scalable distributed APIs with Python, Django, and Redis. Open source contributor.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'ananya_designs',
    display_name: 'Ananya Iyer',
    bio: 'Lead UI/UX Engineer. Building design tokens, micro-interactions, and accessible typography systems for 2M+ users.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'design-systems'
  },
  {
    username: 'kabir_fit',
    display_name: 'Kabir Nair',
    bio: 'Marathoner, Calisthenics trainer, and Biotech researcher. Chasing 2:50 at the Boston Marathon. Discipline > Motivation.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'fitness-wellness'
  },
  {
    username: 'diya_kapoor',
    display_name: 'Diya Kapoor',
    bio: 'AI Safety Researcher & Computer Vision specialist. Exploring transformer interpretability and multimodal reasoning.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'ai-machine-learning'
  },
  {
    username: 'marcus_chen',
    display_name: 'Marcus Chen',
    bio: 'Site Reliability Engineer & Cloud Architect. Kubernetes, eBPF, Prometheus, and zero-downtime database migrations.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'cybersecurity'
  },
  {
    username: 'elena_rostova',
    display_name: 'Elena Rostova',
    bio: 'Landscape & Architectural Photographer. Chasing golden hour gradients across Nordic fjords and metropolitan rooftops.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'photography'
  },
  {
    username: 'priya_patel',
    display_name: 'Priya Patel',
    bio: 'Full-stack software engineer & mentor. Writing daily on data structures, system design patterns, and clean code principles.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'web-developers'
  },
  {
    username: 'carlos_mendez',
    display_name: 'Carlos Mendez',
    bio: 'Offensive Security Researcher & Bug Bounty Hunter. AppSec, OAuth vulnerabilities, and SSRF hardening. Always learning.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'cybersecurity'
  },
  {
    username: 'sophie_laurent',
    display_name: 'Sophie Laurent',
    bio: 'Digital artist and 3D animator working with Blender, GLSL shaders, and Three.js generative art.',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'design-systems'
  },
  {
    username: 'zainab_mansoor',
    display_name: 'Zainab Al-Mansoor',
    bio: 'Data Scientist & NLP enthusiast. Fine-tuning low-rank adapters and building bilingual retrieval-augmented generation pipelines.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'ai-machine-learning'
  },
  {
    username: 'kenji_takahashi',
    display_name: 'Kenji Takahashi',
    bio: 'Street photographer based in Tokyo. Documenting rainy neon reflections, subterranean transit, and ephemeral shadows.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'photography'
  },
  {
    username: 'fatima_zahra',
    display_name: 'Fatima Zahra',
    bio: 'Open Source Maintainer & Python core contributor. Passionate about developer ergonomics and inclusive engineering cultures.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'liam_oconnor',
    display_name: 'Liam O\'Connor',
    bio: 'Ultrarunner, Strength Coach & Physical Therapist. Exploring human endurance, biomechanics, and zone-2 cardiovascular efficiency.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'fitness-wellness'
  },
  {
    username: 'nina_kowalska',
    display_name: 'Nina Kowalska',
    bio: 'Systems Programmer working with Rust and WebAssembly. Compiling high-frequency data pipelines directly into the browser.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'web-developers'
  },
  {
    username: 'david_kim',
    display_name: 'David Kim',
    bio: 'Applied Machine Learning Engineer. Deploying low-latency inference pipelines on edge TPU hardware.',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'ai-machine-learning'
  },
  {
    username: 'aisha_bello',
    display_name: 'Aisha Bello',
    bio: 'Tech educator and advocate for women in STEM. Building open curriculum for full-stack engineering and cloud computing.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'open-source'
  },
  {
    username: 'lucas_silva',
    display_name: 'Lucas Silva',
    bio: 'Cybersecurity Analyst & Cryptography enthusiast. Specializing in zero-knowledge proofs and post-quantum algorithms.',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'cybersecurity'
  },
  {
    username: 'chloe_dupont',
    display_name: 'Chloe Dupont',
    bio: 'Visual artist and editorial photographer. Exploring brutalist architecture, raw concrete geometries, and monochrome contrast.',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'photography'
  },
  {
    username: 'vikram_singh',
    display_name: 'Vikram Singh',
    bio: 'Backend Specialist. Scaling distributed queues with RabbitMQ, Celery, and PostgreSQL row-level locks.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'web-developers'
  },
  {
    username: 'hannah_schmidt',
    display_name: 'Hannah Schmidt',
    bio: 'Motion Designer & Creative Coder. Bringing static components alive with smooth spring physics and micro-interactions.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'design-systems'
  },
  {
    username: 'tariq_alhashmi',
    display_name: 'Tariq Al-Hashmi',
    bio: 'Autonomous systems researcher. Working with reinforcement learning, sensor fusion, and drone navigation models.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'ai-machine-learning'
  },
  {
    username: 'isabella_rossi',
    display_name: 'Isabella Rossi',
    bio: 'Travel journalist and documentary photographer based in Rome. Documenting timeless artisanal workshops and culinary heritage.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'photography'
  },
  {
    username: 'neil_armstrong_dev',
    display_name: 'Neil Armstrong',
    bio: 'Embedded Firmware Engineer. C/C++, ARM Cortex-M microcontrollers, real-time operating systems, and IoT telematics.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'yuki_tanaka',
    display_name: 'Yuki Tanaka',
    bio: 'Powerlifter and Sports Nutritionist. Evidence-based strength programming, macro tracking, and biomechanical injury prevention.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'fitness-wellness'
  },
  {
    username: 'gabriel_costa',
    display_name: 'Gabriel Costa',
    bio: 'Cloud Security Architect. Hardening AWS/GCP infrastructure, Terraform CI/CD pipelines, and IAM least privilege policies.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'cybersecurity'
  },
  {
    username: 'sara_alvarez',
    display_name: 'Sara Alvarez',
    bio: 'Frontend enthusiast & Design Technologist. Bridging Figma variables directly into CSS Custom Properties and Tailwind plugins.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'design-systems'
  },
  {
    username: 'samuel_osei',
    display_name: 'Samuel Osei',
    bio: 'Software Craftsman & Open Source advocate. Building high-resilience web services with Go, Docker, and Kafka.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'natalia_volkova',
    display_name: 'Natalia Volkova',
    bio: 'Natural Language Processing Specialist. Researching cross-lingual transfer learning and tokenization efficiency.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'ai-machine-learning'
  },
  {
    username: 'oliver_hansen',
    display_name: 'Oliver Hansen',
    bio: 'Scandinavian Nature Photographer. Capturing polar auroras, glacial caves, and sub-zero wildlife across Tromsø.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'photography'
  },
  {
    username: 'kavita_reddy',
    display_name: 'Kavita Reddy',
    bio: 'Full-Stack Developer & Accessibility Consultant. Building WCAG 2.2 AAA compliant enterprise interfaces.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'web-developers'
  },
  {
    username: 'adrian_novak',
    display_name: 'Adrian Novak',
    bio: 'Triathlete & endurance enthusiast. Swimming, cycling, and running towards Ironman Kona. Consistency over intensity.',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'fitness-wellness'
  },
  {
    username: 'meera_joshi',
    display_name: 'Meera Joshi',
    bio: 'Penetration Tester & Ethical Hacker. Disclosing critical zero-days in enterprise web applications and API gateways.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'cybersecurity'
  },
  {
    username: 'benjamin_taylor',
    display_name: 'Benjamin Taylor',
    bio: 'Product Designer focused on dark-mode aesthetics, tactile interface components, and fluid typography.',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'design-systems'
  },
  {
    username: 'lin_wei',
    display_name: 'Lin Wei',
    bio: 'Deep Learning Engineer working on diffusion models, latent space representations, and real-time neural rendering.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'ai-machine-learning'
  },
  {
    username: 'clara_becker',
    display_name: 'Clara Becker',
    bio: 'Berlin-based street photographer. Framing brutalist concrete, rainy tram rails, and neon alleyway portraits.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'photography'
  },
  {
    username: 'devon_miles',
    display_name: 'Devon Miles',
    bio: 'DevOps & Platform Engineer. Infrastructure as Code, GitOps with ArgoCD, and automated vulnerability scanning.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'anika_choudhury',
    display_name: 'Anika Choudhury',
    bio: 'Frontend Architect. State management patterns, real-time optimistic UI updates, and WebGL particle simulations.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'web-developers'
  },
  {
    username: 'mateo_gomez',
    display_name: 'Mateo Gomez',
    bio: 'Trail runner, mountaineer, and outdoor enthusiast. High altitude training across the Andes and Pyrenees.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'fitness-wellness'
  },
  {
    username: 'amara_okoye',
    display_name: 'Amara Okoye',
    bio: 'Distributed Systems Engineer. Exploring consensus algorithms, Raft implementations, and eventual consistency trade-offs.',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'open-source'
  },
  {
    username: 'lucia_morales',
    display_name: 'Lucia Morales',
    bio: 'Security Operations & Threat Hunting. Decoupling malware binaries, reverse engineering, and threat intelligence sharing.',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'cybersecurity'
  },
  {
    username: 'ethan_brooks',
    display_name: 'Ethan Brooks',
    bio: 'Creative Technologist. Experimenting with WebGPU compute shaders, procedural terrain generation, and generative music.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'design-systems'
  },
  {
    username: 'zoya_khan',
    display_name: 'Zoya Khan',
    bio: 'AI Product Specialist. Exploring synthetic data generation, model alignment, and prompt evaluation benchmarks.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'ai-machine-learning'
  },
  {
    username: 'finn_gallagher',
    display_name: 'Finn Gallagher',
    bio: 'Seascape & Coastal Photographer. Capturing Atlantic swells, tempestuous lighthouses, and rugged Irish cliff-lines.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'photography'
  },
  {
    username: 'arjun_verma',
    display_name: 'Arjun Verma',
    bio: 'Backend Core Engineer. Python 3.14 async, Django ORM query optimization, and connection pool tuning.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'web-developers'
  },
  {
    username: 'leila_farah',
    display_name: 'Leila Farah',
    bio: 'Calisthenics athlete & mobility coach. Focusing on hand balancing, ring dips, and scapular stabilization.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'fitness-wellness'
  },
  {
    username: 'tomas_jelinek',
    display_name: 'Tomas Jelinek',
    bio: 'Cloud Security Engineer. Specializing in container escapes, Linux kernel namespaces, and Seccomp security profiles.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'cybersecurity'
  },
  {
    username: 'emily_watson',
    display_name: 'Emily Watson',
    bio: 'Design Systems Advocate. Documenting component governance, color contrast ratios, and cross-platform token synchronization.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'design-systems'
  },
  {
    username: 'ken_matsumoto',
    display_name: 'Ken Matsumoto',
    bio: 'Open Source Software Craftsperson. Maintaining developer CLI tools, Git integrations, and markdown documentation engines.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'nour_hammadi',
    display_name: 'Nour Hammadi',
    bio: 'Computational Linguist & Researcher. Developing low-resource dialectal Arabic translation and speech recognition models.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'ai-machine-learning'
  },
  {
    username: 'hugo_lindqvist',
    display_name: 'Hugo Lindqvist',
    bio: 'Architectural Photographer. Documenting Nordic minimalism, curved timber facades, and natural illumination in buildings.',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'photography'
  },
  {
    username: 'tanvi_deshmukh',
    display_name: 'Tanvi Deshmukh',
    bio: 'Frontend Engineer & Web Performance specialist. Reducing Total Blocking Time, optimizing bundle splitting, and Web Workers.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'web-developers'
  },
  {
    username: 'jorge_santana',
    display_name: 'Jorge Santana',
    bio: 'Crossfit coach and Olympic weightlifting athlete. Clean & jerk technique, snatch mechanics, and athletic periodization.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'fitness-wellness'
  },
  {
    username: 'rachel_adams',
    display_name: 'Rachel Adams',
    bio: 'Application Security Engineer. Hardening API endpoints, preventing Broken Object Level Authorization, and securing tokens.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'cybersecurity'
  },
  {
    username: 'maxime_lefevre',
    display_name: 'Maxime Lefevre',
    bio: 'Product Designer & Iconographer. Crafting cohesive vector icon sets, SVG path animations, and spatial UI layouts.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'design-systems'
  },
  {
    username: 'alina_petrova',
    display_name: 'Alina Petrova',
    bio: 'Reinforcement Learning Researcher. Sim-to-real robotic control, policy gradient algorithms, and physics simulators.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'ai-machine-learning'
  },
  {
    username: 'sean_murphy',
    display_name: 'Sean Murphy',
    bio: 'Open source tooling enthusiast. Writing fast Rust-based linters, formatters, and dependency graph visualizers.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'chiara_ferri',
    display_name: 'Chiara Ferri',
    bio: 'Street and documentary photographer in Milan. High-contrast monochrome shadows, vintage fashion, and cafe candid moments.',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'photography'
  },
  {
    username: 'rahul_sen',
    display_name: 'Rahul Sen',
    bio: 'Full-Stack Engineer. Building real-time multi-tenant platforms with Django REST Framework, WebSockets, and Vue 3.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'web-developers'
  },
  {
    username: 'valeria_torres',
    display_name: 'Valeria Torres',
    bio: 'Yoga Instructor & Breathwork Facilitator. Mindful morning sequences, nervous system regulation, and mobility flows.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'fitness-wellness'
  },
  {
    username: 'dmitri_sokolov',
    display_name: 'Dmitri Sokolov',
    bio: 'Systems Programmer & Kernel Hacker. Linux tracepoints, eBPF network filters, and memory-safe hardware abstraction layers.',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'cybersecurity'
  },
  {
    username: 'zoe_martin',
    display_name: 'Zoe Martin',
    bio: 'Accessibility Specialist & Design Technologist. Testing screen readers, voice navigation, and accessible interactive states.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'design-systems'
  },
  {
    username: 'kevin_zhao',
    display_name: 'Kevin Zhao',
    bio: 'Graph Neural Networks & Knowledge Graphs researcher. Uncovering hidden relational patterns in biological and citation networks.',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'ai-machine-learning'
  },
  {
    username: 'ingrid_berg',
    display_name: 'Ingrid Berg',
    bio: 'Fjord & Mountain Photographer based in Bergen. Dramatic weather, storm fronts, and remote Scandinavian wilderness.',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'photography'
  },
  {
    username: 'omar_khatib',
    display_name: 'Omar Khatib',
    bio: 'Open Source maintainer and Technical Writer. Simplifying distributed architectures and writing clear API documentation.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'open-source'
  },
  {
    username: 'siddharth_menon',
    display_name: 'Siddharth Menon',
    bio: 'Full-Stack Developer building modern real-time social applications. Exploring WebSockets, SSE, and service worker offline caching.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'web-developers'
  },
  {
    username: 'nadia_kamal',
    display_name: 'Nadia Kamal',
    bio: 'Endurance runner and sports physical therapist. Gait analysis, Achilles tendon rehab, and long-distance pacing strategies.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    is_verified: 0,
    theme: 'fitness-wellness'
  },
  {
    username: 'felix_bauer',
    display_name: 'Felix Bauer',
    bio: 'Offensive Security Consultant. Hardware hacking, firmware extraction, CAN bus automotive security, and SDR analysis.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    is_verified: 1,
    theme: 'cybersecurity'
  }
];

// 2. 7 Communities
const COMMUNITIES = [
  {
    id: 1,
    name: 'Web Developers',
    slug: 'web-developers',
    description: 'Modern frontend, full-stack architectures, WebSockets, Three.js 3D canvas, APIs, and performance tuning.',
    avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
    creator_id: 2, // aarav_codes
    theme: 'web-developers',
    center: { x: 25, y: 10, z: 0 }
  },
  {
    id: 2,
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Deep learning, LLMs, computer vision, PyTorch, multimodal models, and ethical AI research.',
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
    creator_id: 7, // diya_kapoor
    theme: 'ai-machine-learning',
    center: { x: 15, y: 25, z: -15 }
  },
  {
    id: 3,
    name: 'Urban & Nature Photography',
    slug: 'photography',
    description: 'Capturing light, architectural geometry, landscape vistas, street moments, and golden hours.',
    avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
    creator_id: 9, // elena_rostova
    theme: 'photography',
    center: { x: -20, y: 15, z: 20 }
  },
  {
    id: 4,
    name: 'UI/UX & Design Systems',
    slug: 'design-systems',
    description: 'Scalable design systems, glassmorphism, micro-interactions, Figma tokens, and accessible interfaces.',
    avatar: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80',
    creator_id: 3, // maya_creates
    theme: 'design-systems',
    center: { x: -25, y: -10, z: -10 }
  },
  {
    id: 5,
    name: 'Fitness & Wellness',
    slug: 'fitness-wellness',
    description: 'Running, marathon prep, strength training, calisthenics, mindfulness, recovery, and daily nutrition.',
    avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=80',
    creator_id: 6, // kabir_fit
    theme: 'fitness-wellness',
    center: { x: 0, y: -25, z: 20 }
  },
  {
    id: 6,
    name: 'Open Source Collective',
    slug: 'open-source',
    description: 'Building public software, cross-team collaboration, developer tooling, and shipping high-impact tools.',
    avatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&auto=format&fit=crop&q=80',
    creator_id: 4, // rohan_dev
    theme: 'open-source',
    center: { x: 20, y: -15, z: -25 }
  },
  {
    id: 7,
    name: 'Cybersecurity & Systems',
    slug: 'cybersecurity',
    description: 'Application security, penetration testing, zero-trust network defenses, cryptography, and BOLA hardening.',
    avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=80',
    creator_id: 11, // carlos_mendez
    theme: 'cybersecurity',
    center: { x: -15, y: -20, z: 15 }
  }
];

export { USER_PROFILES, COMMUNITIES };
