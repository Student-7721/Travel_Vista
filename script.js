
/* =========================================
   TRAVELVISTA — INTERACTIVE WEBSITE
   Step 3: script.js
========================================= */

"use strict";

/* ---------- 1. HELPER FUNCTIONS ---------- */

const getElement = (id) => document.getElementById(id);

const showToast = (message) => {
    const toast = getElement("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
};

/* ---------- 2. CURRENT YEAR ---------- */

const currentYear = getElement("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* ---------- 3. MOBILE NAVIGATION ---------- */

const menuToggle = getElement("menuToggle");
const navLinks = getElement("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "×" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navLinks.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }
    });
}

/* ---------- 4. CUSTOM CURSOR GLOW ---------- */

const cursorGlow = getElement("cursorGlow");

if (cursorGlow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("pointermove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;

        document.body.classList.add("cursor-active");
    });

    document.addEventListener("pointerleave", () => {
        document.body.classList.remove("cursor-active");
    });

    document.addEventListener("pointerenter", () => {
        document.body.classList.add("cursor-active");
    });
}

/* ---------- 5. DESTINATION SEARCH AND FILTERS ---------- */

const destinationGrid = getElement("destinationGrid");
const destinationSearch = getElement("destinationSearch");
const filterButtons = getElement("filterButtons");
const destinationCount = getElement("destinationCount");
const emptyMessage = getElement("emptyMessage");

const destinationCards = destinationGrid
    ? Array.from(destinationGrid.querySelectorAll(".destination-card"))
    : [];

let activeCategory = "all";

function filterDestinations() {
    const searchTerm = destinationSearch
        ? destinationSearch.value.trim().toLowerCase()
        : "";

    let visibleCount = 0;

    destinationCards.forEach((card) => {
        const category = card.dataset.category || "";
        const name = card.dataset.name || "";
        const searchableText = `${name} ${card.dataset.search || ""}`.toLowerCase();

        const matchesCategory =
            activeCategory === "all" || category === activeCategory;

        const matchesSearch = searchableText.includes(searchTerm);

        const shouldShow = matchesCategory && matchesSearch;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }
    });

    if (destinationCount) {
        destinationCount.textContent =
            `${visibleCount} ${visibleCount === 1 ? "place" : "places"} to explore`;
    }

    if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
    }
}

if (destinationSearch) {
    destinationSearch.addEventListener("input", filterDestinations);
}

if (filterButtons) {
    filterButtons.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");

        if (!button) return;

        activeCategory = button.dataset.filter;

        filterButtons.querySelectorAll(".filter-btn").forEach((filterButton) => {
            const isActive = filterButton === button;

            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        filterDestinations();
    });
}

/* ---------- 6. FAVORITE DESTINATIONS ---------- */

const favoriteButtons = document.querySelectorAll("[data-favorite]");

favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const isFavorite = button.classList.toggle("is-favorite");

        button.textContent = isFavorite ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(isFavorite));

        const name = button.dataset.favorite;
        const readableName = name.charAt(0).toUpperCase() + name.slice(1);

        button.setAttribute(
            "aria-label",
            `${isFavorite ? "Remove" : "Add"} ${readableName} ${isFavorite ? "from" : "to"} favorites`
        );

        showToast(
            isFavorite
                ? `${readableName} added to your favorites! ♥`
                : `${readableName} removed from your favorites.`
        );
    });
});

/* ---------- 7. DESTINATION DETAILS ---------- */

