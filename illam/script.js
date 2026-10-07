const slideLayers = [...document.querySelectorAll(".hero__slide")];
const slideButtons = [...document.querySelectorAll(".slide-dot")];
const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const amenitySection = document.querySelector(".amenities");
const amenitySlides = [...document.querySelectorAll(".amenities__image")];
const amenityButtons = [...document.querySelectorAll(".amenities__dot")];
const amenityTitle = document.querySelector("#amenity-title");
const propertyTabs = [...document.querySelectorAll(".property-showcase__tab")];
const propertyImages = [...document.querySelectorAll(".property-gallery__image")];
const propertyThumbnails = [...document.querySelectorAll(".property-gallery__thumbnail")];
const propertyPanel = document.querySelector("#property-panel");
const addressTrack = document.querySelector(".addresses__track");
const addressPages = [...document.querySelectorAll(".addresses__page")];
const addressDots = [...document.querySelectorAll(".addresses__dot")];
const addressArrows = [...document.querySelectorAll(".addresses__arrow")];
const favouriteVideo = document.querySelector(".why-favourite__video");
const enquiryForm = document.querySelector(".contact-form");
const enquiryStatus = document.querySelector(".contact-form__status");
const backToTopButton = document.querySelector(".back-to-top");

function updateBackToTopVisibility() {
  const visible = window.scrollY > 300;
  backToTopButton.classList.toggle("is-visible", visible);
  backToTopButton.setAttribute("aria-hidden", String(!visible));
  backToTopButton.inert = !visible;
}

if (window.AOS) {
  AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true,
    offset: 70,
    disable: () => reduceMotion.matches
  });
}

let activeSlide = 1;
let activeAmenity = 0;
let activePropertyImage = 0;
let activeAddressPage = 0;
let rotationTimer;
let amenityRotationTimer;
let pointerFrame;

function resetParallax() {
  for (const image of hero.querySelectorAll(".hero__image")) {
    image.style.setProperty("--parallax-x", "0px");
    image.style.setProperty("--parallax-y", "0px");
  }
}

hero.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || reduceMotion.matches || !finePointer.matches) return;

  const bounds = hero.getBoundingClientRect();
  const pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
  const pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;

  window.cancelAnimationFrame(pointerFrame);
  pointerFrame = window.requestAnimationFrame(() => {
    for (const slide of slideLayers) {
      const background = slide.querySelector(".hero__image--background");
      const foreground = slide.querySelector(".hero__image--object");
      background.style.setProperty("--parallax-x", `${-pointerX * 12}px`);
      background.style.setProperty("--parallax-y", `${-pointerY * 8}px`);
      foreground.style.setProperty("--parallax-x", `${pointerX * 28}px`);
      foreground.style.setProperty("--parallax-y", `${pointerY * 14}px`);
    }
  });
});

hero.addEventListener("pointerleave", resetParallax);

function showSlide(index) {
  activeSlide = index;
  slideLayers.forEach((slide, slideIndex) => {
    const active = slideIndex === index;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  slideButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function startRotation() {
  window.clearInterval(rotationTimer);
  rotationTimer = window.setInterval(() => showSlide((activeSlide + 1) % slideLayers.length), 6500);
}

slideButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSlide(Number(button.dataset.slide));
    startRotation();
  });
});

function showAmenity(index) {
  activeAmenity = index;
  amenitySlides.forEach((slide, slideIndex) => {
    const active = slideIndex === index;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  amenityButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  amenityTitle.textContent = amenitySlides[index].dataset.title;
}

function startAmenityRotation() {
  window.clearInterval(amenityRotationTimer);
  if (reduceMotion.matches) return;
  amenityRotationTimer = window.setInterval(() => {
    showAmenity((activeAmenity + 1) % amenitySlides.length);
  }, 6000);
}

amenityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showAmenity(Number(button.dataset.amenitySlide));
    startAmenityRotation();
  });
});

amenitySection.addEventListener("pointerenter", () => window.clearInterval(amenityRotationTimer));
amenitySection.addEventListener("pointerleave", startAmenityRotation);
amenitySection.addEventListener("focusin", () => window.clearInterval(amenityRotationTimer));
amenitySection.addEventListener("focusout", (event) => {
  if (!amenitySection.contains(event.relatedTarget)) startAmenityRotation();
});

