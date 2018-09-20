class causalBroadcastTest {
  constructor() {}

  async test(useSignalingServer = true) {
    // await this.sendString({ useSignalingServer, nbSessions: 3 },5000,this.getRandomString(10));
   
    await this.antientropyTest(
        { useSignalingServer, nbSessions: 3 },
        50,
        5
      );
    /*await this.sentRandomChartsByRandomNodes(
      { useSignalingServer, nbSessions: 3 },
      200,
      100
    );
    await this.sentRandomChartsByRandomNodes(
      { useSignalingServer, nbSessions: 3 },
      50,
      100
    );
    await this.sentRandomChartsByRandomNodes(
      { useSignalingServer, nbSessions: 3 },
      50,
      100
    );*/

    /*await this.sendString({ useSignalingServer, nbSessions: 3 },10000,this.getRandomString(100));
    await this.sendString({ useSignalingServer, nbSessions: 3 },10000,this.getRandomString(500));

    await this.sendString({ useSignalingServer, nbSessions: 5 },5000,this.getRandomString(10));
    await this.sendString({ useSignalingServer, nbSessions: 5 },10000,this.getRandomString(100));
    await this.sendString({ useSignalingServer, nbSessions: 5 },10000,this.getRandomString(500));

    await this.sendString({ useSignalingServer, nbSessions: 10 },5000,this.getRandomString(10));
    await this.sendString({ useSignalingServer, nbSessions: 10 },10000,this.getRandomString(100));
    await this.sendString({ useSignalingServer, nbSessions: 10 },10000,this.getRandomString(500));*/
  }

  async sendString(simulationOptions, timeout, string) {
    console.group(
      `Test sending string : NBsessions= ${
        simulationOptions.nbSessions
      }| string = ${string} `
    );

    let sim = new simulation();

    this.sim = sim;
    await sim.init(simulationOptions);

    await this.timeout(2000);
    // pik random node
    const chosenSessionID = sim.pickRandomNodeID();

    let strings = [];
    for (let i = 0; i < sim._nbSessions; i++) {
      strings[i] = "";
    }

    strings[chosenSessionID] = string;

    for (let i = 0; i < sim._nbSessions; i++) {
      if (i != chosenSessionID) {
        sim._sessions[i]._documents[0].core.on(
          "remoteInsert",
          (element, indexp) => {
            strings[i] += element;
          }
        );
      }
    }

    for (let i = 0; i < string.length; i++) {
      this.insert(string.charAt(i), i, chosenSessionID, sim);
    }

    await this.timeout(timeout);

    // check if all nodes receive the string

    let okCounter = 0;
    for (let i = 0; i < sim._nbSessions; i++) {
      if (strings[i] === string) {
        console.log(`OK SESSION ${i}: ${strings[i]} `);
        okCounter++;
      } else {
        console.log(`!OK SESSION ${i}: ${strings[i]} `);
      }
    }

    if (okCounter === sim._nbSessions) {
      simulation.log(
        `Test causal broadcast: NBsessions= ${
          simulationOptions.nbSessions
        } , string=${string}`,
        1
      );
    } else {
      simulation.log(
        `Test causal broadcast: NBsessions= ${
          simulationOptions.nbSessions
        } , string=${string}`,
        0
      );
    }

    return string;
    console.groupEnd();
  }

  async sentRandomChartsByRandomNodes(
    simulationOptions,
    timeBetweenInsertions,
    stringSize
  ) {
    console.group(
      `Random insertion by random nodes : NBsessions= ${
        simulationOptions.nbSessions
      }| stringSize = ${stringSize} `
    );

    let sim = new simulation();

    this.sim = sim;
    await sim.init(simulationOptions);

    await this.timeout(5000);

    sim._indexsOfSessions = new Array(sim._nbSessions).fill(0);
    let strings = [];
    for (let i = 0; i < sim._nbSessions; i++) {
      strings[i] = "";
    }

    for (let i = 0; i < sim._nbSessions; i++) {
      sim._sessions[i]._documents[0].core.on("remoteInsert",(element, indexp) => {
          strings[i] += element;
        }
      );
    }

    let string = "";
    for (let i = 0; i < stringSize; i++) {
      const randomID = sim.pickRandomNodeID();
      const char = this.insertRandomCharBy(randomID, sim);
      strings[randomID] += char;
      string += char;
      await this.timeout(timeBetweenInsertions);
    }

    let okCounter = 0;
    for (let i = 0; i < sim._nbSessions; i++) {
      if (strings[i] === string) {
        console.log(`OK SESSION ${i}: ${strings[i]} `);
        okCounter++;
      } else {
        console.log(`!OK SESSION ${i}: ${strings[i]} `);
      }
    }

    if (okCounter === sim._nbSessions) {
      simulation.log(
        `Test random insertion: NBsessions= ${
          simulationOptions.nbSessions
        } ,timeBetweenInsertions = ${timeBetweenInsertions}, string= ${string}`,
        1
      );
    } else {
      simulation.log(
        `Test random insertion: NBsessions= ${
          simulationOptions.nbSessions
        } , string=${string}`,
        0
      );
    }

    return string;
    console.groupEnd();
  }

  async antientropyTest(simulationOptions, timeBetweenInsertions, stringSize) {
    // start simulating random chars
    let string = await this.sentRandomChartsByRandomNodes(simulationOptions,timeBetweenInsertions,stringSize);

    // add new session and see if the antientropy works
    let sim = new simulation();
    this.sim = sim;

    await sim.init({ useSignalingServer:true, nbSessions: 1 },simulationOptions.nbSessions);
    await this.timeout(5000);
    let stringArray = new Array(simulationOptions.nbSessions+1);
    let stringT=""
    sim._sessions[0]._documents[0].core.on("remoteInsert",(element, indexp) => {
        stringArray[indexp] = element;
        stringT+=element
      }
    );
    //start antientropy
    sim._sessions[0]._documents[0].core._communication.broadcast.startAntiEntropy(
      2000
    );
    await this.timeout(20000);
    console.log(stringArray,stringT)
        let string2 = stringArray.join('')
        console.log("String ",string,"String 2",string2)


    if (string2 === string) {
        simulation.log(
          `Test antientropy: NBsessions= ${
            simulationOptions.nbSessions
          } ,timeBetweenInsertions = ${timeBetweenInsertions}, string= ${string}`,
          1
        );
      } else {
        simulation.log(
          `Test antientropy: NBsessions= ${
            simulationOptions.nbSessions
          } , string=${string}`,
          0
        );
      }
  }

  insertRandomCharBy(sessionID, sim) {
    let char = sim.peekRandomChar();
    this.insert(char, sim._indexsOfSessions[sessionID], sessionID, sim);
    sim._indexsOfSessions[sessionID] = sim._indexsOfSessions[sessionID] + 1;
    return char;
  }

  insert(char, index, sessionID, sim) {
    sim._sessions[sessionID]._documents[0].core.insert(char, index);
  }

  getRandomString(size) {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < size; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
