import { fabric } from "fabric";

declare module "fabric/fabric-impl" {
  interface Canvas {
    /* fabric-history */
    undo: (callback?: () => void) => void;
    redo: (callback?: () => void) => void;
    clearHistory: () => void;
  }
}
