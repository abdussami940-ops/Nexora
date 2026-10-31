document.addEventListener("DOMContentLoaded", () => {
    // --- 1. User Profile & Auth Modal ---
    const openAuthBtn = document.getElementById("openAuthModalBtn");
    const closeAuthBtn = document.getElementById("closeAuthModalBtn");
    const authModal = document.getElementById("authModal");
    const authForm = document.getElementById("authForm");
    const userBadge = document.getElementById("userProfileBadge");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const userAvatar = document.getElementById("userAvatar");

    function checkUserAuth() {
        const savedUser = JSON.parse(localStorage.getItem("nexoraUser"));
        if (savedUser && savedUser.name) {
            openAuthBtn.hidden = true;
            userBadge.hidden = false;
            userNameDisplay.textContent = savedUser.name.split(" ")[0];
            userAvatar.textContent = savedUser.name.charAt(0).toUpperCase();
        }
    }

    if (openAuthBtn) openAuthBtn.addEventListener("click", () => authModal.hidden = false);
    if (closeAuthBtn) closeAuthBtn.addEventListener("click", () => authModal.hidden = true);

    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("authName").value;
            const email = document.getElementById("authEmail").value;
            
            localStorage.setItem("nexoraUser", JSON.stringify({ name, email }));
            authModal.hidden = true;
            checkUserAuth();
        });
    }

    checkUserAuth();

    // --- 2. Live Topic Search & Category Filters ---
    const searchInput = document.getElementById("siteSearch");
    const categoryChips = document.querySelectorAll(".category-chip");
    const cards = document.querySelectorAll(".topic-card");
    const emptyState = document.getElementById("emptyState");

    function filterTopics() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const activeChip = document.querySelector(".category-chip.active");
        const category = activeChip ? activeChip.getAttribute("data-category") : "all";

        let visibleCount = 0;

        cards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            const cardSearchText = card.getAttribute("data-search").toLowerCase();

            const matchesCategory = category === "all" || cardCategory === category;
            const matchesSearch = query === "" || cardSearchText.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (emptyState) emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }

    if (searchInput) searchInput.addEventListener("input", filterTopics);

    categoryChips.forEach(chip => {
        chip.addEventListener("click", () => {
            categoryChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            filterTopics();
        });
    });

    // --- 3. Topic Bookmarking System ---
    const bookmarkBtns = document.querySelectorAll(".bookmark-btn");

    bookmarkBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("saved");
            btn.style.color = btn.classList.contains("saved") ? "#66e7e8" : "inherit";
        });
    });

    // --- 4. Daily Discovery Randomizer ---
    const facts = [
        { title: "Your brain adapts as you learn.", text: "Learning strengthens connections between neurons, a process called neuroplasticity." },
        { title: "Honey never spoils.", text: "Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible." },
        { title: "Light takes time to reach us.", text: "Sunlight takes about 8 minutes and 20 seconds to travel from the Sun to Earth." }
    ];

    let currentFactIndex = 0;
    const newFactBtn = document.getElementById("newFactButton");
    
    if (newFactBtn) {
        newFactBtn.addEventListener("click", () => {
            currentFactIndex = (currentFactIndex + 1) % facts.length;
            document.getElementById("factNumber").textContent = `DISCOVERY / 00${currentFactIndex + 1}`;
            document.getElementById("factTitle").textContent = facts[currentFactIndex].title;
            document.getElementById("factText").textContent = facts[currentFactIndex].text;
        });
    }
});