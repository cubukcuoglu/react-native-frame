import React, { FC, useContext, useEffect, useRef } from "react";
import { StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { HandlerStateChangeEvent, PanGestureHandler, State } from "react-native-gesture-handler";

import styles from "../style";
import { Context } from "../hook";
import { IFrameBoxProps, IFrameBoxStatements } from "../types";
import { Points } from "./Points";
import { DEFAULT_STATEMENTS } from '../constants';

const Box: FC<IFrameBoxProps> = (props) => {
    const { rStyle, frameRef, initialFrameRef, minFrameRef, maxFrameRef, resetFrameLayout, onFrameLayout, onFramePanGestureEvent } = useContext(Context) ?? {};

    const propsStyle: Array<StyleProp<any>> = Array.isArray(props?.style) ? props.style : [props.style];

    const statements = useRef<IFrameBoxStatements>(DEFAULT_STATEMENTS);

    const minSize = {
        width: propsStyle?.find((style) => style?.minWidth)?.minWidth,
        height: propsStyle?.find((style) => style?.minHeight)?.minHeight
    };

    const maxSize = {
        width: propsStyle?.find((style) => style?.maxWidth)?.maxWidth,
        height: propsStyle?.find((style) => style?.maxHeight)?.maxHeight
    };

    useEffect(() => {
        resetFrameLayout();
    }, [
        JSON.stringify(props.style)
    ]);

    const changeStatements = (params: IFrameBoxStatements) => {
        const paramsIsNotExists = Object.keys(params).some((k) => (params as any)[k] !== (statements.current as any)[k]);

        if (!paramsIsNotExists) return;

        statements.current = { ...statements.current, ...params };

        props?.onChangeState?.({ ...params, state: statements.current });
    }

    const boxHandlerStateChange = ({ nativeEvent }: HandlerStateChangeEvent) => {
        const state = nativeEvent.state;

        changeStatements({ isDragging: state === State.ACTIVE ? true : false });
    }

    const pointHandlerStateChange = ({ nativeEvent }: HandlerStateChangeEvent) => {
        const state = nativeEvent.state;

        changeStatements({ isResizing: state === State.ACTIVE ? true : false });
    }

    return (
        <>
            <PanGestureHandler maxPointers={1} onGestureEvent={onFramePanGestureEvent} onHandlerStateChange={boxHandlerStateChange}>
                <Animated.View
                    {...props}
                    ref={frameRef}
                    style={[
                        styles.box,
                        props.style,
                        styles.boxHide,
                        styles.boxClearPositions,
                        rStyle
                    ]}>
                    {props.children}
                    <Points {...props} onHandlerStateChange={pointHandlerStateChange} />
                </Animated.View>
            </PanGestureHandler>
            <Animated.View ref={initialFrameRef} style={[props.style, styles.boxHide]} onLayout={onFrameLayout} />
            <Animated.View ref={minFrameRef} style={[styles.boxMinMax, { ...minSize }]} />
            <Animated.View ref={maxFrameRef} style={[styles.boxMinMax, { ...maxSize }]} />
        </>
    );
};

export { Box };