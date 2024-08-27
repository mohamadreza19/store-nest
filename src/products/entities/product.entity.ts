import { env } from "process";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema:'store'
})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column('numeric')
    price:number
}
