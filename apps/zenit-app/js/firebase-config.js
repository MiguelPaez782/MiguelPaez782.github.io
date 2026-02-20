// ============================================================
// firebase-config.js
// Configuracion e inicializacion de Firebase
// El usuario debe reemplazar los valores con los de su proyecto
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyDX1iK9jKiTLDSQFPNYxUYi9eeuVN2J_F0",
  authDomain: "zenit-f6592.firebaseapp.com",
  projectId: "zenit-f6592",
  storageBucket: "zenit-f6592.firebasestorage.app",
  messagingSenderId: "360695456580",
  appId: "1:360695456580:web:b1612e39f9e6a9d8b1ad11"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Instancias globales de los servicios
const auth = firebase.auth();
const db   = firebase.firestore();

// Configuracion de seguridad de Firestore: persistencia offline desactivada
// para evitar datos sensibles en cache del navegador
db.settings({ experimentalForceLongPolling: false });