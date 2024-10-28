interface FieldReview {
    fieldReviewId: number;
    sportField: SportField;
    user: User;
    rating: number;
    comment: string;
    datedAt: Date;
}

interface ProductReview {
    productReviewId: number;
    product: Product;
    user: User;
    rating: number;
    comment: string;
    datedAt: Date;
}