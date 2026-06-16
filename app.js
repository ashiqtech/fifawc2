// FIFA World Cup 2026 Web App Logic

// Local State
let appState = {
    matches: [],
    teams: [],
    articles: [],
    likedArticles: [],
    activeTab: 'dashboard',
    selectedGroup: 'G', // Default group to show
    soundOn: true
};

// Web Audio API Sound Synthesizer (for professional UI sounds)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!appState.soundOn) return;
    
    // Resume context if suspended (browser security policies)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
        // Subtle soft click/pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
    } else if (type === 'success') {
        // High fidelity double chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.setValueAtTime(0.05, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'goal') {
        // Retro synth stadium roar/alert
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.linearRampToValueAtTime(440, now + 0.15); // A4
        osc.frequency.linearRampToValueAtTime(330, now + 0.3); // E4
        gainNode.gain.setValueAtTime(0.04, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
    } else if (type === 'modal') {
        // Smooth swell for modal open
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15); // C5
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State from data.js & localStorage
    appState.matches = [...WC_MATCHES];
    appState.teams = [...WC_TEAMS];
    
    const storedArticles = localStorage.getItem('wc_articles');
    if (storedArticles) {
        appState.articles = JSON.parse(storedArticles);
    } else {
        appState.articles = [...INITIAL_ARTICLES];
        localStorage.setItem('wc_articles', JSON.stringify(appState.articles));
    }

    const storedLikes = localStorage.getItem('wc_liked_articles');
    if (storedLikes) {
        appState.likedArticles = JSON.parse(storedLikes);
    }
    
    const storedSound = localStorage.getItem('wc_sound_on');
    if (storedSound !== null) {
        appState.soundOn = storedSound === 'true';
        updateSoundToggleUI();
    }

    // 2. Setup Event Listeners
    setupEventListeners();

    // 3. Start Live Match Score Simulation
    startLiveSimulation();

    // 4. Setup Router & Load Initial Tab
    initRouter();
    
    // 5. Populate Venue Filter options in Schedule tab
    populateVenueFilterDropdown();
});

// Event Listeners Binding
function setupEventListeners() {
    // Nav links router hook up
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            playSound('click');
        });
    });

    // Sound toggle button
    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        appState.soundOn = !appState.soundOn;
        localStorage.setItem('wc_sound_on', appState.soundOn);
        updateSoundToggleUI();
        playSound('click');
    });

    // Global Search Input
    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('input', (e) => {
        handleGlobalSearch(e.target.value);
    });

    // Dashboard Quick Standings Group Selector
    document.getElementById('quick-group-select').addEventListener('change', (e) => {
        playSound('click');
        renderQuickStandings(e.target.value);
    });

    // Reset Schedule Filters
    document.getElementById('btn-reset-filters').addEventListener('click', () => {
        playSound('click');
        document.getElementById('filter-stage').value = 'all';
        document.getElementById('filter-venue').value = 'all';
        document.getElementById('filter-search').value = '';
        renderSchedule();
    });

    // Bind filters on Schedule tab
    document.getElementById('filter-stage').addEventListener('change', () => { playSound('click'); renderSchedule(); });
    document.getElementById('filter-venue').addEventListener('change', () => { playSound('click'); renderSchedule(); });
    document.getElementById('filter-search').addEventListener('input', () => renderSchedule());

    // Blog Category filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            playSound('click');
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            renderBlogGrid(e.currentTarget.dataset.category);
        });
    });

    // Modals Close binds
    document.getElementById('btn-close-article-modal').addEventListener('click', () => closeModal('modal-article'));
    document.getElementById('btn-close-writer-modal').addEventListener('click', () => closeModal('modal-writer'));
    document.getElementById('btn-close-venue-modal').addEventListener('click', () => closeModal('modal-venue'));
    
    // Cancel Writer Button
    document.getElementById('btn-cancel-writer').addEventListener('click', () => closeModal('modal-writer'));

    // Open Writer Modal
    document.getElementById('btn-open-writer').addEventListener('click', () => {
        playSound('modal');
        openModal('modal-writer');
    });

    // Write Post Form Submit
    document.getElementById('form-publish-article').addEventListener('submit', (e) => {
        e.preventDefault();
        publishArticle();
    });

    // Comment Form Submit
    document.getElementById('form-submit-comment').addEventListener('submit', (e) => {
        e.preventDefault();
        submitComment();
    });

    // Like Button inside Modal
    document.getElementById('btn-like-article').addEventListener('click', () => {
        toggleLikeArticle();
    });
}

// Sound toggle UI updates
function updateSoundToggleUI() {
    const iconOn = document.getElementById('icon-sound-on');
    const iconOff = document.getElementById('icon-sound-off');
    if (appState.soundOn) {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
    } else {
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
    }
}

