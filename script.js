const navToggle = document.querySelector("#navToggle");
const navLinks = document.querySelector("#navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
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
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const events = [
  {
    date: "July 8, 2026",
    title: "Community Co-Creation Circle",
    description: "A collaborative session for sharing updates, ideas, and next steps.",
    type: "Meeting"
  },
  {
    date: "July 15, 2026",
    title: "LiF Garden Planning Session",
    description: "A working session to map community pathways and engagement spaces.",
    type: "Workshop"
  },
  {
    date: "July 22, 2026",
    title: "Digital Community Launch Prep",
    description: "Preparing website flow, platform onboarding, and communication tools.",
    type: "Planning"
  },
  {
    date: "August 2, 2026",
    title: "Volunteer Orientation",
    description: "An introduction for new volunteers and community members.",
    type: "Orientation"
  }
];

const eventList = document.querySelector("#eventList");
const showAllEventsButton = document.querySelector("#showAllEvents");
let showingAllEvents = false;

function renderEvents(limit = 3) {
  const visibleEvents = events.slice(0, limit);

  eventList.innerHTML = visibleEvents
    .map(
      (event) => `
        <article class="event-card reveal visible">
          <div class="event-date">${event.date} • ${event.type}</div>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
        </article>
      `
    )
    .join("");
}

showAllEventsButton.addEventListener("click", () => {
  showingAllEvents = !showingAllEvents;
  renderEvents(showingAllEvents ? events.length : 3);
  showAllEventsButton.textContent = showingAllEvents ? "Show fewer" : "Show all";
});

renderEvents();

const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");

  formNote.textContent = `Thanks, ${name}. This prototype captured the form locally only. Connect a real form service before launch.`;
  contactForm.reset();
});
