// Function to create Test Subject IDs dropdown menu
function dropdownBuilder (dataInput) {
    var dropdownObj = d3.select("#selDataset");
    // Use each element from "names" array in data to create new <option> tag
    dataInput.names.forEach(name => dropdownObj.append("option").text(`${name}`));
}


// Function to build demographics table
function demoBuilder(dataInput) {
    var ageVar = dataInput.age;
    var bbVar = dataInput.bbtype;
    var ethnVar = dataInput.ethnicity;
    var genderVar = dataInput.gender;
    var idVar = dataInput.id;
    var locVar = dataInput.location;
    var wfreqVar = dataInput.wfreq;


    // Build demographics table
    d3.select("#age-td").text(ageVar);
    d3.select("#bbtype-td").text(bbVar);
    d3.select("#ethn-td").text(ethnVar);
    d3.select("#gender-td").text(genderVar);
    d3.select("#id-td").text(idVar);
    d3.select("#loc-td").text(locVar);
    d3.select("#wfreq-td").text(wfreqVar);
}


// Function to build bar chart
function chartBuilder(dataInput) {
    // Build bar chart
    // Define the dataset
    var trace1 = {
        x: dataInput.otu_ids.slice(0,10).map(id => id.toString()),
        y: dataInput.sample_values.slice(0,10),
        type: "bar",
        name: "OTU Bar Chart",
        text: dataInput.otu_labels.slice(0,10),
    }

    // Define the layout
    var layout = {
        title: "Count of Highest 10 OTUs per Sample (bar)",
        xaxis:{title: "OTU ID No.", type: "category"},
        yaxis:{title: "Count in Sample"}
    }

    // Define the datasets to plot
    var data = [trace1]

    // Plot data
    Plotly.newPlot("bar", data, layout)

}


// Page initialization function
function chartInitialize(dataInput) {
    demoBuilder(dataInput.metadata[0]);
    chartBuilder(dataInput.samples[0]);
    bubbleBuilder(dataInput.samples[0]);
    gaugeBuilder(dataInput.metadata[0]);
}

// Function to build gauge
function gaugeBuilder(dataInput) {
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: dataInput.wfreq,
            title: { text: "Wash Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {axis: { range: [null, 10], tickwidth: 5},
                    bar: { color: "lightblue" }
                }
        }
    ];

    var layout = { width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot('gauge', data, layout);
}

// Function to build bubble chart
function bubbleBuilder(dataInput) {
    var trace1 = {
        x: dataInput.otu_ids.slice(0,10).map(id => id.toString()),
        y: dataInput.sample_values.slice(0,10),
        mode: 'markers',
        text: dataInput.otu_labels.slice(0,10),
        marker: {
        size: dataInput.sample_values.slice(0,10),
        color: dataInput.otu_ids.slice(0,10).map(id => id.toString()),
        },
        name: "Bacteria (Bubble size reflects count)"
    };

    var data = [trace1];

    var layout = {
        title: "Count of Highest 10 OTUs per Sample (bubble)",
        showlegend: true,
        xaxis: {title:{text:"OTU ID No."}},
        yaxis: {title:{text:"Count in Sample"}},
    };
    Plotly.newPlot('bubble', data, layout);
};


// Begin page load and working wtih data
d3.json("././data/samples.json").then(function(dataObj) {
    console.log(dataObj)
    // Build dropdown
    dropdownBuilder(dataObj);

    // Initialize page data
    chartInitialize(dataObj);

// Get the value from the dropdown to reference what objects to pull from source data
var selection = d3.select("#selDataset");


// Event listener function
selection.on("change",function(){
    // For the selected value, get that id
    var selectValue =  d3.event.target.value;
    // Within the array of samples objects, if the value of that object's "id"
    //key is the selection made by the user, get that object
    var sampleObj = dataObj.samples.filter(sample => sample.id == selectValue)[0];

    // Retrieve/display metadata
    // Get metadata
    var metadataObj = dataObj.metadata.filter(sample => sample.id == selectValue)[0];


    demoBuilder(metadataObj);
    chartBuilder(sampleObj);
    bubbleBuilder(sampleObj);
    gaugeBuilder(metadataObj);
    })
});
