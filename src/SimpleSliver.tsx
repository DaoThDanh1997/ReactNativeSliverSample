import React, {useState, useRef, useEffect} from 'react';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {
  View,
  Dimensions,
  StatusBar,
  StyleSheet,
  ScrollView,
} from 'react-native';

const DW = Dimensions.get('screen').width;
const DH = Dimensions.get('screen').height;

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export default (props: any) => {
  const scrollView = useRef(null);
  const HDIFF = props.maxHeight - props.minHeight;

  const [headerHeight, setHeaderHeight] = useState(props.maxHeight);

  const [tempRelativeCurrY, setTempRelativeCurrY] = useState(0);

  const [additionalY, setAdditionalY] = useState(0);

  const [lastRelY, setLastRelY] = useState(0);

  const [maximumScroll, setMaximumScroll] = useState(-1);

  // initial boundary for relative scroll Y
  const _setInitialMaximumScroll = (contentHeight: any) => {
    if (maximumScroll == -1) {
      const scrollDiff = contentHeight - (DH - props.maxHeight);
      // set initial maximum available scroll position
      setMaximumScroll(Math.max(scrollDiff, HDIFF));
    }
  };

  const scrollScrViewToYPos = (y: number | string) => {
    if (y === 'end') {
      scrollView.current.scrollToEnd({
        animated: false,
      });
    } else if (typeof y === 'number') {
      scrollView.current.scrollTo({
        x: 0,
        y: y,
        animated: false,
      });
    }
  };

  const _onPanScroll = ({translationY}: any) => {
    const currY = lastRelY - translationY;
    const relCurrY = currY - additionalY;
    // if the relative curr Y is in [0, max]
    if (relCurrY >= 0) {
      setHeaderHeight(props.maxHeight - clamp(relCurrY, 0, HDIFF));
      if (relCurrY < maximumScroll) {
        scrollScrViewToYPos(Math.max(relCurrY - HDIFF, 0));
      } else {
        scrollScrViewToYPos('end');
        setAdditionalY(Math.max(currY - maximumScroll, additionalY));
      }
    }
    // scroll down past the initial
    else {
      setHeaderHeight(props.maxHeight);
      scrollScrViewToYPos(0);
      setAdditionalY(additionalY + relCurrY);
    }
    setTempRelativeCurrY(clamp(relCurrY, 0, maximumScroll));
  };

  // update relative scroll Y position and reset the temporary and additional
  const _onHandleStateChange = (event: any) => {
    if (event.state == State.END) {
      setLastRelY(tempRelativeCurrY);
      setTempRelativeCurrY(0);
      setAdditionalY(0);
    }
  };

  const bigViewOpacity = (headerHeight - props.minHeight) / HDIFF;

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <View style={{height: headerHeight}}>
        <View
          style={[
            styles.smallView,
            {
              backgroundColor: props.minViewBackgroundColor || 'transparent',
              opacity: 1 - bigViewOpacity,
            },
          ]}
          pointerEvents={headerHeight == props.minHeight ? 'auto' : 'none'}>
          {props.minHeightView}
        </View>
        <View
          style={[
            styles.bigView,
            {
              backgroundColor: props.maxViewBackgroundColor || 'transparent',
              opacity: bigViewOpacity,
            },
          ]}
          pointerEvents={headerHeight == props.maxHeight ? 'auto' : 'none'}>
          {props.maxHeightView}
        </View>
      </View>

      <PanGestureHandler
        onGestureEvent={({nativeEvent}) => {
          _onPanScroll(nativeEvent);
        }}
        onHandlerStateChange={({nativeEvent}) =>
          _onHandleStateChange(nativeEvent)
        }>
        <View style={styles.panView}>
          <ScrollView
            scrollEnabled={false}
            ref={scrollView}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            <View
              onLayout={({nativeEvent}) =>
                _setInitialMaximumScroll(nativeEvent.layout.height)
              }>
              {/* <Text style={{fontSize: 30}}>{longText}</Text> */}
              {props.scrollViewContent}
            </View>
          </ScrollView>
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  smallView: {
    height: '100%',
    width: DW,
  },
  smallViewText: {
    fontSize: 16,
    color: 'white',
  },
  bigView: {
    width: DW,
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bigViewText: {
    fontSize: 20,
    color: 'white',
  },
  panView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
