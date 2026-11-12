import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PainelScreen } from './src/screens/PainelScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <PainelScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}