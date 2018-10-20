import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, PanResponder } from 'react-native';
import _ from 'lodash';

import { sizes } from '../constants/parameters';

const ModePropType = PropTypes.oneOf(['decay', 'snap', 'spring-origin']);
const OvershootPropType = PropTypes.oneOf(['spring', 'clamp']);
const AnimatedPropType = PropTypes.any;

export default class PanController extends PureComponent {
  static handleResponderGrant(anim, mode, spacing) {
    switch (mode) {
      case 'spring-origin':
        anim.setValue(0);
        break;
      case 'snap':
      case 'decay':
        anim.setOffset(PanController.closestCenter(anim._value, spacing));
        anim.setValue(0);
        break;
      default:
        break;
    }
  }

  static closestCenter(x, spacing) {
    const plus = (x % spacing) < spacing / 2 ? 0 : spacing;
    return Math.floor(x / spacing) * spacing + plus;
  }

  _responder = null;

  _listener = null;

  _direction = null;

  static propTypes = {
    // Component Config
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    onComponentDidUpdate: PropTypes.func,
    lockDirection: PropTypes.bool,
    horizontal: PropTypes.bool,
    vertical: PropTypes.bool,
    overshootX: OvershootPropType,
    overshootY: OvershootPropType,
    yBounds: PropTypes.arrayOf(PropTypes.number),
    xMode: ModePropType,
    yMode: ModePropType,
    snapSpacingX: PropTypes.number, // TODO: also allow an array of values?
    snapSpacingY: PropTypes.number,
    renderItem: PropTypes.func,

    // Animated Values
    panX: AnimatedPropType,
    panY: AnimatedPropType,

    // Animation Config
    overshootSpringConfig: PropTypes.any,
    momentumDecayConfig: PropTypes.any,
    springOriginConfig: PropTypes.any,
    directionLockDistance: PropTypes.number,
    overshootReductionFactor: PropTypes.number,

    // Events
    onOvershoot: PropTypes.func,
    onReleaseX: PropTypes.func,
    onReleaseY: PropTypes.func,
    onRelease: PropTypes.func,
    onDirectionChange: PropTypes.func,
    onIndexChange: PropTypes.func,
    onLevelChange: PropTypes.func,
    onPanResponderGrant: PropTypes.func,
    onPanResponderMove: PropTypes.func,
    onStartShouldSetPanResponder: PropTypes.func,
    onMoveShouldSetPanResponder: PropTypes.func,
  }

  static defaultProps = {
    horizontal: false,
    vertical: false,
    lockDirection: true,
    overshootX: 'clamp',
    overshootY: 'clamp',
    panX: new Animated.Value(0),
    panY: new Animated.Value(0),
    yBounds: [-Infinity, null, Infinity],
    yMode: 'decay',
    xMode: 'snap',
    snapSpacingX: sizes.width,
    overshootSpringConfig: { friction: 9, tension: 40 },
    momentumDecayConfig: { deceleration: 0.993 },
    springOriginConfig: { friction: 7, tension: 40 },
    overshootReductionFactor: 3,
    directionLockDistance: 10,
    onPanResponderGrant: () => true,
    onPanResponderMove: () => true,
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (__, { dx }) => (Math.abs(dx) > 5),
    onIndexChange: () => true,
    onLevelChange: () => true,
    onOvershoot: () => true,
    onDirectionChange: () => true,
  }

  constructor(props) {
    super(props);

    this.deceleration = 0.997;
    if (props.momentumDecayConfig && this.props.momentumDecayConfig.deceleration) {
      this.deceleration = this.props.momentumDecayConfig.deceleration;
    }
  }

