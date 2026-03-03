'use strict';

import { authAPI_auto } from '../api/_auth.js';
import { messageRenderer } from '../renderers/messages.js';

function handleRegister() {
    let form = document.getElementById("register-form");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let firstName = document.getElementById("firstname-input").value.trim();
        let lastName  = document.getElementById("lastname-input").value.trim();
        let email     = document.getElementById("email-input").value.trim();
        let telephone = document.getElementById("telephone-input").value.trim();
        let username  = document.getElementById("username-input").value.trim();
        let password  = document.getElementById("password-input").value;
        let password2 = document.getElementById("password2-input").value;

        // Client-side validation
        if (!firstName || !lastName || !email || !telephone || !username || !password || !password2) {
            messageRenderer.showErrorMessage("All fields are required.");
            return;
        }

        if (password !== password2) {
            messageRenderer.showErrorMessage("Passwords do not match.");
            return;
        }

        if (password.length < 4) {
            messageRenderer.showErrorMessage("Password must be at least 4 characters long.");
            return;
        }

        let formData = { firstName, lastName, email, telephone, username, password };

        try {
            await authAPI_auto.register(formData);
            messageRenderer.showSuccessMessage("Account created successfully! Redirecting to login…");
            setTimeout(() => { window.location.href = "login.html"; }, 1500);
        } catch (err) {
            messageRenderer.showErrorMessage("Registration failed. The username may already be taken.");
        }
    });
}

document.addEventListener("DOMContentLoaded", handleRegister);
