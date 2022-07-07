const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
const {serializeQueryPlan} = require('@apollo/query-planner');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')

const demo01Host = process.env.DEMO01_HOST != null ? process.env.DEMO01_host : "localhost:8080";
const demo02Host = process.env.DEMO02_HOST != null ? process.env.DEMO02_host : "localhost:8081";

// Initialize an ApolloGateway instance and pass it an array of
// your implementing service names and URLs
const gateway = new ApolloGateway({
    serviceList: [
        { name: 'demo01', url: `http://${demo01Host}/graphql/` },
        { name: 'demo02', url: `http://${demo02Host}/graphql/` }
        //{ name: "accounts", url: "https://pw678w138q.sse.codesandbox.io/" }
        // Define additional services here
    ],
    __exposeQueryPlanExperimental: true,

    experimental_didResolveQueryPlan: function(options) {
        if (options.requestContext.operationName !== 'IntrospectionQuery') {
            console.log(serializeQueryPlan(options.queryPlan));
        }
    }
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
    gateway,
    engine: false,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    tracing: true,

    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
