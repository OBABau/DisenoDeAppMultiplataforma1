import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBf9nrtpR3EKzs_NVW848bt3h76qj8CWWI",
  authDomain: "soon-9ce81.firebaseapp.com",
  projectId: "soon-9ce81",
  storageBucket: "soon-9ce81.appspot.com",
  messagingSenderId: "393543160914",
  appId: "1:393543160914:web:ad155f3643824b2f5efb8b",
  measurementId: "G-5M8F7YZKTR"
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
       <Text style={styles.title}>{isLogin ? 'Inicia sesion' : 'Registrate'}</Text>

       <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Inicia sesion' : 'Registrate'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Necesitas una cuenta? Registrate' : 'Ya tienes una cuenta? Inicia sesion'}
        </Text>
      </View>
    </View>
  );
}


const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Cerrar sesion" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};
export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('Sesion iniciada con exito!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('Usuario creado con exito');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121212', // Color de fondo oscuro
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#333', // Color de fondo oscuro
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff', // Color de texto claro
  },
  input: {
    height: 40,
    borderColor: '#555', // Color de borde oscuro
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    color: '#fff', // Color de texto claro
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#9effff', // Color de texto claro
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff', // Color de texto claro
  },
});
