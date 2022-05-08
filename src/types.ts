import { Ref, RefObject, ReactNode } from "react";
import { ViewProps, StyleProp, ViewStyle } from "react-native";
import { GestureEvent, HandlerStateChangeEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import Animated, { SharedValue } from "react-native-reanimated";

export type IFrameGestureContext = {
    lastTranslationY: number;
    lastTranslationX: number;
    containerMeasure: IFrameMeasure;
}

export type IFramePointGestureContext = {
    top: number;
    left: number;
    width: number;
    height: number;
    lastTranslationY: number;
    lastTranslationX: number;
    containerMeasure: IFrameMeasure;
    frameMeasure: { width: number, height: number };
    minFrameMeasure: IFrameMeasure;
    maxFrameMeasure: IFrameMeasure;
}

export interface IFrameContext {
    top: SharedValue<number>;
    left: SharedValue<number>;
    width: SharedValue<number>;
    height: SharedValue<number>;
    containerRef: RefObject<Animated.View>;
    frameRef: RefObject<Animated.View>;
    initialFrameRef: RefObject<Animated.View>;
    minFrameRef: RefObject<Animated.View>;
    maxFrameRef: RefObject<Animated.View>;
    rStyle: StyleProp<ViewStyle>;
    onFrameLayout: () => void;
    resetFrameLayout: () => void;
    onFramePanGestureEvent?: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
    onPointPanGestureEvent: (point: IFramePointName, type: IFramePointTypeScale | IFramePointTypeScaleLock) => (event: GestureEvent<any>) => void;
}

export interface IFrameImperativeHandle {
    top: SharedValue<number>;
    left: SharedValue<number>;
    width: SharedValue<number>;
    height: SharedValue<number>;
    resetFrame: () => void;
}

export interface IFrameContainerProps<T> extends ViewProps {
    ref?: Ref<T> | undefined;
}

export type IFramePointName = "top" | "right" | "bottom" | "left" | "top-right" | "bottom-right" | "bottom-left" | "top-left";

export type IFramePointTypeScale = "scale";

export type IFramePointTypeScaleLock = "scale-lock";

export type IFramePoint<ScaleType> = {
    type?: ScaleType | "rotate";
    style?: StyleProp<ViewStyle>;
    elementRender?: () => ReactNode;
}

export interface IFramePoints {
    "top"?: IFramePoint<IFramePointTypeScale>;
    "bottom"?: IFramePoint<IFramePointTypeScale>;
    "left"?: IFramePoint<IFramePointTypeScale>;
    "right"?: IFramePoint<IFramePointTypeScale>;
    "top-left"?: IFramePoint<IFramePointTypeScale | IFramePointTypeScaleLock>;
    "top-right"?: IFramePoint<IFramePointTypeScale | IFramePointTypeScaleLock>;
    "bottom-left"?: IFramePoint<IFramePointTypeScale | IFramePointTypeScaleLock>;
    "bottom-right"?: IFramePoint<IFramePointTypeScale | IFramePointTypeScaleLock>;
}

export interface IFrameBoxProps extends ViewProps {
    points?: IFramePoints;
    pointSize?: number;
    onChangeState?: (state: IFrameBoxOnChangeStateEvent) => void;
}

export interface IFrameBoxPointsProps {
    points?: IFramePoints;
    pointSize?: number;
    onHandlerStateChange?: (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => void;
}

export interface IFrameMeasure {
    width: number;
    height: number;
    x: number;
    y: number;
    pageX: number;
    pageY: number;
}

export interface IFrameNativeMeasure {
    width: number;
    height: number;
    ox: number;
    oy: number;
    pageX: number;
    pageY: number;
}

export interface IFrameBoxStatements {
    isDragging?: boolean;
    isResizing?: boolean;
}

export interface IFrameBoxOnChangeStateEvent extends IFrameBoxStatements {
    state: IFrameBoxStatements;
}
