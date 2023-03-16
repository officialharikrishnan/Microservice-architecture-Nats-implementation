# Microservice-architecture-Nats-implementation

In this mini project, Three services are there,
1.Products
2.Orders,
3.Payment

When an order request get from user, the order service will get product data from product service through Nats brocker,
Then the payment service will make payment done and send response to order service through Nats.
