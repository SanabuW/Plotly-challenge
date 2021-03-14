// Function to create Test Subject IDs dropdown menu
function dropdownBuilder (dataInput) {
    var dropdownObj = d3.select("#selDataset");
    // Create a blank value to empty selection
    dropdownObj.append("option").attr("value","");
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
        name: "OTU Bar Chart"
    }
    // Define the layout
    var layout = {
        title: "Count of Highest 10 OTUs per Sample",
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
}


// Function to build gauge chart

function gaugeBuilder(dataInput) {
    
}


// Begin page load and working wtih data
d3.json("././samples.json").then(function(dataObj) {
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


    })
});










