/* ================================================================
   theme.js
   TIMAWA — Shared theme system
   Loaded SYNCHRONOUSLY in <head> after theme.css, before page render.
   Provides: applyTheme, THEMES, injectThemeShapes, BroadcastChannel sync.
   ================================================================ */

(function () {
    'use strict';

    // ================================================================
    // ===== CONSTANTS =====
    // ================================================================
    window.THEME_STORAGE_KEY = 'timawa_theme';
    window.THEME_EVENT = 'timawa-theme-change';

    // ================================================================
    // ===== THEME SHAPES (HTML for each preset's animated background) =====
    // ================================================================
    window.THEME_SHAPES = {
        ocean: `
            <div class="shape ocean-wave"></div>
            <div class="shape ocean-wave w2"></div>
            <div class="shape ocean-bubble b1"></div>
            <div class="shape ocean-bubble b2"></div>
            <div class="shape ocean-bubble b3"></div>
            <div class="shape ocean-bubble b4"></div>
            <div class="shape ocean-fish f1"></div>
            <div class="shape ocean-fish f2"></div>
        `,
        sunset: `
            <div class="shape sunset-ray"></div>
            <div class="shape sunset-glow g1"></div>
            <div class="shape sunset-glow g2"></div>
            <div class="shape sunset-cloud c1"></div>
            <div class="shape sunset-cloud c2"></div>
        `,
        pink: `
            <div class="shape petal p1"></div>
            <div class="shape petal p2"></div>
            <div class="shape petal p3"></div>
            <div class="shape petal p4"></div>
            <div class="shape petal p5"></div>
            <div class="shape petal p6"></div>
            <div class="shape blossom b1"></div>
            <div class="shape blossom b2"></div>
            <div class="shape blossom b3"></div>
        `,
        forest: `
            <div class="shape leaf l1"></div>
            <div class="shape leaf l2"></div>
            <div class="shape leaf l3"></div>
            <div class="shape leaf l4"></div>
            <div class="shape leaf l5"></div>
            <div class="shape fern f1"></div>
            <div class="shape fern f2"></div>
        `,
        sunshine: `
            <div class="shape sunbeam s1"></div>
            <div class="shape sunbeam s2"></div>
            <div class="shape sunbeam s3"></div>
            <div class="shape sunbeam s4"></div>
            <div class="shape sun-dot d1"></div>
            <div class="shape sun-dot d2"></div>
            <div class="shape sun-dot d3"></div>
            <div class="shape sun-dot d4"></div>
            <div class="shape sun-ring r1"></div>
            <div class="shape sun-ring r2"></div>
        `,
        starry: `
            <div class="shape starfield"></div>
            <div class="shape starfield starfield-2"></div>
            <div class="shape shooting-star sh1"></div>
            <div class="shape shooting-star sh2"></div>
            <div class="shape nebula n1"></div>
            <div class="shape nebula n2"></div>
        `,
        cafe: `
            <div class="shape coffee-ring cr1"></div>
            <div class="shape coffee-ring cr2"></div>
            <div class="shape coffee-ring cr3"></div>
            <div class="shape coffee-ring cr4"></div>
            <div class="shape bean bn1"></div>
            <div class="shape bean bn2"></div>
            <div class="shape bean bn3"></div>
            <div class="shape bean bn4"></div>
            <div class="shape steam st1"></div>
            <div class="shape steam st2"></div>
        `,
        crimson: `
            <div class="shape crimson-orb o1"></div>
            <div class="shape crimson-orb o2"></div>
            <div class="shape crimson-orb o3"></div>
            <div class="shape crimson-streak cs1"></div>
            <div class="shape crimson-streak cs2"></div>
            <div class="shape crimson-streak cs3"></div>
            <div class="shape crimson-diamond cd1"></div>
            <div class="shape crimson-diamond cd2"></div>
            <div class="shape crimson-diamond cd3"></div>
        `,
        maroon: `
            <div class="shape maroon-blob mb1"></div>
            <div class="shape maroon-blob mb2"></div>
            <div class="shape maroon-blob mb3"></div>
            <div class="shape maroon-ring mr1"></div>
            <div class="shape maroon-ring mr2"></div>
            <div class="shape maroon-ring mr3"></div>
            <div class="shape maroon-triangle mt1"></div>
            <div class="shape maroon-triangle mt2"></div>
            <div class="shape maroon-triangle mt3"></div>
        `
    };

    // ================================================================
    // ===== THEMES (palette definitions) =====
    // ================================================================
    window.THEMES = {
        ocean: {
            name: 'Ocean', sub: 'Fresh · Cool', emoji: '🌊',
            preview: { primary: '#1089d3', gradient: 'linear-gradient(135deg, #1089d3 0%, #12b1d1 100%)' },
            light: {
                '--theme-primary': '#1089d3', '--theme-accent': '#12b1d1', '--theme-primary-dark': '#0c6ca8',
                '--theme-primary-soft': '#e0f2fe', '--theme-primary-soft-2': '#f0f7ff',
                '--theme-bg': '#ffffff', '--theme-bg-soft': '#f8faff', '--theme-card': '#ffffff',
                '--theme-text': '#1a1a2e', '--theme-text-muted': '#555', '--theme-text-dim': '#888', '--theme-text-faint': '#aaa',
                '--theme-border': '#eef2f7', '--theme-border-soft': '#f0f4ff', '--theme-border-input': '#e0e7ff',
                '--theme-gradient': 'linear-gradient(45deg, #1089d3 0%, #12b1d1 100%)',
                '--theme-shadow': 'rgba(133, 189, 215, 0.15)', '--theme-shadow-soft': '#cff0ff',
                '--theme-nav-bg': 'rgba(255, 255, 255, 0.98)'
            },
            dark: {
                '--theme-primary': '#4dabf7', '--theme-accent': '#5ac8fa', '--theme-primary-dark': '#339af0',
                '--theme-primary-soft': '#1a2b3d', '--theme-primary-soft-2': '#0f1a26',
                '--theme-bg': '#0a1118', '--theme-bg-soft': '#131b24', '--theme-card': '#131b24',
                '--theme-text': '#e6f0f9', '--theme-text-muted': '#a0b3c5', '--theme-text-dim': '#7a8fa3', '--theme-text-faint': '#5a6b7d',
                '--theme-border': '#1f2a37', '--theme-border-soft': '#16202b', '--theme-border-input': '#1f2a37',
                '--theme-gradient': 'linear-gradient(45deg, #4dabf7 0%, #5ac8fa 100%)',
                '--theme-shadow': 'rgba(77, 171, 247, 0.2)', '--theme-shadow-soft': 'rgba(77, 171, 247, 0.15)',
                '--theme-nav-bg': 'rgba(10, 17, 24, 0.98)'
            }
        },
        sunset: {
            name: 'Sunset', sub: 'Warm · Bold', emoji: '🌅',
            preview: { primary: '#f5576c', gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)' },
            light: {
                '--theme-primary': '#f5576c', '--theme-accent': '#f093fb', '--theme-primary-dark': '#c73a52',
                '--theme-primary-soft': '#ffe4e6', '--theme-primary-soft-2': '#fff1f2',
                '--theme-bg': '#ffffff', '--theme-bg-soft': '#fff8f9', '--theme-card': '#ffffff',
                '--theme-text': '#2e1a1e', '--theme-text-muted': '#6b4a50', '--theme-text-dim': '#9c7a80', '--theme-text-faint': '#c4a5aa',
                '--theme-border': '#fdeef0', '--theme-border-soft': '#fef5f6', '--theme-border-input': '#fde0e3',
                '--theme-gradient': 'linear-gradient(45deg, #f5576c 0%, #f093fb 100%)',
                '--theme-shadow': 'rgba(245, 87, 108, 0.15)', '--theme-shadow-soft': 'rgba(245, 87, 108, 0.2)',
                '--theme-nav-bg': 'rgba(255, 255, 255, 0.98)'
            },
            dark: {
                '--theme-primary': '#ff6b7e', '--theme-accent': '#ff9db0', '--theme-primary-dark': '#e04458',
                '--theme-primary-soft': '#3d1f26', '--theme-primary-soft-2': '#1e0f13',
                '--theme-bg': '#1a0e11', '--theme-bg-soft': '#241318', '--theme-card': '#241318',
                '--theme-text': '#fbe5e8', '--theme-text-muted': '#c9a0a7', '--theme-text-dim': '#a57a82', '--theme-text-faint': '#7d5a61',
                '--theme-border': '#3a1f26', '--theme-border-soft': '#2a151b', '--theme-border-input': '#3a1f26',
                '--theme-gradient': 'linear-gradient(45deg, #ff6b7e 0%, #ff9db0 100%)',
                '--theme-shadow': 'rgba(255, 107, 126, 0.25)', '--theme-shadow-soft': 'rgba(255, 107, 126, 0.18)',
                '--theme-nav-bg': 'rgba(26, 14, 17, 0.98)'
            }
        },
        pink: {
            name: 'Blossom', sub: 'Soft · Sweet', emoji: '🌸',
            preview: { primary: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)' },
            light: {
                '--theme-primary': '#ec4899', '--theme-accent': '#f9a8d4', '--theme-primary-dark': '#be185d',
                '--theme-primary-soft': '#fce7f3', '--theme-primary-soft-2': '#fdf2f8',
                '--theme-bg': '#ffffff', '--theme-bg-soft': '#fff7fb', '--theme-card': '#ffffff',
                '--theme-text': '#2e1a26', '--theme-text-muted': '#6b4a5c', '--theme-text-dim': '#9c7a8c', '--theme-text-faint': '#c4a5b4',
                '--theme-border': '#fde8f1', '--theme-border-soft': '#fef3f9', '--theme-border-input': '#fbd5e5',
                '--theme-gradient': 'linear-gradient(45deg, #ec4899 0%, #f9a8d4 100%)',
                '--theme-shadow': 'rgba(236, 72, 153, 0.15)', '--theme-shadow-soft': 'rgba(236, 72, 153, 0.2)',
                '--theme-nav-bg': 'rgba(255, 255, 255, 0.98)'
            },
            dark: {
                '--theme-primary': '#f472b6', '--theme-accent': '#fbcfe8', '--theme-primary-dark': '#db2777',
                '--theme-primary-soft': '#3d1f30', '--theme-primary-soft-2': '#1e0f1a',
                '--theme-bg': '#1a0e16', '--theme-bg-soft': '#241320', '--theme-card': '#241320',
                '--theme-text': '#fbe5f0', '--theme-text-muted': '#c9a0b8', '--theme-text-dim': '#a57a95', '--theme-text-faint': '#7d5a70',
                '--theme-border': '#3a1f30', '--theme-border-soft': '#2a1522', '--theme-border-input': '#3a1f30',
                '--theme-gradient': 'linear-gradient(45deg, #f472b6 0%, #fbcfe8 100%)',
                '--theme-shadow': 'rgba(244, 114, 182, 0.25)', '--theme-shadow-soft': 'rgba(244, 114, 182, 0.18)',
                '--theme-nav-bg': 'rgba(26, 14, 22, 0.98)'
            }
        },
        forest: {
            name: 'Forest', sub: 'Fresh · Natural', emoji: '🌲',
            preview: { primary: '#16a34a', gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' },
            light: {
                '--theme-primary': '#16a34a', '--theme-accent': '#22c55e', '--theme-primary-dark': '#15803d',
                '--theme-primary-soft': '#dcfce7', '--theme-primary-soft-2': '#f0fdf4',
                '--theme-bg': '#ffffff', '--theme-bg-soft': '#f8fdf9', '--theme-card': '#ffffff',
                '--theme-text': '#0f2e1a', '--theme-text-muted': '#3d5c47', '--theme-text-dim': '#698072', '--theme-text-faint': '#9cb3a4',
                '--theme-border': '#e8f5ec', '--theme-border-soft': '#f0f9f2', '--theme-border-input': '#d1e7d8',
                '--theme-gradient': 'linear-gradient(45deg, #16a34a 0%, #22c55e 100%)',
                '--theme-shadow': 'rgba(22, 163, 74, 0.15)', '--theme-shadow-soft': 'rgba(22, 163, 74, 0.2)',
                '--theme-nav-bg': 'rgba(255, 255, 255, 0.98)'
            },
            dark: {
                '--theme-primary': '#4ade80', '--theme-accent': '#86efac', '--theme-primary-dark': '#22c55e',
                '--theme-primary-soft': '#14281a', '--theme-primary-soft-2': '#0a1810',
                '--theme-bg': '#08140d', '--theme-bg-soft': '#0f1e15', '--theme-card': '#0f1e15',
                '--theme-text': '#e0f2e6', '--theme-text-muted': '#a0c4ad', '--theme-text-dim': '#7a9c86', '--theme-text-faint': '#5a7c66',
                '--theme-border': '#1c3524', '--theme-border-soft': '#122319', '--theme-border-input': '#1c3524',
                '--theme-gradient': 'linear-gradient(45deg, #4ade80 0%, #86efac 100%)',
                '--theme-shadow': 'rgba(74, 222, 128, 0.25)', '--theme-shadow-soft': 'rgba(74, 222, 128, 0.18)',
                '--theme-nav-bg': 'rgba(8, 20, 13, 0.98)'
            }
        },
        sunshine: {
            name: 'Sunshine', sub: 'Bright · Cheery', emoji: '☀️',
            preview: { primary: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
            light: {
                '--theme-primary': '#f59e0b', '--theme-accent': '#fbbf24', '--theme-primary-dark': '#d97706',
                '--theme-primary-soft': '#fef3c7', '--theme-primary-soft-2': '#fffbeb',
                '--theme-bg': '#ffffff', '--theme-bg-soft': '#fffdf5', '--theme-card': '#ffffff',
                '--theme-text': '#2e2410', '--theme-text-muted': '#6b5a30', '--theme-text-dim': '#9c8a5c', '--theme-text-faint': '#c4b588',
                '--theme-border': '#fdf3dc', '--theme-border-soft': '#fef9ec', '--theme-border-input': '#fce8b3',
                '--theme-gradient': 'linear-gradient(45deg, #f59e0b 0%, #fbbf24 100%)',
                '--theme-shadow': 'rgba(245, 158, 11, 0.15)', '--theme-shadow-soft': 'rgba(245, 158, 11, 0.2)',
                '--theme-nav-bg': 'rgba(255, 255, 255, 0.98)'
            },
            dark: {
                '--theme-primary': '#fbbf24', '--theme-accent': '#fcd34d', '--theme-primary-dark': '#f59e0b',
                '--theme-primary-soft': '#3d3018', '--theme-primary-soft-2': '#1f1808',
                '--theme-bg': '#171207', '--theme-bg-soft': '#221a0c', '--theme-card': '#221a0c',
                '--theme-text': '#fbf3d9', '--theme-text-muted': '#c9baa0', '--theme-text-dim': '#a59578', '--theme-text-faint': '#7d7058',
                '--theme-border': '#3a2e15', '--theme-border-soft': '#2a210f', '--theme-border-input': '#3a2e15',
                '--theme-gradient': 'linear-gradient(45deg, #fbbf24 0%, #fcd34d 100%)',
                '--theme-shadow': 'rgba(251, 191, 36, 0.25)', '--theme-shadow-soft': 'rgba(251, 191, 36, 0.18)',
                '--theme-nav-bg': 'rgba(23, 18, 7, 0.98)'
            }
        },
        starry: {
            name: 'Starry', sub: 'Cosmic · Night', emoji: '✨',
            preview: { primary: '#8b5cf6', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6d28d9 50%, #c4b5fd 100%)' },
            light: {
                '--theme-primary': '#a78bfa', '--theme-accent': '#c4b5fd', '--theme-primary-dark': '#8b5cf6',
                '--theme-primary-soft': '#2a1e3d', '--theme-primary-soft-2': '#150e26',
                '--theme-bg': '#0a0714', '--theme-bg-soft': '#0e0818', '--theme-card': '#17102a',
                '--theme-text': '#e8e0ff', '--theme-text-muted': '#b0a0d0', '--theme-text-dim': '#8878b0', '--theme-text-faint': '#665a88',
                '--theme-border': '#281e3d', '--theme-border-soft': '#1a1229', '--theme-border-input': '#281e3d',
                '--theme-gradient': 'linear-gradient(45deg, #a78bfa 0%, #c4b5fd 100%)',
                '--theme-shadow': 'rgba(167, 139, 250, 0.3)', '--theme-shadow-soft': 'rgba(167, 139, 250, 0.2)',
                '--theme-nav-bg': 'rgba(10, 7, 20, 0.98)'
            },
            dark: {
                '--theme-primary': '#a78bfa', '--theme-accent': '#c4b5fd', '--theme-primary-dark': '#8b5cf6',
                '--theme-primary-soft': '#2a1e3d', '--theme-primary-soft-2': '#150e26',
                '--theme-bg': '#0a0714', '--theme-bg-soft': '#0e0818', '--theme-card': '#17102a',
                '--theme-text': '#e8e0ff', '--theme-text-muted': '#b0a0d0', '--theme-text-dim': '#8878b0', '--theme-text-faint': '#665a88',
                '--theme-border': '#281e3d', '--theme-border-soft': '#1a1229', '--theme-border-input': '#281e3d',
                '--theme-gradient': 'linear-gradient(45deg, #a78bfa 0%, #c4b5fd 100%)',
                '--theme-shadow': 'rgba(167, 139, 250, 0.3)', '--theme-shadow-soft': 'rgba(167, 139, 250, 0.2)',
                '--theme-nav-bg': 'rgba(10, 7, 20, 0.98)'
            }
        },
        cafe: {
            name: 'Café', sub: 'Warm · Cozy', emoji: '☕',
            preview: { primary: '#8B5E3C', gradient: 'linear-gradient(135deg, #8B5E3C 0%, #D2B48C 100%)' },
            light: {
                '--theme-primary': '#8B5E3C', '--theme-accent': '#D2B48C', '--theme-primary-dark': '#6B4226',
                '--theme-primary-soft': '#F5E6D3', '--theme-primary-soft-2': '#FAF3E8',
                '--theme-bg': '#FDF8F2', '--theme-bg-soft': '#F9F1E7', '--theme-card': '#FFFFFF',
                '--theme-text': '#3E2C1C', '--theme-text-muted': '#6B5A4A', '--theme-text-dim': '#9C8A7A', '--theme-text-faint': '#C4B5A5',
                '--theme-border': '#EDE0D0', '--theme-border-soft': '#F5EDE2', '--theme-border-input': '#DCC8B0',
                '--theme-gradient': 'linear-gradient(45deg, #8B5E3C 0%, #D2B48C 100%)',
                '--theme-shadow': 'rgba(139, 94, 60, 0.15)', '--theme-shadow-soft': 'rgba(139, 94, 60, 0.2)',
                '--theme-nav-bg': 'rgba(253, 248, 242, 0.98)'
            },
            dark: {
                '--theme-primary': '#C49A6C', '--theme-accent': '#D2B48C', '--theme-primary-dark': '#A67B5B',
                '--theme-primary-soft': '#3D2E1E', '--theme-primary-soft-2': '#1E150E',
                '--theme-bg': '#1A120B', '--theme-bg-soft': '#241A12', '--theme-card': '#241A12',
                '--theme-text': '#F0E6D8', '--theme-text-muted': '#C4B5A0', '--theme-text-dim': '#A09080', '--theme-text-faint': '#7D6E60',
                '--theme-border': '#3A2C1E', '--theme-border-soft': '#2A1E14', '--theme-border-input': '#3A2C1E',
                '--theme-gradient': 'linear-gradient(45deg, #C49A6C 0%, #D2B48C 100%)',
                '--theme-shadow': 'rgba(196, 154, 108, 0.25)', '--theme-shadow-soft': 'rgba(196, 154, 108, 0.18)',
                '--theme-nav-bg': 'rgba(26, 18, 11, 0.98)'
            }
        },
        crimson: {
            name: 'Crimson', sub: 'Bold · Passion', emoji: '❤️',
            preview: { primary: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)' },
            light: {
                '--theme-primary': '#dc2626', '--theme-accent': '#f87171', '--theme-primary-dark': '#b91c1c',
                '--theme-primary-soft': '#fee2e2', '--theme-primary-soft-2': '#fef2f2',
                '--theme-bg': '#ffffff', '--theme-bg-soft': '#fff5f5', '--theme-card': '#ffffff',
                '--theme-text': '#2e1a1a', '--theme-text-muted': '#6b4a4a', '--theme-text-dim': '#9c7a7a', '--theme-text-faint': '#c4a5a5',
                '--theme-border': '#fde8e8', '--theme-border-soft': '#fef3f3', '--theme-border-input': '#fbd5d5',
                '--theme-gradient': 'linear-gradient(45deg, #dc2626 0%, #f87171 100%)',
                '--theme-shadow': 'rgba(220, 38, 38, 0.15)', '--theme-shadow-soft': 'rgba(220, 38, 38, 0.2)',
                '--theme-nav-bg': 'rgba(255, 255, 255, 0.98)'
            },
            dark: {
                '--theme-primary': '#ef4444', '--theme-accent': '#fca5a5', '--theme-primary-dark': '#dc2626',
                '--theme-primary-soft': '#3d1a1a', '--theme-primary-soft-2': '#1e0e0e',
                '--theme-bg': '#1a0a0a', '--theme-bg-soft': '#241010', '--theme-card': '#241010',
                '--theme-text': '#fbe5e5', '--theme-text-muted': '#c9a0a0', '--theme-text-dim': '#a57a7a', '--theme-text-faint': '#7d5a5a',
                '--theme-border': '#3a1a1a', '--theme-border-soft': '#2a1010', '--theme-border-input': '#3a1a1a',
                '--theme-gradient': 'linear-gradient(45deg, #ef4444 0%, #fca5a5 100%)',
                '--theme-shadow': 'rgba(239, 68, 68, 0.25)', '--theme-shadow-soft': 'rgba(239, 68, 68, 0.18)',
                '--theme-nav-bg': 'rgba(26, 10, 10, 0.98)'
            }
        },
        maroon: {
            name: 'Maroon', sub: 'Deep · Classic', emoji: '🍷',
            preview: { primary: '#800000', gradient: 'linear-gradient(135deg, #800000 0%, #a52a2a 100%)' },
            light: {
                '--theme-primary': '#800000', '--theme-accent': '#a52a2a', '--theme-primary-dark': '#5c0000',
                '--theme-primary-soft': '#f5e6e6', '--theme-primary-soft-2': '#faf0f0',
                '--theme-bg': '#fdf8f8', '--theme-bg-soft': '#f9f0f0', '--theme-card': '#ffffff',
                '--theme-text': '#2e1a1a', '--theme-text-muted': '#5c3a3a', '--theme-text-dim': '#8a6a6a', '--theme-text-faint': '#b5a0a0',
                '--theme-border': '#e8d5d5', '--theme-border-soft': '#f0e0e0', '--theme-border-input': '#d4b5b5',
                '--theme-gradient': 'linear-gradient(45deg, #800000 0%, #a52a2a 100%)',
                '--theme-shadow': 'rgba(128, 0, 0, 0.15)', '--theme-shadow-soft': 'rgba(128, 0, 0, 0.2)',
                '--theme-nav-bg': 'rgba(253, 248, 248, 0.98)'
            },
            dark: {
                '--theme-primary': '#a52a2a', '--theme-accent': '#c04040', '--theme-primary-dark': '#800000',
                '--theme-primary-soft': '#2a1515', '--theme-primary-soft-2': '#1a0d0d',
                '--theme-bg': '#120808', '--theme-bg-soft': '#1a0f0f', '--theme-card': '#1a0f0f',
                '--theme-text': '#f0e0e0', '--theme-text-muted': '#c4a0a0', '--theme-text-dim': '#a08080', '--theme-text-faint': '#7d6060',
                '--theme-border': '#2e1a1a', '--theme-border-soft': '#221212', '--theme-border-input': '#2e1a1a',
                '--theme-gradient': 'linear-gradient(45deg, #a52a2a 0%, #c04040 100%)',
                '--theme-shadow': 'rgba(165, 42, 42, 0.25)', '--theme-shadow-soft': 'rgba(165, 42, 42, 0.18)',
                '--theme-nav-bg': 'rgba(18, 8, 8, 0.98)'
            }
        }
    };

    // ================================================================
    // ===== DEFAULT + GLOBAL STATE =====
    // ================================================================
    window.DEFAULT_THEME = { preset: 'ocean', mode: 'light' };
    window.selectedTheme = { ...window.DEFAULT_THEME };

    // ================================================================
    // ===== CORE FUNCTIONS =====
    // ================================================================

    /**
     * Inject the shape HTML for a preset into #themeBgShapes.
     * Idempotent — only re-injects if the preset changed.
     * Handles unknown presets gracefully (falls back to empty).
     */
    window.injectThemeShapes = function (presetKey) {
        const container = document.getElementById('themeBgShapes');
        if (!container) return;

        // Guard against invalid keys
        if (!presetKey || !window.THEME_SHAPES[presetKey]) {
            console.warn('injectThemeShapes: unknown preset "' + presetKey + '"');
            return;
        }

        if (container.dataset.activeTheme !== presetKey) {
            container.innerHTML = window.THEME_SHAPES[presetKey];
            container.dataset.activeTheme = presetKey;
        }
    };

    /**
     * Apply a theme object { preset, mode } to the document.
     * - Sets all CSS variables on :root
     * - Sets data-timawa-theme and data-timawa-mode
     * - Injects shapes
     * - Updates the <meta name="theme-color">
     *
     * Validates input — falls back to DEFAULT_THEME if invalid.
     */
    window.applyTheme = function (theme) {
        // Validate
        const safeTheme = (theme && typeof theme === 'object') ? theme : {};
        const presetKey = (safeTheme.preset && window.THEMES[safeTheme.preset])
            ? safeTheme.preset
            : window.DEFAULT_THEME.preset;
        const mode = safeTheme.mode === 'dark' ? 'dark' : 'light';

        const preset = window.THEMES[presetKey];
        const palette = preset[mode];

        const root = document.documentElement;
        Object.keys(palette).forEach(key => {
            root.style.setProperty(key, palette[key]);
        });
        root.setAttribute('data-timawa-theme', presetKey);
        root.setAttribute('data-timawa-mode', mode);

        window.injectThemeShapes(presetKey);

        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.content = palette['--theme-bg'];

        // Keep the global state in sync
        window.selectedTheme = { preset: presetKey, mode };
    };

    /**
     * Read the cached theme from localStorage.
     * Returns { preset, mode } or null.
     */
    window.readThemeFromStorage = function () {
        try {
            const raw = localStorage.getItem(window.THEME_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.preset && window.THEMES[parsed.preset]) {
                return { preset: parsed.preset, mode: parsed.mode === 'dark' ? 'dark' : 'light' };
            }
        } catch (e) { /* ignore */ }
        return null;
    };

    /**
     * Save a theme to localStorage.
     * Validates the theme object before saving.
     */
    window.persistThemeLocally = function (theme) {
        if (!theme || typeof theme !== 'object') return;
        if (!theme.preset || !window.THEMES[theme.preset]) return;
        try {
            localStorage.setItem(window.THEME_STORAGE_KEY, JSON.stringify({
                preset: theme.preset,
                mode: theme.mode === 'dark' ? 'dark' : 'light'
            }));
        } catch (e) { /* ignore */ }
    };

    /**
     * Broadcast a theme change to all other tabs.
     * Also dispatches a local CustomEvent for same-tab listeners.
     */
    window.broadcastThemeChange = function (theme) {
        if (!theme || typeof theme !== 'object') return;
        if (!theme.preset || !window.THEMES[theme.preset]) return;

        const safe = {
            preset: theme.preset,
            mode: theme.mode === 'dark' ? 'dark' : 'light'
        };

        try {
            if ('BroadcastChannel' in window) {
                const bc = new BroadcastChannel('timawa_theme_sync');
                bc.postMessage({ type: 'theme-change', theme: safe });
                bc.close();
            }
        } catch (e) { /* ignore */ }

        try {
            window.dispatchEvent(new CustomEvent(window.THEME_EVENT, { detail: safe }));
        } catch (e) { /* ignore */ }
    };

    // ================================================================
    // ===== BOOT: Apply cached theme IMMEDIATELY (no flash) =====
    // ================================================================
    (function bootTheme() {
        const cached = window.readThemeFromStorage();
        if (cached) window.selectedTheme = cached;
        window.applyTheme(window.selectedTheme);
    })();

    // ================================================================
    // ===== CROSS-TAB LIVE SYNC (BroadcastChannel) =====
    // ================================================================
    try {
        if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('timawa_theme_sync');
            bc.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'theme-change' && event.data.theme) {
                    const incoming = event.data.theme;
                    if (!incoming.preset || !window.THEMES[incoming.preset]) return;
                    window.selectedTheme = {
                        preset: incoming.preset,
                        mode: incoming.mode === 'dark' ? 'dark' : 'light'
                    };
                    window.applyTheme(window.selectedTheme);
                    try {
                        localStorage.setItem(window.THEME_STORAGE_KEY, JSON.stringify(window.selectedTheme));
                    } catch (e) { /* ignore */ }
                }
            });
        }
    } catch (e) { /* ignore */ }

    // ================================================================
    // ===== ★ CRITICAL FIX: Re-inject shapes once DOM is ready =====
    // ================================================================
    // The boot-time applyTheme() runs in <head> BEFORE <body> is parsed,
    // so #themeBgShapes doesn't exist yet. That means injectThemeShapes()
    // silently returns without adding the shape elements.
    //
    // We must re-run applyTheme() after the DOM is fully parsed so that
    // the shapes actually get injected into #themeBgShapes.
    //
    // Also: some pages (like dashboard.html) only call applyTheme() from
    // their auth handler IF the user has a theme saved in Firestore. If
    // they don't, nothing re-triggers the injection — hence empty shapes.
    // This listener guarantees the injection always happens.
    // ================================================================
    function ensureShapesInjected() {
        const container = document.getElementById('themeBgShapes');
        if (!container) return;

        // Re-read current theme from the DOM (source of truth)
        const currentPreset = document.documentElement.getAttribute('data-timawa-theme')
            || window.selectedTheme.preset
            || window.DEFAULT_THEME.preset;
        const currentMode = document.documentElement.getAttribute('data-timawa-mode')
            || window.selectedTheme.mode
            || window.DEFAULT_THEME.mode;

        // Force re-injection by temporarily clearing the marker
        container.dataset.activeTheme = '';
        window.applyTheme({ preset: currentPreset, mode: currentMode });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureShapesInjected);
    } else {
        // DOM already loaded (deferred scripts, etc.) — run now
        ensureShapesInjected();
    }

    // Also re-check shortly after load, in case the page's auth handler
    // delayed things
    window.addEventListener('load', () => {
        setTimeout(ensureShapesInjected, 100);
    });
})();