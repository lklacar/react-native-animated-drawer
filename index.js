import * as React from "react";
import { Animated, Dimensions, PanResponder, View } from "react-native";
const { width } = Dimensions.get('window');
export default class AnimatedDrawer extends React.Component {
    get sidebarWidth() {
        return this.props.sidebarWidth ? this.props.sidebarWidth : width - 50;
    }
    get triggerThreshold() {
        return this.props.triggerThreshold ? this.props.triggerThreshold : 50;
    }
    get triggerArea() {
        return this.props.triggerArea ? this.props.triggerArea : 100;
    }
    get mode() {
        return this.props.mode ? this.props.mode : "overlay";
    }
    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.Value(0),
            open: this.open.bind(this),
            close: this.close.bind(this)
        };
        this.animatedValueX = 0;
        this.state.pan.addListener(({ value }) => {
            return this.animatedValueX = Math.max(0, Math.min(value, this.sidebarWidth));
        });
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt) => {
                if (this.props.isOpen) {
                    return true;
                }
                else {
                    return evt.nativeEvent.locationX < this.triggerArea;
                }
            },
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponderCapture: () => false,
            onPanResponderTerminationRequest: () => false,
            onPanResponderTerminate: () => false,
            onShouldBlockNativeResponder: () => false,
            onPanResponderGrant: () => {
                this.state.pan.setOffset(this.animatedValueX);
                this.state.pan.setValue(0);
            },
            onPanResponderMove: (evt, gestureState) => {
                return Animated.event([null, {
                        dx: this.state.pan,
                    }])(evt, gestureState);
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > this.triggerThreshold) {
                    this.props.shouldOpen();
                }
                else if (gestureState.dx < -this.triggerThreshold) {
                    this.props.shouldClose();
                }
                else {
                    this.state.pan.flattenOffset();
                    const distanceFromStart = this.animatedValueX;
                    const distanceFromEnd = this.sidebarWidth - this.animatedValueX;
                    if (distanceFromStart > distanceFromEnd) {
                        this.props.shouldOpen();
                    }
                    else {
                        this.props.shouldClose();
                    }
                }
            },
        });
    }
    open() {
        Animated.timing(this.state.pan, {
            toValue: this.sidebarWidth
        }).start();
    }
    close() {
        Animated.timing(this.state.pan, {
            toValue: -this.sidebarWidth
        }).start();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen) {
            this.open();
        }
        else {
            this.close();
        }
    }
    componentWillUnmount() {
        this.state.pan.removeAllListeners();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isOpen) {
            prevState.open();
        }
        else {
            prevState.close();
        }
        return prevState;
    }
    render() {
        const maxX = this.sidebarWidth;
        const constrainedX = this.state.pan.interpolate({
            inputRange: [0, 0, maxX, Infinity],
            outputRange: [0, 0, maxX, maxX]
        });
        return React.createElement(View, Object.assign({}, this.panResponder.panHandlers, { style: { flex: 1, backgroundColor: 'transparent' } }),
            React.createElement(Animated.View, { style: [{
                        position: 'absolute',
                    }, this.mode === "slide" ? {
                        transform: [{
                                translateX: constrainedX
                            }]
                    } : {}] }, this.props.content),
            React.createElement(Animated.View, { style: {
                    width: this.sidebarWidth,
                    left: -this.sidebarWidth,
                    flex: 1,
                    transform: [{
                            translateX: constrainedX
                        }]
                } }, this.props.sidebarContent));
    }
}
