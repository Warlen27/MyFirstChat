
module.exports = (io) => {
  const messages = [];
  const users = {};

  io.on('connection', (socket) => {


    socket.emit('load old msgs', messages);

    console.log('New user connected');


    socket.on('new user', (data, cb) => {

      console.log(data);
      if (data in users) {
        cb(false);

      } else{
        cb(true);
        socket.id = data;

        users[socket.id] = socket;

        updateNickname();


      }

      socket.broadcast.emit('userOn', socket.id);

    });



    socket.on('Enviar menssagem', (data) => {

      socket.broadcast.emit('Nova menssagem', {
        nick: socket.id,
        msg: data,
        time: getCurrentTime(),


      });
    });
    socket.on('photo', (data) => {

      socket.broadcast.emit('photo', data);



    });
    socket.on('disconnect', () => {
      if (!socket.id) return;
      delete users[socket.id];
      updateNickname();

    });
    function updateNickname() {
      socket.broadcast.emit('usernames', Object.keys(users));


    }


    socket.on('typing', (data) => {

      socket.broadcast.emit('typing', socket.id);


    });


  });
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString();
    replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
  };
};

