// Carrossel simples e reutilizável
(function(){
  function setupCarousel(carousel){
    var track = carousel.querySelector('.slides');
    var slides = Array.prototype.slice.call(track.children);
    var prev = carousel.querySelector('.prev');
    var next = carousel.querySelector('.next');
    var dotsEl = carousel.querySelector('.dots');
    var index = 0;
    var timer = null;

    // criar dots
    slides.forEach(function(_, i){
      var b = document.createElement('button');
      b.className = 'dot' + (i===0 ? ' active' : '');
      b.setAttribute('aria-label', 'Ir para slide ' + (i+1));
      b.addEventListener('click', function(){ goTo(i); });
      dotsEl.appendChild(b);
    });

    function update(){
      track.style.transform = 'translateX(-' + (index*100) + '%)';
      var dots = dotsEl.querySelectorAll('.dot');
      for (var i=0;i<dots.length;i++){
        dots[i].classList.toggle('active', i===index);
      }
    }
    function goTo(i){
      index = (i + slides.length) % slides.length;
      update();
    }

    prev.addEventListener('click', function(){ goTo(index-1); });
    next.addEventListener('click', function(){ goTo(index+1); });

    function startAuto(){
      stopAuto();
      timer = setInterval(function(){ goTo(index+1); }, 5000);
    }
    function stopAuto(){
      if (timer) { clearInterval(timer); timer = null; }
    }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    update();
    startAuto();
  }

  document.addEventListener('DOMContentLoaded', function(){
    var carousels = document.querySelectorAll('.carousel');
    for (var i=0;i<carousels.length;i++) setupCarousel(carousels[i]);
  });
})();