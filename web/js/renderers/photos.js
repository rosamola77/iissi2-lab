'use strict';

import { photosAPI_auto } from '../api/_photos.js';
import { messageRenderer } from './messages.js';
import { sessionManager } from '../utils/session.js';

function renderPhotoCard(photo, index) {
    let isOwner = sessionManager.isLogged() &&
                  sessionManager.getLoggedId() === photo.userId;

    let editButtons = isOwner
        ? `<div class="card-footer border-secondary d-flex gap-2">
               <button class="btn btn-sm btn-outline-warning flex-grow-1 btn-edit" data-id="${photo.photoId}">
                   <i class="fa fa-pencil me-1"></i>Edit
               </button>
               <button class="btn btn-sm btn-outline-danger flex-grow-1 btn-delete" data-id="${photo.photoId}">
                   <i class="fa fa-trash me-1"></i>Delete
               </button>
           </div>`
        : '';

    let description = photo.description || '';

    return `
        <div class="col-md-6 col-lg-4 gallery-card fade-in-up" style="animation-delay:${index * 0.07}s">
            <div class="card bg-dark border-secondary h-100">
                <a href="photo_detail.html">
                    <img src="${photo.url}" class="card-img-top photo-img"
                         alt="${photo.title}" data-fallback="images/placeholder-img.jpg">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${photo.title}</h5>
                    <span class="badge bg-${photo.visibility === 'Public' ? 'primary' : 'secondary'} me-1">
                        <i class="fa fa-${photo.visibility === 'Public' ? 'globe' : 'lock'} me-1"></i>${photo.visibility}
                    </span>
                    <p class="card-text text-secondary mt-2">${description}</p>
                </div>
                ${editButtons}
            </div>
        </div>`;
}

async function loadPhotos() {
    let gallery = document.getElementById("gallery");
    if (!gallery) return;

    try {
        let photos = await photosAPI_auto.getAll();

        if (photos && photos.length > 0) {
            gallery.innerHTML = photos.map((p, i) => renderPhotoCard(p, i)).join('');
            attachDeleteHandlers();
            attachImageFallbacks();
        }
    } catch (err) {
        // If the API is not available, keep the static fallback cards
        console.warn("API not available, showing static gallery cards.", err);
    }
}

function attachDeleteHandlers() {
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async function () {
            let photoId = this.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this photo?")) {
                try {
                    await photosAPI_auto.delete(photoId);
                    loadPhotos();
                } catch (err) {
                    let errorsDiv = document.getElementById("errors");
                    if (errorsDiv) {
                        messageRenderer.showErrorMessage("Could not delete the photo. Please try again.");
                    }
                }
            }
        });
    });
}

function attachImageFallbacks() {
    document.querySelectorAll("img[data-fallback]").forEach(img => {
        img.addEventListener("error", function () {
            this.src = this.getAttribute("data-fallback");
        });
    });
}

document.addEventListener("DOMContentLoaded", loadPhotos);
