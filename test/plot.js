class Plot {
    constructor (DivId,title="",yLabel="",xLabel="") {
    this.title = title
    this.divId  = DivId
    this.yLabel = yLabel
    this.xLabel = xLabel

    this.xValues = []
    this.yValues = []
    this.setupPlot()
    }

    setupPlot() {
        this.chart= new Chart(
          document.getElementById(this.divId),
          {
            type: "line",
            data: {
              labels: [],
              datasets: [
                {
                  label:  this.yLabel,
                  data: []
                }
              ]
            },
            options: {
              legend: { display: true },
              title: {
                display: true,
                text: this.title
              }
            },
            scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: this.yLabel
                  }
                }], 
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: this.xLabel
                    }
                  }]
              }
          }
        );
      }
    
      plot(x, y) {
        this.xValues.push(x)
        this.chart.data.labels=this.xValues
       
        this.chart.data.datasets.forEach(dataset => {
          this.yValues.push(y)
          dataset.data=this.yValues
        });
        this.chart.update();
        clonePage(monitorWindow)
      }

      getMin() {
        return Math.min(...this.yValues)
      }

      getMax() {
        return Math.max(...this.yValues)

      }
      getMean() {
        return this.yValues.reduce((a,b) => a + b, 0) / this.yValues.length
      }

}


