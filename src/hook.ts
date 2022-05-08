import { createContext, useRef, RefObject } from "react";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    useAnimatedRef,
    measure,
    withTiming,
    WithTimingConfig,
    withDelay,
} from "react-native-reanimated";
import {
    PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

import {
    IFrameGestureContext,
    IFramePointGestureContext,
    IFrameContext,
    IFramePointName,
    IFramePointTypeScale,
    IFramePointTypeScaleLock,
    IFrameMeasure,
    IFrameNativeMeasure
} from "./types";

export const Context = createContext<IFrameContext>({} as IFrameContext)

const useHook = () => {
    const containerRef = useAnimatedRef<Animated.View>();
    const frameRef = useAnimatedRef<Animated.View>();
    const initialFrameRef = useAnimatedRef<Animated.View>();
    const minFrameRef = useAnimatedRef<Animated.View>();
    const maxFrameRef = useAnimatedRef<Animated.View>();

    const width = useSharedValue(0);
    const height = useSharedValue(0);
    const top = useSharedValue(0);
    const left = useSharedValue(0);
    const opacity = useSharedValue(0);

    const frameMeasure = useSharedValue<IFrameMeasure>({} as IFrameMeasure);

    const onFrameLayoutIdRef = useRef<number>();

    const frameIsLoadedRef = useRef<boolean>(false);

    const getMeasure = (ref: RefObject<any>): Promise<IFrameNativeMeasure> => new Promise((resolve) => {
        ref.current?.measure?.((ox: number, oy: number, width: number, height: number, pageX: number, pageY: number) => {
            resolve({ ox, oy, width, height, pageX, pageY });
        });
    });

    const sleep = (time: number) => new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });

    const handleFrameLayout = async (isInitialEvent?: boolean) => {
        const id = Math.random();

        onFrameLayoutIdRef.current = id;

        await sleep(100);

        if (onFrameLayoutIdRef.current !== id) return;

        const _frameRef = (isInitialEvent || !frameIsLoadedRef.current) ? initialFrameRef : frameRef;

        const {
            0: _containerMeasure,
            1: _frameMeasure
        }: IFrameNativeMeasure[] = await Promise.all([getMeasure(containerRef), getMeasure(_frameRef)]);

        const frameRatio = _frameMeasure.width / _frameMeasure.height;

        const _width = _frameMeasure.width;
        const _height = _frameMeasure.height;
        const _y = _frameMeasure.pageY - _containerMeasure.pageY;
        const _x = _frameMeasure.pageX - _containerMeasure.pageX;

        let _limitWidth = Math.min(_width, _containerMeasure.width);
        let _limitHeight = Math.min(_height, _containerMeasure.height);

        _limitWidth = Math.min(_limitWidth, _limitHeight * frameRatio);
        _limitHeight = Math.min(_limitHeight, _limitWidth / frameRatio);

        const _limitX = Math.max(0, Math.min(_x, _containerMeasure.width - _limitWidth));
        const _limitY = Math.max(0, Math.min(_y, _containerMeasure.height - _limitHeight));

        const layout: IFrameMeasure = {
            width: _limitWidth,
            height: _limitHeight,
            x: _limitX,
            y: _limitY,
            pageX: _frameMeasure.pageX,
            pageY: _frameMeasure.pageY,
        }

        frameMeasure.value = layout;

        const timingConfig: WithTimingConfig = {
            duration: frameIsLoadedRef.current ? 500 : 0
        };

        width.value = withTiming(layout.width, timingConfig);
        height.value = withTiming(layout.height, timingConfig);
        top.value = withTiming(layout.y, timingConfig);
        left.value = withTiming(layout.x, timingConfig);
        opacity.value = withDelay(60, withTiming(1, timingConfig));

        frameIsLoadedRef.current = true;
    }

    const onFrameLayout = async () => handleFrameLayout();

    const resetFrameLayout = async () => {
        opacity.value = 0;
        
        frameIsLoadedRef.current = false;

        handleFrameLayout(true);
    }

    const onFramePanGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, IFrameGestureContext>({
        onStart: (event, context) => {
            context.lastTranslationY = 0;
            context.lastTranslationX = 0;

            context.containerMeasure = measure(containerRef);
        },
        onActive: (event, context) => {
            const translateY = event.translationY - context.lastTranslationY;
            const translateX = event.translationX - context.lastTranslationX;

            context.lastTranslationY = event.translationY;
            context.lastTranslationX = event.translationX;

            top.value = top.value + translateY;
            left.value = left.value + translateX;
        },
        onEnd: (event, context) => {
            top.value <= 0 && (top.value = withSpring(0));
            left.value <= 0 && (left.value = withSpring(0));
            (top.value + height.value) > context.containerMeasure.height && (top.value = withSpring(context.containerMeasure.height - height.value));
            (left.value + width.value) > context.containerMeasure.width && (left.value = withSpring(context.containerMeasure.width - width.value));
        },
    });

    const onPointPanGestureEvent = (point: IFramePointName, type: IFramePointTypeScale | IFramePointTypeScaleLock) => useAnimatedGestureHandler<PanGestureHandlerGestureEvent, IFramePointGestureContext>({
        onStart: (event, context) => {
            context.top = top.value;
            context.left = left.value;
            context.width = width.value;
            context.height = height.value;

            context.lastTranslationY = 0;
            context.lastTranslationX = 0;

            context.containerMeasure = measure(containerRef);
            context.frameMeasure = {
                width: width.value,
                height: height.value,
            };
            context.minFrameMeasure = measure(minFrameRef);
            context.maxFrameMeasure = measure(maxFrameRef);
        },
        onActive: (event, context) => {
            const frameRatio = context.frameMeasure.width / context.frameMeasure.height;

            const lock = type === "scale-lock";

            const translateY = event.translationY - context.lastTranslationY;
            const translateX = event.translationX - context.lastTranslationX;

            const maxFrameWidth = context.maxFrameMeasure.width ?
                Math.min(context.maxFrameMeasure.width, context.containerMeasure.width) :
                context.containerMeasure.width;
            const maxFrameHeight = context.maxFrameMeasure.height?
                Math.min(context.maxFrameMeasure.height, context.containerMeasure.height) :
                context.containerMeasure.height;

            const minFrameWidth = context.minFrameMeasure.width || Math.min(20, frameMeasure.value.width * .4);
            const minFrameHeight = context.minFrameMeasure.height || Math.min(20, frameMeasure.value.height * .4);

            const getLimitTranslate = ({ translateX = 0, translateY = 0 }: { translateX?: number, translateY?: number }) => ({
                top: translateY < 0 ?
                    Math.max(translateY, (height.value - maxFrameHeight), -top.value) :
                    Math.min(translateY, (height.value - minFrameHeight)),
                bottom: translateY < 0 ?
                    Math.max(translateY, (minFrameHeight - height.value)) :
                    Math.min(translateY, (maxFrameHeight - height.value), (context.containerMeasure.height - top.value - height.value)),
                left: translateX < 0 ?
                    Math.max(translateX, (width.value - maxFrameWidth), -left.value) :
                    Math.min(translateX, (width.value - minFrameWidth)),
                right: translateX < 0 ?
                    Math.max(translateX, (minFrameWidth - width.value)) :
                    Math.min(translateX, (maxFrameWidth - width.value), (context.containerMeasure.width - left.value - width.value)),
            });

            context.lastTranslationY = event.translationY;
            context.lastTranslationX = event.translationX;

            const scaleToTop = (value: number) => {
                top.value = top.value + value;
                height.value = height.value - value;
            }

            const scaleToBottom = (value: number) => {
                height.value = height.value + value;
            }

            const scaleToLeft = (value: number) => {
                left.value = left.value + value;
                width.value = width.value - value;
            }

            const scaleToRight = (value: number) => {
                width.value = width.value + value;
            }

            const scaleWithoutLock = () => {
                const limitTranslate = getLimitTranslate({ translateX, translateY });

                (point === "top" || point === "top-left" || point === "top-right") && scaleToTop(limitTranslate.top);
                (point === "bottom" || point === "bottom-left" || point === "bottom-right") && scaleToBottom(limitTranslate.bottom);
                (point === "left" || point === "top-left" || point === "bottom-left") && scaleToLeft(limitTranslate.left);
                (point === "right" || point === "top-right" || point === "bottom-right") && scaleToRight(limitTranslate.right);
            }

            const scaleWithLock = () => {
                const limitTranslate = getLimitTranslate({ translateX, translateY });

                const topLeft = () => {
                    if (
                        !(
                            (limitTranslate.top > 0 && limitTranslate.left > 0) ||
                            (limitTranslate.top < 0 && limitTranslate.left < 0)
                        )
                    ) return;

                    const limitTranslateRatio = Math.abs(limitTranslate.left) / Math.abs(limitTranslate.top);
                    const ratio = limitTranslateRatio / frameRatio;

                    let y = ratio >= 1 ? limitTranslate.top * ratio : limitTranslate.top;
                    let x = ratio >= 1 ? limitTranslate.left : limitTranslate.left / ratio;

                    const nextLimitTranslate = getLimitTranslate({ translateX: x, translateY: y });

                    if (nextLimitTranslate.top !== y || nextLimitTranslate.left !== x) {
                        const nextLimitTranslateRatio = Math.abs(nextLimitTranslate.left) / Math.abs(nextLimitTranslate.top);
                        const nextRatio = nextLimitTranslateRatio / frameRatio;

                        y = ratio >= 1 ? nextLimitTranslate.top : nextLimitTranslate.top * nextRatio;
                        x = ratio >= 1 ? nextLimitTranslate.left / nextRatio : nextLimitTranslate.left;
                    }

                    scaleToTop(y);
                    scaleToLeft(x);
                }

                const topRight = () => {
                    if (
                        !(
                            (limitTranslate.top > 0 && limitTranslate.right < 0) ||
                            (limitTranslate.top < 0 && limitTranslate.right > 0)
                        )
                    ) return;

                    const limitTranslateRatio = Math.abs(limitTranslate.right) / Math.abs(limitTranslate.top);
                    const ratio = limitTranslateRatio / frameRatio;

                    let y = ratio >= 1 ? limitTranslate.top * ratio : limitTranslate.top;
                    let x = ratio >= 1 ? limitTranslate.right : limitTranslate.right / ratio;

                    const nextLimitTranslate = getLimitTranslate({ translateX: x, translateY: y });

                    if (nextLimitTranslate.top !== y || nextLimitTranslate.right !== x) {
                        const nextLimitTranslateRatio = Math.abs(nextLimitTranslate.right) / Math.abs(nextLimitTranslate.top);
                        const nextRatio = nextLimitTranslateRatio / frameRatio;

                        y = ratio >= 1 ? nextLimitTranslate.top : nextLimitTranslate.top * nextRatio;
                        x = ratio >= 1 ? nextLimitTranslate.right / nextRatio : nextLimitTranslate.right;
                    }

                    scaleToTop(y);
                    scaleToRight(x);
                }

                const bottomLeft = () => {
                    if (
                        !(
                            (limitTranslate.bottom < 0 && limitTranslate.left > 0) ||
                            (limitTranslate.bottom > 0 && limitTranslate.left < 0)
                        )
                    ) return;

                    const limitTranslateRatio = Math.abs(limitTranslate.left) / Math.abs(limitTranslate.bottom);
                    const ratio = limitTranslateRatio / frameRatio;

                    let y = ratio >= 1 ? limitTranslate.bottom * ratio : limitTranslate.bottom;
                    let x = ratio >= 1 ? limitTranslate.left : limitTranslate.left / ratio;

                    const nextLimitTranslate = getLimitTranslate({ translateX: x, translateY: y });

                    if (nextLimitTranslate.bottom !== y || nextLimitTranslate.left !== x) {
                        const nextLimitTranslateRatio = Math.abs(nextLimitTranslate.left) / Math.abs(nextLimitTranslate.bottom);
                        const nextRatio = nextLimitTranslateRatio / frameRatio;

                        y = ratio >= 1 ? nextLimitTranslate.bottom : nextLimitTranslate.bottom * nextRatio;
                        x = ratio >= 1 ? nextLimitTranslate.left / nextRatio : nextLimitTranslate.left;
                    }

                    scaleToBottom(y);
                    scaleToLeft(x);
                }

                const bottomRight = () => {
                    if (
                        !(
                            (limitTranslate.bottom < 0 && limitTranslate.right < 0) ||
                            (limitTranslate.bottom > 0 && limitTranslate.right > 0)
                        )
                    ) return;

                    const limitTranslateRatio = Math.abs(limitTranslate.right) / Math.abs(limitTranslate.bottom);
                    const ratio = limitTranslateRatio / frameRatio;

                    let y = ratio >= 1 ? limitTranslate.bottom * ratio : limitTranslate.bottom;
                    let x = ratio >= 1 ? limitTranslate.right : limitTranslate.right / ratio;

                    const nextLimitTranslate = getLimitTranslate({ translateX: x, translateY: y });

                    if (nextLimitTranslate.bottom !== y || nextLimitTranslate.right !== x) {
                        const nextLimitTranslateRatio = Math.abs(nextLimitTranslate.right) / Math.abs(nextLimitTranslate.bottom);
                        const nextRatio = nextLimitTranslateRatio / frameRatio;

                        y = ratio >= 1 ? nextLimitTranslate.bottom : nextLimitTranslate.bottom * nextRatio;
                        x = ratio >= 1 ? nextLimitTranslate.right / nextRatio : nextLimitTranslate.right;
                    }

                    scaleToBottom(y);
                    scaleToRight(x);
                }

                switch (point) {
                    case "top-left":
                        topLeft();
                        break;
                    case "top-right":
                        topRight();
                        break;
                    case "bottom-left":
                        bottomLeft();
                        break;
                    case "bottom-right":
                        bottomRight();
                        break;
                }
            }

            lock ? scaleWithLock() : scaleWithoutLock();
        },
        onEnd: () => {

        },
    });

    const rStyle = useAnimatedStyle(() => ({
        top: top.value,
        left: left.value,
        width: width.value,
        height: height.value,
        opacity: opacity.value
    }));

    return {
        top,
        left,
        width,
        height,
        containerRef,
        frameRef,
        initialFrameRef,
        minFrameRef,
        maxFrameRef,
        rStyle,
        onFrameLayout,
        resetFrameLayout,
        onPointPanGestureEvent,
        onFramePanGestureEvent,
    }
};

export default useHook;