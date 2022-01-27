
// This is where it all goes :)

// Accordian Functionality 
function hideOtherAccordians(currentTarget){
    document.querySelectorAll('[data-toggle="collapse"]').forEach((element)=>{
      if(currentTarget!=element.dataset.target){
        document.querySelector(element.dataset.target).classList.remove('show');
        if(element.closest('.card'))
        element.closest('.card').classList.remove('active');
      }
    });
  }
  
  function debounce(func, wait, immediate) {
    var timeout;
  
    return function executedFunction() {
      var context = this;
      var args = arguments;
          
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };
  
  window.addEventListener("load", () => {
  
    // Initialise carousel
    if(document.querySelector('.splide')){
      new Splide(".splide",{
        padding: {
          right: '50px',
        }
      }).mount();
    }
  
    var features = document.getElementById("features");
  
    // Accordian Functionality 
    if(features)
    features.querySelectorAll('[data-toggle="collapse"]').forEach((element)=>{
      element.addEventListener("click",(event)=>{
          var target = document.querySelector(event.target.dataset.target);
          var feature_image = document.getElementById("feature_image")
          var imagepath = event.target.dataset.image;
          var card = event.target.closest('.card');
          if(feature_image.src != imagepath){
             feature_image.src = imagepath 
          }
          if(target.classList.contains('show'))
          {
            target.classList.remove('show')
          }
          else
          {
            hideOtherAccordians(event.target.dataset.target)
            target.classList.add('show')
            card.classList.add('active')
          }
      });
    });
  
    
    var accordion = document.getElementById("accordion");
    if(accordion){
      var shouldActiveScrollEffect = window.getComputedStyle(accordion,null).display == "block"
      if(features && shouldActiveScrollEffect){
        window.addEventListener("scroll",function(e){
          var featuresScrollPosition = features.getBoundingClientRect().top
          if(featuresScrollPosition<=0 && featuresScrollPosition>=-100){
            disableScroll()
            document.onwheel = (e)=>{handleFeatureChange(e)}
          }else{
            unsubscribeScrollEvent()
          }
        });
      }
    }
    
  
    var unsubscribeScrollEvent = function(){
      enableScroll()
      document.onwheel = null;
    }
    
    var handleFeatureChange = debounce(function(e){
      var activeCard = document.querySelector('.card.active');
      var previousCard = activeCard.previousElementSibling;
      var nextCard = activeCard.nextElementSibling;
      if(e.deltaY<0){
        if(previousCard)
        document.querySelector(`[data-target="${previousCard.dataset.targetAccordion}"]`).click();
        else
        unsubscribeScrollEvent()
      }else if(e.deltaY>0){
        if(nextCard)
        document.querySelector(`[data-target="${nextCard.dataset.targetAccordion}"]`).click();
        else
        unsubscribeScrollEvent()
      }
    },100)
  
  });
  
  
  
  var keys = {37: 1, 38: 1, 39: 1, 40: 1};
  
  function preventDefault(e) {
    e.preventDefault();
  }
  
  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }
  
  var supportsPassive = false;
  try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; } 
    }));
  } catch(e) {}
  
  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  
  function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); 
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  }
  
  function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  }
  
  
  // Add Gumstack Support
  let scheduleBtns = document.querySelectorAll("[data-action=gumstack-schedule]");
  scheduleBtns.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      Gumstack('launchScheduler', {})
    })
  })
  
  let callBtns = document.querySelectorAll("[data-action=gumstack-call]");
  callBtns.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      Gumstack('launchCall', {})
    })
  })
  
  let requestInviteButtons = document.querySelectorAll("[data-action=requestInvite]");
  requestInviteButtons.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleRequestInvite(true)
    })
  })
  
  let closeRequest = document.getElementById("close-request-invite");
  if(closeRequest)
  {
    closeRequest.addEventListener('click',e=>{
      toggleRequestInvite(false)
    })
  }
  
  function toggleRequestInvite(bool){
    let overlay = document.getElementById("request-overlay");
    if(overlay){
      if(!overlay.classList.contains('animate') && bool){
        overlay.classList.add('animate')
      }
      if(!bool)
      overlay.classList.remove('animate')
    }
  }
  
  function toggleVideoPopup(bool,url=null){
    let overlay = document.querySelector(".video-popup");
    let frame =  overlay.querySelector("#videoFrame");
    if(url) frame.src = url
    if(overlay){
      if(bool)
        overlay.classList.add('animate')
      else{
          overlay.classList.remove('animate')
          let o = overlay.cloneNode(true)
          overlay.remove();
          document.body.appendChild(o);
      }
    }
  }
  
  function playVideo(url){
    toggleVideoPopup(true,url)
  }
  
  let videoPlayButtons = document.querySelectorAll("[data-action=play-video]");
  videoPlayButtons.forEach((el)=>{
    el.addEventListener('click',(e)=>{
      e.preventDefault();
      let url = el.dataset.url;
      playVideo(url)
    })
  });
  