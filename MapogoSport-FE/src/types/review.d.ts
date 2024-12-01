interface FieldReview {
    fieldReviewId: number;
    sportField: SportField;
    user: User;
    rating: number;
    comment: string;
    datedAt: Date;
}

interface FieldReviewUser {
    fieldReviewId: number;
    sportFieldId: number;
    sportFieldName: string;
    fullname: string;
    comment: string;
    datedAt: Date;
}

interface ProductReview {
    productReviewId: number;
    product: {
        productId: number;
        productName: string;
    };
    fullname: fullname;
    rating: number;
    comment: string;
    datedAt: Date;
}

interface ProductReviewUser {
    productReviewId: number;
    product: {
        productId: number;
        productName: string;
    };
    fullname: fullname;
    user: User;
    comment: string;
    datedAt: Date;
}

interface ProductReviewData {
    productReviewId: number;
    product: {
        productId: number;
        productName: string;
    };
    rating: number;
    comment: string;
    datedAt: Date;
    user: User
}