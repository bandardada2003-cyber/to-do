// ✅ Firebase configuration (from your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCkSZE8p76lbTXLEb0WlsTZUCdfMqZKgNU",
  authDomain: "cloud-todo-9b1d5.firebaseapp.com",
  projectId: "cloud-todo-9b1d5",
  storageBucket: "cloud-todo-9b1d5.firebasestorage.app",
  messagingSenderId: "897369414315",
  appId: "1:897369414315:web:eda9c5c4f860b13e6335ee"
};

// ✅ Initialize Firebase (Compat)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Register user
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Registration successful"))
    .catch(err => alert(err.message));
}

// ✅ Login user
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("todo-section").style.display = "block";
      loadTasks();
    })
    .catch(err => alert(err.message));
}

// ✅ Logout
function logout() {
  auth.signOut().then(() => location.reload());
}

// ✅ Add task
function addTask() {
  const task = document.getElementById("taskInput").value.trim();
  const user = auth.currentUser;

  if (!user) return alert("Please login first");
  if (!task) return alert("Write a task first");

  db.collection("tasks").add({
    text: task,
    uid: user.uid
  })
  .then(() => {
    document.getElementById("taskInput").value = "";
  })
  .catch(err => alert(err.message));
}

// ✅ Load tasks (Realtime)
function loadTasks() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("tasks")
    .where("uid", "==", user.uid)
    .onSnapshot(snapshot => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";

      snapshot.forEach(doc => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = doc.data().text;

        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.onclick = () => db.collection("tasks").doc(doc.id).delete();

        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
      });
    });
}

// ✅ Keep user logged in after refresh
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("todo-section").style.display = "block";
    loadTasks();
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("todo-section").style.display = "none";
  }
});
