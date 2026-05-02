/* --- Initial Data & Storage --- */
let questions = JSON.parse(localStorage.getItem("marine_qa")) || [
  {
    q: "Main Engine မှာ scavenge fire ဖြစ်ရခြင်း အကြောင်းရင်းတစ်ခု?",
    a: "unburnt fuel and oil accumulation",
  },
  {
    q: "Purifier overflow ဖြစ်ရခြင်း အကြောင်းရင်းတစ်ခု?",
    a: "incorrect gravity disc",
  },
];

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

/* --- Navigation --- */
function showTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".menu-btn")
    .forEach((b) => b.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");

  if (tabId === "manage-tab") renderManageList();
  if (tabId === "study-tab") initStudy();
}

/* --- Study Engine --- */
function initStudy() {
  if (questions.length === 0) {
    qText.innerText =
      "ကျေးဇူးပြု၍ မေးခွန်းစီမံမည် Tab တွင် မေးခွန်းများ အရင်ထည့်သွင်းပါ။";
    return;
  }
  loadQuestion();
  updateStats();
}

function loadQuestion() {
  const currentQ = questions[currentIndex];
  qText.innerText = currentQ.q;
  answerInput.value = "";
  feedback.innerText = "";
  feedback.className = "feedback";
  hintBox.style.display = "none";
  updateProgressBar();
}

function processCheck() {
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
}

function processNext() {
  currentIndex = (currentIndex + 1) % questions.length;
  loadQuestion();
}

function toggleHint() {
  if (hintBox.style.display === "block") {
    hintBox.style.display = "none";
  } else {
    hintBox.innerText = "အဖြေမှန်: " + questions[currentIndex].a;
    hintBox.style.display = "block";
  }
}

function updateProgressBar() {
  const progress = ((currentIndex + 1) / questions.length) * 100;
  progressBar.style.width = progress + "%";
}

function updateStats() {
  totalQEl.innerText = questions.length;
}

/* --- Management Engine --- */
function addNewQuestion() {
  const qIn = document.getElementById("new-q-input");
  const aIn = document.getElementById("new-a-input");

  if (!qIn.value || !aIn.value) {
    alert("မေးခွန်းနှင့် အဖြေ နှစ်ခုလုံး ဖြည့်ပေးပါ။");
    return;
  }

  questions.push({ q: qIn.value, a: aIn.value });
  saveData();
  qIn.value = "";
  aIn.value = "";
  renderManageList();
  updateStats();
  alert("မေးခွန်းအသစ် သိမ်းဆည်းပြီးပါပြီ။");
}

function deleteQuestion(idx) {
  if (confirm("ဤမေးခွန်းကို ဖျက်ပစ်ရန် သေချာပါသလား?")) {
    questions.splice(idx, 1);
    saveData();
    renderManageList();
    updateStats();
  }
}

function renderManageList() {
  qListEl.innerHTML = questions
    .map(
      (item, idx) => `
        <div class="q-item">
            <div>
                <strong>${item.q}</strong><br>
                <small style="color: #64748b">Ans: ${item.a}</small>
            </div>
            <button class="del-btn" onclick="deleteQuestion(${idx})"><i class="fas fa-trash"></i></button>
        </div>
    `,
    )
    .join("");
}

function saveData() {
  localStorage.setItem("marine_qa", JSON.stringify(questions));
}

/* --- Initialization --- */
window.onload = () => {
  initStudy();
  renderManageList();
};
