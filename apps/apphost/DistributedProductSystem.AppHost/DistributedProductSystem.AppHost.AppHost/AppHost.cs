using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.AuthService_API>("auth-service");
builder.AddProject<Projects.ApiGateway>("api-gateway");

builder.Build().Run();