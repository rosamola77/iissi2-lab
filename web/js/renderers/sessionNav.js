'use strict';

import { sessionManager } from '../utils/session.js';

let logoutListenerAttached = false;

function updateSessionNav() {
    let loggedOut = document.getElementById("nav-logged-out");
    let loggedIn  = document.getElementById("nav-logged-in");
    let navUser   = document.getElementById("nav-username");
    let logoutBtn = document.getElementById("logout-btn");

    if (!loggedOut || !loggedIn) return;

    if (sessionManager.isLogged()) {
        loggedOut.classList.add("d-none");
        loggedIn.classList.remove("d-none");

        let user = sessionManager.getLoggedUser();
        if (navUser && user) {
            navUser.innerHTML = `<i class="fa fa-user me-1"></i>${user.username}`;
        }
    } else {
        loggedOut.classList.remove("d-none");
        loggedIn.classList.add("d-none");
    }

    if (logoutBtn && !logoutListenerAttached) {
        logoutListenerAttached = true;
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            sessionManager.logout();
            window.location.href = "index.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", updateSessionNav);
setTimeout(updateSessionNav, 200);
