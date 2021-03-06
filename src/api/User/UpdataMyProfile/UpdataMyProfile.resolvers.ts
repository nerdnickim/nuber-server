import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import cleanNullArgs from "../../../utils/cleanNullArgs";
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
				const notNull = cleanNullArgs(args);
				try {
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
