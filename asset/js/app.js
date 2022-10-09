// prevent default href=#
document.querySelectorAll('a[href="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        event.preventDefault();
    });
});

// smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        event.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

window.onload = function() {
    const header = document.querySelector('header');
    const fixedNav = header.offsetTop;

    if(window.pageYOffset > fixedNav) {
        header.classList.add('navbar-fixed');
    } else {
        header.classList.remove('navbar-fixed');
    }
};

// Navbar fixed
window.onscroll = function() {
    const header = document.querySelector('header');
    const fixedNav = header.offsetTop;

    if(window.pageYOffset > fixedNav) {
        header.classList.add('navbar-fixed');
    } else {
        header.classList.remove('navbar-fixed');
    }

    // make link active in section when scrolling
    const links = document.querySelectorAll('#nav-menu a[href^="#"]');
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const sectionOffset = section.offsetTop;

        if(window.pageYOffset > sectionOffset - 100) {
            links.forEach(link => {
                link.classList.remove('text-primary');
                link.classList.add('text-dark');
            });
            document.querySelector(`#nav-menu a[href="#${sectionId}"]`).classList.add('text-primary');
            document.querySelector(`#nav-menu a[href="#${sectionId}"]`).classList.remove('text-dark');

        }
    });
};

// Hamburger in navbar
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');
});

