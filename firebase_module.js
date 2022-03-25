<!-- FIREBASE -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
    <script>
        // Import the functions you need from the SDKs you need

        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyCHdXFvCFOCKHI7oj0CUyusIcoIVP4F7EY",
            authDomain: "blood-bank-g5.firebaseapp.com",
            databaseURL: "https://blood-bank-g5-default-rtdb.firebaseio.com",
            projectId: "blood-bank-g5",
            storageBucket: "blood-bank-g5.appspot.com",
            messagingSenderId: "671833012751",
            appId: "1:671833012751:web:767ace9310ce93c8d7417a"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
    </script>