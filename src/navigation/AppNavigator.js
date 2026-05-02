import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPLoginScreen from '../screens/auth/OTPLoginScreen';
import ProjectsScreen from '../screens/projects/ProjectsScreen';
import ProjectDetailScreen from '../screens/projects/ProjectDetailScreen';
import LoadingOverlay from '../components/LoadingOverlay';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="OTPLogin" component={OTPLoginScreen} />
  </Stack.Navigator>
);

const AppStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Projects" component={ProjectsScreen} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, initialLoading } = useSelector((s) => s.auth);
  const { colors } = useTheme();

  if (initialLoading) {
    return <LoadingOverlay message="Loading..." />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.secondary,
        },
      }}
    >
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
