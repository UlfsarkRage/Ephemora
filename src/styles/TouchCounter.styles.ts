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
  touchIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
});
