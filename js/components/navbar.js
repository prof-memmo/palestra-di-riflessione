function initNavigation() {
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.querySelector('.navbar');

    window.toggleSidebar = function(show) {
        if (show) {
            sidebar.classList.remove('hidden');
            if (openBtn) {
                openBtn.classList.add('hidden');
                openBtn.classList.remove('visible');
            }
            document.querySelector('main').classList.remove('full-width');
            document.querySelector('.footer').classList.remove('full-width');
        } else {
            sidebar.classList.add('hidden');
            if (openBtn) {
                openBtn.classList.remove('hidden');
                openBtn.classList.add('visible');
            }
            document.querySelector('main').classList.add('full-width');
            document.querySelector('.footer').classList.add('full-width');
        }
    }

    openBtn?.addEventListener('click', () => toggleSidebar(true));
    closeBtn?.addEventListener('click', () => toggleSidebar(false));

    // Use event delegation for all navigation items (even dynamic ones)
    document.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            e.preventDefault();
            const section = navItem.getAttribute('data-section');
            if (section) navigateTo(section);
            
            // Chiudi sidebar dopo il click su mobile
            if (window.innerWidth <= 1024) {
                toggleSidebar(false);
            }
            return;
        }

        if (window.innerWidth <= 1024) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnOpenBtn = openBtn?.contains(e.target);
            if (!isClickInsideSidebar && !isClickOnOpenBtn && !sidebar.classList.contains('hidden')) {
                toggleSidebar(false);
            }
        }
    });

    if (window.innerWidth > 1024) {
        toggleSidebar(true);
    } else {
        toggleSidebar(false);
    }
}
\n\nfunction navigateTo(section, subType = null, level = null, updateHash = true, extra = null) {
    if (!window.collapsedSections) window.collapsedSections = [];

    if (updateHash) {
        if (section !== window.currentSection) {
            window.collapsedSections = [];
        }
        const targetId = subType || section;

        let cursor = window.currentSection;
        if (window.currentExtra && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentExtra]) cursor = window.currentExtra;
        else if (window.currentLevel && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentLevel]) cursor = window.currentLevel;
        else if (window.currentSubType && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentSubType]) cursor = window.currentSubType;

        const currentPath = [];
        while (cursor && cursor !== 'materie') {
            currentPath.unshift(cursor);
            let parent = null;
            if (window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[cursor]) {
                parent = window.MATERIE_HIERARCHY[cursor].parent;
            } else if (window.MATERIE_HIERARCHY) {
                for (const k in window.MATERIE_HIERARCHY) {
                    if (window.MATERIE_HIERARCHY[k].items && window.MATERIE_HIERARCHY[k].items.some(item => item.id === cursor)) {
                        parent = k;
                        break;
                    }
                }
            }
            cursor = parent;
        }

        let hash = `#${section}`;
        if (subType) hash += `/${subType}`;
        if (level) hash += `/${level}`;
        if (extra) hash += `/${extra}`;

        if (currentPath.includes(targetId)) {
            const isDifferentView = (section !== window.currentSection) ||
                (subType !== window.currentSubType) ||
                (level !== window.currentLevel) ||
                (extra !== window.currentExtra);

            if (!isDifferentView) {
                const idx = window.collapsedSections.indexOf(targetId);
                if (idx > -1) window.collapsedSections.splice(idx, 1);
                else window.collapsedSections.push(targetId);
                if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
                return;
            }
        } else {
            const idx = window.collapsedSections.indexOf(targetId);
            if (idx > -1) window.collapsedSections.splice(idx, 1);
        }

        window.location.hash = hash;
        return;
    }

    const appContainer = document.getElementById('app');
    try {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        if (section === 'home' || section === '') {
            window.currentSection = 'home';
            window.currentSubType = null;
            window.currentLevel = null;
            window.currentExtra = null;
            window.collapsedSections = [];
            renderHomePage();
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelector('.nav-item[data-section="home"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }

        if (section === 'contatti') {
            window.currentSection = 'contatti';
            window.currentSubType = null;
            window.currentLevel = null;
            window.currentExtra = null;
            renderContattiPage();
            document.querySelector('.nav-item[data-section="contatti"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }
        if (section === 'profilo') {
            renderProfiloPage();
            document.querySelector('.nav-item[data-section="profilo"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }
        if (section === 'admin') {
            const user = Auth.getUser();
            if (user.role === 'admin') {
                renderAdminPage();
            } else {
                window.location.hash = 'home';
            }
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }
        if (section === 'ripassa') {
            renderRipassaPage();
            document.querySelector('.nav-item[data-section="ripassa"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }
        if (section === 'culturagenerale') {
            window.currentSection = 'culturagenerale';
            window.currentSubType = null;
            window.currentLevel = null;
            window.currentExtra = null;
            document.querySelector('.nav-item[data-section="culturagenerale"]')?.classList.add('active');
            const appContainer = document.getElementById('app');
            appContainer.innerHTML = '<div id="exercise-mount"></div>';
            const mount = document.getElementById('exercise-mount');
            const user = Auth.getUser();
            if (user.role === 'docente' || user.role === 'admin') {
                CulturaGenerale.renderTeacherDashboard(mount);
            } else {
                CulturaGenerale.renderStudentDashboard(mount);
            }
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }

        document.querySelector(`.nav-item[data-section="${section}"]`)?.classList.add('active');
        appContainer.innerHTML = '<div id="exercise-mount"></div>';

        currentSection = section; currentSubType = subType; currentLevel = level; currentExtra = extra;
        window.currentSubQuestionIndex = 0;

        const pathKey = `progress_${section}_${subType}_${level}_${extra}`;
        if (window.currentPathKey !== pathKey) {
            window.currentExerciseIndex = (extra === 'scopri' || level === 'scopri' || subType === 'scopri') ? 0 : parseInt(localStorage.getItem(pathKey) || '0');
            window.currentPathKey = pathKey;
        }

        const isActualLevel = ['facile', 'intermedio', 'avanzato', 'sfida', 'difficile', 'a1', 'a2', 'b1', 'b2'].includes(extra || level || subType);
        const isUdaPhase = ['scopri', 'allenati', 'verifica', 'recupera'].includes(extra) ||
            ['scopri', 'allenati', 'verifica', 'recupera'].includes(level) ||
            ['scopri', 'allenati', 'verifica', 'recupera'].includes(subType);

        const currentId = extra || level || subType || section;

        // Reconstruct the full hierarchical path for robust data resolution
        const resolvedPath = [];
        let resolveCursor = currentId;
        const phases = ['scopri', 'allenati', 'verifica', 'recupera'];
        const levels = ['facile', 'intermedio', 'avanzato', 'sfida', 'difficile', 'a1', 'a2', 'b1', 'b2'];

        if (phases.includes(resolveCursor) || levels.includes(resolveCursor)) {
            resolvedPath.unshift(resolveCursor);
            resolveCursor = (currentId === extra) ? (level || subType || section) : (currentId === level ? (subType || section) : section);
        }

        while (resolveCursor && resolveCursor !== 'materie') {
            resolvedPath.unshift(resolveCursor);
            let parent = null;
            if (MATERIE_HIERARCHY[resolveCursor]) {
                parent = MATERIE_HIERARCHY[resolveCursor].parent;
            } else {
                for (const k in MATERIE_HIERARCHY) {
                    if (MATERIE_HIERARCHY[k].items && MATERIE_HIERARCHY[k].items.some(i => i.id === resolveCursor)) {
                        parent = k;
                        break;
                    }
                }
            }
            resolveCursor = parent;
        }
        const fullPath = resolvedPath;

        if (isActualLevel) {
            const actualLevel = extra || level || subType;
            loadExercise(fullPath);
        } else if (isUdaPhase) {
            loadUdaPhase(fullPath);
        } else {
            let target = MATERIE_HIERARCHY[currentId];
            if (!target) {
                for (const k in MATERIE_HIERARCHY) {
                    if (MATERIE_HIERARCHY[k].items) {
                        const item = MATERIE_HIERARCHY[k].items.find(i => i.id === currentId);
                        if (item) { target = item; break; }
                    }
                }
            }
            if (target?.type === 'submenu') renderSubMateriePage(currentId);
            else if (target?.type === 'exercises') renderLevelSelector(currentId, fullPath);
            else if (target?.type === 'uda') {
                if (['tecnica0', 'tecnica1', 'tecnica2', 'tecnica3'].includes(currentId)) {
                    navigateTo(currentId, 'scopri');
                } else {
                    renderUdaMenu(currentId, fullPath);
                }
            }
            else mountError("Tipo di contenuto non riconosciuto: " + (target?.type || 'sconosciuto') + " per " + currentId);
        }
        if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
    } catch (err) {
        console.error("Routing error:", err);
        appContainer.innerHTML = `
            <div class="exercise-container" style="text-align: center; padding: 3rem;">
                <h2>⚠️ Errore di Caricamento</h2>
                <p style="margin-top: 1rem; color: #666;">Si è verificato un errore durante la navigazione.</p>
                <p style="font-family: monospace; background: #fff0f0; color: #d32f2f; padding: 1rem; border-radius: 10px; margin: 1.5rem 0; font-size: 0.9rem;">${err.message}</p>
                <button class="btn btn-primary" onclick="navigateTo('home')">TORNA ALLA HOME</button>
            </div>
        `;
    }
}
\n