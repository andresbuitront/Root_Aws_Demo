export default {
    ListTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: '${self:provider.environment.LIST_TABLE}',
            // DeletionPolicy: 'Retain',
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' }
            ],
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            BillingMode: 'PAY_PER_REQUEST',
        }
    },
    TasksTable: {
        Type: 'AWS::DynamoDB::Table',
        // DeletionPolicy: 'Retain',
        Properties: {
            TableName: '${self:provider.environment.TASKS_TABLE}',
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' },
                { AttributeName: 'listId', AttributeType: 'S' }
            ],
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' },
                { AttributeName: 'listId', KeyType: 'RANGE' }
            ],
            BillingMode: 'PAY_PER_REQUEST',
        }
    }
}