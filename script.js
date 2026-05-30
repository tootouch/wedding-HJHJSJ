const invitation = {
  groom: {
    full: "허재혁",
    first: "재혁",
    parents: "허승규",
    father: "허승규",
    relation: "아들",
    accountName: "허재혁",
    account: "국민은행 123456-78-901234",
    fatherAccount: "계좌번호 입력 예정",
  },
  bride: {
    full: "조소진",
    first: "소진",
    parents: "조광희 · 정은정",
    father: "조광희",
    mother: "정은정",
    relation: "딸",
    accountName: "조소진",
    account: "신한은행 110-123-456789",
    fatherAccount: "계좌번호 입력 예정",
    motherAccount: "계좌번호 입력 예정",
  },
  contacts: [
    {
      side: "신랑측",
      name: "허재혁",
      phone: "010-4546-4170",
    },
    {
      side: "신랑측",
      name: "허승규",
      phone: "010-2856-4170",
    },
    {
      side: "신부측",
      name: "조소진",
      phone: "010-6530-1540",
    },
    {
      side: "신부측",
      name: "조광희",
      phone: "010-7797-4546",
    },
    {
      side: "신부측",
      name: "정은정",
      phone: "010-3771-9204",
    },
  ],
  wedding: {
    date: "2026-09-20T18:10:00+09:00",
    dateLabel: "2026. 09. 20. SUN 6:10 PM",
    dateFull: "2026년 9월 20일 일요일",
    time: "오후 6시 10분",
    venue: "라마다 서울 신도림 호텔",
    venueHall: "5층 세인트그레이스홀",
    venueDetail: "라마다 서울 신도림 호텔 5층 세인트그레이스홀",
    venueShort: "라마다 서울 신도림",
    address: "서울특별시 구로구 경인로 624",
    addressShort: "서울특별시 구로구 경인로 624",
    mapQuery: "라마다서울신도림호텔",
    latitude: "37.5069",
    longitude: "126.8868",
  },
  gallery: [
    {
      src: "assets/wedding-cover.png",
      alt: "꽃과 반지가 놓인 웨딩 이미지",
      caption: "가을 햇살 아래",
      focus: "50% 58%",
    },
    {
      src: "assets/wedding-cover.png",
      alt: "웨딩 꽃 장식 클로즈업",
      caption: "부드러운 꽃 장식",
      focus: "30% 50%",
      scale: 1.14,
    },
    {
      src: "assets/wedding-cover.png",
      alt: "웨딩 반지 클로즈업",
      caption: "서로의 약속",
      focus: "72% 58%",
      scale: 1.22,
    },
    {
      src: "assets/wedding-cover.png",
      alt: "아이보리 배경의 웨딩 디테일",
      caption: "작은 디테일",
      focus: "46% 24%",
      scale: 1.18,
    },
    {
      src: "assets/wedding-cover.png",
      alt: "실크 리본과 웨딩 플라워",
      caption: "고요한 오후",
      focus: "42% 76%",
      scale: 1.2,
    },
    {
      src: "assets/wedding-cover.png",
      alt: "웨딩 반지와 꽃이 함께 놓인 장면",
      caption: "함께 놓인 마음",
      focus: "64% 66%",
      scale: 1.1,
    },
  ],
  shareMessages: {
    default:
      "저희 두 사람이 결혼합니다. 소중한 날 함께 축복해 주시면 감사하겠습니다.",
    parents:
      "저희 아이들의 결혼식에 귀한 분들을 모시고자 합니다. 따뜻한 축복으로 함께해 주세요.",
    friends:
      "우리 결혼해요. 와서 같이 웃고 축하해 주면 정말 든든할 것 같아요.",
  },
};

const fields = {
  groomFirst: invitation.groom.first,
  groomFull: invitation.groom.full,
  groomParents: invitation.groom.parents,
  groomFather: invitation.groom.father,
  groomRelation: invitation.groom.relation,
  groomAccountName: invitation.groom.accountName,
  groomAccount: invitation.groom.account,
  groomFatherAccount: invitation.groom.fatherAccount,
  brideFirst: invitation.bride.first,
  brideFull: invitation.bride.full,
  brideParents: invitation.bride.parents,
  brideFather: invitation.bride.father,
  brideMother: invitation.bride.mother,
  brideRelation: invitation.bride.relation,
  brideAccountName: invitation.bride.accountName,
  brideAccount: invitation.bride.account,
  brideFatherAccount: invitation.bride.fatherAccount,
  brideMotherAccount: invitation.bride.motherAccount,
  weddingDateLabel: invitation.wedding.dateLabel,
  weddingDateFull: invitation.wedding.dateFull,
  weddingTime: invitation.wedding.time,
  venue: invitation.wedding.venue,
  venueHall: invitation.wedding.venueHall,
  venueDetail: invitation.wedding.venueDetail,
  venueShort: invitation.wedding.venueShort,
  address: invitation.wedding.address,
  addressShort: invitation.wedding.addressShort,
};

