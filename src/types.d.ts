declare module '*.svg' {
  import type { Component, JSX } from 'solid-js';
  type SVGProps = JSX.SvgSVGAttributes<SVGElement>;
  const c: Component<SVGProps>;
  export default c;
}