  componentWillMount() {
    this._responder = PanResponder.create({
      onStartShouldSetPanResponder: this.props.onStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.props.onMoveShouldSetPanResponder,
      onPanResponderGrant: (...args) => {
        if (this.props.onPanResponderGrant) {
          this.props.onPanResponderGrant(...args);
        }
        const {
          panX, panY, horizontal, vertical, xMode, yMode, snapSpacingX,
        } = this.props;

        if (horizontal) {
          PanController.handleResponderGrant(panX, xMode, snapSpacingX);
        }
        if (vertical) {
          PanController.handleResponderGrant(panY, yMode, snapSpacingX);
        }

        this._direction = horizontal && !vertical ? 'x' : (vertical && !horizontal ? 'y' : null);
      },

      onPanResponderMove: (__, {
        dx, dy, x0, y0,
      }) => {
        const {
          panX,
          panY,
          yBounds,
          overshootX,
          overshootY,
          horizontal,
          vertical,
          lockDirection,
          directionLockDistance,
        } = this.props;

        if (!this._direction) {
          const dx2 = dx * dx;
          const dy2 = dy * dy;
          if (dx2 + dy2 > directionLockDistance) {
            this._direction = dx2 > dy2 ? 'x' : 'y';
            if (this.props.onDirectionChange) {
              this.props.onDirectionChange(this._direction, {
                dx, dy, x0, y0,
              });
            }
          }
        }

        const dir = this._direction;

        if (this.props.onPanResponderMove) {
          this.props.onPanResponderMove(_, {
            dx, dy, x0, y0,
          });
        }

        if (horizontal && (!lockDirection || dir === 'x')) {
          const xMin = this.childrenWidth();
          const xMax = 0;

          this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
        }

        if (vertical && (!lockDirection || dir === 'y')) {
          const [yMin, yMax] = yBounds;

          this.handleResponderMove(panY, dy, yMin, yMax, overshootY);
        }
      },

      onPanResponderRelease: (__, {
        vx, vy, dx, dy,
      }) => {
        const {
          panX,
          panY,
          yBounds,
          overshootX,
          overshootY,
          horizontal,
          vertical,
          lockDirection,
          xMode,
          yMode,
          snapSpacingX,
          snapSpacingY,
        } = this.props;

        let cancel = false;

        const dir = this._direction;

        if (this.props.onRelease) {
          cancel = !this.props.onRelease({
            vx, vy, dx, dy,
          });
        }

        if (!cancel && horizontal && (!lockDirection || dir === 'x')) {
          const xMin = this.childrenWidth();
          const xMax = 0;
          if (this.props.onReleaseX) {
            cancel = !this.props.onReleaseX({
              vx, vy, dx, dy,
            });
          }
          if (!cancel) {
            this.handleResponderRelease(panX, xMin, xMax, vx, overshootX, xMode, snapSpacingX);
          }
        }

        if (!cancel && vertical && (!lockDirection || dir === 'y')) {
          const [yMin, yMax] = yBounds;
          if (this.props.onReleaseY) {
            cancel = !this.props.onReleaseY({
              vx, vy, dx, dy,
            });
          }
          if (!cancel) {
            this.handleResponderRelease(panY, yMin, yMax, vy, overshootY, yMode, snapSpacingY);
          }
        }

        this._direction = horizontal && !vertical ? 'x' : (vertical && !horizontal ? 'y' : null);
      },
    });
  }

  componentDidUpdate() {
    this.props.onComponentDidUpdate();
  }

  _onIndexChange = (x) => {
    const { snapSpacingX } = this.props;

    this.props.onIndexChange(Math.abs(Math.round(x / snapSpacingX)));
  }

  childrenWidth = () => {
    const count = Children.toArray(this.props.children)
      .filter(child => React.isValidElement(child)).length;
    return -this.props.snapSpacingX * (count - 1);
  };


  handleResponderMove(anim, delta, min, max, overshoot) {
    let val = anim._offset + delta;

    if (val > max) {
      switch (overshoot) {
        case 'spring':
          val = max + (val - max) / this.props.overshootReductionFactor;
          break;
        case 'clamp':
          val = max;
          break;
        default:
          break;
      }
    }
    if (val < min) {
      switch (overshoot) {
        case 'spring':
          val = min - (min - val) / this.props.overshootReductionFactor;
          break;
        case 'clamp':
          val = min;
          break;
        default:
          break;
      }
    }

    val -= anim._offset;
    anim.setValue(val);
  }

  handleResponderRelease(anim, min, max, velocity, overshoot, mode, snapSpacing) {
    anim.flattenOffset();

    if (anim._value < min) {
      if (this.props.onOvershoot) {
        this.props.onOvershoot(); // TODO: what args should we pass to this
      }
      switch (overshoot) {
        case 'spring':
          Animated.spring(anim, {
            ...this.props.overshootSpringConfig,
            toValue: min,
            velocity,
            useNativeDriver: true,
          }).start();
          break;
        case 'clamp':
          anim.setValue(min);
          break;
        default:
          break;
      }
    } else if (anim._value > max) {
      if (this.props.onOvershoot) {
        this.props.onOvershoot(); // TODO: what args should we pass to this
      }
      switch (overshoot) {
        case 'spring':
          Animated.spring(anim, {
            ...this.props.overshootSpringConfig,
            toValue: max,
            velocity,
            useNativeDriver: true,
          }).start();
          break;
        case 'clamp':
          anim.setValue(min);
          break;
        default:
          break;
      }
    } else {
      switch (mode) {
        case 'snap':
          this.handleSnappedScroll(anim, min, max, velocity, snapSpacing, overshoot);
          break;

        case 'decay':
          this.handleMomentumScroll(anim, min, max, velocity, overshoot);
          break;

        case 'spring-origin':
          Animated.spring(anim, {
            ...this.props.springOriginConfig,
            toValue: 0,
            velocity,
            useNativeDriver: true,
          }).start();
          break;
        default:
          break;
      }
    }
  }

