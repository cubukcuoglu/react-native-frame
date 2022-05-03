import { IFrameBoxStatements, IFramePoints } from "./types";

export const DEFAULT_BOX_BORDER_COLOR = "#EFEFEF";
export const DEFAULT_BOX_LINE_WIDTH = 1;
export const DEFAULT_BOX_POINT_COLOR = "#737373";
export const DEFAULT_STATEMENTS: IFrameBoxStatements = {
    isDragging: false,
    isResizing: false
};
export const DEFAULT_FRAME_POINTS: IFramePoints = {
    "top": { type: "scale" },
    "right": { type: "scale" },
    "bottom": { type: "scale" },
    "left": { type: "scale" },
    "top-left": { type: "scale" },
    "bottom-left": { type: "scale" },
    "top-right": { type: "scale" },
    "bottom-right": { type: "scale" },
};
export const DEFAULT_FRAME_POINT_SIZE = 20;