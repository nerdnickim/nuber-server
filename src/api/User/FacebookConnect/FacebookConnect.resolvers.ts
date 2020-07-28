import { Resolvers } from "../../../types/resolvers";
import {
	FaceBookConnectMutationArgs,
	FaceBookConnectResponse,
} from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
	Mutation: {
		FaceBookConnect: async (
			_,
			args: FaceBookConnectMutationArgs
		): Promise<FaceBookConnectResponse> => {
			const { fbId } = args;

			try {
				const existingUser = await User.findOne({ fbId });

				if (existingUser) {
					const token = createJWT(existingUser.id);
					return {
						ok: true,
						error: null,
						token,
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					token: null,
				};
			}
			try {
				const newUser = await User.create({
					...args,
					profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square`,
				}).save();
				const token = createJWT(newUser.id);

				return {
					ok: true,
					error: null,
					token,
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					token: null,
				};
			}
		},
	},
};

export default resolvers;
