import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AlertasScreen } from './src/screens/AlertasScreen';
import { AtuadoresScreen } from './src/screens/AtuadoresScreen';
import { PainelScreen } from './src/screens/PainelScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

const ICONES = {
  Painel: 'speedometer',
  Atuadores: 'options',
  Alertas: 'warning',
} as const;

export default function App() {
  return (
    // No navegador, limita a largura pra parecer um celular
    <View style={{ flex: 1, backgroundColor: '#d9e8ef' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerStyle: { backgroundColor: colors.primaryDark },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: '800' },
              tabBarActiveTintColor: colors.primary,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={ICONES[route.name as keyof typeof ICONES]} size={size} color={color} />
              ),
            })}
          >
            <Tab.Screen name="Painel" component={PainelScreen} options={{ title: 'Vaporeon · Painel' }} />
            <Tab.Screen name="Atuadores" component={AtuadoresScreen} />
            <Tab.Screen name="Alertas" component={AlertasScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}