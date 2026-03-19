declare global {
	namespace Express {
		interface Request {
			decodedUser?: {
				userId: string;
			};
		}
	}
}
