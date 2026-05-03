// Configurazione Firebase fornita dall'utente
const firebaseConfig = {
  apiKey: "AIzaSyC9WhGYaWyaJtqDHhKhii5yhnP363SczJo",
  authDomain: "palestra-riflessione.firebaseapp.com",
  projectId: "palestra-riflessione",
  storageBucket: "palestra-riflessione.firebasestorage.app",
  messagingSenderId: "617112106958",
  appId: "1:617112106958:web:f017958c52e4f1d5845d9f"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Esponi auth e db globalmente per usarli negli altri script
window.fbAuth = firebase.auth();
window.fbDb = firebase.firestore();

console.log("🔥 Firebase inizializzato correttamente");
