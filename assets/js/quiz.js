(function(){
  var questions = [
    {
      q: "Qual destes é um dos biomas de Mato Grosso?",
      options: ["Pantanal", "Caatinga", "Pampa"],
      correct: 0,
      explain: "Mato Grosso abriga Pantanal, Cerrado e Amazônia."
    },
    {
      q: "Qual bioma é conhecido como a savana brasileira?",
      options: ["Amazônia", "Cerrado", "Mata Atlântica"],
      correct: 1,
      explain: "O Cerrado é a savana tropical brasileira, com alta biodiversidade."
    },
    {
      q: "O norte de Mato Grosso pertence majoritariamente a qual bioma?",
      options: ["Amazônia", "Pantanal", "Caatinga"],
      correct: 0,
      explain: "A região norte de MT integra a Amazônia, com floresta tropical úmida."
    },
    {
      q: "O Pantanal é mais conhecido por suas...",
      options: ["Áreas úmidas e cheias sazonais", "Montanhas de alta altitude", "Desertos extensos"],
      correct: 0,
      explain: "O Pantanal é a maior área úmida tropical, marcado por ciclos de cheia e seca."
    },
    {
      q: "Uma espécie emblemática do Cerrado é o...",
      options: ["Lobo-guará", "Pinguim", "Urso-polar"],
      correct: 0,
      explain: "O lobo-guará é símbolo do Cerrado; adaptado às paisagens abertas."
    }
  ];

  var state = { index: 0, score: 0, answered: false };
  var root;

  function el(tag, attrs, children){
    var e = document.createElement(tag);
    if (attrs){
      Object.keys(attrs).forEach(function(k){
        if (k === 'class') e.className = attrs[k];
        else if (k === 'text') e.textContent = attrs[k];
        else e.setAttribute(k, attrs[k]);
      });
    }
    if (children){
      children.forEach(function(c){
        if (typeof c === 'string') e.appendChild(document.createTextNode(c));
        else e.appendChild(c);
      });
    }
    return e;
  }

  function render(){
    var total = questions.length;
    var q = questions[state.index];
    root.innerHTML = '';

    // progresso
    var progress = el('div', {class: 'quiz-progress'}, [
      el('div', {class: 'quiz-progress-bar', style: 'width:' + ((state.index/total)*100) + '%'}),
      el('div', {class: 'quiz-progress-text', text: 'Pergunta ' + (state.index+1) + ' de ' + total})
    ]);

    var title = el('h2', {class: 'question'}, [q.q]);

    var list = el('div', {class: 'options'});
    q.options.forEach(function(opt, i){
      var b = el('button', {class: 'option-btn', 'data-index': i, 'aria-label': 'Alternativa ' + (i+1)}, [opt]);
      b.addEventListener('click', function(){ select(i); });
      list.appendChild(b);
    });

    var actions = el('div', {class: 'quiz-actions'});
    var confirmBtn = el('button', {class: 'button confirm-btn', text: 'Confirmar resposta'});
    confirmBtn.addEventListener('click', confirm);
    actions.appendChild(confirmBtn);

    var feedback = el('div', {class: 'feedback', id: 'feedback'});

    root.appendChild(progress);
    root.appendChild(title);
    root.appendChild(list);
    root.appendChild(actions);
    root.appendChild(feedback);
  }

  var selected = null;
  function select(i){
    if (state.answered) return; // não permite trocar após confirmar
    selected = i;
    var btns = root.querySelectorAll('.option-btn');
    for (var b of btns){ b.classList.toggle('selected', parseInt(b.getAttribute('data-index')) === i); }
  }

  function confirm(){
    if (state.answered) return; // impede duplo clique
    if (selected == null) return;
    var q = questions[state.index];
    var isCorrect = selected === q.correct;
    var feedback = root.querySelector('#feedback');
    state.answered = true;

    var btns = root.querySelectorAll('.option-btn');
    btns.forEach(function(b){
      var idx = parseInt(b.getAttribute('data-index'));
      b.disabled = true;
      b.classList.toggle('correct', idx === q.correct);
      b.classList.toggle('incorrect', idx === selected && !isCorrect);
    });

    // desativa botão Confirmar após uso
    var cb = root.querySelector('.confirm-btn');
    if (cb) cb.disabled = true;

    if (isCorrect) {
      state.score++;
      feedback.innerHTML = '<div class="ok">Correto!</div><p>' + q.explain + '</p>';
    } else {
      feedback.innerHTML = '<div class="err">Não foi dessa vez.</div><p>' + q.explain + '</p>';
    }

    var nextBtn = el('button', {class: 'button next-btn', text: state.index === questions.length-1 ? 'Ver resultado' : 'Próxima'}, []);
    nextBtn.addEventListener('click', next);
    root.querySelector('.quiz-actions').appendChild(nextBtn);
  }

  function next(){
    if (state.index < questions.length-1){
      state.index++; state.answered = false; selected = null; render();
    } else {
      showResult();
    }
  }

  function showResult(){
    root.innerHTML = '';
    var total = questions.length;
    var pct = Math.round((state.score/total)*100);
    root.appendChild(el('h2', {text: 'Resultado'}, []));
    root.appendChild(el('p', {class: 'result', text: 'Você acertou ' + state.score + ' de ' + total + ' (' + pct + '%).'}, []));

    var actions = el('div', {class: 'result-actions'});
    actions.appendChild(el('a', {href: 'index.html', class: 'button'}, ['Explorar páginas dos biomas']));
    var redoBtn = el('button', {class: 'button', text: 'Refazer quiz'});
    redoBtn.addEventListener('click', reset);
    actions.appendChild(redoBtn);
    root.appendChild(actions);
  }

  function reset(){
    state.index = 0; state.score = 0; state.answered = false; selected = null; render();
  }

  document.addEventListener('DOMContentLoaded', function(){
    root = document.getElementById('quiz-root');
    render();
  });
})();