function tabulate(data, columns) {
    var table = d3.select('#Tablea').append('table')
    var thead = table.append('thead')
    var	tbody = table.append('tbody');

    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
        .text(function (column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          return {column: column, value: row[column]};
        });
      })
      .enter()
      .append('td')
        .text(function (d) { return d.value; });

  return table;
}

function clear_e2p2() {
    var table = d3.select('#Tablea').selectAll("table").remove();
  }

function callback_e2p2(){
    var t = d3.csv('data/ConnectedVehicle_D3.csv', function (error,data) {
            var columns = ['Device', 'Trip', 'TimeStap','GpsSpeedWsu','LatitudeWsu', 'LongitudeWsu'];
                    // render the table(s)
                        tabulate(data, columns);});
                     }