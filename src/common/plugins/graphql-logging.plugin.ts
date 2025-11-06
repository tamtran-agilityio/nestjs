import { Plugin } from '@nestjs/apollo';
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { GraphQLRequestContext } from '@apollo/server';

@Plugin()
export class GraphQLLoggingPlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const startTime = Date.now();

    return {
      async didResolveOperation(requestContext: GraphQLRequestContext<any>) {
        const operationName =
          requestContext.request.operationName || 'Anonymous';
        const operationType = requestContext.document?.definitions[0]?.kind;

        // Store start time for duration calculation
        (requestContext as any).startTime = startTime;

        console.log(
          `[${new Date().toISOString()}] GraphQL ${operationType} ${operationName}`,
        );

        // Log variables if present (be careful with sensitive data)
        if (
          requestContext.request.variables &&
          Object.keys(requestContext.request.variables).length > 0
        ) {
          console.log(
            `[${new Date().toISOString()}] GraphQL Variables:`,
            Object.keys(requestContext.request.variables),
          );
        }
      },

      async didEncounterErrors(requestContext: GraphQLRequestContext<any>) {
        const operationName =
          requestContext.request.operationName || 'Anonymous';
        const duration =
          Date.now() - ((requestContext as any).startTime || startTime);

        console.error(
          `[${new Date().toISOString()}] GraphQL Error in ${operationName} (${duration}ms):`,
          requestContext.errors?.map((err) => ({
            message: err.message,
            path: err.path,
            locations: err.locations,
          })),
        );
      },

      async willSendResponse(requestContext: GraphQLRequestContext<any>) {
        const operationName =
          requestContext.request.operationName || 'Anonymous';
        const duration =
          Date.now() - ((requestContext as any).startTime || startTime);
        const hasErrors =
          requestContext.errors && requestContext.errors.length > 0;

        console.log(
          `[${new Date().toISOString()}] GraphQL ${operationName} ${hasErrors ? 'failed' : 'completed'} in ${duration}ms`,
        );
      },
    };
  }
}
