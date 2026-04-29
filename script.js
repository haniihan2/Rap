const quizData = [
  { prompt: "가방", answer: "사람", wrong: ["거울", "마음", "믿음", "수난", "가정", "바램", "파채"] },
  { prompt: "사진", answer: "다리", wrong: ["사과", "도장", "시계", "바람", "다정", "가방"] },
  { prompt: "조각", answer: "도망", wrong: ["지구", "우주", "책상", "보완", "도적", "고별"] },
  { prompt: "기억", answer: "비전", wrong: ["약속", "미상", "비상", "치사", "운명", "시간"] },
  { prompt: "청춘", answer: "건물", wrong: ["학생", "번개", "퍼런", "커튼", "교실", "친구"] },
  { prompt: "우주", answer: "구두", wrong: ["지구", "두근", "부도", "하늘", "태양", "바다"] },
  { prompt: "심장", answer: "기차", wrong: ["버스", "기름", "비료", "시정", "지하", "도로"] },
  { prompt: "고독", answer: "포도", wrong: ["사과", "고상", "포항", "도망", "수박", "딸기"] },
  { prompt: "수비", answer: "무기", wrong: ["수혈", "주사", "부상", "공격", "작전", "훈련"] },
  { prompt: "승리", answer: "금지", wrong: ["승산", "금전", "느루", "흐뭇", "패배", "시작", "포기"] },
  { prompt: "생각", answer: "대박", wrong: ["고민", "질문", "느낌", "생생", "재촉", "태풍", "새벽"] },
  { prompt: "고민", answer: "소리", wrong: ["보장", "소박", "조각", "노화", "슬픔", "기쁨", "눈물"] },
  { prompt: "영혼", answer: "결론", wrong: ["육체", "영화", "경사", "결시", "정곡", "마음", "귀신"] },
  { prompt: "마음", answer: "아픔", wrong: ["마루", "다리", "아장", "다수", "비수", "타율"] },
  { prompt: "호수", answer: "보수", wrong: ["바다", "보라", "호박", "보상", "도박", "강물", "연못"] },
  { prompt: "미래", answer: "실패", wrong: ["어제", "내일", "비결", "기준", "시간", "오늘"] },
  { prompt: "노래", answer: "오해", wrong: ["가사", "음악", "오만", "노화", "도망", "악기", "소리"] },
  { prompt: "학교", answer: "발표", wrong: ["공부", "학생", "학자", "발상", "박수", "칠판", "선생"] },
  { prompt: "편지", answer: "연기", wrong: ["우체", "편차", "절편", "연차", "연상", "사랑", "인사"] },
  { prompt: "성적", answer: "언덕", wrong: ["공부", "시험", "압박", "성과", "언질", "언사", "적시"] },
  { prompt: "세상", answer: "제안", wrong: ["세계", "제의", "세수", "우주", "지구", "세트", "인생"] },
  { prompt: "의미", answer: "의리", wrong: ["가치", "희망", "의상", "희곡", "의사", "보람", "행복"] },
  { prompt: "소설", answer: "보석", wrong: ["창작", "소박", "보수", "조사", "토지", "예술", "작가"] },
  { prompt: "축제", answer: "문제", wrong: ["파티", "풍선", "기쁨", "축하", "부산", "공연", "준비"] },
  { prompt: "상처", answer: "단어", wrong: ["보수", "마음", "심장", "상해", "단순", "아픔", "눈물", "회복"] },
  { prompt: "뿌리", answer: "무지", wrong: ["나무", "줄기", "푸른", "무상", "무해", "잎새"] },
  { prompt: "수건", answer: "무덤", wrong: ["가죽", "수혜", "무정", "투쟁", "부자", "양말", "신발"] },
  { prompt: "펀치", answer: "거짓", wrong: ["주먹", "버섯", "저장", "진실", "복싱", "싸움", "공격"] },
  { prompt: "침묵", answer: "직무", wrong: ["소리", "침해", "치명", "직장", "지혜", "고요", "외침"] },
  { prompt: "나비", answer: "파리", wrong: ["곤충", "호랑", "자체", "사자", "풀밭", "자연", "동물"] },
];

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultOverlay = document.getElementById("resultOverlay");

