/**
 * NewsGram JavaScript
 * Fetches news from Google Sheets and renders it with filtering and sorting
 * Runs only in a browser environment
 */

// Prevent execution in non-browser environments
if (typeof window === 'undefined') {
    console.error('This script is designed to run in a browser environment.');
  } else {
  
  const sheetID = "1Wy6rzaCALqPLFx079nqBCDRP7dk3au5eRO4GuMwQ8Sk";
  const apiKey = "AIzaSyC8D-4bl3GDyj_--BGG1pPdO5Bz63r5iXI";
  const sheetName = "Sheet1";
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?alt=json&key=${apiKey}`;
  
  // State
  let allNews = [];
  let activeCategory = null;
  
  // DOM Elements
  const newsContainer = document.getElementById("newsContainer");
  const sidebar = document.getElementById("sidebarCategories");
  const bottomNav = document.getElementById("bottomNav");
  const errorMessage = document.getElementById("errorMessage");
  const searchSortContainer = document.getElementById("searchSortContainer");
  const mobileSearchContainer = document.getElementById("mobileSearchContainer");
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const searchToggle = document.getElementById("searchToggle");
  const newsHeading = document.getElementById("newsHeading");
  
  // Categories
  const categories = [
    { name: "Tech", icon: "📱", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>` },
    { name: "World", icon: "🌍", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
    { name: "Sports", icon: "🏅", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>` },
    { name: "Politics", icon: "🏛️", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 0112 0V7a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2" /></svg>` },
    { name: "Entertainment", icon: "🎬", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>` },
    { name: "Cricket", icon: "🏏", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V15h5.488" /></svg>` },
    { name: "IPL", icon: "🔥", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A8 8 0 0117.657 18.657z" /></svg>` },
    { name: "Shorts", icon: "🎞️", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }
  ];
  
  // Mobile-specific categories
  const mobileCategories = [
    { name: "World", icon: "🌍", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
    { name: "Tech", icon: "📱", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>` },
    { name: "Shorts", icon: "🎞️", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
    { name: "IPL", icon: "🔥", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A8 8 0 0117.657 18.657z" /></svg>` },
    { name: "Cricket", icon: "🏏", mobileIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V15h5.488" /></svg>` }
  ];
  
  // Cache for API responses
  const CACHE_KEY = 'newsData';
  const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour
  
  /**
   * Renders the sidebar with category buttons for desktop
   */
  function renderSidebar() {
    sidebar.innerHTML = categories.map(cat => `
      <li>
        <button 
          onclick="selectCategory('${cat.name}')" 
          class="w-full text-left px-3 py-2 rounded-md hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 transition-colors ${
            activeCategory === cat.name ? 'bg-blue-600 text-white' : 'text-gray-800'
          }"
          aria-label="Select ${cat.name} category"
        >
          ${cat.icon} ${cat.name}
        </button>
      </li>
    `).join('');
  }
  
  /**
   * Renders the bottom navigation for mobile/tablet
   */
  function renderBottomNav() {
    bottomNav.innerHTML = mobileCategories.map(cat => `
      <button 
        onclick="selectCategory('${cat.name}')" 
        class="bottom-nav-item flex-1 py-2 ${activeCategory === cat.name ? 'active' : ''}"
        aria-label="Select ${cat.name} category"
      >
        ${cat.mobileIcon}
        <span>${cat.name}</span>
      </button>
    `).join('');
  }
  
  /**
   * Selects a category and re-renders news
   * @param {string} category - The category name
   */
  function selectCategory(category) {
    activeCategory = category;
    renderSidebar();
    renderBottomNav();
    renderNews();
  }
  
  /**
   * Fetches news from Google Sheets API with caching
   */
  async function fetchNews() {
    errorMessage.classList.add("hidden");
  
    // Check cache
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTime = localStorage.getItem(`${CACHE_KEY}_time`);
    const now = new Date().getTime();
  
    if (cachedData && cacheTime && (now - cacheTime < CACHE_EXPIRY)) {
      allNews = JSON.parse(cachedData);
      renderSidebar();
      renderBottomNav();
      renderNews();
      return;
    }
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      const rows = data.values;
      const headers = rows[0];
      const newsData = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = row[index]?.trim() || "";
        });
        return obj;
      });
  
      allNews = newsData;
      
      // Cache the data
      localStorage.setItem(CACHE_KEY, JSON.stringify(allNews));
      localStorage.setItem(`${CACHE_KEY}_time`, now);
  
      renderSidebar();
      renderBottomNav();
      renderNews();
    } catch (error) {
      console.error("Failed to fetch news:", error);
      errorMessage.classList.remove("hidden");
      errorMessage.textContent = "Failed to load news. Please try again later.";
      newsContainer.innerHTML = "";
    }
  }
  
  /**
   * Toggles the mobile search input visibility
   */
  function toggleMobileSearch() {
    mobileSearchContainer.classList.toggle('hidden');
    if (!mobileSearchContainer.classList.contains('hidden')) {
      mobileSearchInput.focus();
    }
  }
  
  /**
   * Renders news cards with lazy loading
   */
  function renderNews() {
    const query = (window.innerWidth < 1024 ? mobileSearchInput.value : document.getElementById("searchInput").value).toLowerCase();
    const sortBy = document.getElementById("sortBy").value;
  
    // Toggle heading visibility
    if (activeCategory === "Shorts") {
      newsHeading.classList.add('hidden');
    } else {
      newsHeading.classList.remove('hidden');
    }
  
    let filteredNews = allNews.filter(item =>
      (activeCategory !== "Shorts" && (!activeCategory || (item.Category && item.Category.toLowerCase() === activeCategory.toLowerCase()))) &&
      (item.Headline?.toLowerCase().includes(query) || item.Description?.toLowerCase().includes(query))
    );
  
    if (sortBy === "latest" && activeCategory !== "Shorts") {
      filteredNews.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    } else if (sortBy === "oldest" && activeCategory !== "Shorts") {
      filteredNews.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    }
  
    if (activeCategory === "Shorts") {
      newsContainer.classList.add('shorts-container');
      newsContainer.innerHTML = allNews.length
        ? allNews.map((news, index) => `
            <div class="shorts-card transition-opacity opacity-0 animate-fade-in" style="animation-delay: ${index * 100}ms">
              ${news.Image ? `<img src="${news.Image}" alt="${news.Headline}" loading="lazy" />` : ''}
              <span class="category-badge mb-2">${news.Category}</span>
              <h2>${news.Headline}</h2>
              <p class="description">${news.Description}</p>
              <p class="date">${news.Source} • ${news.Date}</p>
            </div>
          `).join("")
        : `<p class="text-center text-gray-500">No news found.</p>`;
    } else {
      newsContainer.classList.remove('shorts-container');
      newsContainer.innerHTML = filteredNews.length
        ? filteredNews.map((news, index) => `
            <div class="news-card bg-white rounded-lg shadow-sm p-5 border transition-opacity opacity-0 animate-fade-in" style="animation-delay: ${index * 100}ms">
              ${news.Image ? `<img src="${news.Image}" alt="${news.Headline}" loading="lazy" class="mb-4" />` : ''}
              <span class="category-badge mb-2">${news.Category}</span>
              <h2 class="text-xl font-semibold mb-1 leading-tight">${news.Headline}</h2>
              <p class="text-sm text-gray-600 mb-2">${news.Source} • ${news.Date}</p>
              <p class="text-gray-700 mb-3 leading-relaxed">${news.Description}</p>
              <a href="${news.Link}" target="_blank" class="text-blue-600 hover:underline font-semibold" aria-label="Read more about ${news.Headline}">Read More →</a>
            </div>
          `).join("")
        : `<p class="text-center text-gray-500">No news found.</p>`;
    }
  
    // Lazy load images
    lazyLoad();
  }
  
  /**
   * Lazy loads elements (images and cards)
   */
  function lazyLoad() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          observer.unobserve(entry.target);
        }
      });
    });
  
    document.querySelectorAll('.animate-fade-in').forEach(element => {
      observer.observe(element);
    });
  }
  
  /**
   * Filters and re-renders news based on search and sort
   */
  function filterNews() {
    renderNews();
  }
  
  /**
   * Handles keyboard shortcuts for Shorts navigation on desktop
   */
  function handleShortsNavigation(event) {
    if (activeCategory !== "Shorts" || window.innerWidth < 1024) return;
  
    const shortsCards = document.querySelectorAll('.shorts-card');
    if (!shortsCards.length) return;
  
    let currentIndex = -1;
    shortsCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
        currentIndex = index;
      }
    });
  
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 'j') {
      event.preventDefault();
      const nextIndex = Math.min(currentIndex + 1, shortsCards.length - 1);
      shortsCards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const prevIndex = Math.max(currentIndex - 1, 0);
      shortsCards[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  // Initialize
  fetchNews();
  
  // Add keyboard support for search
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      filterNews();
    }
  });
  
  document.getElementById('mobileSearchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      filterNews();
    }
  });
  
  // Add search toggle handler
  searchToggle.addEventListener('click', toggleMobileSearch);
  
  // Add keyboard shortcuts for Shorts navigation
  document.addEventListener('keydown', handleShortsNavigation);
  
  } // End browser-only block