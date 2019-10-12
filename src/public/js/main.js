
(function () {

  const socket = io();

  // Selecionando elementos pelo id  //
  const el = {};
  document.querySelectorAll('[id]').forEach((element) => {
    el[getCamelCase(element.id)] = element;
  });


  function getCamelCase(text) {
    const div = document.createElement('div');


    div.innerHTML = `<div data-${text}="id"></div>`;
    return Object.keys(div.firstChild.dataset)[0];

  }

  // -------------------------------------------//

  function css() {
    Element.prototype.hide = function () {
      this.style.display = 'none';
    };

    Element.prototype.show = function () {
      this.style.display = 'block';
    };

  }
  css();


  const getCurrentTime = () => new Date().toLocaleTimeString();


  el.nickForm.addEventListener('submit', (e) => {
    e.preventDefault();


    socket.emit('new user', el.author.value, (data) => {

      if (data) {
        el.nickWrap.hide();
        el.nickError.hide();
        el.contentWrap.show();
        el.myNameUser.innerHTML = el.author.value;
      } else {
        el.nickError.innerHTML = `<div class="alert alert-danger">
                        Este nome ja existe.
                    </div> `;
      }

      el.author.value = '';


    });
  });

  const previewImage = () => {
    const image = document.querySelector('#image').files[0];

    const reader = new FileReader();
    reader.onloadend = function () {
      el.preview.src = reader.result;
    };
    if (image) {
      reader.readAsDataURL(image);
    } else {
      el.preview.src = '';
    }

  };
  image.addEventListener('change', () => {
    previewImage();
    el.btnPhoto.show();

    el.photo.addEventListener('submit', (e) => {
      e.preventDefault();
      el.btnPhoto.hide();
      socket.emit('photo', el.preview.src);

    });


  });


  socket.on('photo', (data) => el.preview.src = data);


  socket.on('usernames', (users) => {

    let html = '';

    users.map((user) => {


      html = `<div class="container2 hover " >
                                <img src="${el.preview.src}" class="userChat online" id="myUser"/>  
                                <p class="name-user" id="user">${user}</p>  
                                <p class="time">${getCurrentTime()}</p>    
                            </div>`;

    });

    el.usernames.innerHTML += html;






  });


  el.btnChat.addEventListener('click', (e) => {
    e.preventDefault();
    el.aside.hide();
    el.main.style.display = 'flex';
    el.footer.style.display = 'flex';
    el.btnCloseChat.style.display = 'block';


  });

  el.btnCloseChat.addEventListener('click', (e) => {
    e.preventDefault();
    el.aside.style.display = 'flex';
    el.main.hide();
    el.footer.hide();
    el.btnCloseChat.hide();


  });








  socket.on('userOn', (data) => {
    alert(`${data} se conectou ao chat`);
  });





  const renderMessage = (data) => {

    el.feedback.innerHTML = '';
    const htmL = `<b id="userDig">${data.nick}</b><br>
                     <div id="chatBox-left">${data.msg}
                     <span>${data.time}</span></div><br>`;

    el.left.innerHTML += htmL;

  };


  el.chat.addEventListener('submit', (e) => {
    e.preventDefault();

    const htmL = ` <br><div id="chatBox-right">${el.menssage.value} ${getCurrentTime()}</div><br>`;


    el.right.innerHTML += htmL;

    socket.emit('Enviar menssagem', el.menssage.value);

    el.menssage.value = '';

  });


  socket.on('Nova menssagem', (data) => renderMessage(data));


  el.menssage.addEventListener('keypress', () => {

    socket.emit('typing', el.author.value);

  });




  socket.on('typing', (data) => {
    if (data) {
      el.feedback.innerHTML = `<p id="userDig"><em>${data} esta digitando ...</em></p>`;
    } else {
      el.feedback.innerHTML = '';
    }
  });

  socket.on('load old msgs', (msgs) => {

    msgs.forEach((msg) => {
      renderMessage(msg);
    });

  });


}());