  handleMomentumScroll(anim, min, max, velocity, overshoot) {
    Animated.decay(anim, {
      ...this.props.momentumDecayConfig,
      useNativeDriver: true,
      velocity,
    }).start(() => {
      anim.removeListener(this._listener);
    });

    this._listener = anim.addListener(({ value }) => {
      if (value < min) {
        anim.removeListener(this._listener);
        if (this.props.onOvershoot) {
          this.props.onOvershoot(); // TODO: what args should we pass to this
        }
        switch (overshoot) {
          case 'spring':
            Animated.spring(anim, {
              ...this.props.overshootSpringConfig,
              toValue: min,
              velocity,
              useNativeDriver: true,
            }).start();
            break;
          case 'clamp':
            anim.setValue(min);
            break;
          default:
            break;
        }
      } else if (value > max) {
        anim.removeListener(this._listener);
        if (this.props.onOvershoot) {
          this.props.onOvershoot(); // TODO: what args should we pass to this
        }
        switch (overshoot) {
          case 'spring':
            Animated.spring(anim, {
              ...this.props.overshootSpringConfig,
              toValue: max,
              velocity,
              useNativeDriver: true,
            }).start();
            break;
          case 'clamp':
            anim.setValue(min);
            break;
          default:
            break;
        }
      }
    });
  }

  handleSnappedScroll(anim, min, max, velocity, spacing) {
    let endX = this.momentumCenter(anim._value, velocity, spacing);
    endX = Math.max(endX, min);
    endX = Math.min(endX, max);
    const bounds = [endX - spacing / 2, endX + spacing / 2];
    const endV = this.velocityAtBounds(anim._value, velocity, bounds);

    Animated.timing(anim, {
      duration: 200,
      toValue: endX,
      velocity: endV,
      useNativeDriver: true,
    }).start(() => {
      anim.setValue(endX);
      this._onIndexChange(endX);
    });
  }

  momentumCenter(x0, vx, spacing) {
    let t = 0;
    let x1 = x0;
    let x = x1;

    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      t += 16;
      x = x0 + (vx / (1 - this.deceleration)) * (1 - Math.exp(-(1 - this.deceleration) * t));
      if (Math.abs(x - x1) < 0.1) {
        x1 = x;
        break;
      }
      x1 = x;
    }
    return PanController.closestCenter(x1, spacing);
  }

  velocityAtBounds(x0, vx, bounds) {
    let t = 0;
    let x1 = x0;
    let x = x1;
    let vf;

    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      t += 16;
      x = x0 + (vx / (1 - this.deceleration)) * (1 - Math.exp(-(1 - this.deceleration) * t));
      vf = (x - x1) / 16;
      if (x > bounds[0] && x < bounds[1]) {
        break;
      }
      if (Math.abs(vf) < 0.1) {
        break;
      }
      x1 = x;
    }
    return vf;
  }

  toIndex(i, animated = true, callback = false) {
    const index = i < 0 ? 0 : i;

    const { panX } = this.props;
    const toValue = -PanController.closestCenter(
      index * this.props.snapSpacingX,
      this.props.snapSpacingX,
    );

    if (callback) {
      this.props.onIndexChange(index);
    }

    if (!animated) {
      panX.setValue(toValue);
    } else {
      Animated.timing(panX, {
        duration: 200,
        useNativeDriver: true,
        toValue,
      }).start(() => {
        panX.setValue(toValue);
      });
    }
  }

  render() {
    return (
      <View
        {...this.props}
        {...this._responder.panHandlers}
      >
        <Animated.View
          style={[
            {
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }, {
              transform: [
                { translateX: this.props.panX },
                { translateY: this.props.panY },
              ],
            },
          ]}
        >
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}
