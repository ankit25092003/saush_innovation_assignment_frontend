import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/redux/store';
import { loadUser } from './src/redux/slices/authSlice';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((s) => s.theme.mode);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
