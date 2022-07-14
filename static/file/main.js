(function () {
  main();
})();

function main () {
  if (window.location.pathname === '/') {
    home();
  }
}

function home () {
  var el = {
    tabGalleryCommute: document.getElementById('jsTabGalleryCommute'),
    tabGalleryCorrespondance: document.getElementById('jsTabGalleryCorrespondance'),
    galleryCommute: document.getElementById('jsGalleryCommute'),
    galleryCorrespondance: document.getElementById('jsGalleryCorrespondance')
  };

  el.tabGalleryCommute.addEventListener('click', function (event) {
    event.preventDefault();
    el.tabGalleryCommute.classList.add('is-active');
    el.tabGalleryCorrespondance.classList.remove('is-active');
    el.galleryCommute.style.display = 'block';
    el.galleryCorrespondance.style.display = 'none';
  });

  el.tabGalleryCorrespondance.addEventListener('click', function (event) {
    event.preventDefault();
    el.tabGalleryCommute.classList.remove('is-active');
    el.tabGalleryCorrespondance.classList.add('is-active');
    el.galleryCommute.style.display = 'none';
    el.galleryCorrespondance.style.display = 'block';
  });
}
