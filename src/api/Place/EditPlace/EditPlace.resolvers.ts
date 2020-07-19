import { Resolvers } from "src/types/resolvers";
import privateResolver from "src/utils/privateResolver";
import { AddPlaceMutationArgs, AddPlaceResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Place from "../../../entities/Place";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
	Mutation: {
		AddPlace: privateResolver(
			async (_, args: AddPlaceMutationArgs, { req }): Promise<AddPlaceResponse> => {
				const user: User = req.user;
				try {
					const place = await Place.findOne({ id: args.placeId });
					if (place) {
						if (place.userId === user.id) {
							const notNull = cleanNullArgs(args);
							await Place.update({ id: args.placeId }, { ...notNull });
							return {
								ok: true,
								error: null,
							};
						} else {
							return {
								ok: false,
								error: "Not Authorized",
							};
						}
					} else {
						return {
							ok: false,
							error: "Place not found",
						};
					}
				} catch (error) {
					return {
						ok: false,
						error: error.message,
					};
				}
			}
		),
	},
};

export default resolvers;
