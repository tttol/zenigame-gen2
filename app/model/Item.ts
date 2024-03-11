class Item {
    id: string;
    name: string;
    price: number;
    label?: string | null;
    paidByUserA: boolean;
    paidByUserB: boolean;
    paidAt: string;
    createdAt: string;
    updatedAt: string;

    constructor(data: any) {
        this.paidByUserA = data.paidByUserA.BOOL;
        this.paidAt = data.paidAt.S;
        this.createdAt = data.createdAt.S;
        this.updatedAt = data.updatedAt.S;
        this.paidByUserB = data.paidByUserB.BOOL;
        this.price = Number(data.price.N);
        this.label = data.label.S;
        this.id = data.id.S;
        this.name = data.name.S;
    }
}