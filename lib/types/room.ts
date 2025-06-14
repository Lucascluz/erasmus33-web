export default interface Room {
    id: string;
    created_at: string;
    price: number;
    description: string;
    type: string;
    beds: number;
    is_available: boolean;
    images: string[];
    house_id: string;
    house_number: string;
    number: string;
}