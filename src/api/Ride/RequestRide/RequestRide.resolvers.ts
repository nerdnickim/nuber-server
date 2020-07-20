import { Resolvers } from "src/types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { RequestRideMutationArgs, RequestRideResponse } from "../../../types/graph";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";

const resolvers: Resolvers = {
	Mutation: {
		RequestRide: privateResolver(
			async (
				_,
				args: RequestRideMutationArgs,
				{ req, pubSub }
			): Promise<RequestRideResponse> => {
				const user: User = req.user;
				try {
					const ride = await Ride.create({ ...args, passenger: user }).save();
					pubSub.publish("rideRequest", { NeabyRideSubscription: ride });
					return {
						ok: true,
						error: null,
						ride,
					};
				} catch (error) {
					return {
						ok: false,
						error: error.message,
						ride: null,
					};
				}
			}
		),
	},
};

export default resolvers;
