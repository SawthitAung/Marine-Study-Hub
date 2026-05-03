import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

// ၁။ မင်းရဲ့ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-f4bOSAAiEIg9TlLVspOTucHtl3IKGoc",
  authDomain: "marine-study-hub.firebaseapp.com",
  projectId: "marine-study-hub",
  storageBucket: "marine-study-hub.firebasestorage.app",
  messagingSenderId: "1048039943744",
  appId: "1:1048039943744:web:f57e741d86a68f75deb9a5",
  measurementId: "G-7R4VJKDTPE"
};

// ၂။ Initialize Firebase & Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database, "marine_qa");

let questions = [];
let currentIndex = 0;
let score = 0;

/* --- DOM Elements --- */
const qText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const feedback = document.getElementById("feedback-msg");
const hintBox = document.getElementById("hint-text");
const progressBar = document.getElementById("progress-bar");
const totalQEl = document.getElementById("total-q");
const scoreEl = document.getElementById("user-score");
const qListEl = document.getElementById("questions-list");

// ၃။ Database မှ Data များကို Realtime ဖတ်ခြင်း
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    // Object ကို Array အဖြစ်ပြောင်းခြင်း
    questions = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  } else {
    questions = [];
  }
  updateStats();
  initStudy();
  renderManageList();
});

/* --- Study Engine --- */
window.initStudy = function() {
  if (questions.length === 0) {
    qText.innerText = "ကျေးဇူးပြု၍ မေးခွန်းစီမံမည် Tab တွင် မေးခွန်းများ အရင်ထည့်သွင်းပါ။";
    return;
  }
  loadQuestion();
};

function loadQuestion() {
  const currentQ = questions[currentIndex];
  qText.innerText = currentQ.q;
  answerInput.value = "";
  feedback.innerText = "";
  feedback.className = "feedback";
  hintBox.style.display = "none";
  updateProgressBar();
}

window.processCheck = function() {
  const userVal = answerInput.value.trim().toLowerCase();
  const correctVal = questions[currentIndex].a.toLowerCase();

  if (userVal === correctVal) {
    feedback.innerText = "ဂုဏ်ယူပါတယ်! အဖြေမှန်ပါတယ်။ ✅";
    feedback.className = "feedback correct";
    score += 10;
    scoreEl.innerText = score;
  } else {
    feedback.innerText = "အဖြေမှားနေပါတယ်။ ပြန်ကြိုးစားကြည့်ပါ။ ❌";
    feedback.className = "feedback wrong";
  }
};

window.processNext = function() {
  currentIndex = (currentIndex + 1) % questions.length;
  loadQuestion();
};

window.toggleHint = function() {
  if (hintBox.style.display === "block") {
    hintBox.style.display = "none";
  } else {
    hintBox.innerText = "အဖြေမှန်: " + questions[currentIndex].a;
    hintBox.style.display = "block";
  }
};

function updateProgressBar() {
  const progress = ((currentIndex + 1) / questions.length) * 100;
  if (progressBar) progressBar.style.width = progress + "%";
}

function updateStats() {
  if (totalQEl) totalQEl.innerText = questions.length;
}

/* --- Management Engine --- */
window.addNewQuestion = function() {
  const qIn = document.getElementById("new-q-input");
  const aIn = document.getElementById("new-a-input");

  if (!qIn.value || !aIn.value) {
    alert("မေးခွန်းနှင့် အဖြေ နှစ်ခုလုံး ဖြည့်ပေးပါ။");
    return;
  }

  // Firebase သို့ Data အသစ်ပို့ခြင်း
  push(dbRef, {
    q: qIn.value,
    a: aIn.value
  });

  qIn.value = "";
  aIn.value = "";
  alert("Cloud Database သို့ သိမ်းဆည်းပြီးပါပြီ။");
};

window.deleteQuestion = function(id) {
  if (confirm("ဤမေးခွန်းကို ဖျက်ပစ်ရန် သေချာပါသလား?")) {
    const itemRef = ref(database, `marine_qa/${id}`);
    remove(itemRef); // Firebase မှ ဖျက်ခြင်း[cite: 5]
  }
};

window.renderManageList = function() {
  if (!qListEl) return;
  qListEl.innerHTML = questions
    .map(
      (item) => `
        <div class="q-item">
            <div>
                <strong>${item.q}</strong><br>
                <small style="color: #64748b">Ans: ${item.a}</small>
            </div>
            <button class="del-btn" onclick="deleteQuestion('${item.id}')"><i class="fas fa-trash"></i></button>
        </div>
    `,
    )
    .join("");
};

// Navigation function ကို Firebase module နဲ့ကိုက်အောင် ပြင်ခြင်း
window.showTab = function(tabId) {
  document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".menu-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  if (event) event.target.classList.add("active");
};
