(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * initialize connection to signaling server to get ICEs 
 * @return {[type]} [description]
 */


let getICEs = (signalingServer) => {
    return fetch(signalingServer)
}


let checkTURNServer = (turnConfig, timeout) => {

    return new Promise(function(resolve, reject) {

        setTimeout(function() {
            if (promiseResolved) return;
            resolve(false);
            promiseResolved = true;
        }, timeout || 5000);

        var promiseResolved = false,
            myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
            ,
            pc = new myPeerConnection({
                iceServers: [turnConfig]
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

let signalingserver = 'https://carteserver.herokuapp.com/ice'


getICEs(signalingserver).then((resp) => resp.json()).then((result) => {

    let ICEs = result.ice
    let workingICEs = 0

    console.log('NB servers: ' + ICEs.length)

    ICEs.forEach((server) => {
        console.log(server)
        
        //turn service
        if (server.url.indexOf('turn:') >= 0) {
            checkTURNServer(server).then((result) => {
                if (result) {
                   console.log(server.url, 'is WORKING')
                    workingICEs++
                }
            })
        }
    })


}).catch((e) => {
    console.log('there is an error in the request', e)
})
},{}]},{},[1])