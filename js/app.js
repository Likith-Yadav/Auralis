document.addEventListener('DOMContentLoaded', () => {
    function isMobileDevice() {
        const ua = navigator.userAgent || navigator.vendor || window.opera || '';
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS|Tablet|Touch/i.test(ua);
        const isSmallScreen = window.innerWidth <= 768;
        return isMobileUA || isSmallScreen;
    }

    function updatePlatformDownloadButtons() {
        const heroBtn = document.getElementById('hero-download-btn');
        const heroText = document.getElementById('hero-download-text');
        const heroIcon = document.getElementById('hero-download-icon');
        if (!heroBtn || !heroText) return;

        // Guarantee clicking redirects to the bottom #downloads section
        heroBtn.href = '#downloads';

        const isMobile = isMobileDevice();

        if (isMobile) {
            heroText.textContent = 'Download APK';
            if (heroIcon) heroIcon.textContent = 'android';
        } else {
            heroText.textContent = 'Download Windows (.exe)';
            if (heroIcon) heroIcon.textContent = 'laptop_windows';
        }
    }

    window.addEventListener('resize', updatePlatformDownloadButtons);

    // ═══════════════════════ DOM ELEMENTS & RELEASES ═══════════════════════
    const logo = document.getElementById('logo');
    const downloadToast = document.getElementById('downloadToast');
    const toastMsg = document.getElementById('downloadToastMessage');
    const ossVersionBadge = document.getElementById('oss-version-badge');
    const androidVersionBadge = document.getElementById('android-version-badge');
    const windowsVersionBadge = document.getElementById('windows-version-badge');

    let allReleases = [
        {
            tag_name: "1.0.0",
            name: "Auralis v1.0.0",
            published_at: "2026-08-15T08:00:00Z",
            body: "### ✨ Auralis v1.0.0 Release Notes\n- 🎵 **Brand New Auralis Release**\n- 🚀 Integrated Time-Synced Lyrics (BetterLyrics Provider)\n- 🔒 Secure Firebase Authentication & Google Sign-In\n- 🎨 Elegant Dark Neon Green Material Design 3 UI\n- 🏎️ Optimizations for smooth streaming & large song cache",
            assets: [
                { name: "Auralis_v1.0.0_signed.apk", size: 38000000, browser_download_url: "https://github.com/Likith-Yadav/Auralis/releases/download/v1.0.0/Auralis_v1.0.0_signed.apk" }
            ]
        }
    ];

    let latestRelease = allReleases[0];

    // 1. Toast Notification Helper
    function showToast(msg) {
        if (!downloadToast || !toastMsg) return;
        toastMsg.textContent = msg;
        downloadToast.classList.add('show');
        setTimeout(() => downloadToast.classList.remove('show'), 3500);
    }

    // 2. Logo Rhythm Audio Player
    let audioPlayer = new Audio('https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/af/87/8a/af878a06-42f9-b957-c67c-13619e8a6272/mzaf_12187353444091077030.plus.aac.p.m4a');
    let isPlayingAudio = false;

    if (logo) {
        logo.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isPlayingAudio) {
                audioPlayer.play().then(() => {
                    isPlayingAudio = true;
                    logo.classList.add('playing');
                    showToast('🎵 Playing Auralis Rhythm sample...');
                }).catch(err => {
                    console.warn('Audio playback error:', err);
                    showToast('Error playing preview sample');
                });
            } else {
                audioPlayer.pause();
                isPlayingAudio = false;
                logo.classList.remove('playing');
                showToast('⏸️ Audio paused');
            }
        });

        audioPlayer.addEventListener('ended', () => {
            isPlayingAudio = false;
            logo.classList.remove('playing');
            showToast('🎵 Playback finished');
        });
    }

    // 3. GitHub Releases API Fetching
    async function fetchReleases() {
        const url = "https://api.github.com/repos/Likith-Yadav/Auralis/releases";
        try {
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    allReleases = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
                    latestRelease = allReleases[0];
                    updateVersionBadges();
                    return;
                }
            }
        } catch (e) {
            console.warn("Failed to fetch GitHub releases from", url, e);
        }
        updateVersionBadges();
    }

    function formatVersionTag(tag) {
        if (!tag) return 'v1.0.0';
        return tag.startsWith('v') || tag.startsWith('V') ? tag : `v${tag}`;
    }

    function updateVersionBadges() {
        if (!latestRelease) return;
        const tag = formatVersionTag(latestRelease.tag_name);

        if (ossVersionBadge) ossVersionBadge.textContent = `${tag} (Latest Stable Version)`;
        if (androidVersionBadge) androidVersionBadge.textContent = tag;

        // Find latest Windows release
        const winRelease = allReleases.find(r => r.assets && r.assets.some(a => /\.exe$/i.test(a.name)));
        if (windowsVersionBadge && winRelease) {
            windowsVersionBadge.textContent = formatVersionTag(winRelease.tag_name);
            const winDownloadBtn = document.getElementById('windows-download-btn');
            const winExeAsset = winRelease.assets.find(a => /\.exe$/i.test(a.name));
            if (winDownloadBtn && winExeAsset) {
                winDownloadBtn.href = winExeAsset.browser_download_url;
            }
        } else if (windowsVersionBadge) {
            windowsVersionBadge.textContent = 'v1.0.0';
        }

        updatePlatformDownloadButtons();
    }

    updatePlatformDownloadButtons();

    // 4. Screenshots Section Accordion & Carousel
    const screenshotsHeader = document.getElementById('screenshots-header');
    const screenshotsContent = document.getElementById('screenshots-content');
    const screenshotsIcon = document.getElementById('screenshots-icon');

    if (screenshotsHeader && screenshotsContent) {
        screenshotsHeader.addEventListener('click', () => {
            const isCollapsed = screenshotsContent.style.maxHeight === '0px';
            if (isCollapsed) {
                screenshotsContent.style.maxHeight = '2000px';
                if (screenshotsIcon) screenshotsIcon.classList.add('rotated');
            } else {
                screenshotsContent.style.maxHeight = '0px';
                if (screenshotsIcon) screenshotsIcon.classList.remove('rotated');
            }
        });
    }

    // Screenshots Carousel Logic
    const track = document.getElementById('screenshots-track');
    const slides = document.querySelectorAll('.screenshots-slide');
    const prevBtn = document.getElementById('screenshots-prev');
    const nextBtn = document.getElementById('screenshots-next');
    const titleEl = document.getElementById('screenshots-title');
    const descEl = document.getElementById('screenshots-description');
    const indexEl = document.getElementById('screenshots-current-index');
    const indicatorsEl = document.getElementById('screenshots-indicators');
    const previewCards = document.querySelectorAll('.screenshots-preview-card');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function buildIndicators() {
        if (!indicatorsEl) return;
        indicatorsEl.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `screenshots-indicator ${i === currentSlide ? 'is-active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsEl.appendChild(dot);
        }
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        const activeSlide = slides[currentSlide];
        if (activeSlide) {
            if (titleEl) titleEl.textContent = activeSlide.dataset.title || 'Vista previa';
            if (descEl) descEl.textContent = activeSlide.dataset.description || '';
        }

        if (indexEl) {
            indexEl.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        if (indicatorsEl) {
            const dots = indicatorsEl.querySelectorAll('.screenshots-indicator');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('is-active', idx === currentSlide);
            });
        }

        previewCards.forEach((card, idx) => {
            card.classList.toggle('is-active', idx === currentSlide);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    previewCards.forEach((card, idx) => {
        card.addEventListener('click', () => goToSlide(idx));
    });

    buildIndicators();

    // Touch Swipe Support for Screenshots Carousel
    if (track) {
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;

        track.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                isSwiping = true;
            }
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (isSwiping && e.touches.length === 1) {
                touchEndX = e.touches[0].clientX;
            }
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isSwiping) return;
            const swipeThreshold = 35;
            const diff = touchEndX - touchStartX;
            if (touchEndX !== 0 && Math.abs(diff) > swipeThreshold) {
                if (diff < 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }
            touchStartX = 0;
            touchEndX = 0;
            isSwiping = false;
        }, { passive: true });
    }

    // 5. Changelog Modal Triggers
    const changelogTrigger = document.getElementById('changelog-trigger');
    const windowsChangelogTrigger = document.getElementById('windows-changelog-trigger');
    const changelogDialog = document.getElementById('changelog-dialog');
    const changelogContent = document.getElementById('changelog-content');

    function openChangelogModal(targetRel) {
        if (!changelogDialog || !changelogContent) return;
        changelogDialog.showModal();
        const rel = targetRel || latestRelease;
        if (!rel) return;

        let bodyMarkdown = `### ${rel.name || formatVersionTag(rel.tag_name)} Release Notes\n\n${rel.body || 'No release details.'}`;
        if (window.marked) {
            changelogContent.innerHTML = `<div class="prose prose-invert max-w-none text-on-surface-variant">${window.marked.parse(bodyMarkdown)}</div>`;
        } else {
            changelogContent.innerHTML = `<pre class="text-sm text-on-surface-variant whitespace-pre-wrap">${bodyMarkdown}</pre>`;
        }
    }

    if (changelogTrigger) {
        changelogTrigger.addEventListener('click', () => openChangelogModal(latestRelease));
    }
    if (windowsChangelogTrigger) {
        windowsChangelogTrigger.addEventListener('click', () => {
            const winRel = allReleases.find(r => r.assets && r.assets.some(a => /\.exe$/i.test(a.name)));
            openChangelogModal(winRel || latestRelease);
        });
    }

    // 6. Previous Versions Modal Popup Logic (Android & Windows)
    const versionsTrigger = document.getElementById('versions-trigger');
    const windowsVersionsTrigger = document.getElementById('windows-versions-trigger');
    const versionsDialog = document.getElementById('versions-dialog');
    const versionsList = document.getElementById('versions-list');

    function renderVersionsModal(filterPlatform = 'all') {
        if (!versionsDialog || !versionsList) return;

        const dialogTitle = versionsDialog.querySelector('.dialog-header h3');
        if (dialogTitle) {
            if (filterPlatform === 'windows') {
                dialogTitle.innerHTML = `<span class="flex items-center gap-2"><span class="material-symbols-outlined text-primary">laptop_windows</span> Previous Windows Versions (.exe)</span>`;
            } else if (filterPlatform === 'android') {
                dialogTitle.innerHTML = `<span class="flex items-center gap-2"><span class="material-symbols-outlined text-tertiary">android</span> Previous Android Versions (.apk)</span>`;
            } else {
                dialogTitle.innerHTML = `<span class="flex items-center gap-2"><span class="material-symbols-outlined text-primary">history</span> Previous Versions</span>`;
            }
        }

        let filteredReleases = allReleases;
        if (filterPlatform === 'windows') {
            filteredReleases = allReleases.filter(rel => rel.assets && rel.assets.some(a => /\.exe$/i.test(a.name)));
        } else if (filterPlatform === 'android') {
            filteredReleases = allReleases.filter(rel => rel.assets && rel.assets.some(a => /\.apk$/i.test(a.name)));
        }

        if (!filteredReleases || filteredReleases.length === 0) {
            versionsList.innerHTML = `<p class="text-on-surface-variant text-center py-6">No previous versions found for ${filterPlatform}.</p>`;
            versionsDialog.showModal();
            return;
        }

        let html = '';
        filteredReleases.forEach(rel => {
            const tag = formatVersionTag(rel.tag_name);
            const pubDate = rel.published_at ? new Date(rel.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent';
            const rawNotes = rel.body ? rel.body.split('\n').filter(l => l.trim())[0] || 'Official release' : 'Official release';
            const cleanNotes = rawNotes.replace(/[#*`]/g, '').substring(0, 110);

            let downloadableAssets = [];
            if (filterPlatform === 'windows') {
                downloadableAssets = (rel.assets || []).filter(a => a.name && /\.exe$/i.test(a.name));
            } else if (filterPlatform === 'android') {
                downloadableAssets = (rel.assets || []).filter(a => a.name && /\.apk$/i.test(a.name));
            } else {
                downloadableAssets = rel.assets || [];
            }

            let assetButtons = '';
            downloadableAssets.forEach(asset => {
                const size = (asset.size / (1024 * 1024)).toFixed(2);
                const isSetup = /setup/i.test(asset.name);
                const isPortable = /portable|potable/i.test(asset.name);
                const isExe = /\.exe$/i.test(asset.name);

                const label = isExe ? (isSetup ? 'Installer (.exe)' : isPortable ? 'Portable (.exe)' : 'Executable (.exe)') : 'Download APK';
                const icon = isExe ? (isSetup ? 'laptop_windows' : 'inventory_2') : 'android';
                const btnClass = isExe ? 'bg-primary-container text-on-primary-container hover:brightness-110' : 'bg-tertiary-container text-on-tertiary-container hover:brightness-110';

                assetButtons += `
                    <a href="${asset.browser_download_url}" target="_blank" rel="noopener noreferrer" class="${btnClass} px-4 py-2 rounded-full text-xs font-semibold no-underline inline-flex items-center gap-1.5 active:scale-95 transition-all">
                        <span class="material-symbols-outlined" style="font-size:16px">${icon}</span>
                        ${label} (${size} MB)
                    </a>
                `;
            });

            html += `
                <div class="bg-surface-container-high p-5 rounded-2xl mb-4 border border-white/5 shadow-md flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-xs">${tag}</span>
                            <span class="text-xs text-on-surface-variant">${pubDate}</span>
                        </div>
                        <span class="text-xs text-on-surface-variant font-medium">${downloadableAssets.length} file(s)</span>
                    </div>
                    <p class="text-xs text-on-surface-variant leading-relaxed">✨ ${cleanNotes}</p>
                    <div class="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                        ${assetButtons}
                    </div>
                </div>
            `;
        });

        versionsList.innerHTML = html;
        versionsDialog.showModal();
    }

    if (versionsTrigger) {
        versionsTrigger.addEventListener('click', () => renderVersionsModal('android'));
    }
    if (windowsVersionsTrigger) {
        windowsVersionsTrigger.addEventListener('click', () => renderVersionsModal('windows'));
    }

    fetchReleases();
});


/* Demo Controller: Desktop 3D Flip Card & Mobile Fullscreen Modal Handler */
function initAuralisDemoController() {
  const heroFlipCard = document.getElementById('heroFlipCard');
  const heroDemoBtn = document.getElementById('hero-demo-btn');
  const heroDemoBtnIcon = document.getElementById('heroDemoBtnIcon');
  const heroDemoBtnText = document.getElementById('heroDemoBtnText');
  const heroCardFront = document.getElementById('heroCardFront');
  const btnFlipBack = document.getElementById('btnFlipBack');
  const navDemoLink = document.getElementById('navDemoLink');
  const mobileFullscreenModal = document.getElementById('mobileFullscreenModal');
  const btnCloseMobileModal = document.getElementById('btnCloseMobileModal');

  function setButtonState(active) {
    if (heroDemoBtnText) {
      heroDemoBtnText.textContent = active ? 'Close Demo' : 'Try Demo';
    }
    if (heroDemoBtnIcon) {
      heroDemoBtnIcon.textContent = active ? 'cancel' : 'play_circle';
      heroDemoBtnIcon.className = active ? 'material-symbols-outlined text-rose-400' : 'material-symbols-outlined text-emerald-400';
    }
  }

  function toggleDemo(e) {
    if (e) e.preventDefault();
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (mobileFullscreenModal) {
        if (!mobileFullscreenModal.classList.contains('active')) {
          mobileFullscreenModal.classList.add('active');
          document.body.style.overflow = 'hidden';
          setButtonState(true);
        } else {
          closeMobileModal();
        }
      }
    } else {
      if (heroFlipCard) {
        if (!heroFlipCard.classList.contains('flipped')) {
          heroFlipCard.classList.add('flipped');
          heroFlipCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setButtonState(true);
        } else {
          flipToFront(e);
        }
      }
    }
  }

  function closeMobileModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (mobileFullscreenModal) {
      mobileFullscreenModal.classList.remove('active');
      document.body.style.overflow = '';
      setButtonState(false);
    }
  }

  function flipToFront(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (heroFlipCard) {
      heroFlipCard.classList.remove('flipped');
      setButtonState(false);
    }
  }

  if (heroDemoBtn) heroDemoBtn.addEventListener('click', toggleDemo);
  if (heroCardFront) heroCardFront.addEventListener('click', toggleDemo);
  if (navDemoLink) navDemoLink.addEventListener('click', toggleDemo);
  if (btnFlipBack) btnFlipBack.addEventListener('click', flipToFront);
  if (btnCloseMobileModal) btnCloseMobileModal.addEventListener('click', closeMobileModal);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuralisDemoController);
} else {
  initAuralisDemoController();
}