const destinationInformation = {
    agra: {
        name: "Agra",
        location: "Uttar Pradesh, India",
        image: "images/agra.jpg",
        description:
            "Agra is famous for the Taj Mahal, an architectural masterpiece and UNESCO World Heritage Site. Discover Mughal history, impressive monuments and local cuisine.",
        highlights: [
            "Taj Mahal",
            "Agra Fort",
            "Mehtab Bagh"
        ],
        officialUrl: "https://www.uptourism.gov.in/"
    },

    goa: {
        name: "Goa",
        location: "Goa, India",
        image: "images/goa.jpg",
        description:
            "Goa offers beautiful coastlines, Portuguese-influenced heritage, colorful markets and delicious local food. It is a popular destination for relaxation and outdoor adventures.",
        highlights: [
            "Popular beaches",
            "Old Goa heritage churches",
            "Local Goan cuisine"
        ],
        officialUrl: "https://goa-tourism.com/"
    },

    kerala: {
        name: "Kerala",
        location: "Kerala, India",
        image: "images/kerala.jpg",
        description:
            "Kerala is known for its lush greenery, peaceful backwaters, traditional culture and diverse landscapes. Enjoy nature, regional food and scenic journeys.",
        highlights: [
            "Alleppey backwaters",
            "Munnar tea gardens",
            "Traditional Kerala cuisine"
        ],
        officialUrl: "https://www.keralatourism.org/"
    },

    manali: {
        name: "Manali",
        location: "Himachal Pradesh, India",
        image: "images/manali.jpg",
        description:
            "Manali is a mountain destination known for dramatic Himalayan scenery, pine forests, nearby villages and outdoor activities. Weather and seasonal road conditions can affect travel plans.",
        highlights: [
            "Solang Valley",
            "Hadimba Devi Temple",
            "Old Manali"
        ],
        officialUrl: "https://himachaltourism.gov.in/"
    },

    jaipur: {
        name: "Jaipur",
        location: "Rajasthan, India",
        image: "images/jaipur.jpg",
        description:
            "Jaipur, the Pink City, is celebrated for royal architecture, historic forts, traditional crafts and vibrant markets. It is a wonderful place to explore Rajasthan's cultural heritage.",
        highlights: [
            "Amber Fort",
            "Hawa Mahal",
            "City Palace"
        ],
        officialUrl: "https://tourism.rajasthan.gov.in/"
    },

    mumbai: {
        name: "Mumbai",
        location: "Maharashtra, India",
        image: "images/mumbai.jpg",
        description:
            "Mumbai combines historic landmarks, coastal promenades, diverse food and energetic city life. Explore its waterfront, cultural attractions and famous neighborhoods.",
        highlights: [
            "Gateway of India",
            "Marine Drive",
            "Chhatrapati Shivaji Maharaj Terminus"
        ],
        officialUrl: "https://maharashtratourism.gov.in/"
    }
};

const destinationDialog = getElement("destinationDialog");
const dialogClose = getElement("dialogClose");
const dialogImage = getElement("dialogImage");
const dialogLocation = getElement("dialogLocation");
const dialogTitle = getElement("dialogTitle");
const dialogDescription = getElement("dialogDescription");
const dialogHighlights = getElement("dialogHighlights");
const officialTourismLink = getElement("officialTourismLink");

function openDestinationDetails(destinationKey) {
    const destination = destinationInformation[destinationKey];

    if (!destination || !destinationDialog) return;

    if (
        !dialogImage ||
        !dialogLocation ||
        !dialogTitle ||
        !dialogDescription ||
        !dialogHighlights ||
        !officialTourismLink
    ) {
        showToast("Destination details are currently unavailable.");
        return;
    }

    dialogImage.style.backgroundImage =
        `url("${destination.image}")`;

    dialogLocation.textContent = destination.location;
    dialogTitle.textContent = destination.name;
    dialogDescription.textContent = destination.description;

    dialogHighlights.replaceChildren();

    destination.highlights.forEach((highlight) => {
        const item = document.createElement("li");
        item.textContent = highlight;
        dialogHighlights.appendChild(item);
    });

    officialTourismLink.href = destination.officialUrl;

    if (typeof destinationDialog.showModal === "function") {
        destinationDialog.showModal();
    } else {
        showToast("Please use a modern browser to view destination details.");
    }
}

document.querySelectorAll("[data-destination]").forEach((button) => {
    button.addEventListener("click", () => {
        openDestinationDetails(button.dataset.destination);
    });
});

if (dialogClose && destinationDialog) {
    dialogClose.addEventListener("click", () => {
        destinationDialog.close();
    });
}

if (destinationDialog) {
    destinationDialog.addEventListener("click", (event) => {
        if (event.target === destinationDialog) {
            destinationDialog.close();
        }
    });
}

/* ---------- 8. TRAVEL TIPS ROTATOR ---------- */

const travelTips = [
    {
        title: "Pack Light",
        text: "Carry the essentials, check the weather and leave a little space for souvenirs."
    },
    {
        title: "Plan Ahead",
        text: "Research transport, accommodation and opening hours before starting your journey."
    },
    {
        title: "Respect Local Culture",
        text: "Learn about local customs, dress respectfully where required and ask before taking people's photos."
    },
    {
        title: "Stay Hydrated",
        text: "Carry drinking water, take breaks and prepare for the climate at your destination."
    },
    {
        title: "Keep Documents Safe",
        text: "Keep important travel documents secure and maintain accessible copies when appropriate."
    },
    {
        title: "Explore Responsibly",
        text: "Reduce waste, respect wildlife and help keep natural and historic places clean."
    }
];

