// ================================================================
// visit-tracker.js
// Tracks the last visit of each signed-in user.
//
// Behavior:
//   - Waits for Firebase Auth to confirm a signed-in user
//   - Skips admin pages (path contains "admin") by default
//   - OVERWRITES a single field on users/{uid}: lastVisit
//   - Optionally increments visitCount (1 per new browser session)
//   - Throttled: writes at most once per THROTTLE_MINUTES
//     per browser session (uses sessionStorage, not localStorage)
//   - Also records lastVisitPage (e.g. "dashboard.html") and
//     lastVisitTitle (document.title) so you know WHERE they were
//   - Handles multi-tab: uses a "last write" timestamp shared via
//     localStorage so rapid tab-switching doesn't spam Firestore
//
// Include in every USER-facing page (NOT admin pages):
//   <script src="visit-tracker.js"></script>
// ================================================================

(function () {
    'use strict';

    // ===== CONFIG =====
    const THROTTLE_MINUTES = 10;                   // min gap between writes
    const THROTTLE_MS = THROTTLE_MINUTES * 60 * 1000;
    const SKIP_ADMIN = true;                        // set false if you want admin tracked too
    const TRACK_VISIT_COUNT = true;                 // increment a lifetime counter
    const SESSION_WRITE_KEY = 'timawa_visit_write_ts';
    const GLOBAL_WRITE_KEY = 'timawa_visit_last_write';

    // ===== GUARDS =====
    // Skip if we're on an admin page (prevents admin views polluting user data)
    if (SKIP_ADMIN && /admin/i.test(window.location.pathname)) {
        console.log('🛡️ visit-tracker: skipped (admin page)');
        return;
    }

    // Skip if Firebase isn't loaded
    if (!window.firebase || !firebase.auth || !firebase.firestore) {
        console.log('ℹ️ visit-tracker: Firebase not present, skipping.');
        return;
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    // ===== HELPERS =====
    function safeGet(storage, key) {
        try { return storage.getItem(key); } catch (e) { return null; }
    }
    function safeSet(storage, key, value) {
        try { storage.setItem(key, value); } catch (e) { /* ignore */ }
    }

    function shouldWrite() {
        // 1. sessionStorage: has THIS tab already written recently?
        const sessionRaw = safeGet(sessionStorage, SESSION_WRITE_KEY);
        if (sessionRaw) {
            const last = parseInt(sessionRaw, 10);
            if (!isNaN(last) && (Date.now() - last) < THROTTLE_MS) {
                return false;
            }
        }

        // 2. localStorage: has ANY tab written recently?
        //    (prevents tab-switching from spamming writes across tabs)
        const globalRaw = safeGet(localStorage, GLOBAL_WRITE_KEY);
        if (globalRaw) {
            const last = parseInt(globalRaw, 10);
            if (!isNaN(last) && (Date.now() - last) < THROTTLE_MS) {
                // Still update sessionStorage so this tab knows not to retry
                safeSet(sessionStorage, SESSION_WRITE_KEY, String(last));
                return false;
            }
        }

        return true;
    }

    function markWritten() {
        const now = String(Date.now());
        safeSet(sessionStorage, SESSION_WRITE_KEY, now);
        safeSet(localStorage, GLOBAL_WRITE_KEY, now);
    }

    function currentPageInfo() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const title = document.title || 'TIMAWA';
        return { path, title };
    }

    // ===== WRITE =====
    async function recordVisit(user) {
        if (!user) return;

        if (!shouldWrite()) {
            console.log('⏱️ visit-tracker: throttled (already written recently)');
            return;
        }

        const { path, title } = currentPageInfo();

        const payload = {
            lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
            lastVisitPage: path,
            lastVisitTitle: title
        };

        if (TRACK_VISIT_COUNT) {
            payload.visitCount = firebase.firestore.FieldValue.increment(1);
        }

        try {
            await db.collection('users').doc(user.uid).set(payload, { merge: true });
            markWritten();
            console.log(`👋 visit-tracker: recorded visit to ${path}`);
        } catch (err) {
            console.warn('visit-tracker: write failed —', err.message);
            // Don't mark as written so we can retry on next page load
        }
    }

    // ===== AUTH HOOK =====
    // onAuthStateChanged fires on every page load once auth resolves.
    // We only record when a user is present. When they log out, nothing
    // is written (sessionStorage gets cleared on fresh session anyway).
    let lastHandledUid = null;

    auth.onAuthStateChanged(function (user) {
        if (!user) {
            lastHandledUid = null;
            return;
        }
        // Prevent double-fire from some Firebase edge cases
        if (lastHandledUid === user.uid) return;
        lastHandledUid = user.uid;

        // Small delay so it doesn't race with other page-load Firestore reads
        setTimeout(function () {
            recordVisit(user);
        }, 800);
    });

    // ===== OPTIONAL: write when tab becomes visible again =====
    // If the user came back to the tab after being away longer than the
    // throttle window, count it as a fresh visit.
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState !== 'visible') return;
        const user = auth.currentUser;
        if (!user) return;
        if (shouldWrite()) {
            recordVisit(user);
        }
    });

    // ===== EXPOSE FOR DEBUGGING =====
    window.VisitTracker = {
        forceWrite: function () {
            const user = auth.currentUser;
            if (!user) { console.warn('visit-tracker: no signed-in user'); return; }
            // Bypass throttle
            try {
                sessionStorage.removeItem(SESSION_WRITE_KEY);
                localStorage.removeItem(GLOBAL_WRITE_KEY);
            } catch (e) {}
            recordVisit(user);
        },
        throttleMinutes: THROTTLE_MINUTES,
        skipAdmin: SKIP_ADMIN
    };

    console.log(`✅ visit-tracker loaded (throttle: ${THROTTLE_MINUTES}min, skipAdmin: ${SKIP_ADMIN})`);
})();