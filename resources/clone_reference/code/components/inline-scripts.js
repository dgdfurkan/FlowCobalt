/* Inline JavaScript Block 1 */
WebFont.load({  google: {    families: ["Inconsolata:400,700","Noto Sans:200,300,regular,500,600,700","Epilogue:regular,600","Inter:regular,500,600,700,800"]  }});

/* Inline JavaScript Block 2 */
!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);

/* Inline JavaScript Block 3 */
window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('set', 'developer_id.dZGVlNj', true);gtag('js', new Date());gtag('config', 'G-XF58Z10Y4M');

/* Inline JavaScript Block 4 */

    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_f3YHtchuTCLwrunsQCKtzQlUPbfy7yyKLezua95UIH', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    })


/* Inline JavaScript Block 5 */

hbspt.forms.create({
region: "na1",
portalId: "21427964",
formId: "26ac57c9-f1f3-4d9a-9e46-e02198de2109"
});


/* Inline JavaScript Block 6 */
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W8SCC72C');

/* Inline JavaScript Block 7 */
(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');

/* Inline JavaScript Block 8 */

!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '3003168203188488');
fbq('track', 'PageView');


/* Inline JavaScript Block 9 */
(()=>{var t="https://cdn.jsdelivr.net/npm/@finsweet/attributes-accordion@1/accordion.js",e=document.querySelector(`script[src="${t}"]`);e||(e=document.createElement("script"),e.async=!0,e.src=t,document.head.append(e));})();

/* Inline JavaScript Block 10 */

document.addEventListener('DOMContentLoaded', function() {
// Function to check if the viewport width is 767px or less
function isMobile() {
  return window.innerWidth <= 767;
}

// Split text into individual words
const layoutText = new SplitType(".layout484_text", { types: "words" });
const layoutTL = gsap.timeline();

// Define different start and end values for mobile devices
let startValue = isMobile() ? "top 50%" : "top center";
let endValue = isMobile() ? "bottom 90%" : "bottom center";

layoutTL.from(layoutText.words,{
  // Initial opacity for each word
  opacity: 0.25,
  // Stagger animation of each word
  stagger: 0.1,
  scrollTrigger: { 
    trigger: ".section_layout484",
    // Trigger animation when .section_layout484 reaches certain part of the viewport
    start: startValue,
    // End animation when .section_layout484 reaches certain part of the viewport
    end: endValue,
    // Smooth transition based on scroll position
    scrub: 2
  }
});
});


/* Inline JavaScript Block 11 */

// Set year in footer credits
$(function() {
  $('.this-year').text(new Date().getFullYear());
});


/* Inline JavaScript Block 12 */

  {
    "region": "f1db6c",
    "project": "171876085774-435c-a088-dfa345099d17",
    "agent": "f3213730-ff41-4878-a92c-82ef8e74aada",
    "buttonImage": "https://cdn.jsdelivr.net/gh/RelevanceAI/content-cdn@latest/agents/agent_avatars/agent_avatar_13.svg",
    "prompts": ["Request a tailored demo"],
    "features": {
      "hidePoweredBy": true,
      "attachments": true
    }
  }


/* Inline JavaScript Block 13 */

(function () {
  const run = () => {
    const anyOpen = () =>
      document.querySelector('.w-nav-button.w--open, .w-nav-menu.w--open, .w-nav-overlay.w--open');

    const closeAll = () => {
      document.querySelectorAll('.w-nav-button.w--open').forEach(btn => btn.click());
    };

    // Only treat the real menu / dropdowns as "inside"
    const insideMenu = (el) =>
      !!el && !!el.closest('.w-nav-menu, .w-dropdown, .w-dropdown-list, .w-dropdown-toggle');

    const isOverlay = (el) => !!el && !!el.closest('.w-nav-overlay');

    // If a gesture starts outside the menu (e.g., on overlay), a tiny move should close it
    let down = null;
    const THRESH = 5; // smaller = more responsive close on overlay drag

    const onStart = (e) => {
      if (!anyOpen()) return;
      const t = e.target || e.srcElement;
      const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0);
      const y = (e.clientY ?? e.touches?.[0]?.clientY ?? 0);
      down = { x, y, inMenu: insideMenu(t), onOverlay: isOverlay(t) };
    };

    const onMove = (e) => {
      if (!anyOpen() || !down) return;
      if (down.inMenu) return; // allow scrolling inside the menu/dropdowns
      // Started on overlay or outside menu: small drag closes
      const cx = (e.clientX ?? e.touches?.[0]?.clientX ?? 0);
      const cy = (e.clientY ?? e.touches?.[0]?.clientY ?? 0);
      if (Math.abs(cx - down.x) > THRESH || Math.abs(cy - down.y) > THRESH) {
        closeAll();
        down = null;
      }
    };

    const onEnd = () => { down = null; };

    document.addEventListener('pointerdown', onStart, { capture: true });
    document.addEventListener('touchstart',  onStart, { capture: true, passive: true });
    document.addEventListener('mousedown',   onStart, { capture: true });

    document.addEventListener('pointermove', onMove,  { capture: true, passive: true });
    document.addEventListener('touchmove',   onMove,  { capture: true, passive: true });

    document.addEventListener('pointerup',     onEnd, { capture: true });
    document.addEventListener('pointercancel', onEnd, { capture: true });
    document.addEventListener('touchend',      onEnd, { capture: true });
    document.addEventListener('mouseup',       onEnd, { capture: true });

    // If any scroll happens OUTSIDE the menu (overlay/page), close.
    const closeOnScroll = (e) => {
      if (!anyOpen()) return;
      const t = e.target || e.srcElement;
      if (insideMenu(t)) return;     // scrolling menu content → allowed
      // overlay or page → close
      closeAll();
    };
    // Capture-phase catches scroll on any container, including overlay
    document.addEventListener('scroll', closeOnScroll, { capture: true, passive: true });
    window.addEventListener('scroll',   closeOnScroll, { passive: true });
    window.addEventListener('wheel',    closeOnScroll, { passive: true });

    // Close after tapping a REAL nav link (not toggles / "#" / buttons)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.w-nav-menu a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href === '#' || link.matches('.w-dropdown-toggle,[aria-haspopup="menu"],[role="button"]')) return;
      if (anyOpen()) closeAll();
    }, false);

    // Orientation/resize: collapse to avoid odd states
    window.addEventListener('resize', () => anyOpen() && closeAll());
    window.addEventListener('orientationchange', () => anyOpen() && closeAll());
  };

  if (window.Webflow && Array.isArray(window.Webflow)) window.Webflow.push(run);
  else if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();


