// Function to handle the welcome page (formerly game-like intro)
function handleIntroPage() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterResumeBtn = document.getElementById('enterResumeBtn'); // Get the new button

    if (welcomeScreen && enterResumeBtn) {
        // Function to redirect to the resume page
        const redirectToResume = () => {
            window.location.href = 'resume.html';
        };

        // Listen for a click on the "ENTER" button
        enterResumeBtn.addEventListener('click', redirectToResume);

        // Listen for the 'Enter' key press anywhere on the document
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                redirectToResume();
            }
        });
    }
}

// Function to create and manage a slideshow (no changes)
function createSlideshow(containerId, images) {
    const slideshowContainer = document.getElementById(containerId);
    if (!slideshowContainer || images.length === 0) {
        console.warn(`Slideshow container ${containerId} not found or no images provided.`);
        return;
    }

    let slideIndex = 0;
    let slideInterval; // To hold the interval ID for auto-advance

    // Create image slides
    images.forEach((imagePath, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('mySlides', 'fade');
        if (index === 0) slideDiv.style.display = 'block'; // Show first slide initially

        const img = document.createElement('img');
        img.src = `assets/img/${imagePath}`; // Correct path construction for assets/img folder
        img.alt = `Vivin Bristow Image ${index + 1}`;
        slideDiv.appendChild(img);
        slideshowContainer.appendChild(slideDiv);
    });

    // Create navigation arrows
    const prevArrow = document.createElement('a');
    prevArrow.classList.add('prev');
    prevArrow.innerHTML = '&#10094;'; // Left arrow
    prevArrow.onclick = () => plusSlides(-1);
    slideshowContainer.appendChild(prevArrow);

    const nextArrow = document.createElement('a');
    nextArrow.classList.add('next');
    nextArrow.innerHTML = '&#10095;'; // Right arrow
    nextArrow.onclick = () => plusSlides(1);
    slideshowContainer.appendChild(nextArrow);

    // Create dot container and dots
    const dotContainer = document.createElement('div');
    dotContainer.classList.add('dot-container');
    slideshowContainer.parentElement.appendChild(dotContainer); // Append dots outside the main slideshow div

    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.onclick = () => currentSlide(index);
        dotContainer.appendChild(dot);
    });

    const slides = slideshowContainer.getElementsByClassName('mySlides');
    const dots = dotContainer.getElementsByClassName('dot');


    function showSlides() {
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        // Remove active class from all dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active-dot');
        }

        // Adjust index for cycling
        if (slideIndex >= slides.length) { slideIndex = 0; }
        if (slideIndex < 0) { slideIndex = slides.length - 1; }

        // Show current slide and activate current dot
        slides[slideIndex].style.display = 'block';
        dots[slideIndex].classList.add('active-dot');
    }

    function plusSlides(n) {
        clearTimeout(slideInterval); // Clear auto-advance on manual navigation
        slideIndex += n;
        showSlides();
        startAutoAdvance(); // Restart auto-advance
    }

    function currentSlide(n) {
        clearTimeout(slideInterval); // Clear auto-advance on manual navigation
        slideIndex = n;
        showSlides();
        startAutoAdvance(); // Restart auto-advance
    }

    function startAutoAdvance() {
        // Clear any existing interval to prevent multiple intervals running
        clearTimeout(slideInterval);
        slideInterval = setTimeout(() => {
            plusSlides(1); // Advance to the next slide
        }, 5000); // Change image every 5 seconds
    }

    // Initial display and start auto-advance
    showSlides();
    startAutoAdvance();

    // Pause slideshow on hover
    slideshowContainer.addEventListener('mouseenter', () => clearTimeout(slideInterval));
    slideshowContainer.addEventListener('mouseleave', () => startAutoAdvance());
}


