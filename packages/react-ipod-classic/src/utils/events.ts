export type IpodEvent =
  | "centerclick"
  | "centerlongclick"
  | "forwardclick"
  | "backwardclick"
  | "forwardscroll"
  | "backwardscroll"
  | "menuclick"
  | "menulongpress"
  | "playpauseclick";

export const clickWheelKeys = new Map<string, IpodEvent>([
  ["ArrowUp", "backwardscroll"],
  ["ArrowLeft", "backwardscroll"],
  ["ArrowDown", "forwardscroll"],
  ["ArrowRight", "forwardscroll"],
  ["Enter", "centerclick"],
  [" ", "playpauseclick"],
  ["Spacebar", "playpauseclick"],
  ["Escape", "menuclick"],
]);
