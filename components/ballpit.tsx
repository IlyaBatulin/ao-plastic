/** @ts-nocheck */
"use client";

// Ballpit component based on @react-bits/Ballpit-JS-CSS
// Adjusted for this project and tweaked to use white "polymer" spheres.

import { useRef, useEffect } from "react";
import {
  Clock as ThreeClock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

class ThreeManager {
  #options;
  canvas;
  camera;
  cameraMinAspect;
  cameraMaxAspect;
  cameraFov;
  maxPixelRatio;
  minPixelRatio;
  scene;
  renderer;
  #postprocessing;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#renderInternal;
  onBeforeRender = () => {};
  onAfterRender = () => {};
  onAfterResize = () => {};
  #isInViewport = false;
  #isAnimating = false;
  isDisposed = false;
  #intersectionObserver;
  #resizeObserver;
  #resizeTimeout;
  #clock = new ThreeClock();
  #time = { elapsed: 0, delta: 0 };
  #rafId;

  constructor(options) {
    this.#options = { ...options };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.resize();
    this.#initEvents();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#options.canvas) {
      this.canvas = this.#options.canvas;
    } else if (this.#options.id) {
      this.canvas = document.getElementById(this.#options.id);
    } else {
      console.error("ThreeManager: Missing canvas or id parameter");
    }
    this.canvas.style.display = "block";
    const rendererOptions = {
      canvas: this.canvas,
      powerPreference: "high-performance",
      ...(this.#options.rendererOptions ?? {}),
    };
    this.renderer = new WebGLRenderer(rendererOptions);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #initEvents() {
    if (!(this.#options.size instanceof Object)) {
      window.addEventListener("resize", this.#handleResize.bind(this));
      if (this.#options.size === "parent" && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#handleResize.bind(this));
        this.#resizeObserver.observe(this.canvas.parentNode);
      }
    }
    this.#intersectionObserver = new IntersectionObserver(this.#handleIntersect.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#handleVisibility.bind(this));
  }

  #cleanupEvents() {
    window.removeEventListener("resize", this.#handleResize.bind(this));
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.#handleVisibility.bind(this));
  }

  #handleIntersect(entries) {
    this.#isInViewport = entries[0].isIntersecting;
    this.#isInViewport ? this.#start() : this.#stop();
  }

  #handleVisibility() {
    if (this.#isInViewport) {
      document.hidden ? this.#stop() : this.#start();
    }
  }

  #handleResize() {
    if (this.#resizeTimeout) clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let width, height;
    if (this.#options.size instanceof Object) {
      width = this.#options.size.width;
      height = this.#options.size.height;
    } else if (this.#options.size === "parent" && this.canvas.parentNode) {
      width = this.canvas.parentNode.offsetWidth;
      height = this.canvas.parentNode.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.#updateCamera();
    this.#updateRenderer();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#updateCameraFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#updateCameraFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #updateCameraFov(aspectLimit) {
    const t = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / aspectLimit);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(t));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fovRad = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }

  #updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing() {
    return this.#postprocessing;
  }

  set postprocessing(post) {
    this.#postprocessing = post;
    this.render = post.render.bind(post);
  }

  #start() {
    if (this.#isAnimating) return;
    const animate = () => {
      this.#rafId = requestAnimationFrame(animate);
      this.#time.delta = this.#clock.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
      this.onAfterRender(this.#time);
    };
    this.#isAnimating = true;
    this.#clock.start();
    animate();
  }

  #stop() {
    if (this.#isAnimating) {
      cancelAnimationFrame(this.#rafId);
      this.#isAnimating = false;
      this.#clock.stop();
    }
  }

  #renderInternal() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((obj) => {
      if (obj.isMesh && typeof obj.material === "object" && obj.material !== null) {
        Object.keys(obj.material).forEach((key) => {
          const value = obj.material[key];
          if (value !== null && typeof value === "object" && typeof value.dispose === "function") {
            value.dispose();
          }
        });
        obj.material.dispose();
        obj.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#cleanupEvents();
    this.#stop();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

// Pointer interaction helpers
const pointerTargets = new Map();
const pointerPos = new Vector2();
let listenersAttached = false;

function createPointerInteraction(element, options) {
  const state = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...options,
  };

  if (!pointerTargets.has(element)) {
    pointerTargets.set(element, state);
    if (!listenersAttached) {
      document.body.addEventListener("pointermove", handlePointerMove);
      document.body.addEventListener("pointerleave", handlePointerLeave);
      document.body.addEventListener("click", handleClick);

      document.body.addEventListener("touchstart", handleTouchStart, { passive: false });
      document.body.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.body.addEventListener("touchend", handleTouchEnd, { passive: false });
      document.body.addEventListener("touchcancel", handleTouchEnd, { passive: false });

      listenersAttached = true;
    }
  }

  state.dispose = () => {
    pointerTargets.delete(element);
    if (pointerTargets.size === 0) {
      document.body.removeEventListener("pointermove", handlePointerMove);
      document.body.removeEventListener("pointerleave", handlePointerLeave);
      document.body.removeEventListener("click", handleClick);

      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("touchend", handleTouchEnd);
      document.body.removeEventListener("touchcancel", handleTouchEnd);

      listenersAttached = false;
    }
  };

  return state;
}

function handlePointerMove(event) {
  pointerPos.x = event.clientX;
  pointerPos.y = event.clientY;
  processPointerInteraction();
}

function processPointerInteraction() {
  for (const [elem, state] of pointerTargets) {
    const rect = elem.getBoundingClientRect();
    if (rectContainsPointer(rect)) {
      updatePointerState(state, rect);
      if (!state.hover) {
        state.hover = true;
        state.onEnter(state);
      }
      state.onMove(state);
    } else if (state.hover && !state.touching) {
      state.hover = false;
      state.onLeave(state);
    }
  }
}

function handleClick(event) {
  pointerPos.x = event.clientX;
  pointerPos.y = event.clientY;
  for (const [elem, state] of pointerTargets) {
    const rect = elem.getBoundingClientRect();
    updatePointerState(state, rect);
    if (rectContainsPointer(rect)) state.onClick(state);
  }
}

function handlePointerLeave() {
  for (const state of pointerTargets.values()) {
    if (state.hover) {
      state.hover = false;
      state.onLeave(state);
    }
  }
}

function handleTouchStart(event) {
  if (event.touches.length > 0) {
    event.preventDefault();
    pointerPos.x = event.touches[0].clientX;
    pointerPos.y = event.touches[0].clientY;

    for (const [elem, state] of pointerTargets) {
      const rect = elem.getBoundingClientRect();
      if (rectContainsPointer(rect)) {
        state.touching = true;
        updatePointerState(state, rect);
        if (!state.hover) {
          state.hover = true;
          state.onEnter(state);
        }
        state.onMove(state);
      }
    }
  }
}

function handleTouchMove(event) {
  if (event.touches.length > 0) {
    event.preventDefault();
    pointerPos.x = event.touches[0].clientX;
    pointerPos.y = event.touches[0].clientY;

    for (const [elem, state] of pointerTargets) {
      const rect = elem.getBoundingClientRect();
      updatePointerState(state, rect);

      if (rectContainsPointer(rect)) {
        if (!state.hover) {
          state.hover = true;
          state.touching = true;
          state.onEnter(state);
        }
        state.onMove(state);
      } else if (state.hover && state.touching) {
        state.onMove(state);
      }
    }
  }
}

function handleTouchEnd() {
  for (const [, state] of pointerTargets) {
    if (state.touching) {
      state.touching = false;
      if (state.hover) {
        state.hover = false;
        state.onLeave(state);
      }
    }
  }
}

function updatePointerState(state, rect) {
  const { position, nPosition } = state;
  position.x = pointerPos.x - rect.left;
  position.y = pointerPos.y - rect.top;
  nPosition.x = (position.x / rect.width) * 2 - 1;
  nPosition.y = (-position.y / rect.height) * 2 + 1;
}

function rectContainsPointer(rect) {
  const { x, y } = pointerPos;
  const { left, top, width, height } = rect;
  return x >= left && x <= left + width && y >= top && y <= top + height;
}

// Physics
const { randFloat, randFloatSpread } = MathUtils;
const tmpVec1 = new Vector3();
const tmpVec2 = new Vector3();
const tmpVec3 = new Vector3();
const tmpVec4 = new Vector3();
const tmpVec5 = new Vector3();
const tmpVec6 = new Vector3();
const tmpVec7 = new Vector3();
const tmpVec8 = new Vector3();
const tmpVec9 = new Vector3();
const tmpVec10 = new Vector3();

class PhysicsSystem {
  constructor(config) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.#initPositions();
    this.setSizes();
  }

  #initPositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const base = 3 * i;
      positionData[base] = randFloatSpread(2 * config.maxX);
      positionData[base + 1] = randFloatSpread(2 * config.maxY);
      positionData[base + 2] = randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = randFloat(config.minSize, config.maxSize);
    }
  }

  update(time) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIndex = 0;

    if (config.controlSphere0) {
      startIndex = 1;
      tmpVec1.fromArray(positionData, 0);
      const lerp = config.cursorLerp ?? 0.1;
      tmpVec1.lerp(center, lerp).toArray(positionData, 0);
      tmpVec4.set(0, 0, 0).toArray(velocityData, 0);
    }

    // Apply gravity & movement
    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tmpVec2.fromArray(positionData, base);
      tmpVec5.fromArray(velocityData, base);
      tmpVec5.y -= time.delta * config.gravity * sizeData[idx];
      tmpVec5.multiplyScalar(config.friction);
      tmpVec5.clampLength(0, config.maxVelocity);
      tmpVec2.add(tmpVec5);
      tmpVec2.toArray(positionData, base);
      tmpVec5.toArray(velocityData, base);
    }

    // Collisions & bounds
    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tmpVec2.fromArray(positionData, base);
      tmpVec5.fromArray(velocityData, base);
      const radius = sizeData[idx];

      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const baseOther = 3 * jdx;
        tmpVec3.fromArray(positionData, baseOther);
        tmpVec6.fromArray(velocityData, baseOther);
        const otherRadius = sizeData[jdx];

        tmpVec7.copy(tmpVec3).sub(tmpVec2);
        const dist = tmpVec7.length();
        const sumRadius = radius + otherRadius;

        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          tmpVec8
            .copy(tmpVec7)
            .normalize()
            .multiplyScalar(0.5 * overlap);
          tmpVec9.copy(tmpVec8).multiplyScalar(Math.max(tmpVec5.length(), 1));
          tmpVec10.copy(tmpVec8).multiplyScalar(Math.max(tmpVec6.length(), 1));

          tmpVec2.sub(tmpVec8);
          tmpVec5.sub(tmpVec9);
          tmpVec2.toArray(positionData, base);
          tmpVec5.toArray(velocityData, base);

          tmpVec3.add(tmpVec8);
          tmpVec6.add(tmpVec10);
          tmpVec3.toArray(positionData, baseOther);
          tmpVec6.toArray(velocityData, baseOther);
        }
      }

      if (config.controlSphere0) {
        tmpVec7.copy(tmpVec1).sub(tmpVec2);
        const dist = tmpVec7.length();
        const ctrlRadius = config.cursorControlSize ?? sizeData[0];
        const sumRadius0 = radius + ctrlRadius;
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          tmpVec8.copy(tmpVec7.normalize()).multiplyScalar(diff);
          const pushStr = config.cursorPushStrength ?? 1;
          tmpVec9.copy(tmpVec8).multiplyScalar(Math.max(tmpVec5.length(), 2) * pushStr);
          tmpVec2.sub(tmpVec8);
          tmpVec5.sub(tmpVec9);
        }
      }

      // Walls
      if (Math.abs(tmpVec2.x) + radius > config.maxX) {
        tmpVec2.x = Math.sign(tmpVec2.x) * (config.maxX - radius);
        tmpVec5.x = -tmpVec5.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(tmpVec2.y) + radius > config.maxY) {
          tmpVec2.y = Math.sign(tmpVec2.y) * (config.maxY - radius);
          tmpVec5.y = -tmpVec5.y * config.wallBounce;
        }
      } else if (tmpVec2.y - radius < -config.maxY) {
        tmpVec2.y = -config.maxY + radius;
        tmpVec5.y = -tmpVec5.y * config.wallBounce;
      }

      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(tmpVec2.z) + radius > maxBoundary) {
        tmpVec2.z = Math.sign(tmpVec2.z) * (config.maxZ - radius);
        tmpVec5.z = -tmpVec5.z * config.wallBounce;
      }

      tmpVec2.toArray(positionData, base);
      tmpVec5.toArray(velocityData, base);
    }
  }
}

