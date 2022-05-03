import { StyleSheet } from "react-native";

import { DEFAULT_BOX_BORDER_COLOR, DEFAULT_BOX_LINE_WIDTH } from "./constants";

export default StyleSheet.create({
    containerClearPositions: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    box: {
        borderWidth: DEFAULT_BOX_LINE_WIDTH,
        borderColor: DEFAULT_BOX_BORDER_COLOR
    },
    boxClearPositions: {
        position: "absolute",
        margin: 0,
        marginHorizontal: 0,
        marginVertical: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginStart: 0,
        marginEnd: 0,
        transform: [{ translateY: 0 }, { translateX: 0 }],
        aspectRatio: undefined,
        minWidth: undefined,
        maxWidth: undefined,
        minHeight: undefined,
        maxHeight: undefined
    },
    boxMinMax: {
        position: "absolute",
        opacity: 0
    },
    boxHide: {
        opacity: 0
    }
});