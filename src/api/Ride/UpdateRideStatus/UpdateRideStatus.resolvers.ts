import { Resolvers } from "src/types/resolvers";
import privateResolver from "src/utils/privateResolver";
import User from "src/entities/User";
import {
	UpdateRideStatusMutationArgs,
	UpdateRideStatusResponse,
} from "../../../types/graph";
import Ride from "src/entities/Ride";

const resolvers: Resolvers = {
	Mutation: {
		UpdateRideStatus: privateResolver(
			async (
				_,
				args: UpdateRideStatusMutationArgs,
				{ req }
			): Promise<UpdateRideStatusResponse> => {
				const user: User = req.user;
				if (user.isDriving) {
					try {
						let ride: Ride | undefined;
						if (args.status === "ACCEPTED") {
							ride = await Ride.findOne({ id: args.id, status: "REQUESTING" });
							if (ride) {
								ride.driver = user;
								user.isTaken = true;
								user.save();
							}
						} else {
							ride = await Ride.findOne({ id: args.id, driver: user });
						}
						if (ride) {
							ride.status = args.status;
							ride.save();
							return {
								ok: true,
								error: null,
							};
						} else {
							return {
								ok: false,
								error: "Can't update ride",
							};
						}
					} catch (error) {
						return {
							ok: false,
							error: error.message,
						};
					}
				} else {
					return {
						ok: false,
						error: "You are not driving",
					};
				}
			}
		),
	},
};

export default resolvers;