const tipNumber = getElement("tipNumber");
const tipTitle = getElement("tipTitle");
const tipText = getElement("tipText");
const nextTip = getElement("nextTip");

let currentTipIndex = 0;

function displayTravelTip(index) {
    const tip = travelTips[index];

    if (!tip) return;

    if (tipNumber) {
        tipNumber.textContent = `TIP ${String(index + 1).padStart(2, "0")}`;
    }

    if (tipTitle) {
        tipTitle.textContent = tip.title;
    }

    if (tipText) {
        tipText.textContent = tip.text;
    }
}

if (nextTip) {
    nextTip.addEventListener("click", () => {
        currentTipIndex = (currentTipIndex + 1) % travelTips.length;

        displayTravelTip(currentTipIndex);
    });
}

/* ---------- 9. TRAVEL STYLE QUIZ ---------- */

const quizOptions = getElement("quizOptions");
const quizResult = getElement("quizResult");

const quizRecommendations = {
    nature: {
        title: "You're a Mountain Explorer! 🏔️",
        message:
            "You might enjoy Manali for Himalayan scenery or Kerala for lush green landscapes."
    },

    beach: {
        title: "You're a Beach Lover! 🏖️",
        message:
            "Goa could be a great match for coastal views, beach walks and relaxing sunsets."
    },

    culture: {
        title: "You're a Culture Seeker! 🏛️",
        message:
            "Agra and Jaipur offer remarkable historic landmarks, architecture and cultural experiences."
    },

    city: {
        title: "You're a City Explorer! 🌆",
        message:
            "Mumbai is worth exploring for its waterfront, city landmarks, neighborhoods and food."
    }
};

if (quizOptions && quizResult) {
    quizOptions.addEventListener("click", (event) => {
        const button = event.target.closest("[data-style]");

        if (!button) return;

        quizOptions.querySelectorAll(".quiz-option").forEach((option) => {
            const isSelected = option === button;

            option.classList.toggle("selected", isSelected);
            option.setAttribute("aria-pressed", String(isSelected));
        });

        const recommendation = quizRecommendations[button.dataset.style];

        if (!recommendation) return;

        quizResult.replaceChildren();

        const heading = document.createElement("strong");
        heading.textContent = recommendation.title;

        const paragraph = document.createElement("p");
        paragraph.textContent = recommendation.message;
        paragraph.style.marginTop = "8px";

        quizResult.append(heading, paragraph);
    });
}

/* ---------- 10. TRIP PLANNER ---------- */

const tripForm = getElement("tripForm");
const plannerResult = getElement("plannerResult");

const tripSuggestions = {
    agra: {
        name: "Agra",
        activities: [
            "Visit the Taj Mahal",
            "Explore Agra Fort",
            "Enjoy local food and explore the markets"
        ]
    },

    goa: {
        name: "Goa",
        activities: [
            "Explore a beach and enjoy the coastline",
            "Discover local heritage and markets",
            "Try regional food and enjoy a sunset"
        ]
    },

    kerala: {
        name: "Kerala",
        activities: [
            "Explore the local scenery and gardens",
            "Discover backwaters or a nearby cultural attraction",
            "Enjoy Kerala cuisine and a relaxed day"
        ]
    },

    manali: {
        name: "Manali",
        activities: [
            "Explore Manali town",
            "Visit a nearby scenic valley, weather permitting",
            "Discover local markets and mountain viewpoints"
        ]
    },

    jaipur: {
        name: "Jaipur",
        activities: [
            "Visit Amber Fort",
            "Explore Hawa Mahal and nearby heritage areas",
            "Discover local crafts and Rajasthani food"
        ]
    },

    mumbai: {
        name: "Mumbai",
        activities: [
            "Visit the Gateway of India",
            "Explore Marine Drive",
            "Discover local neighborhoods and street food"
        ]
    }
};

