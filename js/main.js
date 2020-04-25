/* function leftPicHover() {
  document.getElementById("leftpic").style.width = "calc(50% + 42px)";
  document.getElementById("centerpic").style.width = "calc(25% + 42px)";
  document.getElementById("rightpic").style.width = "calc(25% + 42px)";
}

function centerPicHover() {
  document.getElementById("centerpic").style.width = "calc(50% + 42px)";
  document.getElementById("leftpic").style.width = "calc(25% + 42px)";
  document.getElementById("rightpic").style.width = "calc(25% + 42px)";
}

function rightPicHover() {
  document.getElementById("rightpic").style.width = "calc(50% + 42px)";
  document.getElementById("centerpic").style.width = "calc(25% + 42px)";
  document.getElementById("leftpic").style.width = "calc(25% + 42px)";
}

function hoverDone() {
  document.getElementById("leftpic").style.width = "calc(35% + 42px)";
  document.getElementById("centerpic").style.width = "calc(30% + 42px)";
  document.getElementById("rightpic").style.width = "calc(35% + 42px)";
} */

// ES6 class
class TypeWriter {
  constructor(txtElement, words, wait) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
  
    // Get full text of current word
    const fulltxt = this.words[current];
  
    // Check if deleting
    if (this.isDeleting) {
      // Remove a char
      this.txt = fulltxt.substring(0, this.txt.length - 1)
    } else {
      // Add a char
      this.txt = fulltxt.substring(0, this.txt.length + 1)
    }
  
    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`
  
    // Initial type speed
    let typeSpeed = 200; 
  
    if(this.isDeleting) {
      typeSpeed /= 2;
    }

    if(this.txt === fulltxt || this.txt === "") {
      document.getElementById('cursor').classList.add('blinking-cursor');
    } else {
      document.getElementById('cursor').classList.remove('blinking-cursor');
    }
  
    // If word is complete
    if(!this.isDeleting && this.txt === fulltxt) {
      // Make a pause at end
      typeSpeed = this.wait;
      // Set isDeleting to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = this.wait * 3 / 4;
    }
    
    setTimeout(() => this.type(), typeSpeed)
  }
}

// Init on DOM load

document.addEventListener('DOMContentLoaded', init);

// Init app
function init() {
  const txtElement = document.querySelector('.txt-type');
  const words = JSON.parse(txtElement.getAttribute('data-words'));
  const wait = txtElement.getAttribute('data-wait');

  //init typewritter
  new TypeWriter(txtElement, words, wait);
}

// eslint-disable-next-line no-unused-vars
function otvoriUslugu(pageName,elmnt) {
  var tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (var j = 0; j < tablinks.length; j++) {
    tablinks[j].style.backgroundColor = "";
    tablinks[j].style.color = "";
  }
  console.log(pageName);
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = "rgb(226, 94, 28)";
  elmnt.style.color = "white";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

let currentAnchor;
const bubble = document.querySelector('.bubble');

const pocetnaOptions = {
  root: document.querySelector('.sitewindow'),
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
}

let pocetnaObserver = new IntersectionObserver(navCheck, pocetnaOptions);

pocetnaObserver.observe(document.querySelector('#pocetna'));


const uslugeOptions = {
  root: document.querySelector('.sitewindow'),
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
}

let uslugeObserver = new IntersectionObserver(navCheck, uslugeOptions);

uslugeObserver.observe(document.querySelector('#usluge'));

const galerijaOptions = {
  root: document.querySelector('.sitewindow'),
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
}

let galerijaObserver = new IntersectionObserver(navCheck, galerijaOptions);

galerijaObserver.observe(document.querySelector('#galerija'));


const kontaktOptions = {
  root: document.querySelector('.sitewindow'),
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
}

let kontaktObserver = new IntersectionObserver(navCheck, kontaktOptions);

kontaktObserver.observe(document.querySelector('#kontakt'));

/*const karijeraOptions = {
  root: document.querySelector('.sitewindow'),
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
}

let karijeraObserver = new IntersectionObserver(navCheck, karijeraOptions);

karijeraObserver.observe(document.querySelector('#karijera'));*/

function navCheck(entries) {
  let viewportPercentage = entries[0].intersectionRect.height / entries[0].rootBounds.height
  /*console.log(entries[0].target.id + ": " + viewportPercentage);*/
  let windowResizeAnchor;
  const targetId = entries[0].target.id;
  const activeAnchor = document.querySelector(`[data-page=${targetId}]`);
  const navItems = document.querySelectorAll('nav ul li a');
  windowResizeAnchor = activeAnchor;
  if(viewportPercentage > 0.5 && currentAnchor !== targetId) {
    currentAnchor = targetId;
    setMenuBubble(navItems, activeAnchor);
  }
  
  window.addEventListener("resize", () => {
    let windowResize = windowResizeAnchor.getBoundingClientRect();
    bubble.style.setProperty('left', `${windowResize.left}px`);
    bubble.style.setProperty('top', `${windowResize.top}px`);
    bubble.style.setProperty('width', `${windowResize.width}px`);
    bubble.style.setProperty('height', `${windowResize.height}px`);
  })
}

function setMenuBubble (navItems, activeAnchor) {
  const itemSize = activeAnchor.getBoundingClientRect();
  bubble.style.setProperty('left', `${itemSize.left}px`);
  bubble.style.setProperty('top', `${itemSize.top}px`);
  bubble.style.setProperty('width', `${itemSize.width}px`);
  bubble.style.setProperty('height', `${itemSize.height}px`);
  navItems.forEach((item) => item.style.removeProperty('color'));
  activeAnchor.style.setProperty('color', '#fff');
}

const logoObserver = {
  threshold: 0.05
}

let observer2 = new IntersectionObserver(navCheck2, logoObserver);

function navCheck2(entry) {
  if (!entry[0].isIntersecting) {
    document.querySelector('.logonavbar').style.setProperty('left', '-110px')
    document.querySelector('.logonavbar').style.setProperty('top', '-150px')
  }
  if (entry[0].isIntersecting) {
    document.querySelector('.logonavbar').style.removeProperty('left')
    document.querySelector('.logonavbar').style.removeProperty('top')
  }
}

observer2.observe(document.querySelector('.logo'));