/* ==========================================================================
   Auralis Application Engine & Search Controller
   Dev By Likith Yadav | Android Music Emulator
   ========================================================================== */

const USER_AVATAR_URL = "https://github.com/Likith-Yadav.png";

const FALLBACK_MUSIC_DATABASE = [
  {
    trackId: 101,
    trackName: "O Maahi",
    artistName: "Arijit Singh & Pritam",
    collectionName: "Dunki (Original Motion Picture Soundtrack)",
    primaryGenreName: "Bollywood",
    releaseDate: "2024-01-01T00:00:00Z",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/5a/08/90/5a089063-2615-5858-a532-a548bc889d1a/8902894362146.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/4a/60/76/4a60768e-9905-234b-449e-c8ff46fb1fef/mzaf_16560934091629853381.plus.aac.p.m4a"
  },
  {
    trackId: 102,
    trackName: "Tum Kya Mile - Lofi",
    artistName: "Arijit Singh, Shreya Ghoshal & Pritam",
    collectionName: "Rocky Aur Rani Kii Prem Kahaani",
    primaryGenreName: "Bollywood",
    releaseDate: "2023-06-28T00:00:00Z",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/80/47/9b/80479b08-360e-8902-6c39-2a9a4e76a66a/8902894357593.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/b8/91/30/b891307b-841a-a5f6-17b5-2d4e73f4e3c9/mzaf_10677561877478065099.plus.aac.p.m4a"
  },
  {
    trackId: 103,
    trackName: "Jhoom - Vishal Mishra",
    artistName: "Vishal Mishra & Mithoon",
    collectionName: "Gadar 2",
    primaryGenreName: "Bollywood",
    releaseDate: "2023-08-01T00:00:00Z",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/85/37/ef/8537ef67-17b1-2180-2882-73a74c4ed464/8902894358828.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/05/65/59/05655979-3c81-8078-433c-352210fbfa5a/mzaf_13506927954131557022.plus.aac.p.m4a"
  },
  {
    trackId: 104,
    trackName: "ESSE CARA! (Sped Up)",
    artistName: "Sayfalse, Scythermane & TRXSHBXY",
    collectionName: "ESSE CARA! (Sped Up) - Single",
    primaryGenreName: "Phonk",
    releaseDate: "2024-01-01T00:00:00Z",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7e/83/ce/7e83ce5c-cb1c-0cb9-5fcd-89f797172317/1043254.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/af/87/8a/af878a06-42f9-b957-c67c-13619e8a6272/mzaf_12187353444091077030.plus.aac.p.m4a"
  },
  {
    trackId: 105,
    trackName: "FUNK MI CAMINO",
    artistName: "Sayfalse & Junior RCE",
    collectionName: "Funk Mi Camino - Single",
    primaryGenreName: "Phonk",
    releaseDate: "2023-05-10T00:00:00Z",
    artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/58/f3/c858f365-b207-651d-13ca-39015bba75b9/7721.jpg/600x600bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f7/16/2d/f7162dd1-2002-cd4b-f63a-bb01cb22596f/mzaf_17850094322210168746.plus.aac.p.m4a"
  }
];

