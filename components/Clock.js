import React from "react";
import {
    Text,
    TextInput,
    View,
    TouchableOpacity
} from "react-native";

export default class App extends React.Component {
    state = {
        a: 0,
        b: 0,
        length: 0,
        breaks: 0,
        fight: true,
        remaining: 0
    };

    start = () => {
        const secsPerMin = 60;
        this.setState({length: this.state.a});
        this.setState({breaks: this.state.b});
        this.setState({remaining: this.state.length * secsPerMin});
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.setState({remaining: this.state.remaining - 1});
            if (-1 === this.state.remaining) {
                this.bell.play((success) => {
                    if (!success) {
                        console.log('playback failed due to audio decoding errors');
                    } 
                })
                this.setState({fight: !this.state.fight});
                this.setState({remaining: this.state.fight ? this.state.length * secsPerMin : this.state.breaks * secsPerMin});
            }
        }, 1000);
    };

    render() {
        return (
            <View>
                <TextInput
                    keyboardType="numeric"
                    placeholder="Round Length"
                    onChangeText={a => {
                        this.setState({a: a});
                    }}
                />

                <TextInput
                    keyboardType="numeric"
                    placeholder="Break Length"
                    onChangeText={b => {
                        this.setState({b: b});
                    }}
                />

                <TouchableOpacity
                    onPress={this.start}
                >
                    <Text>Start</Text>
                </TouchableOpacity>

                <Text>{Math.floor(this.state.remaining / 60)}:{this.state.remaining % 60}</Text>
            </View>
        );
    }

    componentDidMount() {
        const Sound = require('react-native-sound');
        this.bell = new Sound('bell.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            }
        })
    }
}
