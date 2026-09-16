import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import LoginScreen from '../../src/screens/LoginScreen';
import DashboardScreen from '../../src/screens/DashboardScreen';

function MainAppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return isAuthenticated ? <DashboardScreen /> : <LoginScreen />;
}

export default function Index() {
  return (
    <AuthProvider>
      <View style={styles.screenContainer}>
        <MainAppNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090D16',
  },
});