/* Inline JavaScript Block 14 */

 //Only backspace what doesn't match the previous string
 var typed = new Typed(".typedjs-smart", {
 		strings:["Support", "Sales", "Marketing", "Finance", "Human Resources", "Operations"],
    typeSpeed: 30,//typing speed
    backSpeed: 50, //erasing speed
    loop: true, // start back after ending typing
    smartBackspace: true, //this is on by default
  });


/* Inline JavaScript Block 15 */

$(document).ready(function() {
    // Show custom cursor and hide the default cursor on hover
    $('.home_hero-header_image-wrapper, .key-features_video, .typedjs-smart').on('mouseenter', function() {
        $('.you-cursor').stop().fadeTo(200, 1); // Fade in the custom cursor
        $(this).addClass('hide-default-cursor'); // Hide default cursor
    });

    // Hide custom cursor and show the default cursor when leaving the element
    $('.home_hero-header_image-wrapper, .key-features_video, .typedjs-smart').on('mouseleave', function() {
        $('.you-cursor').stop().fadeTo(200, 0); // Fade out the custom cursor
        $(this).removeClass('hide-default-cursor'); // Restore default cursor
    });
});


/* Inline JavaScript Block 16 */

$(".slider-main_component").each(function (index) {
  let loopMode = true;
  if ($(this).attr("loop-mode") === "true") {
    loopMode = true;
  }
  let sliderDuration = 300;
  if ($(this).attr("slider-duration") !== undefined) {
    sliderDuration = +$(this).attr("slider-duration");
  }
  const swiper = new Swiper($(this).find(".swiper")[0], {
    speed: sliderDuration,
    loop: loopMode,
    autoHeight: false,
    centeredSlides: loopMode,
    followFinger: true,
    freeMode: false,
    slideToClickedSlide: false,
    slidesPerView: 1,
    spaceBetween: "4%",
    rewind: false,
    mousewheel: {
      forceToAxis: true
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    breakpoints: {
      // mobile landscape
      480: {
        slidesPerView: 1,
        spaceBetween: "4%"
      },
      // tablet
      768: {
        slidesPerView: 2,
        spaceBetween: "4%"
      },
      // desktop
      992: {
        slidesPerView: 4,
        spaceBetween: "2%"
      }
    },
    pagination: {
      el: $(this).find(".swiper-bullet-wrapper")[0],
      bulletActiveClass: "is-active",
      bulletClass: "swiper-bullet",
      bulletElement: "button",
      clickable: true
    },
    navigation: {
      nextEl: $(this).find(".swiper-next")[0],
      prevEl: $(this).find(".swiper-prev")[0],
      disabledClass: "is-disabled"
    },
    scrollbar: {
      el: $(this).find(".swiper-drag-wrapper")[0],
      draggable: true,
      dragClass: "swiper-drag",
      snapOnRelease: true
    },
    slideActiveClass: "is-active",
    slideDuplicateActiveClass: "is-active"
  });
});


/* Inline JavaScript Block 17 */

  $(document).ready(function () {
    let processing = false; // Prevent multiple queries from running at the same time

    function typeText(element, text, callback) {
      let i = 0;
      element.val(""); // Clear input before typing

      function type() {
        if (i < text.length) {
          element.val(element.val() + text.charAt(i));
          i++;
          setTimeout(type, 20); // Adjust typing speed here
        } else if (callback) {
          callback(); // Call the function when typing is complete
        }
      }

      type();
    }

    $('[data-element="query"]').click(function () {
      if (processing) return; // Prevent multiple clicks

      processing = true; // Set flag to prevent duplicate actions

      // Disable all query buttons completely
      $('[data-element="query"]').css({
        "pointer-events": "none",  // Prevent further clicks
        "opacity": "0.5",          // Grey out the buttons
        "cursor": "not-allowed"    // Show disabled cursor
      });

      var queryText = $(this).attr('data-query'); // Get long query from data-query attribute
      var inputField = $('#invent_query');

      // Animate typing effect, then submit the form after typing completes
      typeText(inputField, queryText, function () {
        setTimeout(function () {
          redirectWithQuery(); // Submit after typing completes
        }, 300); // Small delay before submission
      });
    });

    $('form').submit(function (event) {
      event.preventDefault(); // Prevent actual form submission
      redirectWithQuery(); // Manually handle redirection
    });

    function redirectWithQuery() {
      var inputValue = $('#invent_query').val().trim();
      if (inputValue === "") return; // Prevent empty submissions

      var encodedValue = encodeURIComponent(inputValue);
      var redirectUrl = "https://app.relevanceai.com/?invent_query=" + encodedValue;

      window.location.href = redirectUrl; // Redirect to the new URL
    }
  });



