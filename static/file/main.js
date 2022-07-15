(function () {
  main();
})();

function main () {
  header();

  if (window.location.pathname === '/') {
    home();
  } else if (window.location.pathname === '/contact/') {
    contact();
  }
}

function header () {
  var el = {
    navbarToggler: document.getElementById('jsNavbarToggler'),
    header: document.getElementById('jsHeader')
  }

  var isCollapsed = true;

  el.navbarToggler.addEventListener('click', function (event) {
    event.preventDefault();

    isCollapsed = !isCollapsed;

    if (isCollapsed) {
      el.navbarToggler.classList.add('is-collapsed');
      el.header.classList.remove('is-fixed');
    } else {
      el.navbarToggler.classList.remove('is-collapsed');
      el.header.classList.add('is-fixed');
    }
  });
}

function home () {
  var vm = new Vue({
    data: {
      tab: 'commute'
    },
    methods: {
      onClickTab: function (tab) {
        this.tab = tab;
      }
    }
  });

  vm.$mount('#app');
}

function contact () {
  var vm = new Vue({
    data: {
      page: 'input',
      form: null,
      validation: null,
      contactCategories: null,
      review: null,
      previousContactCategoryId: null,
    },
    created: function () {
      var method = 'GET';
      var url = '/api/v1/contact/initialize';
      
      fetch(url, {method: method})
        .then(function (response) {
          return response.json();
        }.bind(this))
        .then(function (body) {
          this.form = body.form;
          this.validation = body.validation;
          this.contactCategories = body.contactCategories;
        }.bind(this))
        .catch(function (err) {
          console.error(err);
        }.bind(this))
    },
    methods: {
      onChangeContactCategoryId: function () {
        var contactCategory = this.contactCategories.find(function (contactCategory) {
          return (contactCategory.id + '') === this.form.contactCategoryId;
        }.bind(this));
        var previous = null;

        if (this.previousContactCategoryId) {
          previous = this.contactCategories.find(function (contactCategory) {
            return (contactCategory.id + '') === this.previousContactCategoryId;
          }.bind(this));

          if (previous) {
            if (this.form.text === '' || this.form.text === previous.text) {
              this.form.text = contactCategory.text;
            }
          }
        } else {
          if (this.form.text === '') {
            this.form.text = contactCategory.text;
          }
        }

        this.previousContactCategoryId = this.form.contactCategoryId;
      },

      onClickButtonNext: function () {
        var method = 'POST';
        var url = '/api/v1/contact/validate';
        var headers = {
          'Content-Type': 'application/json; charset=UTF-8'
        };
        var body = JSON.stringify({form: this.form});
        
        fetch(url, {
          method: method,
          headers: headers,
          body: body,
        })
          .then(function (response) {
            return response.json();
          }.bind(this))
          .then(function (body) {
            this.validation = body.validation;

            if (this.validation.ok) {
              var contactCategory = this.contactCategories.find(function (contactCategory) {
                return (contactCategory.id + '') === this.form.contactCategoryId;
              }.bind(this));

              this.review = {
                name: this.form.name,
                phone: this.form.phone,
                email: this.form.email,
                zip: this.form.zip,
                address: this.form.address,
                contactCategory: contactCategory.title,
                textLines: this.form.text.replace(/\r\n/g, '\n')
                  .replace(/\r/g, '\n')
                  .split('\n')
              };

              this.page = 'review';
              window.scrollTo(0, 0);
            }
          }.bind(this))
          .catch(function (err) {
            console.error(err);
          }.bind(this))
      },

      onClickButtonPrevious: function () {
        this.page = 'input';
        window.scrollTo(0, 0);
      },

      onClickButtonSubmit: function () {
        var method = 'POST';
        var url = '/api/v1/contact/submit';
        var headers = {
          'Content-Type': 'application/json; charset=UTF-8'
        };
        var body = JSON.stringify({form: this.form});
        
        fetch(url, {
          method: method,
          headers: headers,
          body: body,
        })
          .then(function (response) {
            return response.json();
          }.bind(this))
          .then(function (body) {
            if (body.ok) {
              window.location.assign(body.redirect);
            }
          }.bind(this))
          .catch(function (err) {
            console.error(err);
          }.bind(this))
      }
    }
  });

  vm.$mount('#app');
}
