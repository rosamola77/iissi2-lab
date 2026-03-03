'use strict';

import { photosAPI_auto } from '../api/_photos.js';
import { sessionManager } from '../utils/session.js';
import { messageRenderer } from '../renderers/messages.js';

function handleUpload() {
    let form = document.getElementById("upload-form");
    if (!form) return;

    if (!sessionManager.isLogged()) {
        messageRenderer.showWarningMessage("You must be logged in to upload photos.");
        form.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let title       = document.getElementById("title-input").value.trim();
        let description = document.getElementById("description-input").value.trim();
        let url         = document.getElementById("url-input").value.trim();
        let visibility  = document.getElementById("visibility-input").value;

        if (!title || !url) {
            messageRenderer.showErrorMessage("Title and image URL are required.");
            return;
        }

        let formData = {
            title,
            description,
            url,
            visibility,
            userId: sessionManager.getLoggedId(),
        };

        try {
            await photosAPI_auto.create(formData);
            messageRenderer.showSuccessMessage("Photo uploaded successfully! Redirecting…");
            setTimeout(() => { window.location.href = "index.html"; }, 1500);
        } catch (err) {
            messageRenderer.showErrorMessage("Could not upload the photo. Please try again.");
        }
    });
}

document.addEventListener("DOMContentLoaded", handleUpload);
