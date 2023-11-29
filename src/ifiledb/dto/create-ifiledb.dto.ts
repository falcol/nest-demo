export class CreateIfiledbDto {
	id: string;

	name: string;

	from: string;

	to: string;

	order: number;

	s1_name: string;

	s2_name: string;

	color_name: string;

	constructor(data: Partial<CreateIfiledbDto>) {
		Object.assign(this, data);
		try {
			this.order = Number(this.order);
		} catch (error) {}
	}
}
