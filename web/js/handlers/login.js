'use strict';

import { authAPI_auto } from '../api/_auth.js';
import { sessionManager } from '../utils/session.js';
import { messageRenderer } from '../renderers/messages.js';

function handleLogin() {
    let form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let username = document.getElementById("username-input").value.trim();
        let password = document.getElementById("password-input").value;

        if (!username || !password) {
            messageRenderer.showErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            let response = await authAPI_auto.login({ username, password });
            sessionManager.login(response.sessionToken, response.user);
            window.location.href = "index.html";
        } catch (err) {
            messageRenderer.showErrorMessage("Incorrect username or password.");
        }
    });
}

document.addEventListener("DOMContentLoaded", handleLogin);
