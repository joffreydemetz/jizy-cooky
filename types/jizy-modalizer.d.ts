declare module 'jizy-modalizer' {
	export default class Modalizer {
		static init(selector: string): Modalizer;
		show(): void;
		hide(): void;
		find(selector: string): any;
	}
}
