var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request to Get All Person from SQL Database');

    var config = {
        userName: 'hectorhuol',
        password: 'hedahuol-9889',
        server: 'actionable-insights.database.windows.net',
        options:
        {
            database: 'relational_model',
            encrypt: true
        }
    };    

    var connection = new Connection(config);

    connection.on('connect', function(err) {
        context.log('Connected successfully to server');
        if (err) {
            handleError(err);
        } else {
            executeStatement();
        }
    });

    function handleError(err)
    {
        context.log(err);
        context.res = {
            status: 500,
            body: "Unable to establish a connection."
        };
        context.done();
    }

    function executeStatement() {
        var result = []; 
        var response;

        request = new Request("SELECT * FROM Person", function(err, rowCount) {
            if (err) {
                handleError(err);
            } else {
                context.log('Getting All Persons');
                context.log(rowCount + ' rows');
                response = { status: 200, body: JSON.stringify(result) };
                context.res = response;
                context.done();                
            }
        });

        request.on('row', function(columns) {
            var row = {}; 
            columns.forEach(function(column) {
                if (column.isNull) { 
                    row[column.metadata.colName] = null; 
                  } else { 
                    row[column.metadata.colName] = column.value; 
                  }
            });
            result.push(row);            
        });

        connection.execSql(request);
    }
};