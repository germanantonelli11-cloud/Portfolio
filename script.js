'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Select all project summary rows that act as triggers
    const accordionRows = document.querySelectorAll('.project-summary-row');

    accordionRows.forEach(row => {
        row.addEventListener('click', () => {
            const currentItem = row.parentElement;
            const toggleIcon = row.querySelector('.toggle-icon');

            // 1. Auto-collapse behavior: close all other items first
            document.querySelectorAll('.project-accordion-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('is-open');
                    const otherIcon = item.querySelector('.toggle-icon');
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });

            // 2. Toggle the active class on the currently selected item
            const isOpen = currentItem.classList.toggle('is-open');

            // 3. Smoothly change the tracking icon between + and −
            if (toggleIcon) {
                toggleIcon.textContent = isOpen ? '−' : '+';
            }
        });
    });
});
