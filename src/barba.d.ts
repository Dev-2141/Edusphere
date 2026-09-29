// Minimal typings for the parts of @barba/core this site uses.
declare module '@barba/core' {
  interface BarbaPage {
    container: HTMLElement;
    namespace: string;
    url: { href: string; path: string };
  }
  interface BarbaData {
    current: BarbaPage;
    next: BarbaPage;
    trigger: HTMLElement | 'barba' | 'back' | 'forward';
  }
  interface BarbaTransition {
    name?: string;
    once?: (data: BarbaData) => unknown;
    leave?: (data: BarbaData) => unknown;
    beforeEnter?: (data: BarbaData) => unknown;
    enter?: (data: BarbaData) => unknown;
    after?: (data: BarbaData) => unknown;
  }
  interface BarbaOptions {
    transitions?: BarbaTransition[];
    preventRunning?: boolean;
    prevent?: (args: { el: HTMLElement; event: Event; href: string }) => boolean;
  }
  const barba: { init(options: BarbaOptions): void; go(href: string): Promise<void> };
  export default barba;
}
