

// the name for stored variavle
const configName = "config7"
// If you change this, change it in common also
if (!store.get(configName)) {
    var configuration = {
      //    signalingServer: "https://172.16.9.236:3000",
      signalingServer: "https://carteserver.herokuapp.com",
      ICEsURL: "https://carteserver.herokuapp.com/ice",
      storageServer: "https://storagecrate.herokuapp.com",
      stun: "23.21.150.121" // default google ones if xirsys not
    };
} else {
  var configuration = store.get(configName);
}

