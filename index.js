import * as React from "react";
import { Animated, Dimensions, PanResponder, View } from "react-native";
const { width } = Dimensions.get('window');
export default class AnimatedDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.shouldCapture = true;
        this.threshold = 50;
        this.limit = width - 50;
        this.shouldTrigger = false;
        this.state = {
            pan: new Animated.Value(0),
            open: this.open.bind(this),
            close: this.close.bind(this)
        };
        this.animatedValueX = 0;
        this.state.pan.addListener(({ value }) => {
            return this.animatedValueX = Math.max(0, Math.min(value, this.limit));
        });
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => this.shouldCapture,
            onStartShouldSetPanResponderCapture: () => this.shouldCapture,
            onMoveShouldSetPanResponder: () => this.shouldCapture,
            onMoveShouldSetPanResponderCapture: () => this.shouldCapture,
            onPanResponderGrant: (evt) => {
                if (evt.nativeEvent.locationX < 100) {
                    this.shouldTrigger = true;
                }
                else {
                    this.shouldTrigger = false;
                }
                this.state.pan.setOffset(this.animatedValueX);
                this.state.pan.setValue(0);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!this.props.isOpen && !this.shouldTrigger) {
                    return;
                }
                return Animated.event([null, {
                        dx: this.state.pan,
                    }])(evt, gestureState);
            },
            onPanResponderTerminationRequest: () => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (!this.props.isOpen && !this.shouldTrigger) {
                    return;
                }
                if (gestureState.dx > this.threshold) {
                    this.props.shouldOpen();
                }
                else if (gestureState.dx < -this.threshold) {
                    this.props.shouldClose();
                }
                else {
                    this.state.pan.flattenOffset();
                    const distanceFromStart = this.animatedValueX;
                    const distanceFromEnd = this.limit - this.animatedValueX;
                    if (distanceFromStart > distanceFromEnd) {
                        this.props.shouldOpen();
                    }
                    else {
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
        Animated.timing(this.state.pan, {
            toValue: this.limit
        }).start();
    }
    close() {
        Animated.timing(this.state.pan, {
            toValue: -this.limit
        }).start();
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
        const maxX = width - 50;
        const constrainedX = this.state.pan.interpolate({
            inputRange: [0, maxX, Infinity],
            outputRange: [0, maxX, maxX]
        });
        return React.createElement(View, Object.assign({}, this.panResponder.panHandlers, { style: { flex: 1, backgroundColor: 'transparent' } }),
            React.createElement(View, { style: { position: 'absolute' } }, this.props.content),
            React.createElement(Animated.View, { style: {
                    width: width - 50,
                    left: -width + 50,
                    flex: 1,
                    transform: [{
                            translateX: constrainedX
                        }]
                } }, this.props.sidebarContent));
    }
}
