import React from "react";
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StyleSheet
} from "react-native";

export default class App extends React.Component {
    state = {
        length: 0,
        breaks: 0,
        fight: true,
        remaining: 0,
        running: false
    };

    ring = () => {
        if (this.bell) {
            const that = this;
            this.bell.stop(() => {
                that.bell.play((success) => {
                    if (!success) {
                        console.log('playback failed due to audio decoding errors');
                    } 
                });
            });
        }
    }

    toggle = () => {
        if ((!this.state.length || 0 == this.state.length)
         && (!this.state.breaks || 0 == this.state.breaks)) return;
        if (this.state.running) clearInterval(this.interval);
        else {
            const secsPerMin = 60;
            this.setState({ remaining: this.state.length * secsPerMin });
            this.ring();
            if (this.interval) clearInterval(this.interval);
            const that = this;
            this.interval = setInterval(() => {
                that.setState({ remaining: that.state.remaining - 1 });
                if (-1 === that.state.remaining) {
                    that.ring();
                    that.setState({ fight: !that.state.fight });
                    that.setState({ remaining: that.state.fight ? that.state.length * secsPerMin : that.state.breaks * secsPerMin });
                }
            }, 1000);
        }
        this.setState({running: !this.state.running});
    };

    getSecs = () => {
        let secs = this.state.remaining % 60;
        if (secs < 10) return '0' + secs
        return secs;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Boxing Clock</Text>

                <TextInput
                    keyboardType="numeric"
                    placeholder="Round Length"
                    onChangeText={length => {
                        this.setState({length: length});
                    }}
                    style={styles.input}
                    editable={!this.state.running}
                />

                <TextInput
                    keyboardType="numeric"
                    placeholder="Break Length"
                    onChangeText={breaks => {
                        this.setState({breaks: breaks});
                    }}
                    style={styles.input}
                    editable={!this.state.running}
                />

                <TouchableOpacity
                    onPress={this.toggle}
                    style={styles.button}
                >
                    <Text>{this.state.running ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>

                <Text style={styles.clock}>{Math.floor(this.state.remaining / 60)}:{this.getSecs()}</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },   
    title: {
      fontSize: 36,
      color: 'red',
    },
    input: {
        textAlign: 'center',
    },
    clock: {
        fontSize: 28
    },
});
