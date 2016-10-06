const net = require ('net');
const fs =require('fs');

const server = net.createServer((request) => {


  request.on('data', (data)=>{

    console.log('GET REQUEST', data.toString());

    let headerArray = data.toString().split(' ');
    let requestMethod = headerArray[0];
    let pathName = '.' + headerArray[1];
    let type;

    if(pathName === './'){
      pathName = './index.html';
    }

    if(pathName.substring(pathName.length - 4) === 'html'){
      type = 'html';
    }else{
      type = 'css';
    }

    fs.readFile( pathName, (err, data) => {
      if(err){
        fs.readFile( './404.html', (err, data)=>{

        let errorHeader = `HTTP/1.1 404 Not Found
        Server: nginx/1.4.6 (Ubuntu)
        Content-Type: text/html; charset=utf-8
        Content-Length: ${data.toString().length}
        Connection: keep-alive\n\n`;

        request.write(errorHeader);
        request.write(data.toString());


        })
      }else{


        let header = `HTTP/1.1 200 OK
        Server: nginx/1.4.6 (Ubuntu)
        Content-Type: text/${type}; charset=utf-8
        Content-Length: ${data.toString().length}
        Connection: keep-alive\n\n`;

        request.write(header);
        request.write(data.toString());
        request.end();
      }


    });


  });


  request.on('end', () => {
    console.log('Connection Closed');
  });

});

server.listen({port: 8080}, ()=>{
  const address = server.address();
  console.log(`Opened server on ${address.port}`);
});
