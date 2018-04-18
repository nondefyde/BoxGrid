/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

type Props = {};
export default class App extends Component<Props> {
    state = {
        boxes: [],
        nextColor: {},
        currentColor: {},
        animatedValue: {}
    };
    colors = ['rgb(0,0,0)', 'rgb(0,0,255)', 'rgb(0,255,255)', 'rgb(0,128,0)', 'rgb(255,0,255)', 'rgb(255,0,0)', 'rgb(255,255,0)'];

    componentWillMount() {
        const [boxItems, animatedValue, nextItems, currentItems] = [[], {}, {}, {}];
        let index = 0;
        this.colors.forEach((outer, rowIndex) => {
            return this.colors.forEach((color, colIndex) => {
                nextItems[index] = color;
                currentItems[index] = color;
                animatedValue[index] = new Animated.Value(0);
                boxItems.push({color, rowIndex, colIndex});
                index++;
            });
        });
        this.setState({
            boxes: boxItems,
            animatedValue: animatedValue,
            nextColor: nextItems,
            currentColor: currentItems,
        });
    }

    animate = (index) => {
        Animated.timing(this.state.animatedValue[index], {
            toValue: 225,
            duration: 2000
        }).start(() => {
            const [currentColor, nextColor] = [this.state.currentColor, this.state.nextColor];
            currentColor[index] = nextColor[index];
            this.setState({
                currentColor: {...this.state.currentColor, ...currentColor},
            });
        });
    };

    handlePress = (index) => {
        let nextIndex = index + 1;
        if (nextIndex === 49) {
            nextIndex = 0;
        }
        const [currentColor, nextColor, animatedValue] = [this.state.currentColor, this.state.nextColor, this.state.animatedValue];
        nextColor[index] = currentColor[nextIndex];
        animatedValue[index].setValue(0);
        this.setState({
            nextColor: {...this.state.nextColor, ...nextColor},
            animatedValue: {...this.state.animatedValue, ...animatedValue},
        });
        this.animate(index);
    };

    renderSquare(box, index) {
        const [width, height] = [
            Math.floor(Dimensions.get('window').width / 7),
            Math.floor(Dimensions.get('window').height / 7)
        ];
        const interpolate = this.state.animatedValue[index].interpolate({
            inputRange: [0, 225],
            outputRange: [this.state.currentColor[index], this.state.nextColor[index]]
        });
        return <TouchableWithoutFeedback
            key={index}
            onPress={() => this.handlePress(index)}>
            <Animated.View
                style={{borderWidth: 1, borderColor: '#fff', width, height, backgroundColor: interpolate}}/>
        </TouchableWithoutFeedback>;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.boxes.map((box, index) => this.renderSquare(box, index))}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#F5FCFF',
    }
});