function getCuratedFallbackResults(term) {
  const q = term ? term.toLowerCase() : '';
  const filtered = FALLBACK_MUSIC_DATABASE.filter(item => 
    item.trackName.toLowerCase().includes(q) || 
    item.artistName.toLowerCase().includes(q) ||
    item.primaryGenreName.toLowerCase().includes(q)
  );
  return filtered.length > 0 ? filtered : FALLBACK_MUSIC_DATABASE;
}

async function queryiTunesAPI(searchTerm, limit = 25) {
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn("Direct fetch notice, attempting fallback...", err);
  }

  return new Promise((resolve) => {
    const callbackName = 'itunes_cb_' + Math.floor(Math.random() * 1000000);
    const scriptUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=${limit}&callback=${callbackName}`;
    let isHandled = false;

    const timeout = setTimeout(() => {
      if (!isHandled) {
        isHandled = true;
        cleanup();
        resolve(getCuratedFallbackResults(searchTerm));
      }
    }, 2500);

    window[callbackName] = function(data) {
      if (isHandled) return;
      isHandled = true;
      clearTimeout(timeout);
      cleanup();
      if (data && data.results && data.results.length > 0) {
        resolve(data.results);
      } else {
        resolve(getCuratedFallbackResults(searchTerm));
      }
    };

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onerror = function() {
      if (isHandled) return;
      isHandled = true;
      clearTimeout(timeout);
      cleanup();
      resolve(getCuratedFallbackResults(searchTerm));
    };

    function cleanup() {
      try {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      } catch (e) {}
    }

    document.body.appendChild(script);
  });
}

const INITIAL_CURATED_TRACKS = [
  {
    id: "itunes_1648938363",
    title: "ESSE CARA! (Sped Up)",
    artist: "Sayfalse, Scythermane & TRXSHBXY",
    album: "ESSE CARA! (Sped Up) - Single",
    genre: "Phonk / Electronic",
    year: "2024",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7e/83/ce/7e83ce5c-cb1c-0cb9-5fcd-89f797172317/1043254.jpg/600x600bb.jpg",
    artThumb: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7e/83/ce/7e83ce5c-cb1c-0cb9-5fcd-89f797172317/1043254.jpg/300x300bb.jpg",
    audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/af/87/8a/af878a06-42f9-b957-c67c-13619e8a6272/mzaf_12187353444091077030.plus.aac.p.m4a",
    duration: 30,
    liked: true
  },
  {
    id: "itunes_1971887309",
    title: "FUNK MI CAMINO",
    artist: "Sayfalse & Junior RCE",
    album: "Funk Mi Camino - Single",
    genre: "Phonk",
    year: "2023",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/58/f3/c858f365-b207-651d-13ca-39015bba75b9/7721.jpg/600x600bb.jpg",
    artThumb: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/58/f3/c858f365-b207-651d-13ca-39015bba75b9/7721.jpg/300x300bb.jpg",
    audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f7/16/2d/f7162dd1-2002-cd4b-f63a-bb01cb22596f/mzaf_17850094322210168746.plus.aac.p.m4a",
    duration: 30,
    liked: false
  },
  {
    id: "itunes_840780180",
    title: "Nachde Ne Saare",
    artist: "Jasleen Royal, Harshdeep Kaur & Siddharth",
    album: "Baar Baar Dekho",
    genre: "Bollywood / Dance",
    year: "2016",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/14/b8/58/14b85883-40a4-0a2e-de65-130f55726ee6/840780180390.png/600x600bb.jpg",
    artThumb: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/14/b8/58/14b85883-40a4-0a2e-de65-130f55726ee6/840780180390.png/300x300bb.jpg",
    audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ef/d5/96/efd5965b-1084-4f5e-23c5-774c22ffb682/mzaf_17530489274193688460.plus.aac.p.m4a",
    duration: 30,
    liked: true
  },
  {
    id: "itunes_14797123",
    title: "NUNCA MUDA?",
    artist: "Scythermane, NXGHT! & MC Fabinho",
    album: "NUNCA MUDA? - Single",
    genre: "Phonk / Funk",
    year: "2024",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/45/75/1f/45751fab-8a44-70ec-ce16-695290892499/14797.jpg/600x600bb.jpg",
    artThumb: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/45/75/1f/45751fab-8a44-70ec-ce16-695290892499/14797.jpg/300x300bb.jpg",
    audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fa/3a/34/fa3a34fb-0fa4-5f66-8234-4a408f57200c/mzaf_7185755272822523038.plus.aac.p.m4a",
    duration: 30,
    liked: false
  },
  {
    id: "itunes_42925456",
    title: "Thumka",
    artist: "Kunal Ganjawala, Sahir Ali Bagga & Sana",
    album: "Thumka - Single",
    genre: "Pop / World",
    year: "2020",
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/aa/96/ba/aa96badb-128d-fe1b-3058-3f5fa2376191/cover.jpg/600x600bb.jpg",
    artThumb: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/aa/96/ba/aa96badb-128d-fe1b-3058-3f5fa2376191/cover.jpg/300x300bb.jpg",
    audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ad/52/66/ad526602-0e58-dfea-48e5-c2ed3e65bfbe/mzaf_4292545678407866085.plus.aac.p.m4a",
    duration: 30,
    liked: false
  }
];

class AuralisApp {
  constructor() {
    this.playlist = [...INITIAL_CURATED_TRACKS];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isDraggingTimeline = false;
    this.sleepTimer = null;
    this.activeViewId = 'viewHome';
    this.previousViewId = 'viewHome';
    this.hasUserPlayedSong = false;
    this.isMiniPlayerDismissed = false;

    this.recentSearches = ['songs', 'fonk', 'bollywood', 'pop'];

    this.audio = document.getElementById('mainAudioPlayer');
    this.init();
  }

  async init() {
    this.bindEvents();
    this.bindSearchInputEvents();
    this.bindResultsEvents();
    this.bindLibraryEvents();
    this.bindSettingsEvents();
    this.bindExploreEvents();
    this.bindStatsEvents();
    this.bindAllBackArrows();
    this.initTimelineScrubber();
    this.initMiniPlayerSlideDown();

    this.loadTrack(this.currentIndex, false);
    this.renderQuickPicks();
    this.renderLikedTracks();
    this.renderRecentSearches();
    this.startClock();

    this.fetchGlobalStats();
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      document.querySelectorAll('.status-time').forEach(el => el.textContent = `${hours}:${minutes}`);
    };
    updateTime();
    setInterval(updateTime, 30000);
  }

  switchView(viewId) {
    if (this.activeViewId !== viewId) {
      this.previousViewId = this.activeViewId;
    }
    this.activeViewId = viewId;
    
    document.querySelectorAll('.screen-view').forEach(v => v.classList.remove('active-view'));
    
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active-view');

    document.querySelectorAll('.liquid-nav-item').forEach(btn => {
      const target = btn.getAttribute('data-target');
      const isMatch = (target === viewId) || (target === 'viewSearch' && (viewId === 'viewSearchInput' || viewId === 'viewSearchResults'));
      btn.classList.toggle('active', isMatch);
    });

    this.updateMiniPlayerVisibility();
  }

  goBack() {
    const target = (this.previousViewId && this.previousViewId !== this.activeViewId) ? this.previousViewId : 'viewHome';
    this.switchView(target);
  }

  bindAllBackArrows() {
    const backBtnIds = [
      'btnSearchInputBackHome',
      'btnResultsBackToSearch',
      'btnNPAckHome',
      'btnLikedBackToLib',
      'btnStatsBackHome'
    ];

    backBtnIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          this.goBack();
        });
      }
    });
  }

  updateMiniPlayerVisibility() {
    const miniPlayer = document.getElementById('screenMiniPlayer');
    if (!miniPlayer) return;

    if (!this.hasUserPlayedSong || this.isMiniPlayerDismissed || this.activeViewId === 'viewNowPlaying') {
      miniPlayer.classList.add('hidden');
    } else {
      miniPlayer.classList.remove('hidden');
      miniPlayer.classList.remove('sliding-down');
    }
  }

  loadTrack(index, autoPlay = true) {
    if (index < 0 || index >= this.playlist.length) return;
    this.currentIndex = index;
    const track = this.playlist[index];

    this.audio.src = track.audio;
    this.audio.load();

    this.updateUI(track);
    this.resetTimeline();

    if (autoPlay) {
      this.playAudio();
    }
  }

  playAudio() {
    this.hasUserPlayedSong = true;
    this.isMiniPlayerDismissed = false;
    this.updateMiniPlayerVisibility();

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayStateUI();
    }).catch(err => {
      console.warn("Audio playback notice:", err);
      this.isPlaying = false;
      this.updatePlayStateUI();
    });
  }

  pauseAudio() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayStateUI();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  nextTrack() {
    let nextIndex;
    if (this.isShuffle) {
      nextIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      nextIndex = (this.currentIndex + 1) % this.playlist.length;
    }
    this.loadTrack(nextIndex, true);
  }

  prevTrack() {
    let prevIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(prevIndex, true);
  }

  updateUI(track) {
    const npImg = document.getElementById('npTrackImg');
    if (npImg) npImg.src = track.art || track.artThumb;
    
    const npTitle = document.getElementById('npTrackTitle');
    if (npTitle) npTitle.textContent = track.title;
    
    const npArtist = document.getElementById('npTrackArtist');
    if (npArtist) npArtist.textContent = track.artist;

    const npAlbumTag = document.getElementById('npTrackAlbumTag');
    if (npAlbumTag) npAlbumTag.textContent = `${track.album || 'Single'} • ${track.genre || 'Music'}`;

    const npLike = document.getElementById('btnNPLike');
    if (npLike) npLike.classList.toggle('liked', !!track.liked);

    const keepImg = document.getElementById('keepTrackImg');
    if (keepImg) keepImg.src = track.artThumb || track.art;

    const keepTitle = document.getElementById('keepTrackTitle');
    if (keepTitle) keepTitle.textContent = track.title;

    const keepArtist = document.getElementById('keepTrackArtist');
    if (keepArtist) keepArtist.textContent = track.artist;

    const keepLike = document.getElementById('keepLikeBtn');
    if (keepLike) keepLike.classList.toggle('liked', !!track.liked);

    const miniThumb = document.getElementById('miniThumb');
    if (miniThumb) miniThumb.src = track.artThumb || track.art;

    const miniTitle = document.getElementById('miniTitle');
    if (miniTitle) miniTitle.textContent = track.title;

    const miniArtist = document.getElementById('miniArtist');
    if (miniArtist) miniArtist.textContent = track.artist;

    const miniLike = document.getElementById('miniLikeBtn');
    if (miniLike) {
      miniLike.innerHTML = track.liked ? '<i class="fa-solid fa-heart text-pink"></i>' : '<i class="fa-regular fa-heart"></i>';
    }

    document.querySelectorAll('.track-item').forEach((item) => {
      const tid = item.getAttribute('data-id');
      item.classList.toggle('playing', tid === track.id);
    });
  }

  updatePlayStateUI() {
    const playIcon = document.getElementById('playIcon');
    const miniPlayBtn = document.getElementById('miniPlayBtn');
    const screen = document.getElementById('phoneScreen');

    if (this.isPlaying) {
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      if (screen) screen.classList.add('playing');
    } else {
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      if (miniPlayBtn) miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      if (screen) screen.classList.remove('playing');
    }
  }

  // --- Dedicated Search Input Screen Events ---
  bindSearchInputEvents() {
    const input = document.getElementById('phoneSearchInput');
    if (input) {
      let debounceTimer = null;
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);
        if (query.length >= 1) {
          debounceTimer = setTimeout(() => {
            this.fetchTextSuggestions(query);
          }, 200);
        } else {
          const suggestionsContainer = document.getElementById('textSuggestionsContainer');
          const recentContainer = document.getElementById('recentSearchesContainer');
          if (suggestionsContainer) suggestionsContainer.classList.add('hidden');
          if (recentContainer) recentContainer.classList.remove('hidden');
        }
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = input.value.trim();
          if (query) {
            this.executePhoneSearch(query, true);
          }
        }
      });
    }
  }

  addRecentSearch(query) {
    if (!query) return;
    this.recentSearches = this.recentSearches.filter(q => q.toLowerCase() !== query.toLowerCase());
    this.recentSearches.unshift(query);
    if (this.recentSearches.length > 8) this.recentSearches.pop();
    this.renderRecentSearches();
  }

  renderRecentSearches() {
    const container = document.getElementById('recentSearchesContainer');
    if (!container) return;

    container.innerHTML = '';
    this.recentSearches.forEach((query) => {
      const row = document.createElement('div');
      row.className = 'recent-search-row';
      row.setAttribute('data-query', query);
      row.innerHTML = `
        <div class="recent-search-left">
          <div class="history-clock-box">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </div>
          <span class="recent-query-text">${query}</span>
        </div>
        <div class="recent-search-right">
          <button class="recent-action-btn remove-history-btn" title="Remove"><i class="fa-solid fa-xmark"></i></button>
          <button class="recent-action-btn fill-query-btn" title="Use Query"><i class="fa-solid fa-arrow-up-long" style="transform: rotate(-45deg);"></i></button>
        </div>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.remove-history-btn')) {
          e.stopPropagation();
          this.recentSearches = this.recentSearches.filter(q => q !== query);
          this.renderRecentSearches();
        } else if (e.target.closest('.fill-query-btn')) {
          e.stopPropagation();
          const input = document.getElementById('phoneSearchInput');
          if (input) input.value = query;
          this.fetchTextSuggestions(query);
        } else {
          const input = document.getElementById('phoneSearchInput');
          if (input) input.value = query;
          this.executePhoneSearch(query, true);
        }
      });

      container.appendChild(row);
    });
  }

  // --- Fetch Text-Only Song Suggestions ---
  async fetchTextSuggestions(query) {
    if (!query) return;

    const recentContainer = document.getElementById('recentSearchesContainer');
    const suggestionsContainer = document.getElementById('textSuggestionsContainer');

    if (recentContainer) recentContainer.classList.add('hidden');
    if (suggestionsContainer) {
      suggestionsContainer.classList.remove('hidden');
    }

    const results = await queryiTunesAPI(query, 14);

    if (suggestionsContainer) {
      suggestionsContainer.innerHTML = '';

      if (results && results.length > 0) {
        results.forEach((item) => {
          const songTitle = item.trackName;
          const artistName = item.artistName;

          const row = document.createElement('div');
          row.className = 'recent-search-row';
          row.innerHTML = `
            <div class="recent-search-left">
              <div class="history-clock-box">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <span class="recent-query-text">${songTitle} <span style="font-weight:400; color:#86EFAC; font-size:13px;">• ${artistName}</span></span>
            </div>
            <div class="recent-search-right">
              <button class="recent-action-btn fill-query-btn" title="Use Query"><i class="fa-solid fa-arrow-up-long" style="transform: rotate(-45deg);"></i></button>
            </div>
          `;

          row.addEventListener('click', (e) => {
            if (e.target.closest('.fill-query-btn')) {
              e.stopPropagation();
              const input = document.getElementById('phoneSearchInput');
              if (input) input.value = songTitle;
              this.fetchTextSuggestions(songTitle);
            } else {
              const input = document.getElementById('phoneSearchInput');
              if (input) input.value = songTitle;
              this.executePhoneSearch(songTitle, true);
            }
          });

          suggestionsContainer.appendChild(row);
        });
      } else {
        suggestionsContainer.innerHTML = `<div class="text-muted" style="padding:16px; font-size:13px; text-align:center;">No song suggestions for "${query}"</div>`;
      }
    }
  }

  // --- Display Exact Result Screen ---
  async executePhoneSearch(query, saveToHistory = true) {
    if (!query) return;

    if (saveToHistory) this.addRecentSearch(query);

    this.switchView('viewSearchResults');

    const headerTitle = document.getElementById('resultsHeaderTitle');
    const topList = document.getElementById('resultsTopList');
    const playlistsList = document.getElementById('resultsPlaylistsList');

    if (headerTitle) headerTitle.textContent = query;
    if (topList) topList.innerHTML = '<div class="text-muted" style="padding:16px 0; text-align:center;">Searching tracks...</div>';
    if (playlistsList) playlistsList.innerHTML = '<div class="text-muted" style="padding:16px 0; text-align:center;">Loading playlists...</div>';

    const results = await queryiTunesAPI(query, 25);

    if (results && results.length > 0) {
      const fetchedTracks = results.map((item) => {
        const rawArt = item.artworkUrl100 || '';
        const artHD = rawArt ? rawArt.replace(/\/100x100bb/g, '/600x600bb').replace(/\/100x100/g, '/600x600') : 'esse_cara.jpg';
        const artThumb = rawArt ? rawArt.replace(/\/100x100bb/g, '/300x300bb').replace(/\/100x100/g, '/300x300') : 'esse_cara.jpg';

        return {
          id: `itunes_${item.trackId}`,
          title: item.trackName,
          artist: item.artistName,
          album: item.collectionName || "Single",
          genre: item.primaryGenreName || "Music",
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : "",
          art: artHD,
          artThumb: artThumb,
          audio: item.previewUrl,
          duration: 30,
          liked: false
        };
      });

      // Render Section 1: Top result
      if (topList) {
        topList.innerHTML = '';
        fetchedTracks.slice(0, 3).forEach(track => {
          const item = document.createElement('div');
          item.className = 'track-item';
          item.innerHTML = `
            <div class="track-left">
              <img src="${track.artThumb}" alt="${track.title}" class="track-thumb" onerror="this.src='esse_cara.jpg'">
              <div class="track-details">
                <h4>${track.title}</h4>
                <p>Episode • ${track.artist}</p>
              </div>
            </div>
            <button class="track-more-btn" title="Options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          `;

          item.addEventListener('click', (e) => {
            if (!e.target.closest('.track-more-btn')) {
              this.playSpecificTrack(track);
            }
          });

          topList.appendChild(item);
        });
      }

      // Render Section 2: Playlists
      if (playlistsList) {
        playlistsList.innerHTML = '';
        const playlistTitles = [
          `Lata Mangeshkar: 70s Hits`,
          `Hindi Hits 2025`,
          `Slow Romantic Punjabi Songs`,
          `Motivational songs | Inspirational Songs`,
          `All HIT Songs of Dharmendra`,
          `Govinda's Hit Songs`
        ];

        fetchedTracks.slice(0, 6).forEach((track, idx) => {
          const title = playlistTitles[idx] || `${track.artist} Playlist`;
          const subText = idx % 2 === 0 ? `YouTube Music • ${40 + idx * 10} songs` : `SuperHit Gaane • ${(idx + 2) * 3}.5M views`;

          const item = document.createElement('div');
          item.className = 'track-item';
          item.innerHTML = `
            <div class="track-left">
              <img src="${track.artThumb}" alt="${title}" class="track-thumb" onerror="this.src='esse_cara.jpg'">
              <div class="track-details">
                <h4>${title}</h4>
                <p>${subText}</p>
              </div>
            </div>
            <button class="track-more-btn" title="Options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          `;

          item.addEventListener('click', (e) => {
            if (!e.target.closest('.track-more-btn')) {
              this.playSpecificTrack(track);
            }
          });

          playlistsList.appendChild(item);
        });
      }
    } else {
      if (topList) topList.innerHTML = `<div class="text-muted" style="padding:16px 0; text-align:center;">No top results found.</div>`;
      if (playlistsList) playlistsList.innerHTML = `<div class="text-muted" style="padding:16px 0; text-align:center;">No playlists found.</div>`;
    }
  }

  bindResultsEvents() {
    document.querySelectorAll('.results-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.results-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  playSpecificTrack(track) {
    const existingIdx = this.playlist.findIndex(t => t.id === track.id);
    if (existingIdx !== -1) {
      this.loadTrack(existingIdx, true);
    } else {
      this.playlist.unshift(track);
      this.renderQuickPicks();
      this.loadTrack(0, true);
    }
    this.switchView('viewNowPlaying');
  }

  // --- Explore Screen Cards Interaction ---
  bindExploreEvents() {
    document.querySelectorAll('.explore-card').forEach(card => {
      card.addEventListener('click', () => {
        const query = card.getAttribute('data-query');
        if (query) {
          this.switchView('viewSearchInput');
          const phoneInput = document.getElementById('phoneSearchInput');
          if (phoneInput) phoneInput.value = query;
          this.executePhoneSearch(query, true);
        }
      });
    });
  }

  // --- Stats API Integration (uses mock / fallback since it is local) ---
  async fetchGlobalStats() {
    // Generate simulated global users stats
    const mockUsers = [
      { rank: 1, name: "izelkuro", totalListenMs: 308 * 60 * 60 * 1000, profileUrl: null },
      { rank: 2, name: "Sprce", totalListenMs: 289 * 60 * 60 * 1000, profileUrl: null },
      { rank: 3, name: "Kartik", totalListenMs: 244 * 60 * 60 * 1000, profileUrl: null },
      { rank: 4, name: "Likith Yadav", totalListenMs: 232 * 60 * 60 * 1000, profileUrl: USER_AVATAR_URL },
      { rank: 5, name: "Sajidbhat", totalListenMs: 231 * 60 * 60 * 1000, profileUrl: null },
      { rank: 6, name: "Aryan", totalListenMs: 184 * 60 * 60 * 1000, profileUrl: null }
    ];
    this.renderGlobalStats(mockUsers);
  }

  renderGlobalStats(users) {
    const container = document.getElementById('globalStatsList');
    if (!container) return;

    const topUser = users[0];
    const topHours = Math.floor(topUser.totalListenMs / (1000 * 60 * 60));

    const hlTopListener = document.getElementById('hlTopListener');
    if (hlTopListener) hlTopListener.textContent = `${topHours}h`;

    const globalSub = document.getElementById('globalStatsMostListened');
    if (globalSub) globalSub.textContent = `Most listened: ${topUser.name} • Total Use...`;

    const userMe = users.find(u => u.name && u.name.toLowerCase().includes('likith')) || users[3];
    const hlYourRank = document.getElementById('hlYourRank');
    if (hlYourRank && userMe) hlYourRank.textContent = `#${userMe.rank}`;

    container.innerHTML = '';
    users.forEach((user) => {
      const hours = Math.floor(user.totalListenMs / (1000 * 60 * 60));
      const isMe = user.name && user.name.toLowerCase().includes('likith');
      
      const item = document.createElement('div');
      item.className = `leaderboard-item ${isMe ? 'user-highlight' : ''}`;
      
      let avatarHTML = '';
      if (isMe) {
        avatarHTML = `<img src="${USER_AVATAR_URL}" alt="${user.name}" class="lb-avatar">`;
      } else {
        const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
        avatarHTML = `<div class="lb-avatar">${initial}</div>`;
      }

      let badgeHTML = '';
      if (user.rank === 1) badgeHTML = '<span class="lb-badge">🎯</span>';
      else if (user.rank <= 5) badgeHTML = '<span class="lb-badge">🎯</span>';

      item.innerHTML = `
        <div class="lb-left">
          <span class="lb-rank">#${user.rank}</span>
          ${avatarHTML}
          <span class="lb-name">${user.name} ${badgeHTML}</span>
        </div>
        <span class="lb-hours">${hours}h</span>
      `;
      container.appendChild(item);
    });
  }

  bindStatsEvents() {
    const btnRefreshStats = document.getElementById('btnRefreshStats');
    if (btnRefreshStats) {
      btnRefreshStats.addEventListener('click', () => {
        this.fetchGlobalStats();
      });
    }

    const chipHomeStats = document.getElementById('chipHomeStats');
    if (chipHomeStats) {
      chipHomeStats.addEventListener('click', () => {
        this.switchView('viewStats');
        this.fetchGlobalStats();
      });
    }

    document.querySelectorAll('.stats-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.stats-pill-btn').forEach(b => b.classList.remove('active-green'));
        btn.classList.add('active-green');
      });
    });
  }

  // --- Mini Player Slide Down / Swipe Gestures & Audio Auto-Pause ---
  initMiniPlayerSlideDown() {
    const miniPlayer = document.getElementById('screenMiniPlayer');
    const miniCloseBtn = document.getElementById('miniCloseBtn');
    if (!miniPlayer) return;

    const dismissMiniPlayer = () => {
      this.isMiniPlayerDismissed = true;
      this.pauseAudio();
      miniPlayer.classList.add('sliding-down');
      setTimeout(() => {
        miniPlayer.classList.add('hidden');
      }, 250);
    };

    if (miniCloseBtn) {
      miniCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissMiniPlayer();
      });
    }

    let startY = 0;
    let currentY = 0;
    let isSwiping = false;

    miniPlayer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        startY = e.touches[0].clientY;
        isSwiping = true;
      }
    });

    miniPlayer.addEventListener('touchmove', (e) => {
      if (!isSwiping || !e.touches || !e.touches[0]) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0) {
        miniPlayer.style.transform = `translateY(${deltaY}px)`;
      }
    });

    miniPlayer.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      const deltaY = currentY - startY;

      if (deltaY > 40) {
        dismissMiniPlayer();
      } else {
        miniPlayer.style.transform = 'translateY(0)';
      }
      startY = 0;
      currentY = 0;
    });

    let isMouseDown = false;
    miniPlayer.addEventListener('mousedown', (e) => {
      if (e.target.closest('.mini-controls')) return;
      startY = e.clientY;
      isMouseDown = true;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      currentY = e.clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        miniPlayer.style.transform = `translateY(${deltaY}px)`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const deltaY = currentY - startY;
      if (deltaY > 40) {
        dismissMiniPlayer();
      } else {
        miniPlayer.style.transform = 'translateY(0)';
      }
      startY = 0;
      currentY = 0;
    });
  }

  // --- Interactive Timeline Engine ---
  initTimelineScrubber() {
    const wrapper = document.getElementById('timelineWrapper');
    if (!wrapper) return;

    const updateFromPosition = (clientX) => {
      const rect = wrapper.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      let ratio = offsetX / rect.width;
      if (ratio < 0) ratio = 0;
      if (ratio > 1) ratio = 1;

      const dur = this.audio.duration || 30;
      const targetTime = ratio * dur;
      this.audio.currentTime = targetTime;
      this.updateTimelineUI(targetTime, dur);
    };

    wrapper.addEventListener('click', (e) => updateFromPosition(e.clientX));

    const onMouseMove = (e) => {
      if (this.isDraggingTimeline) updateFromPosition(e.clientX);
    };

    const onMouseUp = () => {
      if (this.isDraggingTimeline) {
        this.isDraggingTimeline = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    };

    wrapper.addEventListener('mousedown', (e) => {
      this.isDraggingTimeline = true;
      updateFromPosition(e.clientX);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        this.isDraggingTimeline = true;
        updateFromPosition(e.touches[0].clientX);
      }
    });

    wrapper.addEventListener('touchmove', (e) => {
      if (this.isDraggingTimeline && e.touches && e.touches[0]) {
        updateFromPosition(e.touches[0].clientX);
      }
    });

    wrapper.addEventListener('touchend', () => {
      this.isDraggingTimeline = false;
    });

    this.audio.addEventListener('loadedmetadata', () => {
      const dur = this.audio.duration || 30;
      document.getElementById('totalTimeText').textContent = this.formatTime(dur);
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.isDraggingTimeline) {
        const cur = this.audio.currentTime || 0;
        const dur = this.audio.duration || 30;
        this.updateTimelineUI(cur, dur);
      }
    });

    this.audio.addEventListener('ended', () => this.nextTrack());
  }

  resetTimeline() {
    this.updateTimelineUI(0, 30);
  }

  updateTimelineUI(currentTime, duration) {
    const dur = duration > 0 ? duration : 30;
    const pct = Math.min(Math.max((currentTime / dur) * 100, 0), 100);

    const progressBar = document.getElementById('timelineProgress');
    const thumb = document.getElementById('timelineThumb');
    const miniLine = document.getElementById('miniProgressLine');

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (thumb) thumb.style.left = `${pct}%`;
    if (miniLine) miniLine.style.width = `${pct}%`;

    const curText = document.getElementById('currentTimeText');
    if (curText) curText.textContent = this.formatTime(currentTime);

    const durText = document.getElementById('totalTimeText');
    if (durText) durText.textContent = this.formatTime(dur);
  }

  // --- Settings Screen Events ---
  bindSettingsEvents() {
    const items = [
      { id: 'itemAppearance', name: 'Appearance' },
      { id: 'itemAOD', name: 'Always On Display' },
      { id: 'itemAccount', name: 'Account' },
      { id: 'itemContent', name: 'Content' },
      { id: 'itemPlayerAudio', name: 'Player and audio' },
      { id: 'itemListenTogether', name: 'Listen Together' }
    ];

    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        el.addEventListener('click', () => {
          // Action if desired
        });
      }
    });
  }

  // --- Library Events & Actions ---
  bindLibraryEvents() {
    const btnLibSearch = document.getElementById('btnLibSearch');
    if (btnLibSearch) btnLibSearch.addEventListener('click', () => this.switchView('viewSearchInput'));

    const btnLibSettings = document.getElementById('btnLibSettings');
    if (btnLibSettings) btnLibSettings.addEventListener('click', () => this.switchView('viewSettings'));

    document.querySelectorAll('.lib-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.lib-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const tab = chip.getAttribute('data-tab');
        if (tab === 'playlists' || tab === 'songs') {
          this.openLikedSongsScreen();
        }
      });
    });

    const btnLibSort = document.getElementById('btnLibSort');
    if (btnLibSort) {
      btnLibSort.addEventListener('click', () => {
        this.playlist.reverse();
        this.renderQuickPicks();
        this.renderLikedTracks();
      });
    }

    const cardLibLiked = document.getElementById('cardLibLiked');
    if (cardLibLiked) {
      cardLibLiked.addEventListener('click', () => {
        this.openLikedSongsScreen();
      });
    }
  }

  openLikedSongsScreen() {
    this.renderLikedTracks();
    this.switchView('viewLikedSongs');
  }

  renderQuickPicks() {
    const container = document.getElementById('quickPicksList');
    if (!container) return;

    container.innerHTML = '';
    this.playlist.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = `track-item ${index === this.currentIndex ? 'playing' : ''}`;
      item.setAttribute('data-id', track.id);
      item.innerHTML = `
        <div class="track-left">
          <img src="${track.artThumb || track.art}" alt="${track.title}" class="track-thumb" onerror="this.src='esse_cara.jpg'">
          <div class="track-details">
            <h4>${track.title}</h4>
            <p>${track.artist}</p>
          </div>
        </div>
        <button class="track-more-btn" data-index="${index}"><i class="fa-solid fa-ellipsis-vertical"></i></button>
      `;

      item.addEventListener('click', (e) => {
        if (!e.target.closest('.track-more-btn')) {
          this.loadTrack(index, true);
          this.switchView('viewNowPlaying');
        }
      });

      container.appendChild(item);
    });
  }

  renderLikedTracks() {
    const container = document.getElementById('likedTracksList');
    const subtitle = document.getElementById('likedCountSubtitle');
    if (!container) return;

    const liked = this.playlist.filter(t => t.liked);
    if (subtitle) subtitle.textContent = `${liked.length} favorite songs`;

    container.innerHTML = '';

    if (liked.length === 0) {
      container.innerHTML = '<div class="text-muted" style="padding:24px 0; text-align:center;">No liked songs yet. Tap ❤️ on any track to add!</div>';
      return;
    }

    liked.forEach((track) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      item.setAttribute('data-id', track.id);
      item.innerHTML = `
        <div class="track-left">
          <img src="${track.artThumb || track.art}" alt="${track.title}" class="track-thumb" onerror="this.src='esse_cara.jpg'">
          <div class="track-details">
            <h4>${track.title}</h4>
            <p>${track.artist} • ${track.album}</p>
          </div>
        </div>
        <button class="icon-btn play-search-btn" title="Play Track"><i class="fa-solid fa-play"></i></button>
      `;
      item.addEventListener('click', () => {
        const idx = this.playlist.findIndex(t => t.id === track.id);
        if (idx !== -1) {
          this.loadTrack(idx, true);
          this.switchView('viewNowPlaying');
        }
      });
      container.appendChild(item);
    });
  }

  bindEvents() {
    document.querySelectorAll('.liquid-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-target');
        this.switchView(targetView);
      });
    });

    const miniInfo = document.getElementById('miniPlayerOpenNowPlaying');
    if (miniInfo) {
      miniInfo.addEventListener('click', () => this.switchView('viewNowPlaying'));
    }

    const btnGoSearch = document.getElementById('btnGoSearch');
    if (btnGoSearch) {
      btnGoSearch.addEventListener('click', () => {
        this.switchView('viewSearchInput');
        setTimeout(() => {
          const input = document.getElementById('phoneSearchInput');
          if (input) input.focus();
        }, 100);
      });
    }

    const btnGoSettings = document.getElementById('btnGoSettings');
    if (btnGoSettings) {
      btnGoSettings.addEventListener('click', () => this.switchView('viewSettings'));
    }

    const playBtn = document.getElementById('btnPlayPause');
    if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());

    const miniPlayBtn = document.getElementById('miniPlayBtn');
    if (miniPlayBtn) miniPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePlay();
    });

    const prevBtn = document.getElementById('btnPrev');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevTrack());

    const nextBtn = document.getElementById('btnNext');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());

    const shuffleBtn = document.getElementById('btnShuffle');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        this.isShuffle = !this.isShuffle;
        shuffleBtn.classList.toggle('active', this.isShuffle);
      });
    }

    const webSearchBtn = document.getElementById('webSearchBtn');
    const webSearchInput = document.getElementById('webSearchInput');
    if (webSearchBtn && webSearchInput) {
      const doWebSearch = () => {
        const q = webSearchInput.value.trim();
        if (q) {
          const phoneInput = document.getElementById('phoneSearchInput');
          if (phoneInput) phoneInput.value = q;
          this.switchView('viewSearchInput');
          this.executePhoneSearch(q, true);
        }
      };
      webSearchBtn.addEventListener('click', doWebSearch);
      webSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doWebSearch(); });
    }

    document.querySelectorAll('.chip-item').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip-item').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        if (filter === 'history') {
          this.renderQuickPicks();
        } else if (filter === 'stats') {
          this.switchView('viewStats');
          this.fetchGlobalStats();
        } else if (filter === 'liked') {
          this.openLikedSongsScreen();
        } else {
          this.switchView('viewSearchInput');
          const phoneInput = document.getElementById('phoneSearchInput');
          if (phoneInput) phoneInput.value = filter;
          this.executePhoneSearch(filter, true);
        }
      });
    });

    const btnDownload = document.getElementById('btnDownload');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        const cur = this.playlist[this.currentIndex];
        window.open(cur.audio, '_blank');
      });
    }

    const btnRadio = document.getElementById('btnRadio');
    if (btnRadio) {
      btnRadio.addEventListener('click', () => {
        const cur = this.playlist[this.currentIndex];
        this.switchView('viewSearchInput');
        const phoneInput = document.getElementById('phoneSearchInput');
        if (phoneInput) phoneInput.value = cur.artist;
        this.executePhoneSearch(cur.artist, true);
      });
    }

    const btnSleepTimer = document.getElementById('btnSleepTimer');
    if (btnSleepTimer) {
      btnSleepTimer.addEventListener('click', () => {
        document.getElementById('sleepTimerModal').classList.remove('hidden');
      });
    }

    const closeSleepModal = document.getElementById('closeSleepModal');
    if (closeSleepModal) {
      closeSleepModal.addEventListener('click', () => {
        document.getElementById('sleepTimerModal').classList.add('hidden');
      });
    }

    document.querySelectorAll('.timer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mins = parseInt(btn.getAttribute('data-time'));

        if (this.sleepTimer) clearTimeout(this.sleepTimer);
        if (mins > 0) {
          this.sleepTimer = setTimeout(() => {
            this.pauseAudio();
          }, mins * 60 * 1000);
          document.getElementById('timerStatusText').textContent = `Timer set for ${mins} minutes`;
        } else {
          document.getElementById('timerStatusText').textContent = "No timer set";
        }
        document.getElementById('sleepTimerModal').classList.add('hidden');
      });
    });

    const toggleLikeCurrent = () => {
      const cur = this.playlist[this.currentIndex];
      cur.liked = !cur.liked;
      this.updateUI(cur);
      this.renderLikedTracks();
    };

    const npLike = document.getElementById('btnNPLike');
    if (npLike) npLike.addEventListener('click', toggleLikeCurrent);

    const keepLike = document.getElementById('keepLikeBtn');
    if (keepLike) keepLike.addEventListener('click', toggleLikeCurrent);

    const miniLike = document.getElementById('miniLikeBtn');
    if (miniLike) miniLike.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLikeCurrent();
    });
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.auralisApp = new AuralisApp();
});
