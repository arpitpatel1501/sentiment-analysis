import json
import boto3
import os

dyn_client = boto3.client('dynamodb')


def getHistoryFromDatabase(email):
    TABLE_NAME = os.environ['DYNAMO_DB_NAME']
    history = dyn_client.scan(TableName=TABLE_NAME, FilterExpression='email = :email',
                            ExpressionAttributeValues={
                                ':email': {'S': email}
                            })

    return history

def lambda_handler(event, context):
    # TODO implement
    email = event["email"]
    history = getHistoryFromDatabase(email)
    return {
        'statusCode': 200,
        'body': history
    }     
