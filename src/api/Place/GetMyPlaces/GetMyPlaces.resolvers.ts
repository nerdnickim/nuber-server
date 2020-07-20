import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { GetMyPlacesResponse } from "../../../types/graph";

const resolvers: Resolvers = {
	Query: {
		GetMyPlaces: privateResolver(
			async (_, __, { req }): Promise<GetMyPlacesResponse> => {
				try {
					const user = await User.findOne({ id: req.user.id }, { relations: ["places"] });
					if (user) {
						return {
							ok: true,
							places: user.places,
							error: null,
						};
					} else {
						return {
							ok: false,
							error: "User not found",
							places: null,
						};
					}
				} catch (error) {
					return {
						ok: false,
						places: null,
						error: error.message,
					};
				}
			}
		),
	},
};

export default resolvers;
