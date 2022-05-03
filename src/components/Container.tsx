import React, { forwardRef, useImperativeHandle } from "react";
import Animated from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import styles from "../style";
import useHook, { Context } from "../hook";
import { IFrameContainerProps, IFrameImperativeHandle } from "../types";

const Container = forwardRef<IFrameImperativeHandle, IFrameContainerProps<any>>((props, ref) => {
    const hook = useHook();

    useImperativeHandle(ref, () => ({
        top: hook.top,
        left: hook.left,
        width: hook.width,
        height: hook.height,
    }));

    return (
        <Context.Provider value={hook}>
            <GestureHandlerRootView>
                <Animated.View
                    {...props}
                    ref={hook.containerRef}
                    style={[
                        props.style,
                        hook.frameIsLoaded ?
                            styles.containerClearPositions :
                            {}
                    ]}
                    onLayout={hook.onFrameLayout} />
            </GestureHandlerRootView>
        </Context.Provider>
    )
});

export { Container };