const toast = document.querySelector("[data-toast]");
let toastTimer;
const storageKeys = {
  rsvp: "wedding-rsvp-list",
  guestbook: "wedding-guestbook",
};

const fallbackGuestbook = [
  {
    target: "신랑",
    relation: "친구",
    name: "민지",
    message: "두 사람의 시작을 진심으로 축하해요. 오래오래 다정하게 걸어가길!",
    savedAt: "2026-05-29T09:00:00+09:00",
  },
  {
    target: "신부",
    relation: "친구",
    name: "준호",
    message: "청첩장 분위기가 두 사람처럼 따뜻하네요. 예식 날 환하게 만나요.",
    savedAt: "2026-05-29T09:10:00+09:00",
  },
];

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function readStorage(key, fallbackValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
  return true;
}

function populateContent() {
  document.querySelectorAll("[data-field]").forEach((node) => {
    const key = node.dataset.field;
    node.textContent = fields[key] ?? "";
  });

  const query = encodeURIComponent(invitation.wedding.mapQuery);
  const tmapName = encodeURIComponent(invitation.wedding.mapQuery);
  const mapUrls = {
    naver: `https://map.naver.com/p/search/${query}`,
    kakao: `https://map.kakao.com/link/search/${query}`,
    tmap: `tmap://route?goalname=${tmapName}&goalx=${invitation.wedding.longitude}&goaly=${invitation.wedding.latitude}`,
  };

  document.querySelectorAll("[data-map]").forEach((node) => {
    node.href = mapUrls[node.dataset.map];
  });
}

function updateCountdown() {
  const target = new Date(invitation.wedding.date).getTime();
  const distance = Math.max(0, target - Date.now());
  const minutesTotal = Math.floor(distance / 60000);
  const days = Math.floor(minutesTotal / 1440);
  const hours = Math.floor((minutesTotal % 1440) / 60);
  const minutes = minutesTotal % 60;

  document.querySelector("[data-countdown='days']").textContent = days;
  document.querySelector("[data-countdown='hours']").textContent = hours;
  document.querySelector("[data-countdown='minutes']").textContent = minutes;
}