if (tripForm && plannerResult) {
    tripForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const destinationKey = getElement("tripDestination").value;
        const days = Number(getElement("tripDays").value);
        const style = getElement("tripStyle").value;

        const destination = tripSuggestions[destinationKey];

        if (!destination || !Number.isInteger(days) || days < 1) {
            showToast("Please select a valid destination and trip duration.");
            return;
        }

        const styleSuggestions = {
            relaxed: "Allow extra time for breaks, scenic stops and rest.",
            adventure: "Research suitable activities, weather and safety requirements.",
            culture: "Check local museums, monuments and heritage-site opening hours.",
            food: "Explore regional specialties and choose clean, reputable food outlets."
        };

        const heading = document.createElement("h4");
        heading.textContent = `Your ${days}-Day ${destination.name} Plan`;

        const introduction = document.createElement("p");
        introduction.textContent =
            `Travel style: ${style.charAt(0).toUpperCase() + style.slice(1)}.`;

        const list = document.createElement("ul");

        for (let day = 1; day <= days; day++) {
            const item = document.createElement("li");
            const activity = destination.activities[(day - 1) % destination.activities.length];

            item.textContent = `Day ${day}: ${activity}.`;
            list.appendChild(item);
        }

        const advice = document.createElement("p");
        advice.textContent = styleSuggestions[style] ||
            "Check local conditions and opening hours before travelling.";

        const disclaimer = document.createElement("p");
        disclaimer.textContent =
            "Suggested itinerary only. Check transport, local conditions, timings and bookings before your trip.";

        plannerResult.replaceChildren(
            heading,
            introduction,
            list,
            advice,
            disclaimer
        );

        plannerResult.hidden = false;

        plannerResult.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

        showToast("Your trip plan is ready! ✈️");
    });
}

/* ---------- 11. PACKING CHECKLIST ---------- */

const packingList = getElement("packingList");
const packingCount = getElement("packingCount");
const packingProgress = getElement("packingProgress");

function updatePackingProgress() {
    if (!packingList) return;

    const checkboxes = Array.from(
        packingList.querySelectorAll('input[type="checkbox"]')
    );

    const total = checkboxes.length;

    const checked = checkboxes.filter((checkbox) => checkbox.checked).length;

    if (packingCount) {
        packingCount.textContent = `${checked} / ${total}`;
    }

    if (packingProgress) {
        const percentage = total === 0 ? 0 : (checked / total) * 100;

        packingProgress.style.width = `${percentage}%`;
        packingProgress.setAttribute("role", "progressbar");
        packingProgress.setAttribute("aria-valuemin", "0");
        packingProgress.setAttribute("aria-valuemax", String(total));
        packingProgress.setAttribute("aria-valuenow", String(checked));
    }
}

if (packingList) {
    packingList.addEventListener("change", (event) => {
        if (event.target.matches('input[type="checkbox"]')) {
            updatePackingProgress();
        }
    });

    updatePackingProgress();
}

/* ---------- 12. CONTACT FORM VALIDATION ---------- */

const contactForm = getElement("contactForm");
const contactFeedback = getElement("contactFeedback");

if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = getElement("contactName").value.trim();
        const email = getElement("contactEmail").value.trim();
        const subject = getElement("contactSubject").value.trim();
        const message = getElement("contactMessage").value.trim();

        if (
            name.length < 2 ||
            subject.length < 1 ||
            message.length < 10 ||
            !email
        ) {
            contactFeedback.textContent =
                "Please complete all fields with valid information.";

            contactFeedback.className = "form-message error";
            return;
        }

        contactFeedback.textContent =
            `Thanks, ${name}! Your form passed validation. This demo does not send messages to a server.`;

        contactFeedback.className = "form-message success";

        showToast("Contact form validated successfully!");

        contactForm.reset();
    });
}

/* ---------- 13. BACK TO TOP BUTTON ---------- */

const backToTop = getElement("backToTop");

if (backToTop) {
    const updateBackToTop = () => {
        backToTop.classList.toggle("visible", window.scrollY > 450);
    };

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ---------- 14. IMAGE FALLBACK ---------- */

// If a local image filename is missing, show a readable fallback
// instead of leaving a broken image icon.

document.querySelectorAll(".card-image img").forEach((image) => {
    image.addEventListener("error", () => {
        image.style.display = "none";

        const cardImage = image.closest(".card-image");

        if (cardImage) {
            cardImage.style.background =
                "linear-gradient(135deg, #d9e9de, #b9d4c3)";
        }

        console.warn("TravelVista could not load image:", image.src);
    }, { once: true });
});

/* ---------- 15. INITIALIZE WEBSITE ---------- */

filterDestinations();
displayTravelTip(currentTipIndex);

console.log("TravelVista initialized successfully! ✈️");