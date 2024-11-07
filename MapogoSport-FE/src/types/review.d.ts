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
    fullname: fullname;
    rating: number;
    comment: string;
    datedAt: Date;
}