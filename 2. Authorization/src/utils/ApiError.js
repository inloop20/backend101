class ApiError extends Error{
    constructor(message,statusCode){
        super(message);
        this.message = message || 'internal server error';
        this.statusCode = statusCode || 500;
    }
}

export default ApiError;