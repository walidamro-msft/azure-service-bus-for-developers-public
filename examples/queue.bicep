@description('Name of the existing Service Bus namespace.')
param namespaceName string

@description('Name of the queue to create.')
@minLength(1)
@maxLength(260)
param queueName string = 'orders-processing'

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' existing = {
  name: namespaceName
}

resource queue 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' = {
  parent: serviceBusNamespace
  name: queueName
  properties: {
    maxSizeInMegabytes: 1024
    maxDeliveryCount: 10
    defaultMessageTimeToLive: 'P14D'
    lockDuration: 'PT1M'
    requiresDuplicateDetection: true
    duplicateDetectionHistoryTimeWindow: 'PT10M'
    deadLetteringOnMessageExpiration: true
    enablePartitioning: false
    requiresSession: false
  }
}

output queueResourceId string = queue.id