const nicknameInput = document.getElementById("nicknameInput");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const playerName = document.getElementById("playerName");
const scoreEl = document.getElementById("score");
const timeBar = document.getElementById("timeBar");
const timeValue = document.getElementById("timeValue");
const promptWord = document.getElementById("promptWord");
const optionsGrid = document.getElementById("optionsGrid");
const app = document.getElementById("app");
const plusScore = document.getElementById("plusScore");
const finalScoreText = document.getElementById("finalScoreText");
const finalTitleText = document.getElementById("finalTitleText");
const GAME_DURATION = 40;
const COMBO_BONUS_INTERVAL = 5;
const COMBO_BONUS_SECONDS = 0.5;

let state = {
  nickname: "",
  score: 0,
  timeLeft: GAME_DURATION,
  combo: 0,
  timerId: null,
  activeQuestion: null,
};

function shuffle(array) {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function pickQuestion() {
  const question = quizData[Math.floor(Math.random() * quizData.length)];
  const wrongChoices = shuffle(question.wrong).slice(0, 3);
  const choices = shuffle([question.answer, ...wrongChoices]);
  state.activeQuestion = question;

  promptWord.textContent = question.prompt;
  optionsGrid.innerHTML = "";
  choices.forEach((word) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = word;
    btn.addEventListener("click", () => onAnswer(word));
    optionsGrid.appendChild(btn);
  });
}

function renderHud() {
  scoreEl.textContent = `${state.score}점`;
  timeValue.textContent = `${Math.max(0, state.timeLeft).toFixed(1)}s`;
  const ratio = Math.max(0, Math.min(1, state.timeLeft / GAME_DURATION));
  timeBar.style.width = `${ratio * 100}%`;
}

function showCorrectFeedback() {
  app.classList.remove("shake-wrong");
  app.classList.add("flash-correct");
  plusScore.classList.remove("show-plus");
  void plusScore.offsetWidth;
  plusScore.classList.add("show-plus");
  setTimeout(() => app.classList.remove("flash-correct"), 340);
}

function showWrongFeedback() {
  app.classList.remove("flash-correct");
  app.classList.remove("shake-wrong");
  void app.offsetWidth;
  app.classList.add("shake-wrong");
  setTimeout(() => app.classList.remove("shake-wrong"), 360);
}

function onAnswer(selectedWord) {
  if (state.timeLeft <= 0 || !state.activeQuestion) return;

  if (selectedWord === state.activeQuestion.answer) {
    state.score += 10;
    state.combo += 1;
    if (state.combo > 0 && state.combo % COMBO_BONUS_INTERVAL === 0) {
      state.timeLeft += COMBO_BONUS_SECONDS;
    }
    showCorrectFeedback();
  } else {
    state.combo = 0;
    state.timeLeft -= 3;
    showWrongFeedback();
  }

  state.timeLeft = Math.min(GAME_DURATION, state.timeLeft);
  renderHud();
  if (state.timeLeft <= 0) {
    endGame();
    return;
  }
  pickQuestion();
}

function titleByScore(score) {
  if (score >= 200) return "랩의 신";
  if (score >= 160) return "플로우 마스터";
  if (score >= 120) return "비트 지배자";
  if (score >= 80) return "수퍼 루키";
  return "연습생";
}

function endGame() {
  clearInterval(state.timerId);
  state.timerId = null;
  gameScreen.classList.add("hidden");
  resultOverlay.classList.remove("hidden");
  finalScoreText.textContent = `🎤 ${state.nickname} 님의 최종 점수: ${state.score}점`;
  finalTitleText.textContent = `칭호: ${titleByScore(state.score)}`;
}

function startGame() {
  state = {
    nickname: nicknameInput.value.trim(),
    score: 0,
    timeLeft: GAME_DURATION,
    combo: 0,
    timerId: null,
    activeQuestion: null,
  };

  playerName.textContent = state.nickname;
  startScreen.classList.add("hidden");
  resultOverlay.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  renderHud();
  pickQuestion();

  state.timerId = setInterval(() => {
    state.timeLeft -= 0.1;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      renderHud();
      endGame();
      return;
    }
    renderHud();
  }, 100);
}

nicknameInput.addEventListener("input", () => {
  startBtn.disabled = nicknameInput.value.trim().length === 0;
});

startBtn.addEventListener("click", startGame);

retryBtn.addEventListener("click", () => {
  nicknameInput.value = state.nickname;
  startBtn.disabled = false;
  resultOverlay.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
