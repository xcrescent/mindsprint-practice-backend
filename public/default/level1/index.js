// Toggle mobile menu
const toggleMenu = document.querySelector(".toggle-menu");
const navLinks = document.querySelector(".nav-links");

toggleMenu.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Smooth scrolling
const scrollLinks = document.querySelectorAll(".scroll-link");

scrollLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    const navHeight = document.querySelector("header").offsetHeight;
    const position = target.offsetTop - navHeight;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });

    navLinks.classList.remove("show");
  });
});

// Initialize AOS library
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});
