import * as React from "react";
import { ReactNode } from "react";
import { Animated } from "react-native";
import Value = Animated.Value;
interface State {
    pan: Value;
    open: () => any;
    close: () => any;
}
interface Props {
    content: ReactNode;
    sidebarContent: ReactNode;
    isOpen: boolean;
    shouldOpen: () => any;
    shouldClose: () => any;
}
export default class AnimatedDrawer extends React.Component<Props, State> {
    private panResponder;
    private animatedValueX;
    private shouldCapture;
    private threshold;
    private limit;
    private shouldTrigger;
    constructor(props: any);
    open(): void;
    close(): void;
    componentWillUnmount(): void;
    static getDerivedStateFromProps(nextProps: Props, prevState: State): State;
    render(): React.ReactNode;
}
export {};
