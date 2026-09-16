import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  flashBackground: {
    backgroundColor: '#ffffff',
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  counterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructions: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 30,
  },
  hintText: {
    fontSize: 12,
    color: '#636366',
    marginTop: 10,
    textAlign: 'center',
  },
  touchIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  // Estilos para el icono interactivo móvil que resta toques
  decrementButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
    elevation: 10,
  },
  decrementButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  decrementButtonIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  decrementButtonLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: -2,
    letterSpacing: 0.5,
  },
});
