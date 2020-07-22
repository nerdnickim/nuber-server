import dotenv from "dotenv";
dotenv.config();

import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import defaultConnectionOptions from "./ormConfig";
import decodeJWT from "./utils/decodeJWT";

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions: Options = {
	port: PORT,
	playground: PLAYGROUND_ENDPOINT,
	endpoint: GRAPHQL_ENDPOINT,
	subscriptions: {
		path: SUBSCRIPTION_ENDPOINT,
		onConnect: async (connectionParams) => {
			const token = connectionParams["x-jwt"];
			if (token) {
				const user = await decodeJWT(token);
				if (user) {
					return {
						currentUser: user,
					};
				}
			}
			throw new Error("No JWT. Can't subscribe");
		},
	},
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

createConnection(defaultConnectionOptions).then(() => {
	app.start(appOptions, handleAppStart);
});