// Default config, adapted to white polymer balls
const DEFAULT_CONFIG = {
  count: 200,
  colors: [0xffffff, 0xf5f5f5, 0xffffff], // white / off‑white
  ambientColor: 0xffffff,
  ambientIntensity: 0.9,
  lightIntensity: 180,
  materialParams: {
    metalness: 0.0,
    roughness: 0.35,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  },
  minSize: 0.6,
  maxSize: 1.2,
  size0: 1.2,
  gravity: 0.3,
  friction: 0.9975,
  wallBounce: 0.9,
  maxVelocity: 0.2,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
  cursorLerp: 0.1,
  cursorControlSize: 1.2,
  cursorPushStrength: 0.5,
};

const TMP_OBJECT = new Object3D();

class SpheresInstance extends InstancedMesh {
  constructor(renderer, config = {}) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const roomEnv = new RoomEnvironment();
    const pmremGen = new PMREMGenerator(renderer);
    const envTexture = pmremGen.fromScene(roomEnv, 0.04).texture;
    const geometry = new SphereGeometry();
    const material = new MeshPhysicalMaterial({ envMap: envTexture, ...mergedConfig.materialParams });
    material.envMapRotation.x = -Math.PI / 2;
    super(geometry, material, mergedConfig.count);
    this.config = mergedConfig;
    this.physics = new PhysicsSystem(mergedConfig);
    this.#initLights();
    this.setColors(mergedConfig.colors);
  }

  #initLights() {
    this.ambientLight = new AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }

  setColors(colors) {
    if (Array.isArray(colors) && colors.length > 0) {
      const gradient = (function makeGradient(list) {
        let raw = list;
        let colorObjs = [];
        function setColors(newColors) {
          raw = newColors;
          colorObjs = [];
          raw.forEach((col) => {
            colorObjs.push(new Color(col));
          });
        }
        setColors(list);
        return {
          setColors,
          getColorAt(ratio, out = new Color()) {
            const scaled = Math.max(0, Math.min(1, ratio)) * (raw.length - 1);
            const idx = Math.floor(scaled);
            const start = colorObjs[idx];
            if (idx >= raw.length - 1) return start.clone();
            const alpha = scaled - idx;
            const end = colorObjs[idx + 1];
            out.r = start.r + alpha * (end.r - start.r);
            out.g = start.g + alpha * (end.g - start.g);
            out.b = start.b + alpha * (end.b - start.b);
            return out;
          },
        };
      })(colors);

      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, gradient.getColorAt(idx / this.count));
        if (idx === 0) {
          this.light.color.copy(gradient.getColorAt(idx / this.count));
        }
      }
      this.instanceColor.needsUpdate = true;
    }
  }

  update(time) {
    this.physics.update(time);
    for (let idx = 0; idx < this.count; idx++) {
      TMP_OBJECT.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        TMP_OBJECT.scale.setScalar(0);
      } else {
        TMP_OBJECT.scale.setScalar(this.physics.sizeData[idx]);
      }
      TMP_OBJECT.updateMatrix();
      this.setMatrixAt(idx, TMP_OBJECT.matrix);
      if (idx === 0) this.light.position.copy(TMP_OBJECT.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas, overrides = {}) {
  const three = new ThreeManager({
    canvas,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  });

  let spheres;
  three.renderer.toneMapping = ACESFilmicToneMapping;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;
  three.resize();

  initialize(overrides);

  let pointer: any | null = null;

  // Только если разрешено следование за курсором, вешаем интеракцию
  if (overrides.followCursor !== false) {
    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const planeHit = new Vector3();

    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";

    pointer = createPointerInteraction(canvas, {
      domElement: canvas,
      onMove() {
        raycaster.setFromCamera(pointer.nPosition, three.camera);
        three.camera.getWorldDirection(plane.normal);
        raycaster.ray.intersectPlane(plane, planeHit);
        spheres.physics.center.copy(planeHit);
        spheres.config.controlSphere0 = true;
      },
      onLeave() {
        spheres.config.controlSphere0 = false;
      },
    });
  }

  function initialize(extraConfig) {
    if (spheres) {
      three.clear();
      three.scene.remove(spheres);
    }
    spheres = new SpheresInstance(three.renderer, extraConfig);
    three.scene.add(spheres);
  }

  three.onBeforeRender = (time) => {
    spheres.update(time);
  };

  three.onAfterResize = (size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };

  return {
    three,
    get spheres() {
      return spheres;
    },
    setCount(count) {
      initialize({ ...spheres.config, count });
    },
    dispose() {
      pointer?.dispose();
      three.dispose();
    },
  };
}

type BallpitProps = {
  className?: string;
  followCursor?: boolean;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  cursorLerp?: number;
  cursorControlSize?: number;
  cursorPushStrength?: number;
};

const Ballpit = ({
  className = "",
  followCursor = true,
  count,
  gravity,
  friction,
  wallBounce,
  cursorLerp,
  cursorControlSize,
  cursorPushStrength,
}: BallpitProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    instanceRef.current = createBallpit(canvas, {
      followCursor,
      ...(count !== undefined ? { count } : {}),
      ...(gravity !== undefined ? { gravity } : {}),
      ...(friction !== undefined ? { friction } : {}),
      ...(wallBounce !== undefined ? { wallBounce } : {}),
      ...(cursorLerp !== undefined ? { cursorLerp } : {}),
      ...(cursorControlSize !== undefined ? { cursorControlSize } : {}),
      ...(cursorPushStrength !== undefined ? { cursorPushStrength } : {}),
    });

    return () => {
      instanceRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
};

export default Ballpit;

