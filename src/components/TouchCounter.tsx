import React, { useState } from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { styles } from '../styles/TouchCounter.styles';

interface DecrementButtonProps {
  onDecrement: () => void;
  isFlashing: boolean;
}

/**
 * Componente pequeño e interactivo que resta toques al contador
 * y cambia dinámicamente su posición en pantalla en cada pulsación.
 */
function MovingDecrementIcon({ onDecrement, isFlashing }: DecrementButtonProps) {
  const { width, height } = useWindowDimensions();

  // Posiciones animadas en el hilo nativo de Reanimated
  const posX = useSharedValue(width > 0 ? width - 80 : 250);
  const posY = useSharedValue(120);
  const scale = useSharedValue(1);

  // Calcula una nueva posición aleatoria respetando las áreas seguras de la pantalla
  const getNextPosition = () => {
    const buttonSize = 56;
    const paddingX = 24;
    const minX = paddingX;
    const maxX = Math.max(minX, width - buttonSize - paddingX);

    // Evita la barra de estado superior / header y la barra inferior de tabs
    const minY = 90;
    const maxY = Math.max(minY, height - buttonSize - 160);

    const nextX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const nextY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    return { nextX, nextY };
  };

  const handlePress = () => {
    if (isFlashing) return;

    // Vibración física de impacto medio (diferenciada de la suma)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Efecto de rebote elástico al pulsar
    scale.value = withSequence(
      withTiming(0.8, { duration: 80 }),
      withSpring(1, { damping: 10, stiffness: 180 })
    );

    // Trasladar fluidamente el icono a una nueva posición aleatoria
    const { nextX, nextY } = getNextPosition();
    posX.value = withSpring(nextX, { damping: 14, stiffness: 100 });
    posY.value = withSpring(nextY, { damping: 14, stiffness: 100 });

    // Ejecutar la resta en el contador
    onDecrement();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value },
      { translateY: posY.value },
      { scale: scale.value },
    ],
  }));

  if (isFlashing) return null;

  return (
    <Animated.View style={[styles.decrementButtonContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.decrementButton}
        accessibilityLabel="Restar un toque"
        accessibilityRole="button"
      >
        <Text style={styles.decrementButtonIcon}>−</Text>
        <Text style={styles.decrementButtonLabel}>-1</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

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

  const handleDecrement = () => {
    setCount((prev) => Math.max(0, prev - 1));
  };

  const animatedRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, isFlashing && styles.flashBackground]}>
      {/* Icono interactivo móvil: resta toques y se reubica aleatoriamente */}
      <MovingDecrementIcon onDecrement={handleDecrement} isFlashing={isFlashing} />

      <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.touchArea}>
        <Text style={styles.title}>Ephemora Clean Architecture</Text>

        <View style={styles.counterCircle}>
          <Text style={styles.counterText}>{count}</Text>
        </View>

        <Text style={styles.instructions}>
          {count === 10 ? '¡Llegaste al límite!' : 'Toca la pantalla para sumar (+1)'}
        </Text>
        <Text style={styles.hintText}>
          Toca el icono rojo flotante para restar (-1) y moverlo
        </Text>

        {touchPos && !isFlashing && (
          <Animated.View
            style={[
              styles.touchIndicator,
              animatedRingStyle,
              { top: touchPos.y - 25, left: touchPos.x - 25 },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