function showPropertyImage(index) {
  activePropertyImage = index;
  propertyImages.forEach((image, imageIndex) => {
    const active = imageIndex === index;
    image.classList.toggle("is-active", active);
    image.setAttribute("aria-hidden", String(!active));
  });
  propertyThumbnails.forEach((thumbnail, thumbnailIndex) => {
    const active = thumbnailIndex === index;
    thumbnail.classList.toggle("is-active", active);
    thumbnail.setAttribute("aria-pressed", String(active));
  });
}

function selectPropertyTab(index, moveFocus = false) {
  showPropertyImage(0);
  propertyTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && moveFocus) tab.focus();
  });
  propertyPanel.setAttribute("aria-labelledby", propertyTabs[index].id);
  document.querySelector(".property-gallery").setAttribute("aria-label", `${propertyTabs[index].textContent.trim()} property gallery`);
}

propertyTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectPropertyTab(index));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % propertyTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + propertyTabs.length) % propertyTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = propertyTabs.length - 1;
    else return;
    event.preventDefault();
    selectPropertyTab(nextIndex, true);
  });
});

propertyThumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", () => showPropertyImage(Number(thumbnail.dataset.propertySlide)));
});

function showAddressPage(index) {
  activeAddressPage = (index + addressPages.length) % addressPages.length;
  addressTrack.style.setProperty("transform", `translateX(-${activeAddressPage * addressPages[0].offsetWidth}px)`, "important");
  addressPages.forEach((page, pageIndex) => {
    const inactive = pageIndex !== activeAddressPage;
    page.setAttribute("aria-hidden", String(inactive));
    page.inert = inactive;
  });
  addressDots.forEach((dot, dotIndex) => {
    const active = dotIndex === activeAddressPage;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", String(active));
  });
  addressArrows.forEach((arrow) => {
    const direction = Number(arrow.dataset.addressDirection);
    arrow.disabled = addressPages.length < 2 || (direction < 0 && activeAddressPage === 0) || (direction > 0 && activeAddressPage === addressPages.length - 1);
  });
}

addressDots.forEach((dot) => {
  dot.addEventListener("click", () => showAddressPage(Number(dot.dataset.addressSlide)));
});

addressArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => showAddressPage(activeAddressPage + Number(arrow.dataset.addressDirection)));
});

favouriteVideo.querySelector(".why-favourite__play").addEventListener("click", () => {
  const videoFrame = document.createElement("iframe");
  const videoUrl = new URL(`https://www.youtube.com/embed/${favouriteVideo.dataset.videoId}`);
  videoUrl.searchParams.set("autoplay", "1");
  videoUrl.searchParams.set("playsinline", "1");
  if (location.protocol === "http:" || location.protocol === "https:") {
    videoUrl.searchParams.set("origin", location.origin);
  }
  videoFrame.src = videoUrl.toString();
  videoFrame.title = "Favourite Homes video";
  videoFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  videoFrame.referrerPolicy = "strict-origin-when-cross-origin";
  videoFrame.allowFullscreen = true;
  favouriteVideo.replaceChildren(videoFrame);
});

enquiryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = enquiryForm.querySelector("[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  enquiryStatus.classList.remove("is-error");
  enquiryStatus.textContent = "Sending your enquiry...";

  try {
    const response = await fetch(enquiryForm.action, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(enquiryForm)))
    });
    const result = await response.json();
    if (!response.ok || result.success !== "true") throw new Error(result.message || "Unable to send your enquiry.");
    enquiryForm.reset();
    enquiryStatus.textContent = "Thank you. Your enquiry has been sent.";
  } catch {
    enquiryStatus.classList.add("is-error");
    enquiryStatus.textContent = "We couldn't send your enquiry. Please try again or call +91-98959 94000.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});

document.querySelectorAll('[data-enquiry-type="brochure"]').forEach((link) => {
  link.addEventListener("click", () => {
    enquiryForm.elements.message.value = "Please send me the brochure.";
  });
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
});

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

startRotation();
startAmenityRotation();
showAddressPage(0);
