export default {
  TestQueue: {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: '${self:custom.custom_queue_name}',
      VisibilityTimeout: 120,
      ReceiveMessageWaitTimeSeconds: 20,
    }
  }
}