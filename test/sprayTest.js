class sprayTest {
  constructor() {}


async test(useSignalingServer = true)
{

  let ICEsURL = session.config.signalingServer+"/ice"
  let ICEs = await this.testSignalingServer(ICEsURL)
  let workingICEs = 0
  let log =``
  for (let server of ICEs) {
    console.log(server)
    //turn service
    if (server.url.indexOf('turn:') >= 0) {
        await this.checkTURNServer(server).then((result) => {
            if (result) {
            
              log +=`<p>${server.url} is WORKING</p>`            
                workingICEs++
            }
        })
    }  
  }
 
  


  simulation.log(`Testing ICEs (There are ${workingICEs} ICEs works) 
  ${log}`,workingICEs>0?1:0)
  
  await this.testJoin({useSignalingServer,nbSessions:3},10)
  await this.testShuffling({useSignalingServer,nbSessions:3},5000,10)

  await this.testJoin({useSignalingServer,nbSessions:5},10)
  await this.testShuffling({useSignalingServer,nbSessions:5},5000,10)

  await this.testJoin({useSignalingServer,nbSessions:10},10)
  await this.testShuffling({useSignalingServer,nbSessions:10},5000,10)
}


  /**
   * this test scenario is composed of nbSessions session and each Delta time a random node will shuffle 
   * and then evalute the connectivity and the number of arcs if it is constant
   * @param {*} Delta is the period of shuffling  
   * @param {*} nbSessions is the number of sessions in the scenario 
   * @param {*} maxShufflingNumber  is the maximum number of shuffling
   */


 async testSignalingServer(server) {
  
  console.group(`Test Signaling server working: server= ${server} `);

  const response = await fetch(server)

  if (response.status !== 200) {
    console.log('Looks like there was a problem in the signaling server. Status Code: ' +
      response.status);

    simulation.log(`Test Signaling Server `, 0);
    return response;
  } else {
    const jsonICEs=await response.json()
    window.jsonICEs=  jsonICEs
    const ICEs = jsonICEs.ice

    console.log(jsonICEs)
    simulation.log(`Test Signaling Server return (${ICEs.length} ICEs) `, 1);
    console.log(ICEs)
    return ICEs
  }
  console.groupEnd();
 }  




 async testShuffling(simulationOptions,Delta=10000, maxShufflingNumber = 10) {
  console.log(`Test Shuffling: NBsessions= ${simulationOptions.nbSessions}| SignalingServer= ${simulationOptions.useSignalingServer}| Shuffling tries= ${maxShufflingNumber} | Delta = ${Delta} `);
  console.group();
  console.log(arguments);
   this.sim=  new simulation()
   let sim = this.sim

    let connectivityPlot = new Plot(
      "connectivity",
      "The connectivity test",
      "Percentage of connectivity",
      "Round"
    );
    let numberOfArcsPlot = new Plot(
      "numberofarcs",
      "Evaluation of the number of arcs",
      "Round"
    );

    let tests = { success: 0, failed: 0, all: 0 };
    let shufflingNumber = 0;
      
    let test = ()=> {
      return new Promise((resolve, reject) => {
        let timerTestShuffling = setInterval(
          () => {
            if (shufflingNumber < maxShufflingNumber) {
              shufflingNumber++;
            } else {
              clearInterval(timerTestShuffling);
              resolve();
            }

            let nodeToShuffle = sim.pickRandomNodeID();
            sim.spray(nodeToShuffle)._exchange();
            setTimeout(() => {
              sim.drawGraph();
              tests.all = tests.all + 1;

              if (!this.isGraphConnected(sim)) {
                console.log("Graph not fully connected");
                tests.failed = tests.failed + 1;
                // clearInterval(this._timerTestShuffling)
              } else {
                console.log("Graph fully connected");
                tests.success = tests.success + 1;
              }

              let numberOfArcs = this.getNumberOfArcs(sim);
              console.log("Number of arcs: " + numberOfArcs);

              connectivityPlot.plot(
                shufflingNumber,
                tests.success / tests.all * 100
              );
              numberOfArcsPlot.plot(shufflingNumber, numberOfArcs);

              console.log(
                `Success RATE ${tests.success / tests.all * 100}% in (${
                  tests.all
                }) shuffle.`,
                tests
              );
            }, Delta * 0.9);
          },
          Delta,
          maxShufflingNumber
        );
      })}
      

      let evaluate = ()=> {
        if (tests.success == tests.all) {
          simulation.log(`Test Shuffling: NBsessions= ${simulationOptions.nbSessions}| SignalingServer= ${simulationOptions.useSignalingServer}| Shuffling tries= ${maxShufflingNumber} | Delta = ${Delta} `, 1);
        } else {
          simulation.log(`Test Shuffling: NBsessions= ${simulationOptions.nbSessions}| SignalingServer= ${simulationOptions.useSignalingServer}| Shuffling tries= ${maxShufflingNumber} | Delta = ${Delta} 
            <p>Min: ${connectivityPlot.getMin()}</p> 
            <p>Max: ${connectivityPlot.getMax()}</p>
            <p>Mean: ${connectivityPlot.getMean()}</p>            
            `,
            0
          );
        }

        if (numberOfArcsPlot.getMax() === numberOfArcsPlot.getMean()) {
          simulation.log(`Test Number of arcs: NBsessions= ${simulationOptions.nbSessions}| SignalingServer= ${simulationOptions.useSignalingServer}| Shuffling tries= ${maxShufflingNumber} | Delta = ${Delta} `, 1);
        } else {
          simulation.log(`Test Number of arcs: NBsessions= ${simulationOptions.nbSessions}| SignalingServer= ${simulationOptions.useSignalingServer}| Shuffling tries= ${maxShufflingNumber} | Delta = ${Delta} 
            <p>Min: ${numberOfArcsPlot.getMin()}</p> 
            <p>Max: ${numberOfArcsPlot.getMax()}</p>
            <p>Mean: ${numberOfArcsPlot.getMean()}</p>            
            `,
            0
          );
        }
      }

    await sim.init(simulationOptions)
    await test() 
    evaluate()
    console.groupEnd()
    return sim
 
  }



  async testJoin(simulationOptions, maxJoinNumber = 10,timeout=5000) {
    console.log(`Test Joining - connectivity: NBsessions= ${simulationOptions.nbSessions}| Join tries= ${maxJoinNumber} `);
    console.group();
    console.log(arguments);

     let connectivityPlot = new Plot(
       "connectivity",
       "The connectivity test",
       "Percentage of connectivity",
       "Round"
     );
 
     let tests = { success: 0, failed: 0, all: 0 };
     
      const test = async () => {
       return new Promise(async (resolve, reject) => {
     
       
        for (let i = 0; i < maxJoinNumber; i++) {
             this.sim=  new simulation()
             let sim = this.sim
             await sim.init(simulationOptions)
             await this.timeout(timeout)
             tests.all++
              if (!this.isGraphConnected(sim)) {
                console.log("Graph not fully connected");
                tests.failed = tests.failed + 1;
                // clearInterval(this._timerTestShuffling)
              } else {
                console.log("Graph fully connected");
                tests.success = tests.success + 1;
              }

              connectivityPlot.plot(
                i,
                tests.success / tests.all * 100
              );

              console.log(
                `Success RATE ${tests.success / tests.all * 100}% in (${
                  tests.all
                }) Join.`,
                tests
              );
            
            
              }
              resolve();
       })}
    
 
       let evaluate = ()=> {
         if (tests.success == tests.all) {
           simulation.log(`Test Joining - connectivity: NBsessions= ${simulationOptions.nbSessions}| Join tries= ${maxJoinNumber} `, 1);
         } else {
          simulation.log(`Test Joining - connectivity: NBsessions= ${simulationOptions.nbSessions}| Join tries= ${maxJoinNumber} 
          <p>Min: ${connectivityPlot.getMin()}</p> 
             <p>Max: ${connectivityPlot.getMax()}</p>
             <p>Mean: ${connectivityPlot.getMean()}</p>            
             `,
             0
           );
         }
       }
     await test() 
     evaluate()
     console.groupEnd();
   }

   

 checkTURNServer  (turnConfig, timeout){

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

  isGraphConnected(sim) {
    const tarjan = new Tarjan();

    const allNeighbors = sim.getAllNeighbors()
    
    if (allNeighbors.length > 0 ) {
      return tarjan.test(allNeighbors, true);
    } else {
      console.warn("The number of neighbours equals to 0, the sessions are not connected")
      return false
    }
  }

  getNumberOfArcs(sim) {
    return sim._sessions.reduce(
      (acc, cur) =>
        acc +
        [...cur._foglet.overlay().network.rps.partialView.values()].reduce(
          (a, c) => a + c.length,
          0
        ),
      0
    );
  }

   timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
}
