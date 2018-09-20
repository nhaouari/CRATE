


/**
 * 
 * @param ICEs 
 * @example
 const ICEs= [
    {
"url": "stun:global.stun.twilio.com:3478?transport=udp"
},
{
"url": "turn:global.turn.twilio.com:3478?transport=udp",
"username": "...",
"credential": "..."
}
]
test(ICEs)
 */

async function test(ICEs) {    
    let workingICEs = 0

    for (let server of ICEs) {
      console.log(server)
          await this.checkServer(server).then((result) => {
              if (result) {
                  console.log(`OK: ${server.url} is WORKING.`);            
                  workingICEs++
              } else {
                 console.log(`!OK: ${server.url} is not WORKING.`);  
              }
          })
    }
    console.log(` ${workingICEs} of ${ICEs.length} server works `)

}




/**
 * Check one STUN / TURN server
 * @param server  server object with  "url", "username" and "credential"
 * @param timeout time to wait to establish the connection 
 * @example
 const server={
"url": "turn:global.turn.twilio.com:3478?transport=udp",
"username": "ec826faa494f0fe3ced9e342c6f2d91d5014b5bb55f2b85fc9ad4817eb5228be",
"credential": "75nGVO6Nsc3KfSza1qcEYWheaFjxdD381YlTiR+nc/4="
}

checkServer(server)
 
 */

async function checkServer  (server, timeout=5000){

  return new Promise(function(resolve, reject) {

      setTimeout(function() {
          if (promiseResolved) return;
          resolve(false);
          promiseResolved = true;
      }, timeout);

      var promiseResolved = false,
          myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
          ,
          pc = new myPeerConnection({
              iceServers: [server]
          }),
          noop = function() {};
      pc.createDataChannel(""); //create a bogus data channel
      pc.createOffer(function(sdp) {
          if (sdp.sdp.indexOf('typ relay') > -1) { // sometimes sdp contains the ice candidates...
              promiseResolved = true;
              resolve(true);
          }
          pc.setLocalDescription(sdp, noop, noop);
      }, noop); // create offer and set local description
      pc.onicecandidate = function(ice) { //listen for candidate events
          if (promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay') > -1)) return;
          promiseResolved = true;
          resolve(true);
      };
  });
}

async function getICS (url) {
    const response = await fetch(url)
    if (response.status !== 200) {
        console.log('Error Code: ' +
          response.status);
          return   []
      } else {
        const jsonICEs=await response.json()
        window.jsonICEs=  jsonICEs
        const ICEs = jsonICEs.ice
        return ICEs
}
}


