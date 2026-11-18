import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import { Cabecalho } from './src/components/Cabecalho';
import { EstacaoProvider, useEstacao } from './src/EstacaoContext';
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
  const { alertasAbertos } = useEstacao();
  const pendentes = alertasAbertos?.length ?? 0;

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
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Cabecalho />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarPosition: largo ? 'left' : 'bottom',
            tabBarVariant: largo ? 'material' : 'uikit',
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.muted,
            tabBarLabelStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
            tabBarStyle: largo
              ? { backgroundColor: colors.card, borderColor: colors.border, width: 200, minWidth: 200, maxWidth: 200 }
              : { backgroundColor: colors.card, borderTopColor: colors.border, height: 68, paddingBottom: 8, paddingTop: 6 },
            tabBarBadgeStyle: { backgroundColor: colors.danger, color: '#ffffff', fontFamily: 'Poppins_700Bold', fontSize: 11 },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={ICONES[route.name as keyof typeof ICONES]} size={size} color={color} />
            ),
          })}
        >
          <Tab.Screen name="Painel" component={PainelScreen} />
          <Tab.Screen name="Atuadores" component={AtuadoresScreen} />
          <Tab.Screen
            name="Alertas"
            component={AlertasScreen}
            options={{
              tabBarBadge: pendentes > 0 ? pendentes : undefined,
              tabBarAccessibilityLabel: pendentes > 0 ? `Alertas, ${pendentes} pendentes` : 'Alertas',
            }}
          />
        </Tab.Navigator>
      </View>
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#081b33' }}>
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <EstacaoProvider>
          <Navegacao />
        </EstacaoProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}