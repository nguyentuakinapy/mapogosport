export default function Loading() {
    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}