// Router
function initRouter() {
    const handleRoute = () => {
        const hash = window.location.hash || '#/dashboard';
        const tabName = hash.replace('#/', '');
        
        // Find corresponding nav item
        const navItem = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
        if (navItem) {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');
            
            // Switch tabs
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const targetPane = document.getElementById(tabName);
            if (targetPane) {
                targetPane.classList.add('active');
            }
            
            appState.activeTab = tabName;
            
            // Render Tab contents dynamically
            renderCurrentTab(tabName);
        }
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Call once on load
}

function renderCurrentTab(tab) {
    switch (tab) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'standings':
            renderGroupGridSelector();
            renderFullStandings(appState.selectedGroup);
            break;
        case 'schedule':
            renderSchedule();
            break;
        case 'venues':
            renderVenues();
            break;
        case 'blog':
            const activeCategory = document.querySelector('.category-btn.active').dataset.category || 'all';
            renderBlogGrid(activeCategory);
            break;
    }
}

// Global search bar handler
function handleGlobalSearch(query) {
    if (!query) return;
    const cleanQuery = query.toLowerCase().trim();

    if (appState.activeTab === 'schedule') {
        document.getElementById('filter-search').value = query;
        renderSchedule();
    } else if (appState.activeTab === 'blog') {
        renderBlogGrid(document.querySelector('.category-btn.active').dataset.category, cleanQuery);
    } else if (appState.activeTab === 'venues') {
        renderVenues(cleanQuery);
    } else if (appState.activeTab === 'standings') {
        // Search group of team
        const foundTeam = appState.teams.find(t => t.name.toLowerCase().includes(cleanQuery));
        if (foundTeam) {
            appState.selectedGroup = foundTeam.group;
            renderFullStandings(foundTeam.group);
            // Highlight active group button
            document.querySelectorAll('.group-btn').forEach(btn => {
                if (btn.dataset.group === foundTeam.group) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }
    }
}

// Populate Venue dropdown on schedule
function populateVenueFilterDropdown() {
    const dropdown = document.getElementById('filter-venue');
    dropdown.innerHTML = '<option value="all">All Venues</option>';
    
    // Sort venues by city name
    const sortedVenues = [...WC_VENUES].sort((a, b) => a.city.localeCompare(b.city));
    
    sortedVenues.forEach(v => {
        const option = document.createElement('option');
        option.value = v.stadium;
        option.textContent = `${v.city} - ${v.stadium}`;
        dropdown.appendChild(option);
    });
}


// --- LIVE SCORE SIMULATION ENGINE ---
function startLiveSimulation() {
    setInterval(() => {
        let scoresChanged = false;
        let goalScored = false;
        let scoringTeam = "";

        appState.matches.forEach(m => {
            if (m.status === 'live') {
                // Increment minute
                m.minute += 1;
                if (m.minute >= 90) {
                    m.status = 'completed';
                    m.minute = null;
                    // Finalize stats on match completion
                    updateTeamStatsOnMatchCompletion(m);
                } else {
                    // 1.5% chance to score a goal every minute
                    if (Math.random() < 0.015) {
                        const randomHomeOrAway = Math.random() < 0.5;
                        if (randomHomeOrAway) {
                            m.homeScore += 1;
                            scoringTeam = getTeamName(m.home);
                        } else {
                            m.awayScore += 1;
                            scoringTeam = getTeamName(m.away);
                        }
                        
                        goalScored = true;
                        m.details = `GOAL! ${scoringTeam} scores in the ${m.minute}' minute to change the score line. The stadium is electric!`;
                    }
                }
                scoresChanged = true;
            }
        });

        if (scoresChanged) {
            // Recalculate standings including live match results
            recalculateStandings();

            // Re-render views if active
            if (appState.activeTab === 'dashboard') {
                renderLiveMatchesList();
                renderQuickStandings(document.getElementById('quick-group-select').value);
            } else if (appState.activeTab === 'standings') {
                renderFullStandings(appState.selectedGroup);
            } else if (appState.activeTab === 'schedule') {
                renderSchedule();
            }

            // Update topbar ticker
            updateTopbarTicker();

            if (goalScored) {
                playSound('goal');
                showGoalToast(scoringTeam);
            }
        }
    }, 8000); // Check/update simulation every 8 seconds
}

// Temporary Toast Notification for Live Goals
function showGoalToast(team) {
    const toast = document.createElement('div');
    toast.className = 'goal-toast';
    toast.innerHTML = `
        <div class="toast-g-content">
            <span class="toast-pulse"></span>
            <strong>GOAL!</strong> ${team} has scored!
        </div>
    `;
    document.body.appendChild(toast);
    
    // CSS for toast added programmatically if not in file
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = 'var(--bg-modal)';
    toast.style.border = '2px solid var(--accent-green)';
    toast.style.boxShadow = '0 0 25px rgba(0, 255, 135, 0.4)';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.zIndex = '9999';
    toast.style.animation = 'slideUp 0.3s ease-out';
    toast.style.color = '#fff';
    toast.style.fontFamily = 'Outfit';
    toast.style.fontSize = '15px';
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// Update Topbar Ticker content
function updateTopbarTicker() {
    const ticker = document.getElementById('live-ticker');
    let tickerHtml = '';
    
    appState.matches.forEach(m => {
        const homeFlag = getTeamFlag(m.home);
        const awayFlag = getTeamFlag(m.away);
        if (m.status === 'live') {
            tickerHtml += `<span>${homeFlag} ${m.home} ${m.homeScore} - ${m.awayScore} ${m.away} ${awayFlag} (${m.minute}')</span>`;
        } else if (m.status === 'completed' && isRecentMatch(m.date)) {
            tickerHtml += `<span>${homeFlag} ${m.home} ${m.homeScore} - ${m.awayScore} ${m.away} ${awayFlag} (FT)</span>`;
        }
    });

    // Fallback if no live matches
    if (!tickerHtml) {
        tickerHtml = `
            <span>🏆 FIFA World Cup 2026 Live Hub</span>
            <span>📍 Co-hosted by Canada, Mexico & USA</span>
            <span>⚽ 48 Teams, 12 Groups, 104 Matches</span>
        `;
    }

    ticker.innerHTML = tickerHtml + tickerHtml; // Double up for infinite seamless scroll
}

function isRecentMatch(matchDate) {
    // Simplification: Matches played on or after June 11, 2026
    return new Date(matchDate) >= new Date('2026-06-11');
}

// Recalculates standings based on completed & live matches
function recalculateStandings() {
    // Reset standings stats
    appState.teams = appState.teams.map(t => {
        return {
            id: t.id, name: t.name, group: t.group, flag: t.flag,
            p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: []
        };
    });

    // Populate stats from ALL matches
    appState.matches.forEach(m => {
        if (m.status === 'completed' || m.status === 'live') {
            const home = appState.teams.find(t => t.id === m.home);
            const away = appState.teams.find(t => t.id === m.away);
            
            if (home && away) {
                home.p += 1;
                away.p += 1;
                home.gf += m.homeScore;
                home.ga += m.awayScore;
                away.gf += m.awayScore;
                away.ga += m.homeScore;
                
                if (m.homeScore > m.awayScore) {
                    home.w += 1;
                    home.pts += 3;
                    home.form.push('W');
                    
                    away.l += 1;
                    away.form.push('L');
                } else if (m.homeScore < m.awayScore) {
                    away.w += 1;
                    away.pts += 3;
                    away.form.push('W');
                    
                    home.l += 1;
                    home.form.push('L');
                } else {
                    home.d += 1;
                    home.pts += 1;
                    home.form.push('D');
                    
                    away.d += 1;
                    away.pts += 1;
                    away.form.push('D');
                }

                home.gd = home.gf - home.ga;
                away.gd = away.gf - away.ga;
            }
        }
    });
}

function updateTeamStatsOnMatchCompletion(m) {
    // Matches finished are saved to matches array in state
    m.details = `Final Whistle! The match ended ${getTeamName(m.home)} ${m.homeScore} - ${m.awayScore} ${getTeamName(m.away)}. What a performance!`;
}

// Helper methods to get flags and names
function getTeamName(teamId) {
    const team = appState.teams.find(t => t.id === teamId);
    return team ? team.name : teamId;
}

function getTeamFlag(teamId) {
    const team = appState.teams.find(t => t.id === teamId);
    return team ? team.flag : "🏳️";
}


// --- TAB RENDERERS ---

// 1. Dashboard Tab
function renderDashboard() {
    renderLiveMatchesList();
    renderQuickStandings(document.getElementById('quick-group-select').value);
    
    // Render Trending Articles (top 3 with most likes)
    const sortedArticles = [...appState.articles].sort((a, b) => b.likes - a.likes).slice(0, 3);
    const trendingGrid = document.getElementById('trending-articles-grid');
    
    let html = '';
    sortedArticles.forEach(art => {
        html += `
            <div class="article-card">
                <div class="article-img-wrap">
                    <div class="article-img" style="background-image: url('${art.image}')"></div>
                    <span class="badge article-card-badge">${art.category}</span>
                </div>
                <div class="article-card-content">
                    <div class="article-card-meta">
                        <span>${art.date}</span>
                        <span>By ${art.author}</span>
                    </div>
                    <h4 class="article-card-title">${art.title}</h4>
                    <p class="article-card-desc">${art.summary}</p>
                    <div class="article-card-footer">
                        <div class="article-likes">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>${art.likes}</span>
                        </div>
                        <button class="read-more-btn" onclick="viewArticleDetails('${art.id}')">
                            Read More
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    trendingGrid.innerHTML = html;
    updateTopbarTicker();
}

function renderLiveMatchesList() {
    const listContainer = document.getElementById('live-matches-list');
    let html = '';
    
    const liveMatches = appState.matches.filter(m => m.status === 'live');
    const upcomingToday = appState.matches.filter(m => m.status === 'upcoming').slice(0, 2);
    
    if (liveMatches.length > 0) {
        liveMatches.forEach(m => {
            const homeName = getTeamName(m.home);
            const homeFlag = getTeamFlag(m.home);
            const awayName = getTeamName(m.away);
            const awayFlag = getTeamFlag(m.away);
            
            html += `
                <div class="match-card">
                    <div class="match-card-meta">
                        <span class="group-tag">Group ${m.group} Match</span>
                        <span class="live-indicator">
                            <span class="dot"></span>
                            Live ${m.minute}'
                        </span>
                    </div>
                    <div class="match-card-teams">
                        <div class="match-team home">
                            <span class="team-flag-em">${homeFlag}</span>
                            <span class="team-name-str">${homeName}</span>
                        </div>
                        <div class="match-scores-disp">
                            <div class="score-box">${m.homeScore}</div>
                            <div class="score-divider-c">:</div>
                            <div class="score-box">${m.awayScore}</div>
                        </div>
                        <div class="match-team away">
                            <span class="team-flag-em">${awayFlag}</span>
                            <span class="team-name-str">${awayName}</span>
                        </div>
                    </div>
                    <div class="match-card-footer">
                        <span class="match-card-venue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            </svg>
                            ${m.venue}
                        </span>
                        <button class="btn-details-match" onclick="openMatchDetailsModal(${m.id})">Match Center &rarr;</button>
                    </div>
                </div>
            `;
        });
    }

    // Append upcoming matches to fill spacing
    if (upcomingToday.length > 0) {
        upcomingToday.forEach(m => {
            const homeName = getTeamName(m.home);
            const homeFlag = getTeamFlag(m.home);
            const awayName = getTeamName(m.away);
            const awayFlag = getTeamFlag(m.away);
            
            html += `
                <div class="match-card upcoming-card" style="opacity: 0.85;">
                    <div class="match-card-meta">
                        <span class="group-tag">Group ${m.group} Match</span>
                        <span class="upcoming-date">${m.date} | ${m.time}</span>
                    </div>
                    <div class="match-card-teams">
                        <div class="match-team home">
                            <span class="team-flag-em">${homeFlag}</span>
                            <span class="team-name-str">${homeName}</span>
                        </div>
                        <div class="match-scores-disp">
                            <span class="score-divider-c">VS</span>
                        </div>
                        <div class="match-team away">
                            <span class="team-flag-em">${awayFlag}</span>
                            <span class="team-name-str">${awayName}</span>
                        </div>
                    </div>
                    <div class="match-card-footer">
                        <span class="match-card-venue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            </svg>
                            ${m.venue}
                        </span>
                        <button class="btn-details-match" onclick="openMatchDetailsModal(${m.id})">Preview &rarr;</button>
                    </div>
                </div>
            `;
        });
    }

    listContainer.innerHTML = html || '<p class="txt-center">No matches scheduled for today.</p>';
}

function renderQuickStandings(group) {
    const tbody = document.getElementById('quick-standings-body');
    const filteredTeams = appState.teams.filter(t => t.group === group);
    
    // Sort
    sortTeams(filteredTeams);
    
    let html = '';
    filteredTeams.forEach(t => {
        html += `
            <tr>
                <td><strong>${t.flag} ${t.name}</strong></td>
                <td class="txt-center">${t.p}</td>
                <td class="txt-center">${t.gd > 0 ? '+' + t.gd : t.gd}</td>
                <td class="txt-center" style="color: var(--accent-cyan); font-weight: 700;">${t.pts}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// 2. Standings Tab
function renderGroupGridSelector() {
    const container = document.getElementById('group-buttons-container');
    if (container.children.length > 0) return; // Render once
    
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    
    groups.forEach(g => {
        const btn = document.createElement('button');
        btn.className = `group-btn ${g === appState.selectedGroup ? 'active' : ''}`;
        btn.dataset.group = g;
        btn.textContent = `GP ${g}`;
        
        btn.addEventListener('click', (e) => {
            playSound('click');
            document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.selectedGroup = g;
            renderFullStandings(g);
        });
        
        container.appendChild(btn);
    });
}

function renderFullStandings(group) {
    const standingsTitle = document.getElementById('standings-group-title');
    standingsTitle.textContent = `Group ${group} Standings`;
    
    const tbody = document.getElementById('full-standings-body');
    const filteredTeams = appState.teams.filter(t => t.group === group);
    
    // Sort
    sortTeams(filteredTeams);
    
    let html = '';
    filteredTeams.forEach((t, index) => {
        const pos = index + 1;
        let rowClass = '';
        if (pos <= 2) rowClass = 'row-qualify';
        else if (pos === 3) rowClass = 'row-potential';
        
        // Render form dots
        let formHtml = '';
        t.form.slice(-5).forEach(f => {
            formHtml += `<span class="form-dot ${f.toLowerCase()}">${f}</span>`;
        });
        
        html += `
            <tr class="${rowClass}">
                <td><span class="pos-badge">${pos}</span></td>
                <td><strong style="font-size: 15px;">${t.flag} ${t.name}</strong></td>
                <td class="txt-center">${t.p}</td>
                <td class="txt-center">${t.w}</td>
                <td class="txt-center">${t.d}</td>
                <td class="txt-center">${t.l}</td>
                <td class="txt-center">${t.gf}</td>
                <td class="txt-center">${t.ga}</td>
                <td class="txt-center">${t.gd > 0 ? '+' + t.gd : t.gd}</td>
                <td class="txt-center" style="font-weight: 800; font-size: 16px; color: ${pos <= 2 ? 'var(--accent-green)' : 'var(--text-primary)'};">${t.pts}</td>
                <td>
                    <div class="form-indicator">${formHtml || '<span class="text-muted">-</span>'}</div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// 3. Schedule Tab
function renderSchedule() {
    const timeline = document.getElementById('schedule-matches-list');
    
    const stage = document.getElementById('filter-stage').value;
    const venue = document.getElementById('filter-venue').value;
    const search = document.getElementById('filter-search').value.toLowerCase().trim();
    
    // Filter Matches
    let filtered = appState.matches.filter(m => {
        // Stage filter
        if (stage === 'live' && m.status !== 'live') return false;
        if (stage === 'completed' && m.status !== 'completed') return false;
        if (stage === 'upcoming' && m.status !== 'upcoming') return false;
        
        // Venue filter
        if (venue !== 'all' && !m.venue.includes(venue)) return false;
        
        // Search filter
        if (search) {
            const homeName = getTeamName(m.home).toLowerCase();
            const awayName = getTeamName(m.away).toLowerCase();
            if (!homeName.includes(search) && !awayName.includes(search)) return false;
        }
        
        return true;
    });

    // Sort by date then time
    filtered.sort((a, b) => {
        if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
        return a.time.localeCompare(b.time);
    });

    // Group by Date
    const matchesByDate = {};
    filtered.forEach(m => {
        if (!matchesByDate[m.date]) {
            matchesByDate[m.date] = [];
        }
        matchesByDate[m.date].push(m);
    });

    let html = '';
    const dates = Object.keys(matchesByDate);
    
    if (dates.length > 0) {
        dates.forEach(d => {
            const dateObj = new Date(d);
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);
            const matchCount = matchesByDate[d].length;
            
            html += `
                <div class="timeline-date-group">
                    <div class="timeline-date-header">
                        ${formattedDate} 
                        <span>${matchCount} ${matchCount === 1 ? 'Match' : 'Matches'}</span>
                    </div>
                    <div class="timeline-matches-grid">
            `;
            
            matchesByDate[d].forEach(m => {
                const homeName = getTeamName(m.home);
                const homeFlag = getTeamFlag(m.home);
                const awayName = getTeamName(m.away);
                const awayFlag = getTeamFlag(m.away);
                
                let scoreDisplay = '';
                let liveTag = '';
                let cardOpacity = '1';
                
                if (m.status === 'live') {
                    scoreDisplay = `
                        <div class="score-box" style="color: var(--accent-rose); border-color: rgba(255,42,109,0.3);">${m.homeScore}</div>
                        <div class="score-divider-c">:</div>
                        <div class="score-box" style="color: var(--accent-rose); border-color: rgba(255,42,109,0.3);">${m.awayScore}</div>
                    `;
                    liveTag = `<span class="live-indicator"><span class="dot"></span> Live ${m.minute}'</span>`;
                } else if (m.status === 'completed') {
                    scoreDisplay = `
                        <div class="score-box">${m.homeScore}</div>
                        <div class="score-divider-c">:</div>
                        <div class="score-box">${m.awayScore}</div>
                    `;
                    liveTag = `<span class="badge badge-secondary" style="font-size: 10px;">FT</span>`;
                } else {
                    scoreDisplay = `
                        <div class="score-box" style="font-size: 12px; color: var(--text-muted); font-weight: 600; width: 60px; height: 32px; border-radius: 4px;">
                            ${m.time}
                        </div>
                    `;
                    cardOpacity = '0.9';
                }

                html += `
                    <div class="match-card" style="opacity: ${cardOpacity};">
                        <div class="match-card-meta">
                            <span class="group-tag">Group ${m.group} Match</span>
                            ${liveTag}
                        </div>
                        <div class="match-card-teams">
                            <div class="match-team home">
                                <span class="team-flag-em">${homeFlag}</span>
                                <span class="team-name-str">${homeName}</span>
                            </div>
                            <div class="match-scores-disp">
                                ${scoreDisplay}
                            </div>
                            <div class="match-team away">
                                <span class="team-flag-em">${awayFlag}</span>
                                <span class="team-name-str">${awayName}</span>
                            </div>
                        </div>
                        <div class="match-card-footer">
                            <span class="match-card-venue">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                </svg>
                                ${m.venue}
                            </span>
                            <button class="btn-details-match" onclick="openMatchDetailsModal(${m.id})">Match Center &rarr;</button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
    } else {
        html = `
            <div class="grid-card txt-center" style="padding: 50px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 15px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h4>No matches found match your filters.</h4>
                <p class="text-muted" style="font-size: 13px; margin-top: 5px;">Try resetting the filters or typing a different search term.</p>
            </div>
        `;
    }
    
    timeline.innerHTML = html;
}

// 4. Venues Tab
function renderVenues(searchQuery = '') {
    const grid = document.getElementById('venues-cards-grid');
    let html = '';
    
    let filtered = WC_VENUES;
    if (searchQuery) {
        filtered = WC_VENUES.filter(v => 
            v.city.toLowerCase().includes(searchQuery) || 
            v.stadium.toLowerCase().includes(searchQuery) ||
            v.country.toLowerCase().includes(searchQuery)
        );
    }
    
    filtered.forEach(v => {
        const matchesCount = appState.matches.filter(m => m.venue.includes(v.stadium)).length;
        html += `
            <div class="venue-card" onclick="openVenueModal('${v.id}')">
                <div class="venue-img-wrap">
                    <div class="venue-img" style="background-image: url('${v.image}')"></div>
                </div>
                <div class="venue-card-content">
                    <h4 class="venue-card-city">${v.city}, <span style="font-weight: 500; font-size: 14px; color: var(--text-muted);">${v.country}</span></h4>
                    <p class="venue-card-stadium">${v.stadium}</p>
                    <div class="venue-meta-info">
                        <span>Capacity: <span>${v.capacity}</span></span>
                        <span>Matches: <span>${matchesCount}</span></span>
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html || '<p class="txt-center" style="grid-column: 1/-1;">No venues matching search criteria.</p>';
}

// 5. Blog Tab
function renderBlogGrid(category = 'all', searchQuery = '') {
    const grid = document.getElementById('blog-articles-grid');
    let html = '';
    
    let filtered = appState.articles;
    if (category !== 'all') {
        filtered = filtered.filter(art => art.category === category);
    }
    
    if (searchQuery) {
        filtered = filtered.filter(art => 
            art.title.toLowerCase().includes(searchQuery) || 
            art.summary.toLowerCase().includes(searchQuery) ||
            art.author.toLowerCase().includes(searchQuery) ||
            art.tags.some(t => t.toLowerCase().includes(searchQuery))
        );
    }

    // Sort by ID (newest first, since ID has timestamp prefix or numerical order)
    filtered = [...filtered].reverse();
    
    filtered.forEach(art => {
        html += `
            <div class="article-card">
                <div class="article-img-wrap">
                    <div class="article-img" style="background-image: url('${art.image}')"></div>
                    <span class="badge article-card-badge">${art.category}</span>
                </div>
                <div class="article-card-content">
                    <div class="article-card-meta">
                        <span>${art.date}</span>
                        <span>By ${art.author}</span>
                    </div>
                    <h4 class="article-card-title">${art.title}</h4>
                    <p class="article-card-desc">${art.summary}</p>
                    <div class="article-card-footer">
                        <div class="article-likes">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>${art.likes}</span>
                        </div>
                        <button class="read-more-btn" onclick="viewArticleDetails('${art.id}')">
                            Read More
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html || '<p class="txt-center" style="grid-column: 1/-1; padding: 40px;">No articles in this category.</p>';
}


// --- MODALS ACTIONS ---

let currentViewingArticleId = null;

function viewArticleDetails(articleId) {
    const art = appState.articles.find(a => a.id === articleId);
    if (!art) return;
    
    currentViewingArticleId = articleId;
    playSound('modal');
    
    // Populate Modal details
    document.getElementById('article-modal-img').style.backgroundImage = `url('${art.image}')`;
    document.getElementById('article-modal-category').textContent = art.category;
    document.getElementById('article-modal-date').textContent = art.date;
    document.getElementById('article-modal-author').textContent = `By ${art.author}`;
    document.getElementById('article-modal-title').textContent = art.title;
    document.getElementById('article-modal-content').textContent = art.content;
    document.getElementById('article-modal-likes').textContent = art.likes;
    
    // Tags
    const tagsWrapper = document.getElementById('article-modal-tags');
    tagsWrapper.innerHTML = '';
    art.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = `#${t}`;
        tagsWrapper.appendChild(span);
    });

    // Liked state check
    const likeBtn = document.getElementById('btn-like-article');
    if (appState.likedArticles.includes(articleId)) {
        likeBtn.classList.add('liked');
    } else {
        likeBtn.classList.remove('liked');
    }
    
    // Comments
    renderCommentsList(art.comments);
    
    openModal('modal-article');
}

function renderCommentsList(comments) {
    const list = document.getElementById('article-comments-list');
    document.getElementById('article-comments-count').textContent = comments.length;
    
    let html = '';
    if (comments.length > 0) {
        comments.forEach(c => {
            html += `
                <div class="comment-bubble">
                    <div class="comment-meta">
                        <span class="comment-author">${c.author}</span>
                        <span class="comment-date">${c.date}</span>
                    </div>
                    <p class="comment-text">${c.text}</p>
                </div>
            `;
        });
    } else {
        html = '<p class="text-muted" style="font-size: 13px; font-style: italic; padding: 10px 0;">No comments yet. Start the conversation below!</p>';
    }
    list.innerHTML = html;
    
    // Auto scroll comments list to bottom
    setTimeout(() => {
        list.scrollTop = list.scrollHeight;
    }, 100);
}

function toggleLikeArticle() {
    if (!currentViewingArticleId) return;
    
    const art = appState.articles.find(a => a.id === currentViewingArticleId);
    if (!art) return;
    
    const likeBtn = document.getElementById('btn-like-article');
    const likesDisplay = document.getElementById('article-modal-likes');
    
    if (appState.likedArticles.includes(currentViewingArticleId)) {
        // Dislike
        appState.likedArticles = appState.likedArticles.filter(id => id !== currentViewingArticleId);
        art.likes -= 1;
        likeBtn.classList.remove('liked');
        playSound('click');
    } else {
        // Like
        appState.likedArticles.push(currentViewingArticleId);
        art.likes += 1;
        likeBtn.classList.add('liked');
        playSound('success');
    }
    
    // Update local storage
    localStorage.setItem('wc_liked_articles', JSON.stringify(appState.likedArticles));
    localStorage.setItem('wc_articles', JSON.stringify(appState.articles));
    
    likesDisplay.textContent = art.likes;
    
    // Re-render blog background grids to match likes
    if (appState.activeTab === 'blog') {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        renderBlogGrid(activeCategory);
    } else if (appState.activeTab === 'dashboard') {
        renderDashboard();
    }
}

function submitComment() {
    if (!currentViewingArticleId) return;
    
    const art = appState.articles.find(a => a.id === currentViewingArticleId);
    if (!art) return;
    
    const authorInput = document.getElementById('comment-author');
    const textInput = document.getElementById('comment-text');
    
    const author = authorInput.value.trim();
    const text = textInput.value.trim();
    
    if (!author || !text) return;
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date().toLocaleDateString('en-US', dateOptions);
    
    const newComment = {
        author: author,
        text: text,
        date: dateString
    };
    
    art.comments.push(newComment);
    
    // Save to local storage
    localStorage.setItem('wc_articles', JSON.stringify(appState.articles));
    
    // Sound & Clear Form
    playSound('success');
    textInput.value = '';
    
    // Re-render Comments
    renderCommentsList(art.comments);
    
    // Re-render blog background grids to match comments
    if (appState.activeTab === 'blog') {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        renderBlogGrid(activeCategory);
    }
}

function publishArticle() {
    const title = document.getElementById('post-title').value.trim();
    const author = document.getElementById('post-author').value.trim();
    const category = document.getElementById('post-category').value;
    const summary = document.getElementById('post-summary').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const tagsString = document.getElementById('post-tags').value.trim();
    
    // Get Selected image radio
    const coverImage = document.querySelector('input[name="post-image"]:checked').value;
    
    if (!title || !author || !summary || !content) return;
    
    const tags = tagsString ? tagsString.split(',').map(t => t.trim().replace('#', '')) : ['WorldCup', '2026'];
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date().toLocaleDateString('en-US', dateOptions);
    
    const newArticle = {
        id: `post-${Date.now()}`,
        title: title,
        category: category,
        author: author,
        date: dateString,
        summary: summary,
        content: content,
        image: coverImage,
        likes: 0,
        comments: [],
        tags: tags
    };
    
    appState.articles.push(newArticle);
    localStorage.setItem('wc_articles', JSON.stringify(appState.articles));
    
    // Sound, Reset form & Close modal
    playSound('success');
    document.getElementById('form-publish-article').reset();
    closeModal('modal-writer');
    
    // Show toast for journalism publication
    showJournalismToast(title);
    
    // Move to News tab and render
    window.location.hash = '#/blog';
    document.querySelector('.category-btn[data-category="all"]').click();
}

function showJournalismToast(title) {
    const toast = document.createElement('div');
    toast.className = 'goal-toast';
    toast.innerHTML = `
        <div class="toast-g-content">
            <span class="toast-pulse" style="background-color: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan);"></span>
            <strong>Article Published!</strong> "${title.substring(0, 30)}..." is now live.
        </div>
    `;
    document.body.appendChild(toast);
    
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = 'var(--bg-modal)';
    toast.style.border = '2px solid var(--accent-cyan)';
    toast.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.4)';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.zIndex = '9999';
    toast.style.animation = 'slideUp 0.3s ease-out';
    toast.style.color = '#fff';
    toast.style.fontFamily = 'Outfit';
    toast.style.fontSize = '15px';
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Venue detail modal explorer
function openVenueModal(venueId) {
    const v = WC_VENUES.find(ven => ven.id === venueId);
    if (!v) return;
    
    playSound('modal');
    
    document.getElementById('venue-modal-img').style.backgroundImage = `url('${v.image}')`;
    document.getElementById('venue-modal-title').textContent = v.stadium;
    document.getElementById('venue-modal-city').textContent = `${v.city}, ${v.country}`;
    document.getElementById('venue-modal-capacity').textContent = `${v.capacity} seats`;
    
    // Find scheduled matches for this stadium
    const matches = appState.matches.filter(m => m.venue.includes(v.stadium));
    const matchesList = document.getElementById('venue-modal-matches');
    
    let html = '';
    if (matches.length > 0) {
        matches.forEach(m => {
            const homeName = getTeamName(m.home);
            const homeFlag = getTeamFlag(m.home);
            const awayName = getTeamName(m.away);
            const awayFlag = getTeamFlag(m.away);
            
            let statusText = '';
            if (m.status === 'live') {
                statusText = `<span style="color: var(--accent-rose); font-weight: 700;">LIVE ${m.homeScore}-${m.awayScore}</span>`;
            } else if (m.status === 'completed') {
                statusText = `<span style="color: var(--accent-green); font-weight: 700;">FT ${m.homeScore}-${m.awayScore}</span>`;
            } else {
                statusText = `<span style="color: var(--text-muted);">${m.date} | ${m.time}</span>`;
            }
            
            html += `
                <div class="venue-match-item">
                    <span class="venue-match-teams">${homeFlag} ${homeName} vs ${awayName} ${awayFlag}</span>
                    <span class="venue-match-time">${statusText}</span>
                </div>
            `;
        });
    } else {
        html = '<p class="text-muted" style="font-size: 13px; font-style: italic; padding: 10px 0;">No matches scheduled at this venue.</p>';
    }
    matchesList.innerHTML = html;
    
    openModal('modal-venue');
}

// Match Details / Center Modal (we can reuse venue modal or article detail modal skeleton or construct an overlay. Let's redirect to schedule tab and filter by that match's ID or open a custom alert panel for preview details!)
function openMatchDetailsModal(matchId) {
    const m = appState.matches.find(match => match.id === matchId);
    if (!m) return;
    
    playSound('modal');
    
    // Create match center alert dialog
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'temp-match-modal';
    
    const homeName = getTeamName(m.home);
    const homeFlag = getTeamFlag(m.home);
    const awayName = getTeamName(m.away);
    const awayFlag = getTeamFlag(m.away);
    
    let scoreDisplay = 'VS';
    let subTitle = `${m.date} | Kickoff: ${m.time}`;
    if (m.status === 'live') {
        scoreDisplay = `${m.homeScore} - ${m.awayScore}`;
        subTitle = `LIVE IN PROGRESS (Minute: ${m.minute}')`;
    } else if (m.status === 'completed') {
        scoreDisplay = `${m.homeScore} - ${m.awayScore}`;
        subTitle = 'FINAL RESULT (FT)';
    }

    const card = document.createElement('div');
    card.className = 'modal-card';
    card.style.maxWidth = '550px';
    card.innerHTML = `
        <button class="modal-close-btn" onclick="document.getElementById('temp-match-modal').remove()">&times;</button>
        <div class="modal-body">
            <h2 class="modal-title" style="text-align: center; font-size: 18px; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 2px;">Match Center</h2>
            <p style="text-align: center; color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">${m.venue}</p>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 30px 0;">
                <div style="text-align: center; width: 40%;">
                    <div style="font-size: 48px; line-height: 1;">${homeFlag}</div>
                    <div style="font-weight: 800; font-size: 18px; margin-top: 10px; font-family: Outfit;">${homeName}</div>
                    <small style="color: var(--text-muted); font-weight: 600;">Home</small>
                </div>
                <div style="text-align: center; width: 20%;">
                    <div style="font-size: 32px; font-weight: 900; color: ${m.status === 'live' ? 'var(--accent-rose)' : 'var(--text-primary)'}; font-family: Outfit; letter-spacing: 2px;">${scoreDisplay}</div>
                    <small style="color: ${m.status === 'live' ? 'var(--accent-rose)' : 'var(--text-muted)'}; font-weight: 700; font-size: 11px;">${subTitle}</small>
                </div>
                <div style="text-align: center; width: 40%;">
                    <div style="font-size: 48px; line-height: 1;">${awayFlag}</div>
                    <div style="font-weight: 800; font-size: 18px; margin-top: 10px; font-family: Outfit;">${awayName}</div>
                    <small style="color: var(--text-muted); font-weight: 600;">Away</small>
                </div>
            </div>
            
            <hr class="modal-divider">
            
            <h3 style="font-size: 15px; margin-bottom: 10px;">Reporter Highlights & Updates</h3>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; background-color: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 15px; border-radius: var(--radius-sm); font-style: italic;">
                "${m.details}"
            </p>
            
            <div class="form-actions" style="margin-top: 25px;">
                <button class="btn btn-secondary" style="width: 100%;" onclick="document.getElementById('temp-match-modal').remove()">Back to Dashboard</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    // Click outside overlay to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Modal helper controls
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock body scroll
}

function closeModal(modalId) {
    playSound('click');
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto'; // Release body scroll
    if (modalId === 'modal-article') {
        currentViewingArticleId = null;
    }
}

// Close modals when clicking overlay background
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay.id);
        }
    });
});

// Standings sorting logic
function sortTeams(teamsArray) {
    // 1st by Points (PTS) descending
    // 2nd by Goal Difference (GD) descending
    // 3rd by Goals For (GF) descending
    // 4th alphabetically
    teamsArray.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.name.localeCompare(b.name);
    });
}
