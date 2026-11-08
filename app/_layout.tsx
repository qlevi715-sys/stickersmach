import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function NavigationGuard() {
  const {token, isLoadingSession} = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if(isLoadingSession) return

    const inProtectedScreen = segments[0]==="(protected)"

    if(token){
      console.log("USUARIO LOGUADO", token);

      if(!inProtectedScreen){
        console.log("ENTRO AL PROTECTED");
        
        router.replace("/(protected)/dashboard")
      }
    }else{
      if (inProtectedScreen){
        console.log("USUARIO LOGUADO", token);

        router.replace("/(public)")
      }
    }
  }, [token, isLoadingSession, segments])

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='(public)'/>
      <Stack.Screen name='(protected)'/>
    </Stack>
  );
}

export default function RootLayout(){
  return(
  <AuthProvider>
    <NavigationGuard/>
  </AuthProvider>
  );
}