// Function to handle loading and populating the resume page
async function loadResumeContent() {
    const mainHeader = document.getElementById('main-header');
    const summaryContent = document.getElementById('summary-content');
    const competenciesGallery = document.getElementById('competencies-gallery');
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');
    const technicalSkillsGallery = document.getElementById('technical-skills-gallery');
    const currentYearSpan = document.getElementById('current-year');

    if (mainHeader && summaryContent && competenciesGallery && experienceContainer && educationContainer && technicalSkillsGallery) {
        try {
            const response = await fetch('vivin.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // --- Populate Header ---
            const headerContentDiv = document.createElement('div');
            headerContentDiv.classList.add('header-content');

            const profilePic = document.createElement('img');
            profilePic.src = data.personalInfo.profilePic || 'assets/img/placeholder.jpeg';
            profilePic.alt = `${data.personalInfo.name} Profile Picture`;
            profilePic.classList.add('profile-pic-main');
            headerContentDiv.appendChild(profilePic);

            const nameHeading = document.createElement('h1');
            nameHeading.textContent = data.personalInfo.name;
            headerContentDiv.appendChild(nameHeading);

            const titleHeading = document.createElement('h2');
            titleHeading.textContent = data.personalInfo.title;
            headerContentDiv.appendChild(titleHeading);

            const contactInfo = document.createElement('p');
            contactInfo.classList.add('contact-info');
            contactInfo.innerHTML = `
                <span><svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>${data.personalInfo.address}</span>
                <span><svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.25-3.5-.75-.3-.12-.62-.05-.88.22l-2.67 2.67c-1.46-.72-2.9-1.85-4.18-3.13-1.28-1.28-2.41-2.72-3.13-4.18l2.67-2.67c.27-.26.34-.58.22-.88-.5-.98-.75-2.17-.75-3.5 0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1C2 13.99 7.01 20 14.62 20c.55 0 1-.45 1-1v-4.01c0-.55-.45-1-1-1z"/></svg>${data.personalInfo.phone}</span>
                <span><svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><a href="mailto:${data.personalInfo.email}">${data.personalInfo.email}</a></span>
            `;
            headerContentDiv.appendChild(contactInfo);
            mainHeader.appendChild(headerContentDiv);

            // --- Populate Professional Summary ---
            summaryContent.textContent = data.summary;

            // --- Populate Core Competencies (Image Gallery) ---
            if (data.images && data.images.coreCompetencyImages && data.images.coreCompetencyImages.length > 0) {
                data.images.coreCompetencyImages.forEach((imageFileName, index) => {
                    const img = document.createElement('img');
                    img.src = `assets/img/core-competencies/${imageFileName}`;
                    img.alt = `Core Competency: ${imageFileName.split('.')[0].replace(/[-_]/g, ' ')}`;
                    img.style.animationDelay = `${0.5 + index * 0.1}s`; // Stagger animation
                    competenciesGallery.appendChild(img);
                });
            } else {
                document.getElementById('core-competencies').style.display = 'none';
            }


            // --- Create College Memories Slideshow ---
            const collegeMemoriesSection = document.getElementById('college-memories');
            if (data.images && data.images.collegeImages && data.images.collegeImages.length > 0) {
                createSlideshow('collegeSlideshow', data.images.collegeImages);
            } else if (collegeMemoriesSection) {
                 collegeMemoriesSection.style.display = 'none';
            }


            // --- Populate Professional Experience ---
            data.experience.forEach((job, index) => {
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('experience-entry');
                entryDiv.style.animationDelay = `${0.9 + index * 0.15}s`; // Stagger animation

                const descriptionCol = document.createElement('div');
                descriptionCol.classList.add('description-col');

                const jobTitle = document.createElement('h3');
                jobTitle.classList.add('job-title');
                jobTitle.textContent = job.role;
                descriptionCol.appendChild(jobTitle);

                const companyUniversity = document.createElement('p');
                companyUniversity.classList.add('company-university');
                companyUniversity.textContent = `${job.company}, ${job.location}`;
                descriptionCol.appendChild(companyUniversity);

                const respList = document.createElement('ul');
                job.responsibilities.forEach(resp => {
                    const li = document.createElement('li');
                    li.textContent = resp;
                    respList.appendChild(li);
                });
                descriptionCol.appendChild(respList);
                entryDiv.appendChild(descriptionCol);


                const datesCol = document.createElement('div');
                datesCol.classList.add('dates-col');
                const datesSpan = document.createElement('span');
                datesSpan.classList.add('dates');
                datesSpan.textContent = job.dates;
                datesCol.appendChild(datesSpan);
                entryDiv.appendChild(datesCol);

                experienceContainer.appendChild(entryDiv);
            });

            // --- Create Workplace Glimpses Slideshow ---
            const workplaceGlimpsesSection = document.getElementById('workplace-glimpses');
            if (data.images && data.images.workImages && data.images.workImages.length > 0) {
                createSlideshow('workSlideshow', data.images.workImages);
            } else if (workplaceGlimpsesSection) {
                 workplaceGlimpsesSection.style.display = 'none';
            }

            // --- Populate Education ---
            data.education.forEach((edu, index) => {
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('education-entry');
                entryDiv.style.animationDelay = `${1.3 + index * 0.15}s`; // Stagger animation

                const descriptionCol = document.createElement('div');
                descriptionCol.classList.add('description-col');

                const degreeName = document.createElement('h3');
                degreeName.classList.add('degree-name');
                degreeName.textContent = edu.degree;
                descriptionCol.appendChild(degreeName);

                const institution = document.createElement('p');
                institution.classList.add('company-university');
                institution.textContent = `${edu.institution}, ${edu.location}`;
                descriptionCol.appendChild(institution);

                entryDiv.appendChild(descriptionCol);

                const datesCol = document.createElement('div');
                datesCol.classList.add('dates-col');
                const datesSpan = document.createElement('span');
                datesSpan.classList.add('dates');
                datesSpan.textContent = edu.dates;
                datesCol.appendChild(datesSpan);
                entryDiv.appendChild(datesCol);

                educationContainer.appendChild(entryDiv);
            });


            // --- Populate Technical Skills (Image Gallery) ---
            if (data.images && data.images.technicalSkillsImages && data.images.technicalSkillsImages.length > 0) {
                data.images.technicalSkillsImages.forEach((imageFileName, index) => {
                    const img = document.createElement('img');
                    img.src = `assets/img/technical/${imageFileName}`;
                    img.alt = `Technical Skill: ${imageFileName.split('.')[0].replace(/[-_]/g, ' ')}`;
                    img.style.animationDelay = `${1.6 + index * 0.1}s`; // Stagger animation
                    technicalSkillsGallery.appendChild(img);
                });
            } else {
                document.getElementById('technical-skills').style.display = 'none';
            }

            // --- Update Footer Year ---
            if (currentYearSpan) {
                currentYearSpan.textContent = new Date().getFullYear();
            }

        } catch (error) {
            console.error('Error loading or parsing resume data:', error);
            if (mainHeader) mainHeader.innerHTML = '<p style="color: red; text-align: center;">Failed to load resume content. Please try again later.</p>';
        }
    }
}


// Determine which function to run based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        handleIntroPage();
    } else if (window.location.pathname.endsWith('resume.html')) {
        loadResumeContent();
    }
});