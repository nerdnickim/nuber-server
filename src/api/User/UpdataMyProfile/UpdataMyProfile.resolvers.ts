import { Resolvers } from "src/types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {
	UpdataMyProfileMutationArgs,
	UpdataMyProfileResponse,
} from "../../../types/graph";
import User from "../../../entities/User";

const resolvers: Resolvers = {
	Mutation: {
		UpdataMyProfile: privateResolver(
			async (
				_,
				args: UpdataMyProfileMutationArgs,
				{ req }
			): Promise<UpdataMyProfileResponse> => {
				const user: User = req.user;
				const notNull = {};
				Object.keys(args).forEach((key) => {
					if (args[key] !== null) {
						notNull[key] = args[key];
					}
					return notNull;
				});
				try {
					console.log(notNull);
					await User.update({ id: user.id }, { ...notNull });
					return {
						ok: true,
						error: null,
					};
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
