import React, { forwardRef, useImperativeHandle } from "react";
import Animated from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import useHook, { Context } from "../hook";
import { IFrameContainerProps, IFrameImperativeHandle } from "../types";

const Container = forwardRef<IFrameImperativeHandle, IFrameContainerProps<any>>((props, ref) => {
    const hook = useHook();

    useImperativeHandle(ref, () => ({
        top: hook.top,
        left: hook.left,
        width: hook.width,
        height: hook.height,
        resetFrame: hook.resetFrameLayout
    }));

    return (
        <Context.Provider value={hook}>
            <GestureHandlerRootView>
                <Animated.View
                    {...props}
                    ref={hook.containerRef} />
            </GestureHandlerRootView>
        </Context.Provider>
    )
});

export { Container };