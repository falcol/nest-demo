import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ifile')
export class Ifiledb {
	@PrimaryGeneratedColumn()
	pk: number;

	@Column({
		type: 'text',
	})
	id: string;

	@Column({
		type: 'text',
	})
	name: string;

	@Column({
		type: 'text',
	})
	from: string;

	@Column({
		type: 'text',
	})
	to: string;

	@Column({
		type: 'integer',
	})
	order: number;

	@Column({
		type: 'text',
	})
	s1_name: string;

	@Column({
		type: 'text',
	})
	s2_name: string;

	@Column({
		type: 'text',
	})
	color_name: string;
}
