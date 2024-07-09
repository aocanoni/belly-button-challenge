// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field and ilter the metadata for the object with the desired sample number
    let metadata = data.metadata.find(item => item.id === parseInt(sample));

      console.log(metadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadata).forEach(([key, value]) => {

      // Making demographic info content uppercase
      let upKey = key.toUpperCase();
      let upValue = value.toString().toUpperCase();

      // Append items with key and value and setting them to bold using html
      let demoInfoLabel = panel.append("li");
      demoInfoLabel.html(`<strong>${upKey}: </strong><span style= "color: darkslateblue;">${upValue}</span>`);
    });
  });
}
    
// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field and filter the samples for the object with the desired sample number
    let samples = data.samples.find(item => item.id === sample);
   
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samples.otu_ids;
    let otu_labels = samples.otu_labels;
    let sample_values = samples.sample_values;

    // Build a Bubble Chart
    let bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Viridis'
      }
    };

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);


    // Sorting sample_values in descending order for Top 10 chart
    let sortedSamples = sample_values.slice().sort((firstNum, secondNum) => secondNum - firstNum);

    // Getting Top Ten values after sorting
    let topTen = sortedSamples.slice(0,10);

    // For the Bar Chart, map the otu_ids to a list of strings (OTU) for your yticks and reverse for orientation 'h' purposes
    let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // Mapping otu_labels to bar text and reversing
    let topTenLabels = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart and reversing for orientation 'h' purposes
    let barData = {
      x: topTen.reverse(),
      y: yticks,
      text: topTenLabels,
      type: "bar",
      orientation: "h"
    };

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barData], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
