//function that looks for selected id value
function getSample() {
    var inputid = d3.select("#selDataset")
    //read json file 
    d3.json("samples.json").then((data) => {
        console.log(data.names);
        //input 
        data.names.forEach((samplenm) => {
            inputid.append("option").text(samplenm).property("value")
        })
        optionChanged(data.names[0]);
    })

};

getSample()

//function when sample id is changed 
function optionChanged(sampleiddata) {
    //update demographic info area
    var demoarea = d3.select('#sample-metadata');
    d3.json("samples.json").then((data) => {
        var filtermeta = data.metadata.filter(meta => meta.id == sampleiddata)
        console.log(filtermeta);
        var firstid = filtermeta[0];
        //clear list
        demoarea.html("")
        Object.entries(firstid).forEach(([key, value]) => {
            demoarea.append("p").text(`${key}: ${value}`)
        })
        
        var filtersample = data.samples.filter(sample => sample.id == sampleiddata)
        var firstid = filtersample[0];
        var sampleValues = firstid.sample_values.slice(0, 10).reverse();
        var sampleOtuids = firstid.otu_ids.slice(0, 10).reverse().map(topids => (`OtuID:${topids}`));
        var sampleOtulabel = firstid.otu_labels.slice(0, 10).reverse();

        var trace1 = {
            x: sampleValues,
            y: sampleOtuids,
            labels: sampleOtulabel,
            type: 'bar',
            text: sampleOtulabel,
            orientation: 'h'
        };

        var chartdata = [trace1];

        var layout = {
            title: `Top 10 OTUs`,
        };

        Plotly.newPlot("bar", chartdata, layout);

        //create bubble chart
        var trace2 = {
            x: firstid.otu_ids,
            y: firstid.sample_values,
            mode: 'markers',
            marker: {
                size: firstid.sample_values,
                color: firstid.otu_ids
            }
        };

        var bubbledata = [trace2];

        var layout2 = {
            title: 'Sample OTU ID Values',
            showlegend: false,

        };

        Plotly.newPlot('bubble', bubbledata, layout2);
    });
};