function downloadCalendarInvite() {
  const start = new Date(invitation.wedding.date);
  const end = new Date(start.getTime() + 90 * 60000);
  const formatDate = (date) =>
    date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//Mobile//KO",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wedding-invitation`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${invitation.groom.full} & ${invitation.bride.full} 결혼식`,
    `LOCATION:${invitation.wedding.venueDetail}, ${invitation.wedding.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding-invitation.ics";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("일정 파일을 저장했어요.");
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast(text);
  }
}

async function shareInvitation(preset = "default") {
  const text = invitation.shareMessages[preset] || invitation.shareMessages.default;
  const shareData = {
    title: `${invitation.groom.full} & ${invitation.bride.full} 결혼식`,
    text: `${text}\n${invitation.wedding.dateFull} ${invitation.wedding.time}, ${invitation.wedding.venue}`,
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await copyText(
    `${shareData.title}\n${shareData.text}\n${shareData.url}`,
    "공유 문구를 복사했어요.",
  );
}

function setupActions() {
  document.querySelector("[data-action='calendar']").addEventListener("click", downloadCalendarInvite);
  setupShareDialog();

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = fields[button.dataset.copy];
      const message = button.dataset.copyMessage || "계좌번호를 복사했어요.";
      copyText(value, message);
    });
  });

  document.querySelectorAll("[data-action='pay-unavailable']").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("카카오페이 송금 링크를 준비 중이에요.");
    });
  });
}

function setupShareDialog() {
  const triggers = document.querySelectorAll("[data-action='share']");
  const dialog = document.querySelector("[data-share-dialog]");
  const close = document.querySelector("[data-share-close]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (dialog.showModal) {
        dialog.showModal();
        return;
      }

      shareInvitation("default").catch(() => showToast("공유를 완료하지 못했어요."));
    });
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  document.querySelectorAll("[data-share-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      dialog.close();
      shareInvitation(button.dataset.sharePreset).catch(() => {
        showToast("공유를 완료하지 못했어요.");
      });
    });
  });
}

function setupContactLinks() {
  const contactMap = new Map(invitation.contacts.map((contact) => [contact.name, contact.phone]));
  const trigger = document.querySelector("[data-contact-open]");
  const dialog = document.querySelector("[data-contact-dialog]");
  const close = document.querySelector("[data-contact-close]");

  trigger.addEventListener("click", () => {
    dialog.showModal();
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  document.querySelectorAll("[data-contact-name]").forEach((row) => {
    const phone = contactMap.get(row.dataset.contactName);
    if (!phone) {
      return;
    }

    row.querySelectorAll("[data-contact-action]").forEach((link) => {
      const action = link.dataset.contactAction;
      link.href = `${action}:${phone}`;
    });
  });
}

function renderGalleryGrid() {
  const grid = document.querySelector("[data-gallery-grid]");
  grid.replaceChildren();

  invitation.gallery.forEach((item, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.className = "gallery-tile";
    if (index === 0) {
      button.classList.add("gallery-tile--large");
    }
    if (index > 0 && index % 5 === 0) {
      button.classList.add("gallery-tile--wide");
    }
    button.type = "button";
    button.dataset.gallery = String(index);
    button.setAttribute("aria-label", `${item.caption || item.alt} 크게 보기`);

    image.src = item.src;
    image.alt = item.alt;
    image.loading = index > 2 ? "lazy" : "eager";
    if (item.focus) {
      image.style.objectPosition = item.focus;
    }
    if (item.scale) {
      image.style.transform = `scale(${item.scale})`;
    }

    button.append(image);
    grid.append(button);
  });
}

function setupGallery() {
  const dialog = document.querySelector("[data-gallery-dialog]");
  const image = document.querySelector("[data-gallery-image]");
  const caption = document.querySelector("[data-gallery-caption]");
  const counter = document.querySelector("[data-gallery-counter]");
  const close = document.querySelector("[data-gallery-close]");
  const prev = document.querySelector("[data-gallery-prev]");
  const next = document.querySelector("[data-gallery-next]");
  let activeIndex = 0;
  let touchStartX = 0;

  function showImage(index) {
    activeIndex = (index + invitation.gallery.length) % invitation.gallery.length;
    const item = invitation.gallery[activeIndex];
    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption || item.alt;
    counter.textContent = `${activeIndex + 1} / ${invitation.gallery.length}`;
  }

  renderGalleryGrid();

  document.querySelectorAll("[data-gallery]").forEach((tile) => {
    tile.addEventListener("click", () => {
      showImage(Number(tile.dataset.gallery));
      dialog.showModal();
    });
  });

  close.addEventListener("click", () => dialog.close());
  prev.addEventListener("click", () => showImage(activeIndex - 1));
  next.addEventListener("click", () => showImage(activeIndex + 1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showImage(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      showImage(activeIndex + 1);
    }
  });

  dialog.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );

  dialog.addEventListener(
    "touchend",
    (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 44) {
        return;
      }
      showImage(distance > 0 ? activeIndex - 1 : activeIndex + 1);
    },
    { passive: true },
  );
}

function setupRsvp() {
  const trigger = document.querySelector("[data-rsvp-open]");
  const dialog = document.querySelector("[data-rsvp-dialog]");
  const close = document.querySelector("[data-rsvp-close]");
  const form = document.querySelector("[data-rsvp-form]");

  trigger.addEventListener("click", () => {
    dialog.showModal();
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const savedList = readStorage(storageKeys.rsvp, []);
    savedList.unshift({ ...data, savedAt: new Date().toISOString() });
    writeStorage(storageKeys.rsvp, savedList);
    showToast(`${data.name}님, 마음을 전했어요.`);
    form.reset();
    dialog.close();
  });
}

function formatGuestbookDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function renderGuestbook() {
  const list = document.querySelector("[data-guestbook-list]");
  const messages = readStorage(storageKeys.guestbook, fallbackGuestbook);
  list.replaceChildren();

  messages.slice(0, 8).forEach((item) => {
    const card = document.createElement("article");
    const target = document.createElement("strong");
    const name = document.createElement("span");
    const message = document.createElement("p");
    const time = document.createElement("time");
    const sender = [item.relation, item.name].filter(Boolean).join(" ");

    card.className = "guestbook-card";
    target.textContent = `To. ${item.target || "두 사람"}`;
    name.textContent = `From. ${sender || "익명"}`;
    message.textContent = item.message;
    time.textContent = formatGuestbookDate(item.savedAt);

    card.append(target, name, message, time);
    list.append(card);
  });
}

function setupGuestbook() {
  const trigger = document.querySelector("[data-guestbook-open]");
  const dialog = document.querySelector("[data-guestbook-dialog]");
  const close = document.querySelector("[data-guestbook-close]");
  const form = document.querySelector("[data-guestbook-form]");

  trigger.addEventListener("click", () => {
    dialog.showModal();
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const messages = readStorage(storageKeys.guestbook, fallbackGuestbook);
    messages.unshift({
      target: data.target,
      relation: data.relation,
      name: data.name,
      message: data.message,
      savedAt: new Date().toISOString(),
    });
    writeStorage(storageKeys.guestbook, messages);
    renderGuestbook();
    showToast("축하 메시지를 남겼어요.");
    form.reset();
    dialog.close();
  });
}

populateContent();
updateCountdown();
setupActions();
setupContactLinks();
setupGallery();
setupRsvp();
setupGuestbook();
renderGuestbook();
window.setInterval(updateCountdown, 60000);

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
