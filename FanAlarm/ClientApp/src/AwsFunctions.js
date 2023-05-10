import * as AWS from 'aws-sdk';

AWS.config.update({
    region: process.env.REACT_APP_REGION,
    secretAccessKey: process.env.REACT_APP_SECRET,
    accessKeyId: process.env.REACT_APP_ACCESS_ID
});
const docClient = new AWS.DynamoDB.DocumentClient()

export const fetchData = async (tableName) => {
    var params = {
        TableName: tableName
    }

    let scanResults = [];
    let items;
    let i = 0;
    do {
        items = await docClient.scan(params).promise();
        items.Items.forEach((item) => item.key = i++);
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;

    } while (typeof items.LastEvaluatedKey !== "undefined");
    console.log(scanResults);
    return scanResults;
}

export const putData = async (tableName, data) => {
    var params = {
        TableName: tableName,
        Item: data
    }

    docClient.put(params, function (err, data) {
        if (err) {
            console.log('Error', err)
        } else {
            console.log('Success', data)
        }
    }).promise();
}


export const checkSignin = async (tableName, inputData) => {
    var params = {
        TableName: tableName,
        Key: { "Email": inputData.Email }
    };
    let result = true;
    await docClient.get(params, function (err, data) {
        if (err) {
            result = true;
            console.log(err);
        } else if (data.Item == null) {
            result = true;
        }
        else {
            result = false;
        }
    }).promise();
    return result;
}