import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
// import { Accelerometer } from 'react-native-sensors';
import { ScreenOrientation, Accelerometer } from 'expo';
import Svg, {
  Circle,
  Ellipse,
  G,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask
} from 'react-native-svg';
// import Matter from 'matter-js'

/* Use this if you are using Expo
import { Svg } from 'expo';
const { Circle, Rect } = Svg;
*/
const { width, height } = Dimensions.get('window');

export default class AccelerometerSensor extends React.Component {
  constructor() {
    super();
    Accelerometer.setUpdateInterval(10);
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
  }
  state = {
    accelerometerData: {}
  };

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    let { x, y, z } = this.state.accelerometerData;
    // console.log(this.state);
    return (
      <React.Fragment>
        <View style={styles.sensor}>
          <Text>Accelerometer:</Text>
          <Text>
            x: {round(x)} y: {round(y)} z: {round(z)}
          </Text>
        </View>
        <Labyrinth2 x={round(x)} y={round(y)} z={round(z)} />
      </React.Fragment>
    );
  }
}
const bounds = {
  maxX: width,
  maxY: height
};
var c = {
  radius: 20,
  acc: {
    x: 0,
    y: 0
  },
  vel: {
    x: 0,
    y: 0
  },
  pos: {
    x: width / 2,
    y: height / 2
  }
};
const Labyrinth2 = props => {
  const delay = 0.4;
  c.acc.x = props.x * delay;
  c.acc.y = props.y * -delay;
  c.vel.x += c.acc.x;
  c.vel.y += c.acc.y;

  const drag = 0.01;
  c.vel.x *= 1 - drag;
  c.vel.y *= 1 - drag;

  const bounce = 0.6;
  if (c.pos.x - c.radius <= 0) {
    c.pos.x = c.radius;
    c.vel.x *= -1 * bounce;
  }
  if (c.pos.x + c.radius >= bounds.maxX) {
    c.pos.x = bounds.maxX - c.radius;
    c.vel.x *= -1 * bounce;
  }
  if (c.pos.y - c.radius <= 0) {
    c.pos.y = c.radius;
    c.vel.y *= -1 * bounce;
  }
  if (c.pos.y + c.radius >= bounds.maxY) {
    c.pos.y = bounds.maxY - c.radius;
    c.vel.y *= -1 * bounce;
  }

  c.pos.x += c.vel.x;
  c.pos.y += c.vel.y;

  let circle = <Circle cx={c.pos.x} cy={c.pos.y} r={c.radius} fill="white" />;
  let str = '0 0 ' + bounds.maxX + ' ' + bounds.maxY;
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { alignItems: 'top-right', justifyContent: 'center' }
      ]}
    >
      <Svg height={height} width={width} viewBox={str}>
        <Rect x="0" y="0" width={width} height={height} fill="black" />
        {circle}
      </Svg>
    </View>
  );
};

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc'
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10
  },
  text: {
    color: 'white',
    // fontWeight: '200',
    zIndex: 100
  }
});
