declare module 'animejs' {
  interface AnimeInstance {
    pause(): AnimeInstance;
    play(): AnimeInstance;
    restart(): AnimeInstance;
    reverse(): AnimeInstance;
    seek(time: number): AnimeInstance;
  }

  interface AnimeParams {
    targets?: any;
    duration?: number;
    delay?: number | ((element: any, index: number) => number);
    endDelay?: number | ((element: any, index: number) => number);
    easing?: string;
    round?: number | boolean;
    keyframes?: AnimeParams[];
    direction?: 'normal' | 'reverse' | 'alternate';
    loop?: number | boolean;
    autoplay?: boolean;
    begin?: (anim: AnimeInstance) => void;
    change?: (anim: AnimeInstance) => void;
    update?: (anim: AnimeInstance) => void;
    complete?: (anim: AnimeInstance) => void;
    loopBegin?: (anim: AnimeInstance) => void;
    loopComplete?: (anim: AnimeInstance) => void;
    changeBegin?: (anim: AnimeInstance) => void;
    changeComplete?: (anim: AnimeInstance) => void;
    [AnyAnimatedProperty: string]: any;
  }

  interface AnimeStagger {
    value: number;
    direction?: 'normal' | 'reverse';
    easing?: string;
    grid?: [number, number];
    axis?: 'x' | 'y';
    from?: 'first' | 'last' | 'center' | number;
  }

  function anime(params: AnimeParams): AnimeInstance;

  namespace anime {
    const version: string;
    const speed: number;
    const running: AnimeInstance[];
    const remove: (targets: any) => void;
    const get: (targets: any, prop: string, unit?: string) => string | number;
    const set: (targets: any, prop: any) => void;
    const convertPx: (value: string) => number;
    const path: (path: string) => (prop: string) => any;
    const setDashoffset: (el: any) => number;
    const bezier: (x1: number, y1: number, x2: number, y2: number) => (t: number) => number;
    const stagger: (value: number | AnimeStagger, options?: AnimeStagger) => (element: any, index: number) => number;
    const timeline: (params?: AnimeParams) => any;
    const random: (min: number, max: number) => number;
  }

  export = anime;
}