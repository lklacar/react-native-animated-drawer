import * as React from "react";
import {ReactNode} from "react";
import {
    Animated,
    Dimensions,
    GestureResponderEvent,
    PanResponder,
    PanResponderGestureState,
    PanResponderInstance,
    View
} from "react-native";
import Value = Animated.Value;

interface State {
    pan: Value,
    open: () => any,
    close: () => any,
}

interface Props {
    content: ReactNode,
    sidebarContent: ReactNode,
    isOpen: boolean,
    shouldOpen: () => any,
    shouldClose: () => any,

    sidebarWidth?: number,
    triggerThreshold?: number,
    triggerArea?: number;
}

const {width} = Dimensions.get('window');

export default class AnimatedDrawer extends React.Component<Props, State> {

    private panResponder: PanResponderInstance;
    private animatedValueX: number;
    private shouldCapture: boolean = true;
    private shouldTrigger: boolean = false;
    private animationInProgess: boolean = false;

    get sidebarWidth(): number {
        return this.props.sidebarWidth ? this.props.sidebarWidth : width - 50;
    }

    get triggerThreshold(): number {
        return this.props.triggerThreshold ? this.props.triggerThreshold : 50;
    }

    get triggerArea(): number {
        return this.props.triggerArea ? this.props.triggerArea : 100;
    }

    constructor(props: any) {
        super(props);

        this.state = {
            pan: new Animated.Value(0),

            open: this.open.bind(this),
            close: this.close.bind(this)
        };

        this.animatedValueX = 0;
        this.state.pan.addListener(({value}) => {
            return this.animatedValueX = Math.max(0, Math.min(value, this.sidebarWidth));
        });

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => this.shouldCapture,
            onStartShouldSetPanResponderCapture: () => this.shouldCapture,
            onMoveShouldSetPanResponder: () => this.shouldCapture,
            onMoveShouldSetPanResponderCapture: () => this.shouldCapture,

            onPanResponderGrant: (evt: GestureResponderEvent) => {
                this.shouldTrigger = (evt.nativeEvent.locationX < 100) || !this.animationInProgess;

                this.state.pan.setOffset(this.animatedValueX);
                this.state.pan.setValue(0);
            },
            onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                if (!this.props.isOpen && !this.shouldTrigger) {
                    return
                }

                return Animated.event([null, {
                    dx: this.state.pan,
                }])(evt, gestureState)
            },
            onPanResponderTerminationRequest: () => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (!this.props.isOpen && !this.shouldTrigger) {
                    return;
                }

                if (gestureState.dx > this.triggerThreshold) {
                    this.props.shouldOpen();
                } else if (gestureState.dx < -this.triggerThreshold) {
                    this.props.shouldClose();
                } else {
                    this.state.pan.flattenOffset();
                    const distanceFromStart = this.animatedValueX;
                    const distanceFromEnd = this.sidebarWidth - this.animatedValueX;

                    if (distanceFromStart > distanceFromEnd) {
                        this.props.shouldOpen();
                    } else {
                        this.props.shouldClose();
                    }
                }
            },
            onPanResponderTerminate: () => {
                return true;
            },
            onShouldBlockNativeResponder: () => {
                return true;
            },
        });
    }


    open() {
        this.animationInProgess = true;
        Animated.timing(this.state.pan, {
            toValue: this.sidebarWidth
        }).start(() => this.animationInProgess = false);

    }

    close() {
        this.animationInProgess = true;
        Animated.timing(this.state.pan, {
            toValue: -this.sidebarWidth
        }).start(() => this.animationInProgess = false);
    }

    componentWillUnmount() {
        this.state.pan.removeAllListeners();
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.isOpen) {
            prevState.open();
        } else {
            prevState.close();
        }

        return prevState;
    }

    render(): React.ReactNode {
        const maxX = width - 50;
        const constrainedX = this.state.pan.interpolate({
            inputRange: [0, maxX, Infinity],
            outputRange: [0, maxX, maxX]
        });

        return <View {...this.panResponder.panHandlers} style={{flex: 1, backgroundColor: 'transparent'}}>
            <View style={{
                position: 'absolute',
            }}>
                {this.props.content}
            </View>

            <Animated.View
                style={{
                    width: width - 50,
                    left: -width + 50,
                    flex: 1,
                    transform: [{
                        translateX: constrainedX
                    }]
                }}>
                {this.props.sidebarContent}
            </Animated.View>
        </View>

    }
}