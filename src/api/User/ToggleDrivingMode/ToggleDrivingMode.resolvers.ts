import { Resolvers } from "src/types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { ToggleDrivingModeResponse } from "../../../types/graph";

const resolvers: Resolvers = {
	Mutation: {
		ToggleDrivingModeResponse: privateResolver(
			async (_, __, { req }): Promise<ToggleDrivingModeResponse> => {
				const user: User = req.user;
				user.isDriving = !user.isDriving;
				user.save();
				return {
					ok: true,
					error: null,
				};
			}
		),
	},
};

export default resolvers;
