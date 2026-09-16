import React, { useState } from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { styles } from '../styles/TouchCounter.styles';

export default function TouchCounter() {
  const [count, setCount] = useState<number>(0);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handlePress = (event: GestureResponderEvent) => {
    if (isFlashing) return;

    // Vibración ligera física al pulsar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { locationX, locationY } = event.nativeEvent;
    setTouchPos({ x: locationX, y: locationY });

    // Animación de onda expansiva nativa
    scale.value = 0;
    opacity.value = 1;
    scale.value = withTiming(2.5, { duration: 350 });
    opacity.value = withTiming(0, { duration: 350 });

    const nextCount = count + 1;

    if (nextCount >= 10) {
      setCount(10);
      setIsFlashing(true);
      
      // Vibración de alerta en tu Redmi al llegar a 10
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      
      setTimeout(() => {
        setCount(0);
        setTouchPos(null);
        setIsFlashing(false);
      }, 400);
    } else {
      setCount(nextCount);
    }
  };

  const animatedRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, isFlashing && styles.flashBackground]}>
      <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.touchArea}>
        
        <Text style={styles.title}>Ephemora Clean Architecture</Text>
        
        <View style={styles.counterCircle}>
          <Text style={styles.counterText}>{count}</Text>
        </View>

        <Text style={styles.instructions}>
          {count === 10 ? '¡Llegaste al límite!' : 'Toca la pantalla para vibrar y animar'}
        </Text>

        {touchPos && !isFlashing && (
          <Animated.View 
            style={[
              styles.touchIndicator, 
              animatedRingStyle, 
              { top: touchPos.y - 25, left: touchPos.x - 25 }
            ]} 
          />
        )}
        
      </TouchableOpacity>
    </View>
  );
}
