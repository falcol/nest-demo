export class TokenUserDto {
	readonly id: number;
	readonly email: string;
	readonly username: string;
	readonly isActive: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}
