import {EventEmitter} from 'events';
import {WebSocketServer} from 'ws'

export const userEvents = new EventEmitter()

const userWebSocket = new WebSocketServer({ port: 8080});

  userWebSocket.on('connection', (ws) => {
    console.log('Client Connected')
    ws.on('message', (message) => {
      console.log(`Received message => ${message}`)
    })
    ws.on('close', () => {
      console.log('Client Disconnected')
    })
    ws.send(JSON.stringify('Hello! Message From Server!!'))
  })

  export { userWebSocket }