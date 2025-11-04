// employees-firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBN8KY0Rw4_oBUHOmZet_qOa-R8hSy3qqU",
  authDomain: "ngu-hub.firebaseapp.com",
  projectId: "ngu-hub",
  storageBucket: "ngu-hub.firebasestorage.app",
  messagingSenderId: "1019944923005",
  appId: "1:1019944923005:web:9f4a9c81ae711f7e91a614",
  measurementId: "G-4HP20442DM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.EMPLOYEES = {
    data: [],
    listeners: [],
    
    init() {
        this.loadFromFirebase();
    },
    
    loadFromFirebase() {
        onSnapshot(collection(db, "employees"), (snapshot) => {
            this.data = [];
            snapshot.forEach(doc => {
                this.data.push({ id: doc.id, ...doc.data() });
            });
            this.notifyListeners();
        });
    },
    
    async add(name) {
        // Get the highest employee number from existing IDs
        const snapshot = await getDocs(collection(db, "employees"));
        let maxNumber = 0;
        
        snapshot.forEach(doc => {
            const idMatch = doc.id.match(/^EMP(\d+)$/);
            if (idMatch) {
                const num = parseInt(idMatch[1]);
                if (num > maxNumber) {
                    maxNumber = num;
                }
            }
        });
        
        // Generate new ID with next number
        const id = `EMP${String(maxNumber + 1).padStart(3, '0')}`;
        
        const emp = {
            id,
            name: name.trim(),
            absences: [],
            holidays: [],
            startDate: null,
            dateLeft: null,
            holidayEntitlement: 28,
            holidayRemaining: 28,
            holidayTaken: 0,
            absenceDays: 0,
            location: 'OES'
        };
        
        await setDoc(doc(db, "employees", id), emp);
        return emp;
    },
    
    async remove(id) {
        await deleteDoc(doc(db, "employees", id));
    },
    
    async update(id, updates) {
        await setDoc(doc(db, "employees", id), updates, { merge: true });
    },
    
    onUpdate(callback) {
        this.listeners.push(callback);
    },
    
    notifyListeners() {
        this.listeners.forEach(cb => cb());
    }
};

EMPLOYEES.init();
