const navToggle = document.querySelector("#navToggle");
const navLinks = document.querySelector("#navLinks");
const cursorGlow = document.querySelector("#cursorGlow");
const tiltCard = document.querySelector("#tiltCard");
const seedArea = document.querySelector("#seedArea");
const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");
const showAllEventsButton = document.querySelector("#showAllEvents");
const eventList = document.querySelector("#eventList");

document.body.classList.add("page-fade");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      playSoftClick();
    });
  });
}

const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href.includes(currentPage)) {
    link.classList.add("active");
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

if (tiltCard) {
  tiltCard.addEventListener("mousemove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 9;
    const rotateX = ((y / rect.height) - 0.5) * -9;
    tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

const seedLabels = [
  "Belonging", "Trust", "Care", "Dialogue", "Youth",
  "Learning", "Support", "Hope", "Action", "Co-create"
];
const seedColors = ["#ff0000", "#7030a0", "#0070c0", "#ed7d31", "#397d21"];

if (seedArea) {
  seedArea.addEventListener("click", (event) => {
    const rect = seedArea.getBoundingClientRect();
    const seed = document.createElement("div");
    seed.className = "seed";
    seed.style.left = `${event.clientX - rect.left}px`;
    seed.style.top = `${event.clientY - rect.top}px`;
    seed.style.color = seedColors[Math.floor(Math.random() * seedColors.length)];

    const label = seedLabels[Math.floor(Math.random() * seedLabels.length)];
    seed.innerHTML = `
      <div class="stem"></div>
      <div class="flower">${label}</div>
    `;

    seedArea.appendChild(seed);
    playSoftClick();

    const seeds = seedArea.querySelectorAll(".seed");
    if (seeds.length > 14) seeds[0].remove();
  });
}

const events = [
  {
    date: "July 8, 2026",
    title: "Summer Co-Creating Circle",
    description: "Team update, website planning, and engagement platform next steps.",
    type: "Meeting"
  },
  {
    date: "July 15, 2026",
    title: "LiF Garden Mapping",
    description: "A visual planning session for values, pathways, audiences, and entry points.",
    type: "Workshop"
  },
  {
    date: "July 22, 2026",
    title: "Digital Platform Review",
    description: "Review website flow, community platform options, and onboarding structure.",
    type: "Review"
  },
  {
    date: "August 5, 2026",
    title: "Youth Engagement Pilot Prep",
    description: "Planning digital infrastructure, content, communication, and volunteer pathways.",
    type: "Planning"
  },
  {
    date: "August 12, 2026",
    title: "Community Story Circle",
    description: "A gathering for reflection, sharing, and relationship-building.",
    type: "Circle"
  },
  {
    date: "August 19, 2026",
    title: "Volunteer Orientation",
    description: "A practical introduction for new volunteers and community members.",
    type: "Orientation"
  }
];

let showingAllEvents = false;

function renderEvents(limit = 3) {
  if (!eventList) return;
  eventList.innerHTML = events
    .slice(0, limit)
    .map((event) => `
      <article class="event-card reveal visible">
        <div class="event-date">${event.date}</div>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <span class="event-type">${event.type}</span>
      </article>
    `)
    .join("");
}

if (showAllEventsButton) {
  showAllEventsButton.addEventListener("click", () => {
    showingAllEvents = !showingAllEvents;
    renderEvents(showingAllEvents ? events.length : 3);
    showAllEventsButton.textContent = showingAllEvents ? "Show fewer" : "Show all";
    playSoftClick();
  });
  renderEvents(showingAllEvents ? events.length : 3);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "there";
    if (formNote) {
      formNote.textContent = `Thanks, ${name}. Prototype captured this locally only. Connect a real form service before launch.`;
    }
    contactForm.reset();
    playSoftClick();
  });
}

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${target}`)?.classList.add("active");
    playSoftClick();
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".resource-card").forEach((card) => {
      const category = card.dataset.category;
      card.hidden = filter !== "all" && category !== filter;
    });

    playSoftClick();
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    item.classList.toggle("open");
    const expanded = item.classList.contains("open");
    button.setAttribute("aria-expanded", String(expanded));
    playSoftClick();
  });
});

document.querySelectorAll("[data-match]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#matchResult");
    const choice = button.dataset.match;
    const responses = {
      learn: "Start with Resources, then join a learning circle or guided discussion.",
      meet: "Start with Events, then join the engagement platform for updates and follow-up.",
      help: "Start with Volunteer, then complete the contact form so the team can route you.",
      build: "Start with Community Platform, then join a project or co-creation group."
    };
    if (result) result.textContent = responses[choice];
    playSoftClick();
  });
});

function playSoftClick() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.audioContext = window.audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = window.audioContext.createOscillator();
    const gain = window.audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, window.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(260, window.audioContext.currentTime + 0.05);

    gain.gain.setValueAtTime(0.035, window.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, window.audioContext.currentTime + 0.06);

    oscillator.connect(gain);
    gain.connect(window.audioContext.destination);
    oscillator.start();
    oscillator.stop(window.audioContext.currentTime + 0.06);
  } catch (error) {
    // Audio is optional. Thankfully, silence remains undefeated.
  }
}

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("click", playSoftClick);
});