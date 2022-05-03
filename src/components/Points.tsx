import React, { FC, useContext } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import { Context } from "../hook";
import { IFramePointName, IFrameBoxPointsProps } from "../types";
import { DEFAULT_BOX_POINT_COLOR, DEFAULT_FRAME_POINTS, DEFAULT_FRAME_POINT_SIZE } from '../constants';

const Points: FC<IFrameBoxPointsProps> = ({ points = DEFAULT_FRAME_POINTS, pointSize = DEFAULT_FRAME_POINT_SIZE, onHandlerStateChange }) => {
    const { onPointPanGestureEvent } = useContext(Context) ?? {};

    const pointWrapperSize = Math.max(Math.min(pointSize * 2, 40), pointSize);

    const getPointPositions = (point: IFramePointName) => {
        switch (point) {
            case "top":
                return { top: 0, left: "50%", marginTop: -pointWrapperSize / 2, marginLeft: -pointWrapperSize / 2 };
            case "bottom":
                return { bottom: 0, left: "50%", marginBottom: -pointWrapperSize / 2, marginLeft: -pointWrapperSize / 2 };
            case "left":
                return { top: "50%", left: 0, marginTop: -pointWrapperSize / 2, marginLeft: -pointWrapperSize / 2 };
            case "right":
                return { top: "50%", right: 0, marginTop: -pointWrapperSize / 2, marginRight: -pointWrapperSize / 2 };
            case "top-left":
                return { top: 0, left: 0, marginTop: -pointWrapperSize / 2, marginLeft: -pointWrapperSize / 2 };
            case "top-right":
                return { top: 0, right: 0, marginTop: -pointWrapperSize / 2, marginRight: -pointWrapperSize / 2 };
            case "bottom-left":
                return { bottom: 0, left: 0, marginBottom: -pointWrapperSize / 2, marginLeft: -pointWrapperSize / 2 };
            case "bottom-right":
                return { bottom: 0, right: 0, marginBottom: -pointWrapperSize / 2, marginRight: -pointWrapperSize / 2 };
            default:
                return {};
        }
    };

    return (
        <>
            {Object.keys(points).map((name) => {
                const pointName = name as IFramePointName;

                const positions = getPointPositions(pointName);

                const point = points[pointName];

                const canScale = point?.type === "scale" || point?.type === "scale-lock";

                return (
                    <PanGestureHandler 
                        key={pointName} 
                        maxPointers={1} 
                        enabled={canScale} 
                        onGestureEvent={onPointPanGestureEvent(pointName, point?.type as any)}
                        onHandlerStateChange={onHandlerStateChange}>
                        <Animated.View
                            style={[
                                {
                                    position: "absolute",
                                    zIndex: 2,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: pointWrapperSize,
                                    height: pointWrapperSize,
                                    ...positions
                                },
                                point?.style
                            ]}>
                            {
                                point?.elementRender?.() ??
                                <View
                                    style={{
                                        width: pointSize,
                                        height: pointSize,
                                        borderRadius: pointSize / 2,
                                        backgroundColor: DEFAULT_BOX_POINT_COLOR,
                                    }} />
                            }
                        </Animated.View>
                    </PanGestureHandler>
                )
            })}
        </>
    )
};

export { Points }