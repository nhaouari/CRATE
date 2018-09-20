class simulation {
  constructor() {
   
  }

 

  init(options,startSessionId=0) {
    return new Promise((resolve, reject) => {
      this.setSimulationOptions(options);
      this._indexsOfSessions = new Array(this._nbSessions).fill(0);
      this._allsessionIDs = Array.apply(null, {
        length: this._nbSessions
      }).map(Number.call, Number);

      this._unuglifySessionIDs = {};
      console.log("initializing sessions");
      const tmp = [];
      for (var i = startSessionId; i < startSessionId+this._nbSessions; i++) {
        tmp.push(i);
      }
      this._sessions = [];
      this._tabs = [];
      tmp
        .reduce(
          (acc, cur, i) =>
            acc.then(() => {
              return new Promise((resolve, reject) => {
               let crate = window.open(
                  this._URL,
                  "CRATE " + i,
                  "resizable=yes,toolbar=no,status=no,location=no,menubar=no,scrollbars=yes"
                );

                window.focus();
                // this to close them and do complete referech
                crate.close();
                crate = window.open(this._URL, "CRATE " + i, null);
               
                crate.onload = () => {
                  crate.id = i;
                  crate.document.title = "CRATE " + i;
                  console.log("Document %f loaded.", i);
                  this._tabs.push(crate);
                  resolve();
                };
              });
            }),
          Promise.resolve()
        )
        .then(() => {
          console.log("All loaded.");
          this._tabs
            .reduce(
              (acc, crate, i) =>
                acc
                  .then(() => {
                    return new Promise((resolve, reject) => {
                      let session = undefined;
                      crate.localStorage.debug = "*";

                      session = crate.startSession({
                        editingSession: "test"
                      });

                      /* if (i === 0 || this._useSignalingServer) {
                        session = crate.startSession({
                          editingSession: "test"
                        });
                      } else {
                        session = crate.startSession({
                          editingSession: "test",
                          foglet: this.foglet(0)
                        });
                      }*/

                      console.log(session);
                      session.id = i;
                      this._sessions.push(session);
                      session.on("new_document", doc => {
                        // this.foglet(i).unshare();
                        // doc.on("connected", () => {
                        this._unuglifySessionIDs[
                          session._options.editingSessionID
                        ] =
                          session.id;
                        console.log("Foglet %f connected.", i);
                        resolve();
                        // });
                      });
                    });
                  })
                  .catch(e => {
                    console.log(e);
                  }),
              Promise.resolve()
            )
            .then(() => {
              this.drawGraph();
              console.log("All foglet connected.");
              resolve();
            })
            .catch(e => {
              console.error(e);
            });
        })
        .catch(e => {
          console.error(e);
        });

      setTimeout(() => {
        //  this.connect().then(() => {
        //    console.log("All sessions are connected")
        //  this.Simulation()
        //  })
      }, this._preSimulationTime);
    });
  }

  setSimulationOptions(options) {
    this._options = Object.assign(this.constructor.defaultOptions, options);
    this._nbSessions = this._options.nbSessions;
    this._maxRandomTime = this._options.maxRandomTime;
    this._nbRounds = this._options.nbRounds;
    this._URL = this._options.URL;
    this._preSimulationTime = this._options.preSimulationTime;
    this._seed = this._options.seed;
    this._useSignalingServer = this._options.useSignalingServer;
  }

  Simulation() {
    console.log("Simulation Starts");
    this.drawGraphPeriodically(60000);

    let edits = [];

    for (let i = 0; i < this._nbRounds; i++) {
      edits.push(this.simulateEditing());
    }

    Promise.all(edits).then(() => {
      setTimeout(() => {
        if (this.AreTextsTheSame()) {
          console.log("Success: The texts are the same ");
        } else {
          console.log("Failed: The texts are not the same ");
        }
        if (this.AreSequencesTheSame()) {
          console.log("Success: The sequences are the same ");
        } else {
          console.log("Failed: The sequences are not the same ");
        }
      }, 5000);
    });
  }

  simulateEditing() {
    return Promise.all(
      this._allsessionIDs.map(sessionID => {
        return this.sendRandomCharAtRandomTime(sessionID);
      })
    );
  }

  sendRandomCharAtRandomTime(sessionID) {
    return new Promise((resolve, reject) => {
      let time = this.getRandomTime();
      setTimeout(() => {
        let char = this.insertRandomCharBy(sessionID);
        console.log(
          "CRATE " + sessionID + ": Send ( " + char + " ) waited (" + time + ")"
        );
        resolve();
      }, time);
    });
  }

  getRandomTime() {
    return this.random() * this._maxRandomTime;
  }

  insertRandomCharBy(sessionID) {
    let char = this.peekRandomChar();
    this.insert(char, this._indexsOfSessions[sessionID], sessionID);
    this._indexsOfSessions[sessionID] = this._indexsOfSessions[sessionID] + 1;
    return char;
  }

  insert(char, index, sessionID) {
    try {
      let quill = this._sessions[sessionID].session.actualSession._documents[
        "0"
      ]._view._editor.viewEditor;
      quill.insertText(index, char, "user");
    } catch (e) {
      console.log(e);
      //debugger;
    }
  }

  getQuill(sessionID){
    return this._sessions[sessionID]._documents[
      "0"
    ]._view._editor.viewEditor;
  }

  foglet(i) {
    return this._sessions[i]._foglet;
  }
  spray(i) {
    return this.foglet(i).overlay().network.rps;
  }
  exchange(i) {
    this.spray(i)._exchange();
  }
  AreTextsTheSame() {
    let success = true;
    let sequence = this.getText(0);
    let texts = [];
    texts.push(sequence);
    for (var i = 1; i < this._nbSessions; i++) {
      let sequence2 = this.getText(i);
      texts.push(sequence2);
      if (sequence2 != sequence) {
        success = false;
        console.log("Text of session " + i + " is different");
      }
    }
    console.log(texts);

    return success;
  }

  AreSequencesTheSame() {
    let success = true;
    let sequence = JSON.stringify(this.getSequence(0));
    for (var i = 1; i < this._nbSessions; i++) {
      let sequence2 = JSON.stringify(this.getSequence(i));
      if (sequence2 != sequence) {
        success = false;
        console.log("The sequence of session " + i + " is different");
      }
    }
    return success;
  }

  getAllNeighbors() {
    /*let allNeighbors = this._sessions.reduce((acc,curr)=>{
      acc.push(this.getNeighborsOf(curr))
    })*/
    let allNeighbors = [];
    this._sessions.forEach(session => {
      const neighbors = this.getNeighborsOf(session);
      allNeighbors.push(neighbors);
    });
    return allNeighbors;
  }

  getNeighborsOf(session) {
    let Neighbors = session._foglet.getNeighbours().map(uglyID => {
      return this.unuglifyID(uglyID);
    });

    console.log("CRATE " + session.id + " : " + Neighbors.length, Neighbors);
    return Neighbors;
  }

  getText(i) {
    console.log("CRATE " + i);
    let text = this._sessions[
      i
    ]._documents[0]._view._editor.viewEditor.getText();
    console.log(text);
    return text;
  }

  getSequence(i) {
    let children = this._sessions[i]._documents[0].sequence.root.children;
    return children;
  }

  peekRandomChar() {
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let char = possible.charAt(Math.floor(this.random() * possible.length));
    return char;
  }

  pickRandomNodeID() {
    const chosenNode = Math.floor(this.random() * this._nbSessions);
    console.log(`Node ${chosenNode} is chosen`);
    return chosenNode;
  }
  random() {
    if (this._seed == -1) {
      return Math.random();
    } else {
      var x = Math.sin(this._seed++) * 10000;
      return x - Math.floor(x);
    }
  }

  unuglifyID(id) {
    // remove the last two chars (.i.e -I or IO)
    let cleanID = id.substring(0, id.length - 2);

    return this._unuglifySessionIDs[cleanID];
  }

  unuglifyIDWithType(id) {
    // remove the last two chars (.i.e -I or IO);
    //
    let outID = id.substring(id.length - 2, id.length);
    let cleanID = id.substring(0, id.length - 2);

    return this._unuglifySessionIDs[cleanID] + outID;
  }

  drawGraphPeriodically(delta) {
    this._timerGraphDrawing = setInterval(() => {
      this.drawGraph();
    }, delta);
  }

  StopDrawGraph() {
    clearInterval(this._timerGraphDrawing);
  }

  getNeighboursDetails(session) {
    let spray = session._foglet.overlay().network.rps;

    let I = {
      living: spray.NI.living.store.size,
      dying: spray.NI.dying.size,
      pending: spray.NI.pending.size
    };
    let O = {
      living: spray.NO.living.store.size,
      dying: spray.NO.dying.size,
      pending: spray.NO.pending.size
    };

    let state = `
        I   O \n 
living: ${I.living} - ${O.living} \n 
dying:  ${I.dying} - ${O.dying} \n
pending:${I.pending} - ${O.pending} \n`;

    let stateTable = `
<h3>${session.id}<h3>
    <table>
<tr>
<td><strong></strong></td>
<td><strong>I</strong></td>
<td><strong>O</strong></td>
</tr>
<tr style='color:green'>
<td>L</td>
<td><strong>${I.living}</strong></td>
<td><strong>${O.living}</strong></td>
</tr>
<tr style='color:orange'>
<td>P</td>
<td><strong>${I.pending}</strong></td>
<td><strong>${O.pending}</strong></td>
</tr>
<tr style='color:red'>
<td>D</td>
<td><strong>${I.dying}</strong></td>
<td><strong>${O.dying}</strong></td>
</tr>
</table>

`;
    return stateTable;
  }

  drawGraph() {
    let nodes = this._sessions.map(session => {
      return {
        data: {
          id: session.id,
          label: this.getNeighboursDetails(session)
        },
        classes: "multiline-manual"
      };
    });

    let edges = [];
    this._sessions.forEach(session => {
      let nodeEdges = this.getNeighborsOf(session);
      nodeEdges.forEach(neighbor => {
        edges.push({
          data: {
            id: session.id + " " + neighbor,
            weight: 1,
            source: neighbor,
            target: session.id
          }
        });
      });
    });

    var cy = cytoscape({
      container: document.getElementById("cy"),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: cytoscape
        .stylesheet()
        .selector("edge")
        .css({
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
          width: 4,
          "line-color": "#ddd",
          "target-arrow-color": "red"
        })
        .selector(".highlighted")
        .css({
          "background-color": "#61bffc",
          "line-color": "#ffffff",
          "target-arrow-color": "red",
          "transition-property":
            "background-color, line-color, target-arrow-color",
          "transition-duration": "0.5s"
        }),

      elements: {
        nodes: nodes,
        edges: edges
      },

      layout: {
        name: "grid",
        directed: true,
        roots: 0,
        padding: 100
      }
    });

    cy.nodeHtmlLabel([
      {
        query: "node",
        valign: "top",
        halign: "left",
        valignBox: "top",
        halignBox: "left",
        tpl: function(data) {
          return data.label;
        }
      }
    ]);

    window.cy = cy;

    /*var bfs = cy.elements().bfs('#a', function() {}, true);

    var i = 0;
    var highlightNextEle = function() {
      if (i < bfs.path.length) {
        bfs.path[i].addClass('highlighted');

        i++;
        setTimeout(highlightNextEle, 1000);
      }
    };

    // kick off first highlight
    highlightNextEle();*/
  }

  testShuffling(Delta) {
    this.setupPlots();
    let tests = { success: 0, failed: 0, all: 0 };
    let shufflingNumber = 0;
    this._timerTestShuffling = setInterval(() => {
      shufflingNumber++;
      let nodeToShuffle = this.pickRandomNodeID();
      this.spray(nodeToShuffle)._exchange();
      setTimeout(() => {
        this.drawGraph();
        tests.all = tests.all + 1;
        if (!this.isGraphConnected()) {
          console.log("Graph not fully connected");
          tests.failed = tests.failed + 1;
          // clearInterval(this._timerTestShuffling)
        } else {
          console.log("Graph fully connected");
          tests.success = tests.success + 1;
        }

        let numberOfArcs = this.getNumberOfArcs();
        console.log("Number of arcs: " + numberOfArcs);
        this.plotIt(
          this.connectivityGraph,
          shufflingNumber,
          tests.success / tests.all * 100
        );
        this.plotIt(
          this.NumberOfArcsChart,
          shufflingNumber,
          this.getNumberOfArcs()
        );
        console.log(
          `Success RATE ${tests.success / tests.all * 100}% in (${
            tests.all
          }) shuffle.`,
          tests
        );
      }, Delta * 0.9);
    }, Delta);
  }

  setupPlots() {
    this.NumberOfArcsChart = new Chart(
      document.getElementById("numberofarcs"),
      {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Number of arcs",
              data: []
            }
          ]
        },
        options: {
          legend: { display: true },
          title: {
            display: true,
            text: "Evaluation Number of arcs through shuffling"
          }
        }
      }
    );

    this.connectivityGraph = new Chart(
      document.getElementById("connectivity"),
      {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Success rate",
              data: []
            }
          ]
        },
        options: {
          legend: { display: true },
          title: {
            display: true,
            text: "Evaluation connectivity through shuffling"
          }
        }
      }
    );
  }

  plotIt(chart, x, y) {
    chart.data.labels.push(x);
    chart.data.datasets.forEach(dataset => {
      dataset.data.push(y);
    });
    chart.update();
  }

  static log(test, state) {
    if (!this.logCounter) {
      this.logCounter = 1;
    } else {
      this.logCounter++;
    }

    let color = "green";
    let stateTxt = "OK";
    if (state === 0) {
      color = "red";
      stateTxt = "!OK";
    }

    let logTxt = `<tr style='color:${color}'>
    <th scope="row">${this.logCounter}</th>
    <td>${test}</td>
    <td>${stateTxt}</td>
  npm</tr>`;

    $("#log > tbody:last-child").append(logTxt);
    //$("#log").append(txt);
  }
}
