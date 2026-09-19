/**
 * ThreeUniverse: Interactive 3D WebGL Spatial Universe & Metaverse Grid
 * Powered by Three.js
 */

class ThreeUniverse {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodesGroup = null;
    this.linesGroup = null;
    this.starsParticles = null;
    this.raycaster = null;
    this.mouse = { x: -1000, y: -1000 };
    this.hoveredNode = null;
    this.selectedNode = null;
    this.is3DMode = false;
    this.targetCameraPos = null;
    this.postNodesMap = new Map();

    // Orbit control states
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.spherical = { radius: 60, theta: 0.5, phi: 1.2 };
    this.targetSpherical = { radius: 60, theta: 0.5, phi: 1.2 };
  }

  async init() {
    if (typeof THREE === 'undefined') {
      console.warn("Three.js not loaded yet. Retrying shortly...");
      setTimeout(() => this.init(), 300);
      return;
    }

    this.setupDOM();
    this.setupScene();
    this.setupLighting();
    this.setupStarfield();
    this.setupEventHandlers();
    this.setupHUD();

    this.animate();
    this.loadPostsInto3D();
  }

  setupDOM() {
    let canvas = document.getElementById('universe-3d-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'universe-3d-canvas';
      document.body.prepend(canvas);
    }
    this.container = canvas;

    // Create Tooltip if missing
    if (!document.getElementById('spatial-tooltip')) {
      const tip = document.createElement('div');
      tip.id = 'spatial-tooltip';
      tip.className = 'spatial-tooltip';
      document.body.appendChild(tip);
    }

    // Create Hologram Inspector Card if missing
    if (!document.getElementById('node-hologram-card')) {
      const card = document.createElement('div');
      card.id = 'node-hologram-card';
      card.className = 'node-hologram-card';
      card.innerHTML = `
        <div class="hologram-header">
          <span class="hologram-badge">🪐 3D Spatial Node</span>
          <button class="hologram-close-btn" id="close-hologram-btn">&times;</button>
        </div>
        <div id="hologram-body"></div>
      `;
      document.body.appendChild(card);

      document.getElementById('close-hologram-btn').onclick = () => {
        card.classList.remove('active');
        this.selectedNode = null;
      };
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070b19, 0.012);

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.nodesGroup = new THREE.Group();
    this.linesGroup = new THREE.Group();
    this.scene.add(this.nodesGroup);
    this.scene.add(this.linesGroup);

    this.raycaster = new THREE.Raycaster();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2.5, 100);
    pointLight1.position.set(20, 20, 20);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2.5, 100);
    pointLight2.position.set(-20, -15, -20);
    this.scene.add(pointLight2);
  }

  setupStarfield() {
    const starCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorChoices = [
      new THREE.Color(0x6366f1),
      new THREE.Color(0xec4899),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xa855f7),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.starsParticles = new THREE.Points(geometry, material);
    this.scene.add(this.starsParticles);
  }

  setupHUD() {
    let dock = document.querySelector('.universe-hud-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.className = 'universe-hud-dock';
      dock.innerHTML = `
        <button id="toggle-view-mode-btn" class="hud-btn active" title="Switch 3D Spatial Universe / 2D Feed">
          <span id="view-mode-icon">🪐</span> <span id="view-mode-text">3D Universe</span>
        </button>
        <button id="reset-camera-btn" class="hud-btn" title="Reset Camera Orbit">
          🧭 Orbit Center
        </button>
        <button id="galaxy-pulse-btn" class="hud-btn" title="Quantum Pulse Animation">
          ✨ Pulse Nodes
        </button>
      `;
      document.body.appendChild(dock);

      document.getElementById('toggle-view-mode-btn').onclick = () => this.toggleViewMode();
      document.getElementById('reset-camera-btn').onclick = () => this.resetCamera();
      document.getElementById('galaxy-pulse-btn').onclick = () => this.triggerPulseAnimation();
    }
  }

  toggleViewMode() {
    this.is3DMode = !this.is3DMode;
    const btn = document.getElementById('toggle-view-mode-btn');
    const icon = document.getElementById('view-mode-icon');
    const text = document.getElementById('view-mode-text');

    if (this.is3DMode) {
      document.body.classList.add('view-mode-3d');
      document.body.classList.remove('view-mode-2d');
      if (btn) btn.classList.add('active');
      if (icon) icon.textContent = '🪐';
      if (text) text.textContent = '3D Universe Active';
      if (window.Utils) Utils.showToast('🪐 3D Spatial Universe View Engaged! Drag to rotate, scroll to zoom.', 'info');
    } else {
      document.body.classList.add('view-mode-2d');
      document.body.classList.remove('view-mode-3d');
      if (btn) btn.classList.remove('active');
      if (icon) icon.textContent = '📄';
      if (text) text.textContent = 'Feed Mode';
      const card = document.getElementById('node-hologram-card');
      if (card) card.classList.remove('active');
    }
  }

  resetCamera() {
    this.targetSpherical = { radius: 60, theta: 0.5, phi: 1.2 };
    this.selectedNode = null;
    document.getElementById('node-hologram-card')?.classList.remove('active');
    if (window.Utils) Utils.showToast('Camera centered on Galaxy Core', 'info');
  }

  triggerPulseAnimation() {
    this.nodesGroup.children.forEach(mesh => {
      mesh.scale.set(2.2, 2.2, 2.2);
    });
    if (window.Utils) Utils.showToast('Quantum pulse broadcasted across nodes!', 'success');
  }

  setupEventHandlers() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Update tooltip pos
      const tip = document.getElementById('spatial-tooltip');
      if (tip) {
        tip.style.left = `${e.clientX}px`;
        tip.style.top = `${e.clientY}px`;
      }

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.targetSpherical.theta -= deltaX * 0.005;
        this.targetSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.targetSpherical.phi - deltaY * 0.005));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('.universe-hud-dock') || e.target.closest('.node-hologram-card') || e.target.closest('.navbar')) return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('wheel', (e) => {
      if (!this.is3DMode) return;
      this.targetSpherical.radius = Math.max(15, Math.min(180, this.targetSpherical.radius + e.deltaY * 0.05));
    }, { passive: true });

    window.addEventListener('click', (e) => {
      if (e.target.closest('.universe-hud-dock') || e.target.closest('.node-hologram-card') || e.target.closest('.navbar')) return;
      if (this.hoveredNode) {
        this.selectNode(this.hoveredNode);
      }
    });
  }

  updateCameraPosition() {
    this.camera.position.x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    this.camera.position.y = this.spherical.radius * Math.cos(this.spherical.phi);
    this.camera.position.z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);
    this.camera.lookAt(0, 0, 0);
  }

  async loadPostsInto3D() {
    try {
      const res = await (window.API ? API.get('/posts/') : fetch('/api/posts/').then(r => r.json()));
      const posts = res.results || [];
      this.clearNodes();

      posts.forEach(post => {
        this.addPostNode(post);
      });

      this.rebuildConnectionLines();
    } catch (e) {
      console.warn("Could not load 3D spatial posts:", e);
    }
  }

  clearNodes() {
    while (this.nodesGroup.children.length > 0) {
      const obj = this.nodesGroup.children[0];
      this.nodesGroup.remove(obj);
    }
    this.postNodesMap.clear();
  }

  addPostNode(post) {
    const x = post.coords?.x || (Math.random() - 0.5) * 40;
    const y = post.coords?.y || (Math.random() - 0.5) * 30;
    const z = post.coords?.z || (Math.random() - 0.5) * 40;

    // Outer crystal ring
    const geo = new THREE.DodecahedronGeometry(1.8, 0);
    const color = post.is_liked ? 0xec4899 : (post.community ? 0x38bdf8 : 0x6366f1);

    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.2,
      metalness: 0.8,
      emissive: color,
      emissiveIntensity: 0.45,
      wireframe: false
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = { post, baseScale: 1, color };

    // Add glowing wireframe shell
    const wireGeo = new THREE.DodecahedronGeometry(2.1, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mesh.add(wireMesh);

    this.nodesGroup.add(mesh);
    this.postNodesMap.set(post.id, mesh);
  }

  rebuildConnectionLines() {
    while (this.linesGroup.children.length > 0) {
      this.linesGroup.remove(this.linesGroup.children[0]);
    }

    const nodes = this.nodesGroup.children;
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.2
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p1 = nodes[i].position;
        const p2 = nodes[j].position;
        const dist = p1.distanceTo(p2);

        if (dist < 22) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
          const line = new THREE.Line(lineGeo, lineMat);
          this.linesGroup.add(line);
        }
      }
    }
  }

  selectNode(mesh) {
    this.selectedNode = mesh;
    const post = mesh.userData.post;
    const card = document.getElementById('node-hologram-card');
    const body = document.getElementById('hologram-body');
    if (!card || !body) return;

    const avatar = post.author?.avatar || (window.CONFIG ? CONFIG.DEFAULT_AVATAR : '');
    const tagsHtml = post.hashtags && post.hashtags.length > 0
      ? post.hashtags.map(t => `<span class="trending-chip" style="font-size: 11px;">#${t}</span>`).join(' ')
      : '';

    body.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <img src="${avatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #6366f1;" />
        <div>
          <div style="font-weight: 700; font-size: 15px; color: #fff;">${post.author?.display_name || post.author?.username}</div>
          <div style="font-size: 12px; color: var(--text-muted);">@${post.author?.username}</div>
        </div>
      </div>
      <div class="hologram-content">${post.content || ''}</div>
      ${post.image ? `<img src="${post.image}" style="width: 100%; border-radius: 12px; margin: 8px 0; max-height: 180px; object-fit: cover;" />` : ''}
      <div style="margin: 8px 0;">${tagsHtml}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
        <div style="display: flex; gap: 12px; font-size: 13px;">
          <span>♥ ${post.likes_count}</span>
          <span>💬 ${post.comments_count}</span>
        </div>
        <button class="btn btn-primary btn-sm" id="hologram-jump-feed-btn">Inspect in Feed</button>
      </div>
      <div class="hologram-coords-badge">Spatial Vector: [x: ${post.coords?.x}, y: ${post.coords?.y}, z: ${post.coords?.z}]</div>
    `;

    document.getElementById('hologram-jump-feed-btn').onclick = () => {
      this.toggleViewMode(); // Switch back to feed
      const targetCard = document.getElementById(`post-${post.id}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '2px solid #ec4899';
        setTimeout(() => targetCard.style.outline = 'none', 2500);
      }
    };

    card.classList.add('active');
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth spherical orbit lerp
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.08;
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.08;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.08;

    // Slow ambient rotation if idle
    if (!this.isDragging && !this.selectedNode) {
      this.targetSpherical.theta += 0.0008;
    }

    this.updateCameraPosition();

    // Rotate starfield and nodes
    if (this.starsParticles) {
      this.starsParticles.rotation.y += 0.0003;
      this.starsParticles.rotation.x += 0.0001;
    }

    this.nodesGroup.children.forEach(mesh => {
      mesh.rotation.y += 0.01;
      mesh.rotation.x += 0.005;

      // Pulse scaling lerp
      const target = (mesh === this.hoveredNode || mesh === this.selectedNode) ? 1.4 : 1.0;
      mesh.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    });

    // Raycasting for interactive hover
    if (this.camera && this.nodesGroup) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.nodesGroup.children, true);

      const tip = document.getElementById('spatial-tooltip');

      if (intersects.length > 0) {
        let hitMesh = intersects[0].object;
        if (hitMesh.parent !== this.nodesGroup) hitMesh = hitMesh.parent;

        this.hoveredNode = hitMesh;
        if (tip && hitMesh.userData?.post) {
          const post = hitMesh.userData.post;
          tip.textContent = `@${post.author?.username}: ${post.content?.substring(0, 45)}...`;
          tip.classList.add('show');
        }
      } else {
        this.hoveredNode = null;
        if (tip) tip.classList.remove('show');
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export const threeUniverse = new ThreeUniverse();
window.threeUniverse = threeUniverse;

document.addEventListener('DOMContentLoaded', () => {
  threeUniverse.init();
});
