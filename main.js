const visObject = {
  options: {
  },
 
	create: function(element, config){
		element.innerHTML = "";
	},

	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        element.innerHTML = "";
        const firstLabel = queryResponse.fields.dimensions[0].name;
        const secondLabel = queryResponse.fields.dimensions[1].name;
        const thirdLabel = queryResponse.fields.dimensions[2].name;

        const transformedData = {}
        const onlySummary = {}

        data.forEach(row => {
            const firstValue = row[firstLabel].value;
            const secondValue = row[secondLabel].value;
            const thirdValue = row[thirdLabel];

            if(!transformedData[firstValue]) {
                transformedData[firstValue] = {};
            }

            if(!transformedData[firstValue][secondValue]) {
                transformedData[firstValue][secondValue] = [];
            }

            transformedData[firstValue][secondValue].push({
                'thirdValue': thirdValue
            });
        });

        for(const key in transformedData) {
            if (transformedData.hasOwnProperty(key)) {
                const secondValues = Object.keys(transformedData[key]);
                if(secondValues.length > 1) {
                    onlySummary[key] = false;
                }
                else {
                    onlySummary[key] = true;
                }
            }
        }

        console.log(transformedData, onlySummary)

        const visDiv = document.createElement("div");
        visDiv.setAttribute('style', 'display: flex; flex-wrap: wrap; justify-content: space-around; align-items: stretch; gap:15px');

        for(const key in transformedData) {

            const flexDiv = document.createElement("div");
            flexDiv.setAttribute('style', 'border: groove; padding-left: 12px; flex: 1 1 0px;');

            const flexDivTitle = document.createElement("h2");
            const flexStrong = document.createElement("strong");
            flexStrong.setAttribute("style", "text-align: center;");
            const flexCenter = document.createElement("center");
            flexCenter.innerText = key;
            flexStrong.appendChild(flexCenter)
            flexDivTitle.appendChild(flexStrong);
            flexDiv.appendChild(flexDivTitle);

            if(onlySummary[key]) {
                const summaryValue = Object.keys(transformedData[key])[0];
                transformedData[key][summaryValue].forEach(row => {
                    const liElement = document.createElement("li");
                    liElement.innerHTML = LookerCharts.Utils.htmlForCell(row['thirdValue']);
                    flexDiv.appendChild(liElement);
                });
            }
            else {
                for(const nestedKey in transformedData[key]) {
                    const flexDetails = document.createElement("details");
                    flexDetails.setAttribute("style", "list-style:None;");
                    const flexSummary = document.createElement("summary");
                    flexSummary.setAttribute("style", "list-style:None;");
                    const flexSummaryStrong = document.createElement("strong");
                    flexSummaryStrong.setAttribute("style", "color:#0087e1;");
                    flexSummaryStrong.innerText = nestedKey;
                    flexSummary.appendChild(flexSummaryStrong);
                    flexDetails.appendChild(flexSummary);

                    const flexSummaryDiv = document.createElement("div");
                    transformedData[key][nestedKey].forEach(row => {
                        const liElement = document.createElement("li");
                        liElement.innerHTML = LookerCharts.Utils.htmlForCell(row['thirdValue']);
                        flexSummaryDiv.appendChild(liElement);
                    });
                    flexDetails.appendChild(flexSummaryDiv);
                    flexDiv.appendChild(flexDetails);
                }
            }
            visDiv.appendChild(flexDiv);
        }

        element.appendChild(visDiv);

        doneRendering();
	}
};

looker.plugins.visualizations.add(visObject);