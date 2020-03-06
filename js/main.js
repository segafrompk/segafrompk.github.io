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


const sections = document.querySelectorAll('section');
const bubble = document.querySelector('.bubble');

const options = {
  root: document.querySelector('.sitewindow'),
  threshold: 0.7
}

let observer = new IntersectionObserver(navCheck, options);

function navCheck(entries) {
  let windowResizeAnchor;
  for (let entry of entries) {
    const targetId = entry.target.id;
    const activeAnchor = document.querySelector(`[data-page=${targetId}]`);
    const navItems = document.querySelectorAll('nav ul li a');
    const itemSize = activeAnchor.getBoundingClientRect();
    windowResizeAnchor = activeAnchor;
    if(entry.isIntersecting == true && entry.intersectionRatio != 0) {
      bubble.style.setProperty('left', `${itemSize.left}px`);
      bubble.style.setProperty('top', `${itemSize.top}px`);
      bubble.style.setProperty('width', `${itemSize.width}px`);
      bubble.style.setProperty('height', `${itemSize.height}px`);
      navItems.forEach((item) => item.style.removeProperty('color'));
      activeAnchor.style.setProperty('color', '#fff');
      break;
    }
  }
  
  window.addEventListener("resize", () => {
    let windowResize = windowResizeAnchor.getBoundingClientRect();
    bubble.style.setProperty('left', `${windowResize.left}px`);
    bubble.style.setProperty('top', `${windowResize.top}px`);
    bubble.style.setProperty('width', `${windowResize.width}px`);
    bubble.style.setProperty('height', `${windowResize.height}px`);
  })
}

sections.forEach(section => {
  observer.observe(section);
})

const options2 = {
  threshold: 0.05
}

let observer2 = new IntersectionObserver(navCheck2, options2);

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