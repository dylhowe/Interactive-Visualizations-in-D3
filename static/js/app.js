

function buildMetadata(sample) {

// @TODO: Complete the following function that builds the metadata panel
  URL = "/metadata/" + sample;

// Use `d3.json` to fetch the metadata for a sample
  d3.json(URL).then(function(response) {

    console.log(response)

// Use d3 to select the panel with id of `#sample-metadata`
    var metadataPanel = d3.select("#sample-metadata").html("")

// Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`)
    })
  })
}
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

// @TODO: Use `d3.json` to fetch the sample data for the plots
  URL = "/samples/" + sample;

  d3.json(URL).then(function(response) {
    otu_ids = response.otu_ids.slice(0, 10)
    otu_labels = response.otu_labels.slice(0, 10)
    sample_values = response.sample_values.slice(0, 10)
    console.log(response)
    console.log(otu_ids)
    console.log(otu_labels)
    console.log(sample_values)


    // @TODO: Build a Bubble Chart using the sample data
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        color:  otu_ids,
        size:  sample_values
      },
      hovertext: otu_labels,

      type: "scatter"
    }
    var layout2 = {
      title: `Biodiversity In Participant ${sample}'s Bellybutton`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" }
    }

    var data2 = [trace2]

    Plotly.newPlot("bubble", data2, layout2)

    // @TODO: Build a Pie Chart

    var trace1 = {
      labels: otu_ids,
      values: sample_values,
      type: 'pie',
      hovertext: otu_labels
    };
   
    var data = [trace1];
   
    var layout = {
      title: `Biodiversity In Sample ${sample}`,
    };
   
    Plotly.newPlot("pie", data, layout);
    })
  }


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
