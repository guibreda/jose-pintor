/* José Pintor – interações */
(function () {
  'use strict';

  var WHATSAPP = '5515991302593';

  /* Menu mobile */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) setMenu(false);
    });
  }

  /* Sombra no cabeçalho ao rolar */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Animação de entrada */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* Imagens externas: se falharem, mostra o fundo em degradê */
  document.querySelectorAll('.hero-photo img, .g-item img').forEach(function (img) {
    function hide() { img.style.display = 'none'; }
    img.addEventListener('error', hide);
    // o erro pode ter ocorrido antes do script carregar
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* Máscara simples de telefone (BR) */
  var tel = document.getElementById('f-tel');
  if (tel) {
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11);
      var out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
      tel.value = out;
    });
  }

  /* Formulário -> WhatsApp */
  var form = document.getElementById('form-orcamento');
  var erro = document.getElementById('form-erro');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var fone = form.telefone.value.trim();
      var digits = fone.replace(/\D/g, '');

      form.nome.classList.toggle('invalid', !nome);
      form.telefone.classList.toggle('invalid', digits.length < 10);

      if (!nome || digits.length < 10) {
        erro.textContent = !nome
          ? 'Por favor, informe seu nome.'
          : 'Informe um telefone válido com DDD.';
        erro.hidden = false;
        (!nome ? form.nome : form.telefone).focus();
        return;
      }
      erro.hidden = true;

      var linhas = [
        'Olá José! Vim pelo site e gostaria de um orçamento.',
        '',
        'Nome: ' + nome,
        'Telefone: ' + fone,
        'Cidade: ' + form.cidade.value,
        'Imóvel: ' + form.tipo.value,
        'Serviço: ' + form.servico.value
      ];
      var msg = form.mensagem.value.trim();
      if (msg) linhas.push('Detalhes: ' + msg);

      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }

  /* Ano no rodapé */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
