import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import { HeaderTitle } from './src/components/HeaderTitle';
import { ThemeToggle } from './src/components/ThemeToggle';
import { useLayout } from './src/hooks/useLayout';
import { AlertasScreen } from './src/screens/AlertasScreen';
import { AtuadoresScreen } from './src/screens/AtuadoresScreen';
import { PainelScreen } from './src/screens/PainelScreen';
import { ThemeProvider, useTheme } from './src/ThemeContext';

const Tab = createBottomTabNavigator();

const ICONES = {
  Painel: 'speedometer',
  Atuadores: 'options',
  Alertas: 'warning',
} as const;

function Navegacao() {
  const { colors, escuro } = useTheme();
  const { largo } = useLayout();
  const base = escuro ? DarkTheme : DefaultTheme;
  const tema = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={tema}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: '#fff',
          headerTitleAlign: 'left',
          headerTitle: () => <HeaderTitle tela={route.name} />,
          headerRight: () => <ThemeToggle />,
          tabBarPosition: largo ? 'left' : 'bottom',
          tabBarVariant: largo ? 'material' : 'uikit',
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarLabelStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
          tabBarStyle: largo ? { backgroundColor: colors.card } : { backgroundColor: colors.card, height: 64, paddingBottom: 8, paddingTop: 6 },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={ICONES[route.name as keyof typeof ICONES]} size={size} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Painel" component={PainelScreen} />
        <Tab.Screen name="Atuadores" component={AtuadoresScreen} />
        <Tab.Screen name="Alertas" component={AlertasScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontesProntas, erroFontes] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    LibreBaskerville_700Bold,
  });

  // Espera as fontes carregarem (se falharem, segue com a fonte do sistema)
  if (!fontesProntas && !erroFontes) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf6fb' }}>
        <ActivityIndicator size="large" color="#1b8fc4" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Navegacao />
    </ThemeProvider>
  );
}