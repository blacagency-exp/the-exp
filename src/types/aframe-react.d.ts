// Type definitions for A-Frame
declare namespace AFRAME {
    interface Component {
      schema: Record<string, unknown>;
      init(): void;
      update(): void;
      tick(): void;
      remove(): void;
      pause(): void;
      play(): void;
    }
  
    interface ComponentConstructor {
      new(): Component;
    }
  
    interface Entity extends HTMLElement {
      object3D: THREE.Object3D;
      components: { [key: string]: Component };
      isPlaying: boolean;
      hasLoaded: boolean;
      addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
  
    interface Scene extends Entity {
      behaviors: Array<() => void>;
      camera: THREE.Camera;
      canvas: HTMLCanvasElement;
      isMobile: boolean;
      renderer: THREE.WebGLRenderer;
      renderStarted: boolean;
      systems: Record<string, unknown>;
    }
  
    interface System {
      init(): void;
      tick(): void;
    }
  
    interface SystemConstructor {
      new(scene: Scene): System;
    }
  
    interface Utils {
      coordinates: {
        isCoordinates(value: string): boolean;
        parse(value: string): { x: number, y: number, z: number };
        stringify(coord: { x: number, y: number, z: number }): string;
      };
    }
  
    interface Core {
      components: { [key: string]: ComponentConstructor };
      geometries: { [key: string]: THREE.BufferGeometry };
      materials: { [key: string]: THREE.Material };
      registerComponent(name: string, component: Component): ComponentConstructor;
      registerElement(name: string, element: object): void;
      registerGeometry(name: string, geometry: object): void;
      registerMaterial(name: string, material: object): void;
      registerPrimitive(name: string, primitive: object): void;
      registerShader(name: string, shader: object): void;
      registerSystem(name: string, system: System): SystemConstructor;
    }
  }
  
  interface Window {
    AFRAME: AFRAME.Core;
  }