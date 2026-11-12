import { Alert, Platform } from 'react-native';

/** Mostra um aviso na tela: popup nativo no celular, alert do navegador na versao web. */
export function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}