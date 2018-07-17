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
    sidebarWidth?: number;
    triggerThreshold?: number;
    triggerArea?: number;
    mode?: "overlay" | "slide";
}
export default class AnimatedDrawer extends React.Component<Props, State> {
    private panResponder;
    private animatedValueX;
    private shouldCapture;
    private shouldTrigger;
    private animationInProgess;
    readonly sidebarWidth: number;
    readonly triggerThreshold: number;
    readonly triggerArea: number;
    readonly mode: string;
    constructor(props: any);
    open(): void;
    close(): void;
    componentWillUnmount(): void;
    static getDerivedStateFromProps(nextProps: Props, prevState: State): State;
    render(): React.ReactNode;
}
export {};
