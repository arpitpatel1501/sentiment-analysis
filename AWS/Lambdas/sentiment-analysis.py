import json
import boto3
import uuid
import os

import nltk
nltk.data.path.append("/tmp/nltk_data/")
nltk.download('punkt', download_dir="/tmp/nltk_data/")
nltk.download('stopwords', download_dir="/tmp/nltk_data/")
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

dyn_client = boto3.client('dynamodb')
TABLE_NAME = os.environ['DYNAMO_DB_NAME']

def preprocess_text(text):
    # Tokenize the text
    tokens = word_tokenize(text.lower())

    print("tokens:", tokens)
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [token for token in tokens if token not in stop_words]

    # Stem the words
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(token) for token in filtered_tokens]

    # Join the tokens back into a single string
    preprocessed_text = ' '.join(stemmed_tokens)
    
    print("preprocessed_text:", preprocessed_text)
    return preprocessed_text
    
comprehend = boto3.client('comprehend')

def get_sentiment(text):
    response = comprehend.detect_sentiment(Text=text, LanguageCode='en')
    print(response)
    # sentiment = response['Sentiment']
    return response

def lambda_handler(event, context):
    # TODO implement
    email = event["email"]
    text = event["text"]
    
    # Preprocess the text
    preprocessed_text = preprocess_text(text)
    
    # Get the sentiment
    sentiment_response = get_sentiment(preprocessed_text)
    
    ###############################################
    # Store data in dynamo db
    dynamoData = {}
    dynamoData["sentimentId"]= {'S': str(uuid.uuid4())}
    dynamoData["email"]= {'S': email}

    dynamoData['input'] = {'S':text}
    dynamoData['sentiment'] = {'S':sentiment_response['Sentiment']}
    dynamoData['PositiveScore'] = {'S':str(round(sentiment_response['SentimentScore']['Positive'], 2))}
    dynamoData['NegativeScore'] = {'S':str(round(sentiment_response['SentimentScore']['Negative'], 2))}
    dynamoData['NeutralScore'] = {'S':str(round(sentiment_response['SentimentScore']['Neutral'], 2))}
    dynamoData['MixedScore'] = {'S':str(round(sentiment_response['SentimentScore']['Mixed'], 2))}
    
    response = dyn_client.put_item(TableName=TABLE_NAME, Item=dynamoData)
  
    response = {
        'Sentiment': sentiment_response['Sentiment'],
        'SentimentScore': sentiment_response['SentimentScore']
    }
    
    # TODO implement
    return response
