const visObject = {
    options: {
    },

    create: function (element, config) {
        let css = element.innerHTML = `
            <style>

            body {
                overflow: hidden;
            }

             #metadata {
                border: 1px solid black;
                padding: 10px;
                margin: 10px;
                grid-template-columns: 30% 70%; 
              }

              div {
                border: 1px solid black;
                padding: 2px;
              }
              
              #metadata-slacolumn {
                overflow: hidden;
              }
              
              #metadata-refresh {
                height: 200px;
                overflow: auto;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 10px;

              }
            </style>
        `;
        this._visContainer = element.appendChild(document.createElement("div"));
        this._visContainer.className = "dashboard-details-vis";
    },

    updateAsync: function (data, element, config, queryResponse, details, doneRendering) {

        this.clearErrors();

        if(queryResponse.fields.dimensions.length < 3) {
            this.addError({title: "Not enough dimensions", message: "This visualization requires 3 dimensions"});
            return;
        }

        this._visContainer.innerHTML = "";

        let popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.visibility = 'hidden';
        popup.style.backgroundColor = '#333';
        popup.style.color = '#fff';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        this._visContainer.appendChild(popup);

        uptime_status_dates = [
            {
                date: '2023-12-03',
                status: 'up'
            },
            {
                date: '2023-12-04',
                status: 'up'
            },
            {
                date: '2023-12-05',
                status: 'up'
            },
            {
                date: '2023-12-06',
                status: 'up'
            },
            {
                date: '2023-12-07',
                status: 'up'
            },
            {
                date: '2023-12-08',
                status: 'up'
            },
            {
                date: '2023-12-09',
                status: 'orange',
                message: 'UTC 3 delayed by 1 hour'
            },
            {
                date: '2023-12-10',
                status: 'up'
            },
            {
                date: '2023-12-11',
                status: 'up'
            },
            {
                date: '2023-12-12',
                status: 'up'
            },
            {
                date: '2023-12-13',
                status: 'up'
            },
            {
                date: '2023-12-14',
                status: 'red',
                message: 'UTC 3 delayed by 5 hours due to duplicates. Ref: DSC-1234'
            },
            {
                date: '2023-12-15',
                status: 'up'
            },
            {
                date: '2023-12-16',
                status: 'up'
            },
            {
                date: '2023-12-17',
                status: 'up'
            },
            {
                date: '2023-12-18',
                status: 'up'
            },
            {
                date: '2023-12-19',
                status: 'up'
            }            
        ]

        table_refresh = [
            {
                "name": 'cooked.test_1',
                "lastUpdated": "2023-12-19 11:00 UTC",
            },
            {
                "name": 'cooked.test_2',
                "lastUpdated": "2023-12-19 10:00 UTC",
            },
            {
                "name": 'processed.test_1',
                "lastUpdated": "2023-12-18 12:00 UTC",
                "status": "red",
                "message": "Expected delay from source"
            },
            {
                "name": 'cooked.test_3',
                "lastUpdated": "2023-12-19 05:00 UTC",
            },
            {
                "name": 'cooked.test_4',
                "lastUpdated": "2023-12-19 07:00 UTC",
            },
            {
                "name": 'processed.test_10',
                "lastUpdated": "2023-12-19 05:00 UTC",
            },
            {
                "name": 'snapshot.test1',
                "lastUpdated": "2023-12-19 11:00 UTC",
            },
            {
                "name": 'snapshot.test_2',
                "lastUpdated": "2023-12-19 07:00 UTC",
            },
            {
                "name": 'snapshot.test_5',
                "lastUpdated": "2023-12-19 11:00 UTC",
            }
        ]

        dashboard_details = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu eleifend mauris. Ut eu elit diam. Aliquam mattis lorem in sapien imperdiet sodales. Ut ultricies sodales consectetur. Aenean quis justo eget dui efficitur viverra eget id odio. Maecenas faucibus quis nibh at semper. Suspendisse porta nibh arcu, a blandit lectus sodales in.`

        // Create main container
        let container = document.createElement('div');
        container.id = 'metadata'
        container.style.display = 'grid';

        // Create first column with two rows
        let firstColumn = document.createElement('div');
        firstColumn.id = 'metadata-slacolumn'
        let firstRow = document.createElement('div');
        let secondRow = document.createElement('div');

        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "34px");

        // Define bar width and height
        let barWidth = 100 / 15;
        let barHeight = 100;

        let i = 0;
        uptime_status_dates.forEach((status_val) => {
            // Create rect SVG element
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", `${i * barWidth}%`);
            rect.setAttribute("y", "0");
            rect.setAttribute("width", `${barWidth-2}%`);
            rect.setAttribute("height", `${barHeight}%`);
          
            // Set fill color based on uptime status
            let uptimeStatus = status_val.status == 'up'
            rect.setAttribute("fill", uptimeStatus ? "green" : "red");
          
            // Create title SVG element for hover popup
            let title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            let popupText = status_val.date + '\n';
            if(uptimeStatus) {
                popupText += "No downtime recorded on this day."
            }
            else {
                popupText += status_val['message'];
            }
          
            // Append title to rect
            rect.appendChild(title);

            // Add mouseover event listener
            rect.addEventListener('mouseover', (e) => {
                // Update popup content
                popup.textContent = popupText;

                // Update popup position
                let rect = e.target.getBoundingClientRect();
                popup.style.left = `${rect.left}px`;
                popup.style.top = `${rect.bottom}px`;

                // Show popup
                popup.style.visibility = 'visible';
            });

            // Add mouseout event listener
            rect.addEventListener('mouseout', () => {
                // Hide popup
                popup.style.visibility = 'hidden';
            });

          
            // Append rect to SVG
            svg.appendChild(rect);

            i+= 1

            

        });

        firstRow.appendChild(svg);



        secondRow.textContent = dashboard_details;
        firstColumn.appendChild(firstRow);
        firstColumn.appendChild(secondRow);

        // Create second column with scrollable property
        let secondColumn = document.createElement('div');
        secondColumn.id = 'metadata-refresh'
        secondColumn.style.overflowY = 'scroll';

        table_refresh.forEach((table_details) => {
            // Create card
            let card = document.createElement('div');
            card.style.border = '1px solid black';
            card.style.padding = '10px';
            card.style.textAlign = 'center';
            card.style.width = '100px';

            // Create title
            let title = document.createElement('h3');
            title.style.overflow = 'hidden';
            title.style.textOverflow = ''
            title.style.whiteSpace = 'nowrap';
            title.textContent = table_details['name']; // Replace this with actual title

            // Create last updated time
            let lastUpdated = document.createElement('p');
            lastUpdated.style.overflow = 'hidden';
            lastUpdated.style.textOverflow = 'ellipsis';
            lastUpdated.style.whiteSpace = 'nowrap';
            lastUpdated.textContent = table_details['lastUpdated']; // Replace this with actual last updated time

            // Append title and last updated time to card
            card.appendChild(title);
            card.appendChild(lastUpdated);

            // Append card to grid
            secondColumn.appendChild(card);
        });


        // Append columns to the container
        container.appendChild(firstColumn);
        container.appendChild(secondColumn);

        // Append the container to the body
        this._visContainer.appendChild(container);

        doneRendering();
    }
};

looker.plugins.visualizations.add(visObject);