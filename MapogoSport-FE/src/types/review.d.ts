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
    productName: string;
    fullname: string,
    rating: number;
    comment: string;
    datedAt: Date;
}