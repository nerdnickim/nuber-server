import { Resolvers } from "src/types/resolvers";
import {
	PhoneVerificationMutationArgs,
	PhoneVerificationResponse,
} from "src/types/graph";
import Verification from "src/entities/Verification";

const resolvers: Resolvers = {
	Mutation: {
		PhoneVerification: async (
			_,
			args: PhoneVerificationMutationArgs
		): Promise<PhoneVerificationResponse> => {
			const { phoneNumber } = args;
			try {
				const existingVerification = await Verification.findOne({ payload: phoneNumber });
				if (existingVerification) {
					existingVerification.remove();
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
				};
			}
		},
	},
};

export default resolvers;
