/**
 * test convergence  
 *  - insert random charcters by random nodes
 *  - delete random charters by random nodes
 *  - after anti-antropy 
 */
class testInterface {
    constructor() {
        
    }


    async test(useSignalingServer = true) {
        //await this.sendString({ useSignalingServer, nbSessions: 5 },5000,this.getRandomString(50));  
   
        
       
       /* await this.sentRandomChartsByRandomNodes(
            { useSignalingServer, nbSessions: 3 },
            200,
            60
          );

        debugger */
        await this.antientropyTest(
            { useSignalingServer, nbSessions: 3 },
            200,
            10
          );

          
   

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
    
        for (let i = 0; i < string.length; i++) {
          this.insert(string.charAt(i), i, chosenSessionID, sim);
        }
    
        await this.timeout(timeout);

    
        
        if (this.AreTextsTheSame(sim,string)) {
          simulation.log(
            `Send string from one browser to others: NBsessions= ${
              simulationOptions.nbSessions
            } , string=${string}`,
            1
          );
        } else {
          simulation.log(
            `Send string from one browser to others: NBsessions= ${
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
    
        let string = "";
        for (let i = 0; i < stringSize; i++) {
          const randomID = sim.pickRandomNodeID();
          const char = this.insertRandomCharBy(randomID, sim);
          string += char

          const probabilityOfRemove=Math.random()

          if (probabilityOfRemove<=0.5) {
            const removedIndex=this.deleteRandomIndex(randomID,sim)
            string=string.slice(0, removedIndex) + string.slice(removedIndex+1);
          }

          await this.timeout(timeBetweenInsertions);
        }


        await this.timeout(5000);
        let splitString = string.split("")
        let reverseArray = splitString.reverse()
         string = reverseArray.join("");
    
        if (this.AreTextsTheSame(sim,string)) {
            simulation.log(
              `Send chars from different browsers: NBsessions= ${
                simulationOptions.nbSessions
              } , string=${string}`,
              1
            );
          } else {
            simulation.log(
              `Send chars from different browsers: NBsessions= ${
                simulationOptions.nbSessions
              } , string=${string}`,
              0
            );

            debugger
          }

        return sim;
        console.groupEnd();
      }
    
      async antientropyTest(simulationOptions, timeBetweenInsertions, stringSize) {
        // start simulating random chars
        let sim0 = await this.sentRandomChartsByRandomNodes(simulationOptions,timeBetweenInsertions,stringSize);
    
        // add new session and see if the antientropy works
        let sim = new simulation();
        this.sim = sim;
    
        await sim.init({ useSignalingServer:true, nbSessions: 1 },simulationOptions.nbSessions);
        await this.timeout(5000);

        //start antientropy
      /*  sim._sessions[0]._documents[0]._communication._antiEntropyManager.startAntiEntropy(
          2000
        );*/

        //await this.timeout(5000);
        
        if (this.getText(0,sim) === this.getText(0,sim0)) {
            simulation.log(
              `Test antientropy: NBsessions= ${
                simulationOptions.nbSessions
              } ,timeBetweenInsertions = ${timeBetweenInsertions}, string= ${this.getText(0,sim)}`,
              1
            );
          } else {
            simulation.log(
              `Test antientropy: NBsessions= ${
                simulationOptions.nbSessions
              } , string=${this.getText(0,sim)}`,
              0
            );
            debugger
          }
      }
    
      insertRandomCharBy(sessionID, sim) {
        let char = sim.peekRandomChar();
        this.insert(char, sim._indexsOfSessions[sessionID], sessionID, sim);
        return char;
      }
    
      insert(char, index, sessionID,sim) {
        try {
          let quill = sim.getQuill(sessionID)

          quill.insertText(index, char, "user");
          console.log(`Node ${sessionID} insert ${char}`)
        } catch (e) {
          console.log(e);
          debugger;
        }
      }

      pickIndexToRemove(sessionID,sim){
        let textLength= sim.getQuill(sessionID).getText().length
        const randomIndex=Math.floor(Math.random() * textLength)
        return randomIndex
      }

      deleteRandomIndex(sessionID,sim){
        let indexToRemove=this.pickIndexToRemove(sessionID,sim)
        this.delete(indexToRemove,sessionID,sim)
        return indexToRemove
      }


      delete(index, sessionID,sim) {
        try {
          let quill = sim.getQuill(sessionID)
          quill.deleteText(index, 1, 'user')
          console.log(`Node ${sessionID} delete ${index}`)
        } catch (e) {
          console.log(e);
          debugger;
        }
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
  
      AreTextsTheSame(sim) {
        let success = true;
        let sequence = this.getText(0,sim);
        let texts = [];
        texts.push(sequence);
        for (var i = 1; i < sim._nbSessions; i++) {
          let sequence2 = this.getText(i,sim);
          texts.push(sequence2);
          if (sequence2 != sequence) {
            success = false;
            console.log("Text of session " + i + " is different");
          }
        }
        console.log(texts);
    
        return success;
      }
    
      AreSequencesTheSame(sim) {
        let success = true;
        let sequence = JSON.stringify(this.getSequence(0,sim));
        for (var i = 1; i < sim._nbSessions; i++) {
          let sequence2 = JSON.stringify(this.getSequence(i,sim));
          if (sequence2 != sequence) {
            success = false;
            console.log("The sequence of session " + i + " is different");
          }
        }
        return success;
      }

      
      getText(i,sim) {
        console.log("CRATE " + i);
        let text = sim._sessions[
          i
        ]._documents[0]._view._editor.viewEditor.getText();
        console.log(text);
        return text;
      }
    
      getSequence(i,sim) {
        let children = sim._sessions[i]._documents[0].sequence.root.children;
        return children;
      }


    }
    